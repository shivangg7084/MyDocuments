# My Library — a GitHub-hosted static file library

A personal knowledge/file library that runs entirely as a static site on **GitHub
Pages** — no backend, no database, no third-party services. Content (Markdown
notes, videos, PDFs, images, and other files) lives inside this repository, in
`public/content/`, organized as nested folders. A small Node script scans that
folder and generates a JSON manifest at build time, which the React app reads to
render the folder browser, viewers, and search — all in the browser.

## 1. Project overview

- **Stack:** Vite + React + TypeScript + Tailwind CSS + React Router (hash routing)
- **Content storage:** this Git repository (`public/content/`)
- **Rendering:** Markdown via `react-markdown` (GFM, syntax highlighting, TOC),
  native HTML5 `<video>` for videos, native browser PDF viewer, image lightbox
- **Search:** entirely client-side, built from the generated manifest
- **Hosting:** GitHub Pages, deployed by a GitHub Actions workflow
- **Routing:** `HashRouter` is used deliberately — GitHub Pages has no
  server-side rewrite rules, so hash-based routes (`/#/folder/...`) work
  reliably under any repository subpath without extra configuration

## 2. Installation

```bash
npm install
```

## 3. Local development

```bash
npm run generate-content   # scans public/content and writes src/data/content-manifest.json
npm run dev                # starts Vite on http://localhost:5173
```

`npm run dev` and `npm run build` both regenerate the manifest automatically, so
in normal use you only need:

```bash
npm install
npm run dev
```

## 4. How to add content

All content lives under `public/content/`. Create a folder, drop files in it,
regenerate the manifest, and reload.

```text
public/content/
└── machine-learning/
    ├── README.md
    ├── statistics/
    │   ├── README.md
    │   ├── mean-median-mode.md
    │   └── statistics.mp4
    └── regression/
        ├── README.md
        ├── linear-regression.md
        └── linear-regression.mp4
```

### Folders

Any directory under `public/content/` becomes a folder in the app. Folders can be
nested arbitrarily deep. A folder's display name comes from its `README.md`'s
first `# Heading` if present, otherwise from a title-cased version of the
directory name.

The sidebar has a **"New Folder"** button (and a "+" on hover over any folder
row, for creating a subfolder inside it). Since GitHub Pages has no backend to
write to, it doesn't create anything itself — it generates the exact `mkdir`/
`README.md`/`generate-content` commands for the name and parent you pick, with a
Copy button, so you can run them locally and push.

### Markdown (`.md`, `.markdown`)

Write normal GitHub-flavored Markdown — headings, lists, tables, links, images,
blockquotes, fenced code blocks (with syntax highlighting and a copy button),
inline code. An optional YAML frontmatter block can set a title/description used
in cards and search, without appearing in the rendered page:

```markdown
---
title: Linear Regression
description: How linear regression works, with a worked example.
---

# Linear Regression
...
```

A file named `README.md` (case-insensitive) in a folder is rendered prominently
at the top of that folder's page and is excluded from the regular file list.

### Videos (`.mp4`, `.webm`, `.ogg`, `.mov`)

Drop the video file into a folder. It's served directly by GitHub Pages and
played with a custom HTML5 player (play/pause, seek, volume, playback speed,
fullscreen, picture-in-picture, keyboard shortcuts). No upload to YouTube/Vimeo/
Cloudinary or any other service.

### PDFs (`.pdf`)

Rendered with the browser's built-in PDF viewer, with a download link as a
fallback for browsers that can't display PDFs inline.

### Images (`.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`)

Shown with a click-to-expand lightbox.

### Other files

Several common "other" types get an in-browser preview instead of a download-only
prompt, all parsed client-side:

- **`.txt`** — plain text
- **`.csv`** — parsed (including quoted fields) and rendered as a table
- **`.json`** — pretty-printed and syntax-highlighted, with a Copy button
- **`.docx`** — converted to formatted HTML in the browser via `mammoth`
- **`.xlsx` / `.xls`** — parsed via `xlsx` (SheetJS) and rendered as a table, with
  tabs to switch between sheets
- **`.zip`** — contents listed (name, size, folder structure) via `jszip`,
  without extracting or downloading anything

Every previewed type still has a Download button available. Anything else
(`.pptx`, `.doc`, `.rar`, `.7z`, ...) gets a "Preview unavailable" card with a
Download button, since there's no reasonable way to render it client-side.

All of these libraries are only fetched when you actually open that file type —
they're dynamically imported, not part of the initial page bundle.

## 5. Generating the manifest

```bash
npm run generate-content
```

This runs `scripts/generate-content-manifest.ts`, which walks `public/content/`
and writes `src/data/content-manifest.json`. It:

- Builds the nested folder/file tree
- Classifies each file's type from its extension
- Extracts a title/description from each Markdown file (frontmatter, or the
  first `# Heading` and first paragraph)
- Computes library-wide stats (folder count, file count, videos, notes, etc.)

Re-run it (or just `npm run dev` / `npm run build`, which do it for you) any time
you add, remove, or rename files.

## 6. GitHub Pages configuration

The app must work at `https://USERNAME.github.io/REPOSITORY/`, not just at `/`.
This is handled by:

- `vite.config.ts` reading a `VITE_BASE_PATH` env var for Vite's `base` option
  (defaults to `/` for local dev)
- All content/asset URLs being built through `import.meta.env.BASE_URL` (see
  `src/lib/paths.ts`) instead of hard-coded absolute paths
- `HashRouter`, so client-side routes never need a server rewrite rule
- `public/.nojekyll`, so GitHub Pages doesn't run its default Jekyll processing
  over the built output

## 7. Deployment (GitHub Actions)

