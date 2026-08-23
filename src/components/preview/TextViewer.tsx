import { useTextFile } from "@/hooks/useTextFile";
import { PreviewFrame } from "@/components/preview/PreviewFrame";

interface TextViewerProps {
  src: string;
  fileName: string;
}

export function TextViewer({ src, fileName }: TextViewerProps) {
  const { content, loading, error } = useTextFile(src);

  return (
    <PreviewFrame src={src} fileName={fileName} loading={loading} error={error}>
      <pre className="max-h-[75vh] overflow-auto whitespace-pre-wrap break-words p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
        {content}
      </pre>
    </PreviewFrame>
  );
}
