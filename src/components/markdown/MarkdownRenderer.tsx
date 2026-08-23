import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import { CodeBlock } from "@/components/markdown/CodeBlock";
import { contentFileUrl, fileRoute, folderRoute, markdownRoute, videoRoute } from "@/lib/paths";
import { findFile, findFolder } from "@/lib/manifest";
import { stripFrontmatter } from "@/lib/markdown";

interface MarkdownRendererProps {
  content: string;
  /** Folder the markdown file lives in, used to resolve relative image/link paths. */
  baseDir: string;
}

function resolveRelative(baseDir: string, ref: string): string {
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(ref) || ref.startsWith("#") || ref.startsWith("data:")) {
    return ref;
  }
  const segments = baseDir ? baseDir.split("/") : [];
  for (const part of ref.split("/")) {
    if (part === "." || part === "") continue;
    if (part === "..") segments.pop();
    else segments.push(part);
  }
  return segments.join("/");
}

export function MarkdownRenderer({ content, baseDir }: MarkdownRendererProps) {
  const components: Components = {
    code({ className, children, ...props }) {
      const text = String(children);
      const isBlock = text.includes("\n") || /language-/.test(className ?? "");
      if (!isBlock) {
        return (
          <code
            className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.85em] text-rose-600 dark:bg-slate-800 dark:text-rose-400"
            {...props}
          >
            {children}
          </code>
        );
      }
      return <CodeBlock className={className}>{children}</CodeBlock>;
    },
    pre({ children }) {
      return <>{children}</>;
    },
    img({ src, alt }) {
      const resolved = typeof src === "string" ? resolveRelative(baseDir, src) : "";
      const url = resolved.startsWith("/") || /^https?:\/\//.test(resolved) ? resolved : contentFileUrl(resolved);
      return (
        <img
          src={url}
          alt={alt ?? ""}
          loading="lazy"
          className="mx-auto rounded-lg border border-slate-200 dark:border-slate-800"
        />
      );
    },
    a({ href, children, ...props }) {
      if (!href) return <a {...props}>{children}</a>;

      const isExternal = /^([a-z][a-z0-9+.-]*:)?\/\//i.test(href) || href.startsWith("mailto:");
      if (isExternal) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
          </a>
        );
      }
      if (href.startsWith("#") || href.startsWith("data:")) {
        return (
          <a href={href} {...props}>
            {children}
          </a>
        );
      }

      // Relative link into the content library — resolve it against the manifest
      // so it routes through the app (folder page, viewer) instead of 404ing.
      const [refPath, hash] = href.split("#");
      const resolved = resolveRelative(baseDir, refPath).replace(/\/$/, "");
      const folder = findFolder(resolved);
      const file = findFile(resolved);

      let to: string | undefined;
      if (folder) to = folderRoute(folder.path);
      else if (file?.type === "markdown") to = markdownRoute(file.path);
      else if (file?.type === "video") to = videoRoute(file.path);
      else if (file) to = fileRoute(file.path);

      if (to) {
        return (
          <Link to={hash ? `${to}#${hash}` : to} {...props}>
            {children}
          </Link>
        );
      }

      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    },
    table({ children }) {
      return (
        <div className="my-4 overflow-x-auto">
          <table>{children}</table>
        </div>
      );
    },
  };

  return (
    <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:mx-auto prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={components}
      >
        {stripFrontmatter(content)}
      </ReactMarkdown>
    </div>
  );
}
