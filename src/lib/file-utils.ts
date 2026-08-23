import type { FileType } from "../types/content";

const MARKDOWN_EXT = new Set(["md", "markdown"]);
const VIDEO_EXT = new Set(["mp4", "webm", "ogg", "ogv", "mov"]);
const PDF_EXT = new Set(["pdf"]);
const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg"]);

export function extOf(fileName: string): string {
  const idx = fileName.lastIndexOf(".");
  if (idx === -1 || idx === fileName.length - 1) return "";
  return fileName.slice(idx + 1).toLowerCase();
}

export function classifyExt(ext: string): FileType {
  if (MARKDOWN_EXT.has(ext)) return "markdown";
  if (VIDEO_EXT.has(ext)) return "video";
  if (PDF_EXT.has(ext)) return "pdf";
  if (IMAGE_EXT.has(ext)) return "image";
  return "other";
}

export function classifyFile(fileName: string): FileType {
  return classifyExt(extOf(fileName));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, i);
  return `${i === 0 ? value : value.toFixed(value < 10 ? 1 : 0)} ${units[i]}`;
}

/** Turns a folder display name into a filesystem-safe, kebab-case directory slug. */
export function slugifyFolderName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function titleCaseFromSlug(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** URL-encodes each path segment while preserving the "/" separators. */
export function encodeContentPath(relativePath: string): string {
  return relativePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

/** Reverses encodeContentPath — decodes each "/"-separated segment. */
export function decodeContentPath(routePath: string): string {
  return routePath
    .split("/")
    .map((segment) => decodeURIComponent(segment))
    .join("/");
}

const SPECIAL_ICON_LABEL: Record<string, string> = {
  markdown: "Markdown",
  video: "Video",
  pdf: "PDF",
  image: "Image",
  other: "File",
};

const OTHER_EXT_LABEL: Record<string, string> = {
  txt: "Text",
  csv: "CSV",
  json: "JSON",
  docx: "Word Document",
  doc: "Word Document",
  xlsx: "Spreadsheet",
  xls: "Spreadsheet",
  pptx: "Presentation",
  ppt: "Presentation",
  zip: "Archive",
  rar: "Archive",
  "7z": "Archive",
  tar: "Archive",
  gz: "Archive",
};

export function fileTypeLabel(type: FileType, ext?: string): string {
  if (type === "other" && ext && OTHER_EXT_LABEL[ext]) return OTHER_EXT_LABEL[ext];
  return SPECIAL_ICON_LABEL[type];
}
