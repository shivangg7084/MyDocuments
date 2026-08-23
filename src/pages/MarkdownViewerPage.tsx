import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Download } from "lucide-react";
import { findFile } from "@/lib/manifest";
import { contentFileUrl } from "@/lib/paths";
import { decodeContentPath } from "@/lib/file-utils";
import { useTextFile } from "@/hooks/useTextFile";
import { extractToc, stripFrontmatter } from "@/lib/markdown";
import { Breadcrumbs } from "@/components/file-browser/Breadcrumbs";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { TableOfContents } from "@/components/markdown/TableOfContents";
import { ErrorState } from "@/components/common/ErrorState";

export function MarkdownViewerPage() {
  const params = useParams();
  const filePath = decodeContentPath(params["*"] ?? "");
  const file = findFile(filePath);
  const url = file ? contentFileUrl(file.path) : null;
  const { content, loading, error } = useTextFile(url);

  const toc = useMemo(() => (content ? extractToc(stripFrontmatter(content)) : []), [content]);
  const folderPath = filePath.split("/").slice(0, -1).join("/");

  if (!file) {
    return (
      <ErrorState
        title="File not found"
        description="The requested file could not be loaded."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <Breadcrumbs folderPath={folderPath} trailingLabel={file.name} />
        {url && (
          <a
            href={url}
            download={file.name}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_220px]">
        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          {!file.title && (
            <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">{file.name}</h1>
          )}

          {loading && (
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          )}

          {error && (
            <ErrorState
              title="Couldn't load this file"
              description="Something went wrong while fetching the markdown content."
            />
          )}

          {content && <MarkdownRenderer content={content} baseDir={folderPath} />}

          <p className="mt-10 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
            {file.path}
          </p>
        </article>

        <aside className="hidden lg:block">
          <TableOfContents headings={toc} />
        </aside>
      </div>
    </div>
  );
}
