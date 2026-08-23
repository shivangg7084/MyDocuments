import { useEffect, useState } from "react";
import { useBinaryFile } from "@/hooks/useBinaryFile";
import { PreviewFrame } from "@/components/preview/PreviewFrame";

interface DocxViewerProps {
  src: string;
  fileName: string;
}

export function DocxViewer({ src, fileName }: DocxViewerProps) {
  const { data, loading: fetching, error: fetchError } = useBinaryFile(src);
  const [html, setHtml] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState(false);

  useEffect(() => {
    if (!data) return;
    let cancelled = false;
    setConverting(true);
    setConvertError(false);

    import("mammoth")
      .then((mammoth) => mammoth.convertToHtml({ arrayBuffer: data }))
      .then((result) => {
        if (!cancelled) setHtml(result.value);
      })
      .catch(() => {
        if (!cancelled) setConvertError(true);
      })
      .finally(() => {
        if (!cancelled) setConverting(false);
      });

    return () => {
      cancelled = true;
    };
  }, [data]);

  return (
    <PreviewFrame
      src={src}
      fileName={fileName}
      loading={fetching || converting}
      error={fetchError || convertError}
    >
      {html && (
        <div
          className="prose prose-slate max-h-[75vh] max-w-none overflow-auto p-6 dark:prose-invert sm:p-8"
          // Rendering the user's own trusted library content (their .docx file converted to HTML
          // client-side by mammoth) — same trust level as rendering their own Markdown files.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </PreviewFrame>
  );
}
