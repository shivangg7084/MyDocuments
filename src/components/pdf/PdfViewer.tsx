import { Download } from "lucide-react";

interface PdfViewerProps {
  src: string;
  fileName: string;
}

export function PdfViewer({ src, fileName }: PdfViewerProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end">
        <a
          href={src}
          download={fileName}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </a>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        <object data={src} type="application/pdf" className="h-[80vh] w-full">
          <div className="flex h-64 flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your browser can&apos;t display PDFs inline.
            </p>
            <a
              href={src}
              download={fileName}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Download File
            </a>
          </div>
        </object>
      </div>
    </div>
  );
}
