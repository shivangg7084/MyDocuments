import { clsx } from "clsx";
import { FILTER_OPTIONS, filterLabel, type FilterKey, type SortKey } from "@/hooks/useFileBrowser";

interface SortFilterBarProps {
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
  filterKey: FilterKey;
  onFilterChange: (key: FilterKey) => void;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "size", label: "Size" },
];

export function SortFilterBar({ sortKey, onSortChange, filterKey, onFilterChange }: SortFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-1.5">
        {FILTER_OPTIONS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onFilterChange(key)}
            className={clsx(
              "rounded-full px-3 py-1 text-xs font-medium transition",
              filterKey === key
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
            )}
          >
            {filterLabel(key)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>Sort by</span>
        <select
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-indigo-900/40"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
