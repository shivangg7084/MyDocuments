import { useParams, Navigate } from "react-router-dom";
import { Download } from "lucide-react";
import { findFile } from "@/lib/manifest";
import { contentFileUrl, markdownRoute, videoRoute } from "@/lib/paths";
import { decodeContentPath, fileTypeLabel, formatBytes } from "@/lib/file-utils";
import { Breadcrumbs } from "@/components/file-browser/Breadcrumbs";
import { PdfViewer } from "@/components/pdf/PdfViewer";
import { ImageViewer } from "@/components/image/ImageViewer";
import { TextViewer } from "@/components/preview/TextViewer";
import { CsvViewer } from "@/components/preview/CsvViewer";
import { JsonViewer } from "@/components/preview/JsonViewer";
import { DocxViewer } from "@/components/preview/DocxViewer";
import { XlsxViewer } from "@/components/preview/XlsxViewer";
import { ZipViewer } from "@/components/preview/ZipViewer";
import { FileIcon } from "@/components/common/FileIcon";
import { ErrorState } from "@/components/common/ErrorState";

export function FileViewerPage() {
  const params = useParams();
  const filePath = decodeContentPath(params["*"] ?? "");
  const file = findFile(filePath);
  const folderPath = filePath.split("/").slice(0, -1).join("/");

  if (!file) {
    return <ErrorState title="File not found" description="The requested file could not be loaded." />;
  }

  if (file.type === "markdown") return <Navigate to={markdownRoute(file.path)} replace />;
  if (file.type === "video") return <Navigate to={videoRoute(file.path)} replace />;

  const url = contentFileUrl(file.path);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs folderPath={folderPath} trailingLabel={file.name} />

      {file.type === "pdf" && <PdfViewer src={url} fileName={file.name} />}
      {file.type === "image" && <ImageViewer src={url} alt={file.name} />}

      {file.type === "other" && file.ext === "txt" && <TextViewer src={url} fileName={file.name} />}
      {file.type === "other" && file.ext === "csv" && <CsvViewer src={url} fileName={file.name} />}
      {file.type === "other" && file.ext === "json" && <JsonViewer src={url} fileName={file.name} />}
      {file.type === "other" && file.ext === "docx" && <DocxViewer src={url} fileName={file.name} />}
      {file.type === "other" && (file.ext === "xlsx" || file.ext === "xls") && (
        <XlsxViewer src={url} fileName={file.name} />
      )}
      {file.type === "other" && file.ext === "zip" && <ZipViewer src={url} fileName={file.name} />}

      {file.type === "other" &&
        !["txt", "csv", "json", "docx", "xlsx", "xls", "zip"].includes(file.ext) && (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-slate-200 px-6 py-16 text-center dark:border-slate-800">
            <FileIcon type="other" ext={file.ext} className="h-12 w-12" />
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100">{file.name}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {fileTypeLabel(file.type, file.ext)} · {formatBytes(file.size)}
              </p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Preview unavailable for this file type.
            </p>
            <a
              href={url}
              download={file.name}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              <Download className="h-4 w-4" />
              Download File
            </a>
          </div>
        )}
    </div>
  );
}
