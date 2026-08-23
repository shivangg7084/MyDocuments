import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, FolderPlus, Home, Library, Plus } from "lucide-react";
import { clsx } from "clsx";
import { manifest } from "@/lib/manifest";
import { folderRoute } from "@/lib/paths";
import { FileIcon } from "@/components/common/FileIcon";
import { NewFolderDialog } from "@/components/file-browser/NewFolderDialog";
import type { ManifestFolder } from "@/types/content";

interface FolderTreeItemProps {
  folder: ManifestFolder;
  depth: number;
  onNewSubfolder: (parentPath: string) => void;
}

function FolderTreeItem({ folder, depth, onNewSubfolder }: FolderTreeItemProps) {
  const location = useLocation();
  const route = folderRoute(folder.path);
  const isActive = decodeURIComponent(location.pathname) === route;
  const isAncestor = decodeURIComponent(location.pathname).startsWith(route + "/");
  const [open, setOpen] = useState(isAncestor);
  const hasChildren = folder.folders.length > 0;

  return (
    <div>
      <div
        className={clsx(
          "group flex items-center rounded-lg pr-1 text-sm",
          isActive
            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
        )}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={open ? "Collapse folder" : "Expand folder"}
            onClick={() => setOpen((o) => !o)}
            className="flex h-7 w-5 shrink-0 items-center justify-center text-slate-400"
          >
            <ChevronRight className={clsx("h-3.5 w-3.5 transition-transform", open && "rotate-90")} />
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}
        <Link to={route} className="flex flex-1 items-center gap-2 truncate py-1.5">
          <FileIcon type="folder" className="h-4 w-4" />
          <span className="truncate">{folder.name}</span>
        </Link>
        <button
          type="button"
          aria-label={`New subfolder in ${folder.name}`}
          title={`New subfolder in ${folder.name}`}
          onClick={() => onNewSubfolder(folder.path)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 opacity-0 hover:bg-slate-200 hover:text-slate-700 group-hover:opacity-100 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      {hasChildren && open && (
        <div>
          {folder.folders.map((sub) => (
            <FolderTreeItem key={sub.path} folder={sub} depth={depth + 1} onNewSubfolder={onNewSubfolder} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const atHome = location.pathname === "/" || location.pathname === "";
  const [dialogParentPath, setDialogParentPath] = useState<string | null>(null);

  return (
    <nav className={clsx("flex flex-col gap-1 overflow-y-auto px-2 py-4", className)}>
      <div className="mb-3 flex items-center gap-2 px-2">
        <Library className="h-5 w-5 text-indigo-500" />
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">My Library</span>
      </div>

      <Link
        to="/"
        className={clsx(
          "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm",
          atHome
            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
        )}
      >
        <Home className="h-4 w-4" />
        Home
      </Link>

      <div className="mt-3 flex-1 border-t border-slate-200 pt-3 dark:border-slate-800">
        {manifest.root.folders.length === 0 ? (
          <p className="px-3 text-xs text-slate-400 dark:text-slate-500">No folders yet.</p>
        ) : (
          manifest.root.folders.map((folder) => (
            <FolderTreeItem
              key={folder.path}
              folder={folder}
              depth={0}
              onNewSubfolder={setDialogParentPath}
            />
          ))
        )}
      </div>

      <button
        type="button"
        onClick={() => setDialogParentPath("")}
        className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
      >
        <FolderPlus className="h-4 w-4" />
        New Folder
      </button>

      {dialogParentPath !== null && (
        <NewFolderDialog defaultParentPath={dialogParentPath} onClose={() => setDialogParentPath(null)} />
      )}
    </nav>
  );
}
