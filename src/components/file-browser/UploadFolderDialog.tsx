import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, FolderUp, Upload } from "lucide-react";
import { flattenFolders } from "@/lib/manifest";
import { classifyFile, extOf, fileTypeLabel, formatBytes } from "@/lib/file-utils";
import { folderRoute } from "@/lib/paths";
import {
  collectUpload,
  regenerateManifest,
  sanitizeFolderName,
  uploadFolder,
  type CollectedUpload,
  type UploadProgress,
} from "@/lib/upload";
import { Modal } from "@/components/common/Modal";
import { FileIcon } from "@/components/common/FileIcon";

interface UploadFolderDialogProps {
  onClose: () => void;
  /** Pre-selected destination folder, e.g. when opened from a specific folder's row. */
  defaultParentPath?: string;
}

type Status =
  | { phase: "idle" }
  | { phase: "uploading"; progress: UploadProgress }
  | { phase: "finalizing" }
  | { phase: "done"; folderPath: string; count: number }
  | { phase: "error"; message: string };

const PREVIEW_LIMIT = 8;

/** Counts the picked files by the label the library would show for them. */
function summarizeTypes(collected: CollectedUpload): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const entry of collected.entries) {
    const name = entry.relPath.split("/").pop() ?? entry.relPath;
    const ext = extOf(name);
    const label = ext === "ipynb" ? "Notebook" : fileTypeLabel(classifyFile(name), ext);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function UploadFolderDialog({ onClose, defaultParentPath = "" }: UploadFolderDialogProps) {
  const folderOptions = useMemo(() => flattenFolders(), []);
  const inputRef = useRef<HTMLInputElement>(null);

  const [collected, setCollected] = useState<CollectedUpload | null>(null);
  const [parentPath, setParentPath] = useState(defaultParentPath);
  const [destName, setDestName] = useState("");
  const [status, setStatus] = useState<Status>({ phase: "idle" });

  // `webkitdirectory` isn't in React's JSX attribute types, so it's set directly.
  useEffect(() => {
    inputRef.current?.setAttribute("webkitdirectory", "");
    inputRef.current?.setAttribute("directory", "");
  }, []);

  const typeSummary = useMemo(() => (collected ? summarizeTypes(collected) : []), [collected]);
  const cleanName = sanitizeFolderName(destName);
  const destPath = [parentPath, cleanName].filter(Boolean).join("/");
  const busy = status.phase === "uploading" || status.phase === "finalizing";
  const canUpload = !!collected && collected.entries.length > 0 && cleanName.length > 0 && !busy;

  function handlePick(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const next = collectUpload(fileList);
    setCollected(next);
    setDestName(next.rootName || "");
    setStatus({ phase: "idle" });
  }

  async function handleUpload() {
    if (!collected || !canUpload) return;
    setStatus({ phase: "uploading", progress: { completed: 0, total: collected.entries.length, currentPath: "" } });
    try {
      const folderPath = await uploadFolder(collected, parentPath, cleanName, (progress) =>
        setStatus({ phase: "uploading", progress }),
      );
      setStatus({ phase: "finalizing" });
      await regenerateManifest();
      setStatus({ phase: "done", folderPath, count: collected.entries.length });
    } catch (err) {
      setStatus({ phase: "error", message: err instanceof Error ? err.message : "Upload failed" });
    }
  }

  // The manifest is a build-time JSON import, so a full reload is what actually
  // surfaces the newly written files in the browser.
  function openUploadedFolder(folderPath: string) {
    window.location.hash = `#${folderRoute(folderPath)}`;
    window.location.reload();
  }

  return (
    <Modal title="Upload Folder" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pick a folder from your computer — its notebooks, READMEs and other files are written into{" "}
          <code className="text-slate-600 dark:text-slate-300">public/content/</code> and become view-only
          pages in the library. Commit and push to publish them.
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handlePick(e.target.files)}
        />

        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-6 text-sm text-slate-500 hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
        >
          <FolderUp className="h-4 w-4" />
          {collected ? "Choose a different folder" : "Choose a folder"}
        </button>

        {collected && collected.entries.length === 0 && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400">
            Nothing in that folder can be published — every file was hidden or in an ignored directory.
          </p>
        )}

        {collected && collected.entries.length > 0 && (
          <>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-slate-100 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {collected.entries.length} files · {formatBytes(collected.totalBytes)}
                </span>
                {typeSummary.map((t) => (
                  <span key={t.label}>
                    {t.count} {t.label}
                  </span>
                ))}
              </div>
              <ul className="max-h-40 overflow-y-auto px-3 py-2">
                {collected.entries.slice(0, PREVIEW_LIMIT).map((entry) => {
                  const name = entry.relPath.split("/").pop() ?? entry.relPath;
                  return (
                    <li
                      key={entry.relPath}
                      className="flex items-center gap-2 py-0.5 text-xs text-slate-600 dark:text-slate-300"
                    >
                      <FileIcon type={classifyFile(name)} ext={extOf(name)} className="h-3.5 w-3.5" />
                      <span className="truncate">{entry.relPath}</span>
                    </li>
                  );
                })}
                {collected.entries.length > PREVIEW_LIMIT && (
                  <li className="py-0.5 text-xs text-slate-400 dark:text-slate-500">
                    + {collected.entries.length - PREVIEW_LIMIT} more
                  </li>
                )}
              </ul>
            </div>

            {collected.skipped.length > 0 && (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Skipping {collected.skipped.length} hidden or ignored{" "}
                {collected.skipped.length === 1 ? "file" : "files"} (dotfiles, <code>.git</code>,{" "}
                <code>.ipynb_checkpoints</code>, <code>node_modules</code>) — the library doesn't list them.
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="upload-folder-name"
                className="text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                Folder name
              </label>
              <input
                id="upload-folder-name"
                type="text"
                value={destName}
                disabled={busy}
                onChange={(e) => setDestName(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="upload-folder-parent"
                className="text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                Destination
              </label>
              <select
                id="upload-folder-parent"
                value={parentPath}
                disabled={busy}
                onChange={(e) => setParentPath(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-900/40"
              >
                {folderOptions.map((opt) => (
                  <option key={opt.path} value={opt.path}>
                    {"    ".repeat(opt.depth)}
                    {opt.label}
                  </option>
                ))}
              </select>
              {cleanName && (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Writes to <code className="text-slate-500 dark:text-slate-400">public/content/{destPath}/</code>
                </p>
              )}
            </div>
          </>
        )}

        {status.phase === "uploading" && (
          <div className="flex flex-col gap-1.5">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${(status.progress.completed / status.progress.total) * 100}%` }}
              />
            </div>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              Uploading {status.progress.completed} / {status.progress.total} —{" "}
              {status.progress.currentPath}
            </p>
          </div>
        )}

        {status.phase === "finalizing" && (
          <p className="text-xs text-slate-500 dark:text-slate-400">Regenerating the content manifest…</p>
        )}

        {status.phase === "error" && (
          <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {status.message}
          </p>
        )}

        {status.phase === "done" && (
          <div className="flex flex-col gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              Uploaded {status.count} files to public/content/{status.folderPath}/
            </span>
            <span className="text-emerald-600/80 dark:text-emerald-500/80">
              Commit and push to publish this folder to the live site.
            </span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {status.phase === "done" ? "Close" : "Cancel"}
          </button>
          {status.phase === "done" ? (
            <button
              type="button"
              onClick={() => openUploadedFolder(status.folderPath)}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Open folder
            </button>
          ) : (
            <button
              type="button"
              onClick={handleUpload}
              disabled={!canUpload}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {busy ? "Uploading…" : "Upload"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
