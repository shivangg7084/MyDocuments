import Slugger from "github-slugger";

export interface TocHeading {
  id: string;
  text: string;
  depth: number;
}

const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;

/** Strips a leading YAML frontmatter block (used for title/description at build time) before rendering. */
export function stripFrontmatter(markdown: string): string {
  return markdown.replace(FRONTMATTER_RE, "");
}

/**
 * Extracts a flat table of contents (h1-h3) from raw markdown source.
 * Uses the same slug algorithm as rehype-slug so anchor ids match exactly.
 */
export function extractToc(markdown: string): TocHeading[] {
  const headingRe = /^(#{1,3})\s+(.+)$/gm;
  const headings: TocHeading[] = [];
  const slugger = new Slugger();

  let match: RegExpExecArray | null;
  while ((match = headingRe.exec(markdown)) !== null) {
    const depth = match[1].length;
    const text = match[2].replace(/[#*`]/g, "").trim();
    const id = slugger.slug(text);
    headings.push({ id, text, depth });
  }
  return headings;
}
