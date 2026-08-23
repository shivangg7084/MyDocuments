import { FolderOpen, Files, Film, FileText, FileType as FileTypeIcon } from "lucide-react";
import { manifest } from "@/lib/manifest";
import { SearchBar } from "@/components/common/SearchBar";
import { FolderCard } from "@/components/file-browser/FolderCard";
import { EmptyState } from "@/components/common/EmptyState";

const STAT_ITEMS = [
  { key: "folders", label: "Folders", icon: FolderOpen },
  { key: "files", label: "Files", icon: Files },
  { key: "videos", label: "Videos", icon: Film },
  { key: "markdown", label: "Notes", icon: FileText },
  { key: "pdfs", label: "Documents", icon: FileTypeIcon },
] as const;

export function Home() {
  const { root, stats } = manifest;

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-center gap-6 py-6 text-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            My Knowledge Library
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Organize · Learn · Reference
          </p>
        </div>
        <div className="w-full max-w-xl">
          <SearchBar placeholder="Search your library..." />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {STAT_ITEMS.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white py-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <Icon className="h-5 w-5 text-indigo-500" />
            <span className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              {stats[key]}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{label}</span>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">Folders</h2>
        {root.folders.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="h-10 w-10" />}
            title="No folders yet"
            description={
              'Add a folder under "public/content", run "npm run generate-content", then reload.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {root.folders.map((folder) => (
              <FolderCard key={folder.path} folder={folder} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
