import { useMemo } from "react";
import hljs from "highlight.js/lib/common";
import { useTextFile } from "@/hooks/useTextFile";
import { parseNotebook, type Notebook, type NotebookCell, type NotebookOutput } from "@/lib/notebook";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";

interface NotebookViewerProps {
  src: string;
  fileName: string;
  /** Folder the notebook lives in, so markdown cells can resolve relative images. */
  baseDir: string;
}

/** Highlights a code cell, falling back to plain escaped text for unknown languages. */
function highlight(code: string, language: string): string {
  try {
    if (hljs.getLanguage(language)) {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    }
  } catch {
    // Fall through to the escaped plain-text rendering below.
  }
  return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function OutputBlock({ output }: { output: NotebookOutput }) {
  if (output.kind === "image") {
    const src =
      output.encoding === "base64"
        ? `data:${output.mime};base64,${output.data}`
        : `data:${output.mime};utf8,${encodeURIComponent(output.data ?? "")}`;
    return (
      <img
        src={src}
        alt="Cell output"
        loading="lazy"
        className="max-w-full rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800"
      />
    );
  }

  if (output.kind === "html") {
    // Notebook HTML (pandas tables, plot embeds) is repo content and was
    // sanitized at parse time; `prose` gives the tables sane default styling.
    return (
      <div
        className="prose prose-sm max-w-none overflow-x-auto dark:prose-invert prose-table:text-xs"
        dangerouslySetInnerHTML={{ __html: output.html ?? "" }}
      />
    );
  }

  if (output.kind === "error") {
    return (
      <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
        {output.text}
      </pre>
    );
  }

  return (
    <pre
      className={
        output.stderr
          ? "overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
          : "overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
      }
    >
      {output.text}
    </pre>
  );
}

/** The `In [n]:` / `Out [n]:` gutter label Jupyter shows beside each code cell. */
function PromptLabel({ label }: { label: string }) {
  return (
    <div className="shrink-0 select-none pt-3 font-mono text-[11px] leading-none text-slate-400 dark:text-slate-500 sm:w-16 sm:text-right">
      {label}
    </div>
  );
}

function Cell({ cell, language, baseDir }: { cell: NotebookCell; language: string; baseDir: string }) {
  if (cell.kind === "markdown") {
    if (!cell.source.trim()) return null;
    return (
      <div className="flex gap-3 px-4 py-2">
        <div className="hidden shrink-0 sm:block sm:w-16" />
        <div className="min-w-0 flex-1">
          <MarkdownRenderer content={cell.source} baseDir={baseDir} />
        </div>
      </div>
    );
  }

  if (cell.kind === "raw") {
    if (!cell.source.trim()) return null;
    return (
      <div className="flex gap-3 px-4 py-2">
        <div className="hidden shrink-0 sm:block sm:w-16" />
        <pre className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
          {cell.source}
        </pre>
      </div>
    );
  }

  const hasSource = cell.source.trim().length > 0;
  if (!hasSource && cell.outputs.length === 0) return null;

  return (
    <div className="px-4 py-2">
      {hasSource && (
        <div className="flex gap-3">
          <PromptLabel label={`In [${cell.executionCount ?? " "}]:`} />
          <pre className="min-w-0 flex-1 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs leading-relaxed">
            <code
              className="hljs bg-transparent p-0"
              dangerouslySetInnerHTML={{ __html: highlight(cell.source, language) }}
            />
          </pre>
        </div>
      )}

      {cell.outputs.length > 0 && (
        <div className="mt-1.5 flex gap-3">
          <PromptLabel label={cell.executionCount !== null ? `Out [${cell.executionCount}]:` : ""} />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {cell.outputs.map((output, i) => (
              <OutputBlock key={i} output={output} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Read-only .ipynb rendering: markdown cells, highlighted code, and saved outputs. */
export function NotebookViewer({ src, fileName, baseDir }: NotebookViewerProps) {
  const { content, loading, error } = useTextFile(src);

  const { notebook, parseError } = useMemo((): { notebook: Notebook | null; parseError: boolean } => {
    if (!content) return { notebook: null, parseError: false };
    try {
      return { notebook: parseNotebook(content), parseError: false };
    } catch {
      return { notebook: null, parseError: true };
    }
  }, [content]);

  const codeCells = notebook?.cells.filter((c) => c.kind === "code").length ?? 0;

  return (
    <PreviewFrame
      src={src}
      fileName={fileName}
      loading={loading}
      error={error || parseError}
      toolbar={
        notebook ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {notebook.kernelName ?? notebook.language} · {notebook.cells.length} cells · {codeCells} code
          </p>
        ) : undefined
      }
    >
      {notebook && (
        <div className="max-h-[80vh] divide-y divide-slate-100 overflow-auto py-2 dark:divide-slate-800/60">
          {notebook.cells.map((cell, i) => (
            <Cell key={i} cell={cell} language={notebook.language} baseDir={baseDir} />
          ))}
        </div>
      )}
    </PreviewFrame>
  );
}
