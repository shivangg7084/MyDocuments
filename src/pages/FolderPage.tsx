import { useParams } from "react-router-dom";
import { FolderOpen } from "lucide-react";
import { findFolder, findReadme } from "@/lib/manifest";
import { contentFileUrl } from "@/lib/paths";
import { decodeContentPath } from "@/lib/file-utils";
import { useTextFile } from "@/hooks/useTextFile";
import { useFileBrowser } from "@/hooks/useFileBrowser";
import { Breadcrumbs } from "@/components/file-browser/Breadcrumbs";
import { FolderCard } from "@/components/file-browser/FolderCard";
import { FileCard } from "@/components/file-browser/FileCard";
import { SortFilterBar } from "@/components/file-browser/SortFilterBar";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";

export function FolderPage() {
  const params = useParams();
  const folderPath = decodeContentPath(params["*"] ?? "");
  const folder = findFolder(folderPath);

  const readme = folder ? findReadme(folder) : undefined;
  const { content: readmeContent } = useTextFile(readme ? contentFileUrl(readme.path) : null);
  const otherFiles = folder ? folder.files.filter((f) => f !== readme) : [];
  const { sortKey, setSortKey, filterKey, setFilterKey, visibleFiles } = useFileBrowser(otherFiles);

  if (!folder) {
    return (
      <ErrorState
        title="Folder not found"
        description="The folder you're looking for doesn't exist or may have been moved."
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Breadcrumbs folderPath={folderPath} />
        <div className="flex items-center gap-2">
          <FolderOpen className="h-6 w-6 text-indigo-500" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{folder.name}</h1>
        </div>
        {folder.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{folder.description}</p>
        )}
      </div>

      {readme && readmeContent && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <MarkdownRenderer content={readmeContent} baseDir={folder.path} />
        </section>
      )}

      {folder.folders.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Folders
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {folder.folders.map((sub) => (
              <FolderCard key={sub.path} folder={sub} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Files
        </h2>
        {otherFiles.length === 0 ? (
          <EmptyState title="No files in this folder" />
        ) : (
          <div className="flex flex-col gap-4">
            <SortFilterBar
              sortKey={sortKey}
              onSortChange={setSortKey}
              filterKey={filterKey}
              onFilterChange={setFilterKey}
            />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {visibleFiles.map((file) => (
                <FileCard key={file.path} file={file} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
