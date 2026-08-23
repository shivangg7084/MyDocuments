import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTextFile } from "@/hooks/useTextFile";
import { highlightJson } from "@/lib/highlightJson";
import { PreviewFrame } from "@/components/preview/PreviewFrame";

interface JsonViewerProps {
  src: string;
  fileName: string;
}

export function JsonViewer({ src, fileName }: JsonViewerProps) {
  const { content, loading, error } = useTextFile(src);
  const [copied, setCopied] = useState(false);

  const { pretty, invalid } = useMemo(() => {
    if (!content) return { pretty: "", invalid: false };
    try {
      return { pretty: JSON.stringify(JSON.parse(content), null, 2), invalid: false };
    } catch {
      return { pretty: content, invalid: true };
    }
  }, [content]);

  const highlighted = useMemo(() => highlightJson(pretty), [pretty]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pretty);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — content is still visible to copy manually.
    }
  }

  return (
    <PreviewFrame
      src={src}
      fileName={fileName}
      loading={loading}
      error={error}
      toolbar={
        content ? (
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
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
        ) : undefined
      }
    >
      {invalid && (
        <p className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400">
          This file isn't valid JSON — showing the raw content.
        </p>
      )}
      <pre className="max-h-[75vh] overflow-auto bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </PreviewFrame>
  );
}
