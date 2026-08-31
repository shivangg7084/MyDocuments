/**
 * Client half of the dev-only folder upload.
 *
 * Reads a picked directory in the browser and streams each file to the Vite dev
 * middleware in scripts/upload-content-plugin.ts, which writes it into
 * public/content. Only available while running `npm run dev`.
 */
import type { ContentStats } from "@/types/content";

/** Kept in sync with scripts/upload-content-plugin.ts. */
const UPLOAD_ENDPOINT = "/__library/upload";
const MANIFEST_ENDPOINT = "/__library/manifest";

/** Folders that are never worth publishing, even though they aren't dot-prefixed. */
const NOISE_DIRS = new Set(["node_modules", "__pycache__", "__MACOSX", "venv", "env"]);
const NOISE_FILES = new Set(["thumbs.db", "desktop.ini"]);

/** True while the dev server (and therefore the upload endpoint) is available. */
export const uploadSupported = import.meta.env.DEV;

export interface UploadEntry {
  file: File;
  /** Path relative to the picked folder's parent, e.g. "PythonforDS/Practice/loops.ipynb". */
  relPath: string;
}

export interface CollectedUpload {
  /** Name of the picked folder, taken from the first path segment. */
  rootName: string;
  entries: UploadEntry[];
  /** Paths left out (hidden files, VCS/checkpoint dirs, unsupported names). */
  skipped: string[];
  totalBytes: number;
}

/**
 * Mirrors the manifest scanner (which ignores dotfiles) and the server's path
 * validation, so nothing is uploaded that the library would refuse to show.
 */
function isPublishable(segments: string[]): boolean {
  return segments.every((segment, i) => {
    if (segment === "" || segment === "." || segment === "..") return false;
    if (segment.startsWith(".")) return false;
    if (segment.includes(":") || segment.includes("\0")) return false;
    const isLast = i === segments.length - 1;
    if (isLast) return !NOISE_FILES.has(segment.toLowerCase());
    return !NOISE_DIRS.has(segment);
  });
}

/** Strips a picked folder name down to something safe to create on disk. */
export function sanitizeFolderName(name: string): string {
  return name
    .trim()
    .replace(/[\\/:*?"<>|\0]/g, "-")
    .replace(/^\.+/, "")
    .trim();
}

/** Splits a picked FileList into what will be uploaded and what will be skipped. */
export function collectUpload(fileList: FileList | File[]): CollectedUpload {
  const files = Array.from(fileList);
  const entries: UploadEntry[] = [];
  const skipped: string[] = [];
  let totalBytes = 0;
  let rootName = "";

  for (const file of files) {
    // webkitRelativePath is set by <input webkitdirectory>; fall back to the
    // bare name so a multi-file (non-directory) selection still works.
    const relPath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
    const segments = relPath.split("/").filter((s) => s.length > 0);
    if (segments.length === 0) continue;

    if (!rootName && segments.length > 1) rootName = segments[0];

    if (!isPublishable(segments)) {
      skipped.push(relPath);
      continue;
    }

    entries.push({ file, relPath: segments.join("/") });
    totalBytes += file.size;
  }

  entries.sort((a, b) => a.relPath.localeCompare(b.relPath));
  return { rootName, entries, skipped, totalBytes };
}

async function postFile(contentPath: string, file: File): Promise<void> {
  const res = await fetch(`${UPLOAD_ENDPOINT}?path=${encodeURIComponent(contentPath)}`, {
    method: "POST",
    body: file,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.error ?? `Failed to upload ${file.name} (${res.status})`);
  }
}

export interface UploadProgress {
  completed: number;
  total: number;
  currentPath: string;
}

/**
 * Uploads every entry under `targetPath`, rewriting the picked folder's own name
 * to `destName`. Runs a few requests at a time so large folders don't crawl.
 */
export async function uploadFolder(
  collected: CollectedUpload,
  targetPath: string,
  destName: string,
  onProgress: (progress: UploadProgress) => void,
  concurrency = 4,
): Promise<string> {
  const destFolder = [targetPath, sanitizeFolderName(destName)].filter(Boolean).join("/");
  const { entries } = collected;
  let completed = 0;
  let next = 0;

  async function worker(): Promise<void> {
    for (;;) {
      const index = next++;
      if (index >= entries.length) return;
      const entry = entries[index];

      // Replace the picked folder's own first segment with the chosen name;
      // a flat multi-file selection has no folder segment to replace.
      const segments = entry.relPath.split("/");
      const rest = collected.rootName && segments.length > 1 ? segments.slice(1) : segments;
      const contentPath = [destFolder, ...rest].join("/");

      await postFile(contentPath, entry.file);
      completed += 1;
      onProgress({ completed, total: entries.length, currentPath: entry.relPath });
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, worker));
  return destFolder;
}

/** Asks the dev server to rescan public/content and rewrite the manifest. */
export async function regenerateManifest(): Promise<ContentStats> {
  const res = await fetch(MANIFEST_ENDPOINT, { method: "POST" });
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.error ?? "Failed to regenerate the content manifest");
  }
  const body = (await res.json()) as { stats: ContentStats };
  return body.stats;
}
