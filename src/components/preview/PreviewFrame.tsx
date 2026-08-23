import type { ReactNode } from "react";
import { Download } from "lucide-react";
import { ErrorState } from "@/components/common/ErrorState";

interface PreviewFrameProps {
  src: string;
  fileName: string;
  loading: boolean;
  error: boolean;
  children: ReactNode;
  toolbar?: ReactNode;
}

/** Shared chrome (download link, loading/error states) around a file preview's content. */
export function PreviewFrame({ src, fileName, loading, error, children, toolbar }: PreviewFrameProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">{toolbar}</div>
        <a
          href={src}
          download={fileName}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </a>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {loading && (
          <div className="animate-pulse space-y-3 p-6">
            <div className="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        )}
        {error && !loading && (
          <div className="p-6">
            <ErrorState
              title="Couldn't preview this file"
              description="Something went wrong while loading it. You can still download it below."
            />
          </div>
        )}
        {!loading && !error && children}
      </div>
    </div>
  );
}
