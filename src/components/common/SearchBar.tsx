import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { FileIcon } from "@/components/common/FileIcon";
import { folderRoute, markdownRoute, videoRoute, fileRoute } from "@/lib/paths";

function routeFor(entry: ReturnType<typeof useSearch>["results"][number]): string {
  if (entry.kind === "folder") return folderRoute(entry.path);
  if (entry.fileType === "markdown") return markdownRoute(entry.path);
  if (entry.fileType === "video") return videoRoute(entry.path);
  return fileRoute(entry.path);
}

interface SearchBarProps {
  autoFocus?: boolean;
  placeholder?: string;
}

export function SearchBar({ autoFocus, placeholder = "Search your library..." }: SearchBarProps) {
  const { query, setQuery, results } = useSearch();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function goTo(entry: (typeof results)[number]) {
    navigate(routeFor(entry));
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "Enter" && results.length > 0) goTo(results[0]);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && query && (
        <div className="absolute z-30 mt-2 max-h-96 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            results.map((entry) => (
              <button
                key={`${entry.kind}-${entry.path}`}
                onClick={() => goTo(entry)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <FileIcon type={entry.kind === "folder" ? "folder" : entry.fileType ?? "other"} />
                <span className="flex-1 truncate">
                  <span className="block truncate text-slate-800 dark:text-slate-200">
                    {entry.title || entry.name}
                  </span>
                  <span className="block truncate text-xs text-slate-400 dark:text-slate-500">
                    {entry.folderPath || "Home"}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
