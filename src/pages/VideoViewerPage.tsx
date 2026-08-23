import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { findFile, findFolder, videosInFolder } from "@/lib/manifest";
import { contentFileUrl, videoRoute, markdownRoute, fileRoute } from "@/lib/paths";
import { decodeContentPath, formatBytes } from "@/lib/file-utils";
import { Breadcrumbs } from "@/components/file-browser/Breadcrumbs";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { FileIcon } from "@/components/common/FileIcon";
import { ErrorState } from "@/components/common/ErrorState";
import type { ManifestFile } from "@/types/content";

function routeForRelated(file: ManifestFile): string {
  if (file.type === "markdown") return markdownRoute(file.path);
  if (file.type === "video") return videoRoute(file.path);
  return fileRoute(file.path);
}

export function VideoViewerPage() {
  const params = useParams();
  const filePath = decodeContentPath(params["*"] ?? "");
  const file = findFile(filePath);
  const folderPath = filePath.split("/").slice(0, -1).join("/");
  const folder = findFolder(folderPath);

  if (!file || file.type !== "video" || !folder) {
    return <ErrorState title="Video not found" description="The requested video could not be loaded." />;
  }

  const videos = videosInFolder(folder);
  const index = videos.findIndex((v) => v.path === file.path);
  const prev = index > 0 ? videos[index - 1] : undefined;
  const next = index >= 0 && index < videos.length - 1 ? videos[index + 1] : undefined;
  const related = folder.files.filter((f) => f.path !== file.path);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs folderPath={folderPath} trailingLabel={file.name} />

      <VideoPlayer src={contentFileUrl(file.path)} title={file.title || file.name} />

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{file.title || file.name}</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">{formatBytes(file.size)}</p>
          {folder.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400">{folder.description}</p>
          )}
        </div>
        <a
          href={contentFileUrl(file.path)}
          download={file.name}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </a>
      </div>

      {(prev || next) && (
        <div className="flex items-center justify-between gap-3 border-y border-slate-100 py-3 dark:border-slate-800">
          {prev ? (
            <Link
              to={videoRoute(prev.path)}
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="truncate">{prev.title || prev.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={videoRoute(next.path)}
              className="flex items-center gap-1.5 text-right text-sm text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              <span className="truncate">{next.title || next.name}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Related files
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {related.map((f) => (
              <Link
                key={f.path}
                to={routeForRelated(f)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
              >
                <FileIcon type={f.type} className="h-5 w-5" />
                <span className="truncate text-slate-700 dark:text-slate-200">{f.title || f.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
