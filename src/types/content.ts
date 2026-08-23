export type FileType = "markdown" | "video" | "pdf" | "image" | "other";

export interface ManifestFile {
  /** Display file name, including extension. */
  name: string;
  /** Path relative to the content root, e.g. "machine-learning/notes.md". Not URL-encoded. */
  path: string;
  type: FileType;
  /** Lowercase extension without the dot, e.g. "md". */
  ext: string;
  /** Size in bytes. */
  size: number;
  /** For markdown files: the first H1 heading, if present. */
  title?: string;
  /** For markdown files: a short plain-text excerpt of the body. */
  excerpt?: string;
}

export interface ManifestFolder {
  /** Display name (from README title, or a prettified slug). */
  name: string;
  /** Path relative to the content root, e.g. "machine-learning/statistics". Empty string for the root. */
  path: string;
  description?: string;
  folders: ManifestFolder[];
  files: ManifestFile[];
}

export interface ContentStats {
  folders: number;
  files: number;
  videos: number;
  markdown: number;
  pdfs: number;
  images: number;
  other: number;
}

export interface ContentManifest {
  generatedAt: string;
  root: ManifestFolder;
  stats: ContentStats;
}
