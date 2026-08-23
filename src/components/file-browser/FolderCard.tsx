import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { ManifestFolder } from "@/types/content";
import { folderRoute } from "@/lib/paths";
import { folderFileCount } from "@/lib/manifest";
import { FileIcon } from "@/components/common/FileIcon";

interface FolderCardProps {
  folder: ManifestFolder;
}

export function FolderCard({ folder }: FolderCardProps) {
  const count = folderFileCount(folder);

  return (
    <Link
      to={folderRoute(folder.path)}
      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
    >
      <div className="flex items-start justify-between">
        <FileIcon type="folder" className="h-7 w-7" />
        <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-400 dark:text-slate-600" />
      </div>
      <div className="mt-3">
        <h3 className="truncate font-medium text-slate-800 dark:text-slate-100">{folder.name}</h3>
        {folder.description && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
            {folder.description}
          </p>
        )}
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          {count} {count === 1 ? "file" : "files"}
          {folder.folders.length > 0 &&
            ` · ${folder.folders.length} ${folder.folders.length === 1 ? "subfolder" : "subfolders"}`}
        </p>
      </div>
    </Link>
  );
}
