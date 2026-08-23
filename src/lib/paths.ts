import { encodeContentPath } from "./file-utils";

/** Builds the runtime URL for a content file, correctly prefixed for GitHub Pages subpaths. */
export function contentFileUrl(relativePath: string): string {
  const base = import.meta.env.BASE_URL; // e.g. "/" or "/my-repo/"
  return `${base}content/${encodeContentPath(relativePath)}`;
}

export function folderRoute(folderPath: string): string {
  return folderPath ? `/folder/${encodeContentPath(folderPath)}` : "/folder";
}

export function markdownRoute(filePath: string): string {
  return `/view/markdown/${encodeContentPath(filePath)}`;
}

export function videoRoute(filePath: string): string {
  return `/view/video/${encodeContentPath(filePath)}`;
}

export function fileRoute(filePath: string): string {
  return `/view/file/${encodeContentPath(filePath)}`;
}
