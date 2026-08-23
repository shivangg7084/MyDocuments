import { useMemo, useState } from "react";
import type { FileType, ManifestFile } from "@/types/content";

export type SortKey = "name" | "type" | "size";
export type FilterKey = "all" | FileType;

const FILTER_LABELS: Record<FilterKey, string> = {
  all: "All",
  video: "Videos",
  markdown: "Markdown",
  pdf: "PDF",
  image: "Images",
  other: "Other",
};

export const FILTER_OPTIONS: FilterKey[] = ["all", "video", "markdown", "pdf", "image", "other"];

export function filterLabel(key: FilterKey): string {
  return FILTER_LABELS[key];
}

export function useFileBrowser(files: ManifestFile[]) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [filterKey, setFilterKey] = useState<FilterKey>("all");

  const visibleFiles = useMemo(() => {
    let result = files;
    if (filterKey !== "all") {
      result = result.filter((f) => f.type === filterKey);
    }
    result = [...result].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "type") return a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
      return b.size - a.size;
    });
    return result;
  }, [files, sortKey, filterKey]);

  return { sortKey, setSortKey, filterKey, setFilterKey, visibleFiles };
}
