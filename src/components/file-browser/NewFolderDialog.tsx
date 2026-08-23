import { useMemo, useState } from "react";
import { Check, Copy, FolderPlus } from "lucide-react";
import { flattenFolders } from "@/lib/manifest";
import { slugifyFolderName } from "@/lib/file-utils";
import { Modal } from "@/components/common/Modal";

interface NewFolderDialogProps {
  onClose: () => void;
  /** Pre-selected parent folder path, e.g. when opened from a specific folder's row. */
  defaultParentPath?: string;
}

function buildCommands(fullPath: string, title: string): string {
  const dir = `public/content/${fullPath}`;
  return [
    `mkdir -p "${dir}"`,
    `cat > "${dir}/README.md" << 'EOF'`,
    `# ${title}`,
    `EOF`,
    `npm run generate-content`,
  ].join("\n");
}

export function NewFolderDialog({ onClose, defaultParentPath = "" }: NewFolderDialogProps) {
  const folderOptions = useMemo(() => flattenFolders(), []);
  const [name, setName] = useState("");
  const [parentPath, setParentPath] = useState(defaultParentPath);
  const [copied, setCopied] = useState(false);

  const slug = slugifyFolderName(name);
  const fullPath = parentPath ? `${parentPath}/${slug}` : slug;
  const title = name.trim();
  const commands = slug ? buildCommands(fullPath, title) : "";

  async function handleCopy() {
    if (!commands) return;
    try {
      await navigator.clipboard.writeText(commands);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — the commands are still visible to copy manually.
    }
  }

  return (
    <Modal title="New Folder" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          GitHub Pages is static, so folders are created by adding files to the repository — this
          gives you the exact commands to run locally, then push.
        </p>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="new-folder-name" className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Folder name
          </label>
          <input
            id="new-folder-name"
            type="text"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Deep Learning"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="new-folder-parent" className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Parent folder
          </label>
          <select
            id="new-folder-parent"
            value={parentPath}
            onChange={(e) => setParentPath(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-900/40"
          >
            {folderOptions.map((opt) => (
              <option key={opt.path} value={opt.path}>
                {"    ".repeat(opt.depth)}
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {slug ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Run these locally, then push
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs leading-relaxed text-slate-100">
              <code>{commands}</code>
            </pre>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Creates <code className="text-slate-500 dark:text-slate-400">public/content/{fullPath}/</code>{" "}
              with a starter README, then regenerates the manifest. Commit and push to publish it.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-200 px-3 py-6 text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500">
            <FolderPlus className="h-4 w-4" />
            Type a folder name to generate the commands.
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
