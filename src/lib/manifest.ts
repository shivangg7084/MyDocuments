import manifestJson from "@/data/content-manifest.json";
import type { ContentManifest, ManifestFile, ManifestFolder } from "@/types/content";

export const manifest = manifestJson as ContentManifest;

/** Finds a folder by its relative path ("" for root). Returns undefined if not found. */
export function findFolder(folderPath: string): ManifestFolder | undefined {
  if (folderPath === "" || folderPath === "/") return manifest.root;

  const segments = folderPath.split("/").filter(Boolean);
  let current: ManifestFolder = manifest.root;
  let acc = "";
  for (const segment of segments) {
    acc = acc ? `${acc}/${segment}` : segment;
    const found = current.folders.find((f) => f.path === acc);
    if (!found) return undefined;
    current = found;
  }
  return current;
}

/** Finds a file by its relative path. Returns undefined if not found. */
export function findFile(filePath: string): ManifestFile | undefined {
  const segments = filePath.split("/").filter(Boolean);
  const fileName = segments.pop();
  if (!fileName) return undefined;
  const folder = findFolder(segments.join("/"));
  return folder?.files.find((f) => f.name === fileName);
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/** Builds breadcrumb items (excluding Home) for a folder path. */
export function breadcrumbsForFolder(folderPath: string): BreadcrumbItem[] {
  if (!folderPath) return [];
  const segments = folderPath.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [];
  let acc = "";
  for (const segment of segments) {
    acc = acc ? `${acc}/${segment}` : segment;
    const folder = findFolder(acc);
    items.push({ name: folder?.name ?? segment, path: acc });
  }
  return items;
}

export function findReadme(folder: ManifestFolder): ManifestFile | undefined {
  return folder.files.find((f) => /^readme\.(md|markdown)$/i.test(f.name));
}

export function folderFileCount(folder: ManifestFolder): number {
  let count = folder.files.length;
  for (const sub of folder.folders) count += folderFileCount(sub);
  return count;
}

/** All video files directly inside a folder, in listed order — used for prev/next navigation. */
export function videosInFolder(folder: ManifestFolder): ManifestFile[] {
  return folder.files.filter((f) => f.type === "video");
}

export interface FlatFolderOption {
  path: string;
  label: string;
  depth: number;
}

/** Flattens the folder tree into a depth-indicated list for parent-folder pickers, including root ("Home"). */
export function flattenFolders(): FlatFolderOption[] {
  const options: FlatFolderOption[] = [{ path: "", label: "Home", depth: 0 }];
  function walk(folder: ManifestFolder, depth: number) {
    for (const sub of folder.folders) {
      options.push({ path: sub.path, label: sub.name, depth });
      walk(sub, depth + 1);
    }
  }
  walk(manifest.root, 1);
  return options;
}
