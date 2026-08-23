import { useMemo } from "react";
import { useTextFile } from "@/hooks/useTextFile";
import { parseCsv } from "@/lib/csv";
import { PreviewFrame } from "@/components/preview/PreviewFrame";

interface CsvViewerProps {
  src: string;
  fileName: string;
}

const MAX_ROWS = 2000;

export function CsvViewer({ src, fileName }: CsvViewerProps) {
  const { content, loading, error } = useTextFile(src);

  const rows = useMemo(() => (content ? parseCsv(content) : []), [content]);
  const [header, ...body] = rows;
  const truncated = body.length > MAX_ROWS;
  const visibleBody = truncated ? body.slice(0, MAX_ROWS) : body;

  return (
    <PreviewFrame
      src={src}
      fileName={fileName}
      loading={loading}
      error={error}
      toolbar={
        rows.length > 0 ? (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {body.length} rows · {header?.length ?? 0} columns
          </span>
        ) : undefined
      }
    >
      {rows.length === 0 ? (
        <p className="p-6 text-sm text-slate-500 dark:text-slate-400">This file is empty.</p>
      ) : (
        <div className="max-h-[75vh] overflow-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800">
              <tr>
                {header?.map((cell, i) => (
                  <th
                    key={i}
                    className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-left font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleBody.map((row, i) => (
                <tr
                  key={i}
                  className="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-900 dark:even:bg-slate-800/40"
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="whitespace-nowrap border-b border-slate-100 px-3 py-1.5 text-slate-600 dark:border-slate-800 dark:text-slate-300"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {truncated && (
            <p className="border-t border-slate-100 p-3 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
              Showing the first {MAX_ROWS} of {body.length} rows — download the file to see the rest.
            </p>
          )}
        </div>
      )}
    </PreviewFrame>
  );
}
