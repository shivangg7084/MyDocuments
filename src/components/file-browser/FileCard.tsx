import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import type { ManifestFile } from "@/types/content";
import { fileRoute, markdownRoute, videoRoute, contentFileUrl } from "@/lib/paths";
import { fileTypeLabel, formatBytes } from "@/lib/file-utils";
import { FileIcon } from "@/components/common/FileIcon";

interface FileCardProps {
  file: ManifestFile;
}

function routeForFile(file: ManifestFile): string {
  if (file.type === "markdown") return markdownRoute(file.path);
  if (file.type === "video") return videoRoute(file.path);
  return fileRoute(file.path);
}

export function FileCard({ file }: FileCardProps) {
  return (
    <div className="group flex items-center gap-1 rounded-xl border border-slate-200 bg-white pl-4 pr-2 transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700">
      <Link to={routeForFile(file)} className="flex min-w-0 flex-1 items-center gap-3 py-3">
        <FileIcon type={file.type} ext={file.ext} className="h-6 w-6" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
            {file.title || file.name}
          </p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">
            {fileTypeLabel(file.type, file.ext)} · {formatBytes(file.size)}
          </p>
        </div>
      </Link>
      <a
        href={contentFileUrl(file.path)}
        download={file.name}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Download ${file.name}`}
        title={`Download ${file.name}`}
        className="flex shrink-0 items-center justify-center rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-indigo-600 group-hover:opacity-100 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
      >
        <Download className="h-4 w-4" />
      </a>
    </div>
  );
}