`.github/workflows/deploy.yml` runs on every push to `main`:

1. Checks out the repo and installs dependencies
2. Computes the correct base path (`/` for a `USERNAME.github.io` repo, otherwise
   `/REPOSITORY/`)
3. Generates the content manifest
4. Builds the static site (`vite build`)
5. Publishes `dist/` to GitHub Pages via `actions/deploy-pages`

### One-time setup

1. Push this repository to GitHub.
2. In the repo settings, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).

After that, the day-to-day workflow is just:

```bash
git add .
git commit -m "Add new learning content"
git push
```

GitHub Actions rebuilds and redeploys automatically.

## 8. Supported file types

| Category    | Extensions                                        | Viewer                              |
| ----------- | -------------------------------------------------- | ------------------------------------ |
| Markdown    | `.md`, `.markdown`                                | Rendered reader with TOC             |
| Video       | `.mp4`, `.webm`, `.ogg`, `.ogv`, `.mov`           | Custom HTML5 video player            |
| PDF         | `.pdf`                                            | Embedded browser viewer              |
| Image       | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`  | Lightbox viewer                      |
| Text        | `.txt`                                            | Plain-text reader                    |
| CSV         | `.csv`                                            | Parsed table                         |
| JSON        | `.json`                                           | Pretty-printed, syntax-highlighted   |
| Word        | `.docx`                                           | Rendered as HTML (via `mammoth`)     |
| Spreadsheet | `.xlsx`, `.xls`                                   | Table with sheet tabs (via `xlsx`)   |
| Archive     | `.zip`                                            | Contents list (via `jszip`)          |
| Other       | anything else (`.pptx`, `.doc`, `.rar`, ...)      | Download prompt                      |

### A note on the `xlsx` dependency

The `xlsx` package on the npm registry is stuck on an old release with known
unpatched vulnerabilities (prototype pollution, ReDoS). SheetJS's own fix is
distributed from their CDN instead, so `package.json` points `xlsx` at
`https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz` rather than a normal semver
range — this is SheetJS's own documented recommendation, not a workaround. If you
update it, get the new tarball URL from SheetJS directly rather than switching
back to the plain npm version.

## 9. GitHub file-size limitations

GitHub enforces limits that affect how large your library can grow:

- **100 MB** hard limit per file pushed via plain `git push`.
- GitHub warns starting at **50 MB** per file.
- Repositories are recommended to stay under **~1–5 GB** total, and there's a
  **soft cap around 5 GB** before GitHub may reach out about repo size.
- For large videos, consider **Git LFS**, or compressing/trimming videos before
  committing them. Git LFS works with GitHub Pages, but public LFS bandwidth has
  its own quota — check GitHub's current LFS pricing/limits before relying on it
  for large media libraries.

## 10. Performance considerations

- **Route-level code splitting:** the Markdown renderer/syntax highlighter, video
  player, and PDF/image viewers are lazy-loaded per route (`React.lazy`), so the
  homepage bundle stays small.
- **No eager media loading:** videos use `preload="metadata"` and are never
  auto-played or preloaded from the homepage or folder listings — only the
  active video's page loads video data.
- **Images use `loading="lazy"`.**
- **Client-side search index** is built once (lazily, on first search) from the
  manifest, not by fetching every file's content — full Markdown bodies are only
  fetched when you actually open that file.
- **No runtime thumbnail generation** — none is attempted; folder/video cards
  show icons instead of generated preview frames, which would require decoding
  every video on the homepage.

## 11. Project structure

```text
public/
  content/                  ← your library content (folders, .md, .mp4, .pdf, images, ...)
  .nojekyll
scripts/
  generate-content-manifest.ts
src/
  components/
    layout/                 ← Sidebar (+ New Folder), Header, Layout, ThemeToggle
    file-browser/           ← Breadcrumbs, FolderCard, FileCard, SortFilterBar, NewFolderDialog
    markdown/                ← MarkdownRenderer, TableOfContents, CodeBlock
    video/                   ← VideoPlayer
    pdf/                     ← PdfViewer
    image/                   ← ImageViewer
    preview/                 ← TextViewer, CsvViewer, JsonViewer, DocxViewer, XlsxViewer, ZipViewer, PreviewFrame
    common/                  ← SearchBar, FileIcon, EmptyState, ErrorState, Modal
  pages/                     ← Home, FolderPage, MarkdownViewerPage, VideoViewerPage, FileViewerPage, NotFound
  hooks/                     ← useSearch, useTheme, useFileBrowser, useTextFile, useBinaryFile
  lib/                       ← manifest.ts, paths.ts, markdown.ts, file-utils.ts, csv.ts, highlightJson.ts
  types/content.ts           ← shared manifest types
  data/content-manifest.json ← generated — do not edit by hand
.github/workflows/deploy.yml
```

The content directory (`public/content/`) is just a convention read by
`scripts/generate-content-manifest.ts` and `vite.config.ts`'s `public` dir — to
point at a different content location, change `CONTENT_DIR` in the generator
script (content is always served from wherever Vite's `publicDir` is, by
default `public/`).

## 12. Scripts

```json
{
  "dev": "npm run generate-content && vite",
  "build": "npm run generate-content && tsc --noEmit && vite build",
  "preview": "vite preview",
  "generate-content": "tsx scripts/generate-content-manifest.ts",
  "typecheck": "tsc --noEmit"
}
```

## 13. Notes on filenames

File and folder names may contain spaces and most special characters — the app
URL-encodes path segments when building routes and content URLs
(`src/lib/file-utils.ts`'s `encodeContentPath`/`decodeContentPath`). Avoid `/`
and `#` inside a single file/folder name, since those are structural characters
in both file paths and the app's hash-based routes.
