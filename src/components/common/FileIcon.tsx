import {
  FileText,
  Film,
  FileImage,
  File,
  Folder,
  FileArchive,
  FileCode2,
  FileSpreadsheet,
  FileType as FileTypeIcon,
} from "lucide-react";
import type { FileType } from "@/types/content";
import { clsx } from "clsx";

interface FileIconProps {
  type: FileType | "folder";
  ext?: string;
  className?: string;
}

const ARCHIVE_EXT = new Set(["zip", "rar", "7z", "tar", "gz"]);
const SPREADSHEET_EXT = new Set(["csv", "xlsx", "xls"]);
const DOC_EXT = new Set(["docx", "doc", "pptx", "ppt"]);

export function FileIcon({ type, ext, className }: FileIconProps) {
  const common = clsx("shrink-0", className ?? "h-5 w-5");

  if (type === "folder") return <Folder className={clsx(common, "text-indigo-500")} />;
  if (type === "markdown") return <FileText className={clsx(common, "text-sky-500")} />;
  if (type === "video") return <Film className={clsx(common, "text-rose-500")} />;
  if (type === "pdf") return <FileTypeIcon className={clsx(common, "text-red-500")} />;
  if (type === "image") return <FileImage className={clsx(common, "text-emerald-500")} />;

  if (ext === "ipynb") return <FileCode2 className={clsx(common, "text-orange-500")} />;
  if (ext && ARCHIVE_EXT.has(ext)) return <FileArchive className={clsx(common, "text-amber-500")} />;
  if (ext && SPREADSHEET_EXT.has(ext)) return <FileSpreadsheet className={clsx(common, "text-green-500")} />;
  if (ext && DOC_EXT.has(ext)) return <FileTypeIcon className={clsx(common, "text-blue-500")} />;

  return <File className={clsx(common, "text-slate-400")} />;
}
