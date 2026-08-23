import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";

// Code-split the heavier viewer pages (markdown rendering + syntax highlighting,
// the video player, the PDF/image viewers) out of the initial bundle so the
// homepage stays light.
const FolderPage = lazy(() => import("@/pages/FolderPage").then((m) => ({ default: m.FolderPage })));
const MarkdownViewerPage = lazy(() =>
  import("@/pages/MarkdownViewerPage").then((m) => ({ default: m.MarkdownViewerPage })),
);
const VideoViewerPage = lazy(() =>
  import("@/pages/VideoViewerPage").then((m) => ({ default: m.VideoViewerPage })),
);
const FileViewerPage = lazy(() =>
  import("@/pages/FileViewerPage").then((m) => ({ default: m.FileViewerPage })),
);

function PageLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/folder/*" element={<FolderPage />} />
          <Route path="/view/markdown/*" element={<MarkdownViewerPage />} />
          <Route path="/view/video/*" element={<VideoViewerPage />} />
          <Route path="/view/file/*" element={<FileViewerPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
