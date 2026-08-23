import { useEffect, useMemo, useState } from "react";
import { useBinaryFile } from "@/hooks/useBinaryFile";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { FileIcon } from "@/components/common/FileIcon";
import { classifyFile, extOf, formatBytes } from "@/lib/file-utils";

interface ZipViewerProps {
  src: string;
  fileName: string;
}

interface ZipEntry {
  path: string;
  name: string;
  isDir: boolean;
  size: number;
  depth: number;
}

export function ZipViewer({ src, fileName }: ZipViewerProps) {
  const { data, loading: fetching, error: fetchError } = useBinaryFile(src);
  const [entries, setEntries] = useState<ZipEntry[] | null>(null);
  const [reading, setReading] = useState(false);
  const [readError, setReadError] = useState(false);

  useEffect(() => {
    if (!data) return;
    let cancelled = false;
    setReading(true);
    setReadError(false);

    import("jszip")
      .then(async (mod) => {
        const JSZip = mod.default;
        const zip = await JSZip.loadAsync(data);
        const list: ZipEntry[] = [];
        zip.forEach((relativePath, file) => {
          const parts = relativePath.replace(/\/$/, "").split("/");
          list.push({
            path: relativePath,
            name: parts[parts.length - 1],
            isDir: file.dir,
            size: (file as unknown as { _data?: { uncompressedSize?: number } })._data
              ?.uncompressedSize ?? 0,
            depth: parts.length - 1,
          });
        });
        list.sort((a, b) => a.path.localeCompare(b.path));
        if (!cancelled) setEntries(list);
      })
      .catch(() => {
        if (!cancelled) setReadError(true);
      })
      .finally(() => {
        if (!cancelled) setReading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [data]);

  const fileCount = useMemo(() => entries?.filter((e) => !e.isDir).length ?? 0, [entries]);

  return (
    <PreviewFrame
      src={src}
      fileName={fileName}
      loading={fetching || reading}
      error={fetchError || readError}
      toolbar={
        entries ? (
          <span className="text-xs text-slate-400 dark:text-slate-500">{fileCount} files</span>
        ) : undefined
      }
    >
      {entries && (
        <div className="max-h-[75vh] overflow-auto p-2">
          {entries.length === 0 ? (
            <p className="p-4 text-sm text-slate-500 dark:text-slate-400">This archive is empty.</p>
          ) : (
            <ul className="text-sm">
              {entries.map((entry) => (
                <li
                  key={entry.path}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  style={{ paddingLeft: `${entry.depth * 18 + 8}px` }}
                >
                  <FileIcon
                    type={entry.isDir ? "folder" : classifyFile(entry.name)}
                    ext={extOf(entry.name)}
                    className="h-4 w-4"
                  />
                  <span className="truncate">{entry.name}</span>
                  {!entry.isDir && (
                    <span className="ml-auto shrink-0 text-xs text-slate-400 dark:text-slate-500">
                      {formatBytes(entry.size)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </PreviewFrame>
  );
}
