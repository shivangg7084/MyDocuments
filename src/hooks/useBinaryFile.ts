import { useEffect, useState } from "react";

interface UseBinaryFileResult {
  data: ArrayBuffer | null;
  loading: boolean;
  error: boolean;
}

/** Fetches a static binary file (e.g. .docx, .xlsx, .zip) at runtime as an ArrayBuffer. */
export function useBinaryFile(url: string | null): UseBinaryFileResult {
  const [data, setData] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
    setData(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buffer) => {
        if (!cancelled) setData(buffer);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
