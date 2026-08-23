import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useBinaryFile } from "@/hooks/useBinaryFile";
import { PreviewFrame } from "@/components/preview/PreviewFrame";

interface XlsxViewerProps {
  src: string;
  fileName: string;
}

const MAX_ROWS = 2000;

export function XlsxViewer({ src, fileName }: XlsxViewerProps) {
  const { data, loading: fetching, error: fetchError } = useBinaryFile(src);
  const [sheets, setSheets] = useState<{ name: string; rows: unknown[][] }[] | null>(null);
  const [activeSheet, setActiveSheet] = useState(0);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState(false);

  useEffect(() => {
    if (!data) return;
    let cancelled = false;
    setParsing(true);
    setParseError(false);

    import("xlsx")
      .then((XLSX) => {
        const workbook = XLSX.read(data, { type: "array" });
        const parsed = workbook.SheetNames.map((name) => ({
          name,
          rows: XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[name], {
            header: 1,
            blankrows: false,
          }),
        }));
        if (!cancelled) {
          setSheets(parsed);
          setActiveSheet(0);
        }
      })
      .catch(() => {
        if (!cancelled) setParseError(true);
      })
      .finally(() => {
        if (!cancelled) setParsing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [data]);

  const sheet = sheets?.[activeSheet];
  const [header, ...body] = sheet?.rows ?? [];
  const truncated = body.length > MAX_ROWS;
  const visibleBody = truncated ? body.slice(0, MAX_ROWS) : body;

  return (
    <PreviewFrame
      src={src}
      fileName={fileName}
      loading={fetching || parsing}
      error={fetchError || parseError}
      toolbar={
        sheets && sheets.length > 1 ? (
          <div className="flex flex-wrap gap-1">
            {sheets.map((s, i) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setActiveSheet(i)}
                className={clsx(
                  "rounded-full px-3 py-1 text-xs font-medium transition",
                  i === activeSheet
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
                )}
              >
                {s.name}
              </button>
            ))}
          </div>
        ) : undefined
      }
    >
      {sheet && (
        <div className="max-h-[75vh] overflow-auto">
          {sheet.rows.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">This sheet is empty.</p>
          ) : (
            <>
              <table className="min-w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800">
                  <tr>
                    {(header ?? []).map((cell, i) => (
                      <th
                        key={i}
                        className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-left font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                      >
                        {String(cell ?? "")}
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
                          {String(cell ?? "")}
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
            </>
          )}
        </div>
      )}
    </PreviewFrame>
  );
}
