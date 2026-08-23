import { useMemo, useState } from "react";
import { manifest } from "@/lib/manifest";
import type { FileType, ManifestFolder } from "@/types/content";

export interface SearchEntry {
  kind: "folder" | "file";
  name: string;
  path: string;
  folderPath: string;
  fileType?: FileType;
  title?: string;
  excerpt?: string;
}

function buildIndex(folder: ManifestFolder, index: SearchEntry[]): void {
  if (folder.path !== "") {
    index.push({
      kind: "folder",
      name: folder.name,
      path: folder.path,
      folderPath: folder.path,
    });
  }
  for (const file of folder.files) {
    index.push({
      kind: "file",
      name: file.name,
      path: file.path,
      folderPath: folder.path,
      fileType: file.type,
      title: file.title,
      excerpt: file.excerpt,
    });
  }
  for (const sub of folder.folders) buildIndex(sub, index);
}

let cachedIndex: SearchEntry[] | null = null;
function getIndex(): SearchEntry[] {
  if (!cachedIndex) {
    cachedIndex = [];
    buildIndex(manifest.root, cachedIndex);
  }
  return cachedIndex;
}

interface ScoredEntry {
  entry: SearchEntry;
  score: number;
}

export function searchLibrary(query: string, limit = 50): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored: ScoredEntry[] = [];
  for (const entry of getIndex()) {
    const nameMatch = entry.name.toLowerCase().includes(q);
    const titleMatch = entry.title?.toLowerCase().includes(q) ?? false;
    const excerptMatch = entry.excerpt?.toLowerCase().includes(q) ?? false;
    if (!nameMatch && !titleMatch && !excerptMatch) continue;

    let score = 0;
    if (nameMatch) score += entry.name.toLowerCase().startsWith(q) ? 100 : 50;
    if (titleMatch) score += 30;
    if (excerptMatch) score += 10;
    if (entry.kind === "folder") score += 5;

    scored.push({ entry, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.entry);
}

export function useSearch() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchLibrary(query), [query]);
  return { query, setQuery, results };
}
