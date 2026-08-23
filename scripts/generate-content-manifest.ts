/**
 * Scans public/content and writes src/data/content-manifest.json.
 *
 * Run automatically before `dev` and `build` (see package.json), or manually via
 * `npm run generate-content` after adding/removing files.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { classifyFile, extOf, titleCaseFromSlug } from "../src/lib/file-utils";
import type { ContentManifest, ContentStats, ManifestFile, ManifestFolder } from "../src/types/content";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT_DIR, "public", "content");
const OUTPUT_FILE = path.join(ROOT_DIR, "src", "data", "content-manifest.json");

const README_RE = /^readme\.(md|markdown)$/i;

function toPosixPath(p: string): string {
  return p.split(path.sep).join("/");
}

/** Pulls a title/description out of a markdown file's frontmatter or body. */
async function readMarkdownMeta(absPath: string): Promise<{
  title?: string;
  description?: string;
  excerpt?: string;
}> {
  const raw = await fs.readFile(absPath, "utf-8");
  const parsed = matter(raw);
  const frontmatterTitle = typeof parsed.data.title === "string" ? parsed.data.title : undefined;
  const frontmatterDescription =
    typeof parsed.data.description === "string" ? parsed.data.description : undefined;

  const body = parsed.content;
  const h1Match = body.match(/^#\s+(.+)$/m);
  const title = frontmatterTitle ?? h1Match?.[1]?.trim();

  const withoutHeadings = body
    .replace(/^#{1,6}\s+.+$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[>*_`#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const excerpt =
    frontmatterDescription ?? (withoutHeadings.length > 0 ? withoutHeadings.slice(0, 180) : undefined);

  return { title, description: frontmatterDescription, excerpt };
}

async function buildFolder(absDir: string, relDir: string): Promise<ManifestFolder> {
  const entries = await fs.readdir(absDir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));

  const folders: ManifestFolder[] = [];
  const files: ManifestFile[] = [];
  let readmeMeta: { title?: string; description?: string } | undefined;

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const absEntryPath = path.join(absDir, entry.name);
    const relEntryPath = toPosixPath(path.join(relDir, entry.name));

    if (entry.isDirectory()) {
      folders.push(await buildFolder(absEntryPath, relEntryPath));
      continue;
    }

    if (!entry.isFile()) continue;

    const stat = await fs.stat(absEntryPath);
    const ext = extOf(entry.name);
    const type = classifyFile(entry.name);

    const file: ManifestFile = {
      name: entry.name,
      path: relEntryPath,
      type,
      ext,
      size: stat.size,
    };

    if (type === "markdown") {
      const meta = await readMarkdownMeta(absEntryPath);
      if (meta.title) file.title = meta.title;
      if (meta.excerpt) file.excerpt = meta.excerpt;
      if (README_RE.test(entry.name)) {
        readmeMeta = { title: meta.title, description: meta.description ?? meta.excerpt };
      }
    }

    files.push(file);
  }

  const slug = path.basename(relDir || absDir);
  const name = readmeMeta?.title ?? titleCaseFromSlug(slug || "Library");

  return {
    name,
    path: toPosixPath(relDir),
    description: readmeMeta?.description,
    folders,
    files,
  };
}

function computeStats(folder: ManifestFolder, stats: ContentStats, isRoot: boolean): void {
  if (!isRoot) stats.folders += 1;
  for (const file of folder.files) {
    stats.files += 1;
    if (file.type === "video") stats.videos += 1;
    else if (file.type === "markdown") stats.markdown += 1;
    else if (file.type === "pdf") stats.pdfs += 1;
    else if (file.type === "image") stats.images += 1;
    else stats.other += 1;
  }
  for (const sub of folder.folders) computeStats(sub, stats, false);
}

async function main() {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });

  const root = await buildFolder(CONTENT_DIR, "");
  root.name = "Home";

  const stats: ContentStats = {
    folders: 0,
    files: 0,
    videos: 0,
    markdown: 0,
    pdfs: 0,
    images: 0,
    other: 0,
  };
  computeStats(root, stats, true);

  const manifest: ContentManifest = {
    generatedAt: new Date().toISOString(),
    root,
    stats,
  };

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(manifest, null, 2) + "\n", "utf-8");

  console.log(
    `Generated content manifest: ${stats.folders} folders, ${stats.files} files ` +
      `(${stats.markdown} markdown, ${stats.videos} video, ${stats.pdfs} pdf, ${stats.images} image, ${stats.other} other)`,
  );
}

main().catch((err) => {
  console.error("Failed to generate content manifest:", err);
  process.exitCode = 1;
});
