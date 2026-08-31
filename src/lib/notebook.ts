/**
 * Read-only Jupyter notebook (.ipynb) parsing.
 *
 * Dependency- and DOM-free on purpose: the build-time manifest scanner imports
 * it under Node, and NotebookViewer imports it in the browser.
 */

export type NotebookCellKind = "markdown" | "code" | "raw";

export interface NotebookOutput {
  kind: "text" | "image" | "html" | "error";
  /** Plain text for "text"/"error" outputs. */
  text?: string;
  /** Sanitized markup for "html" outputs. */
  html?: string;
  /** MIME type for "image" outputs, e.g. "image/png". */
  mime?: string;
  /** Payload for "image" outputs, encoded per `encoding`. */
  data?: string;
  encoding?: "base64" | "utf8";
  /** True for stderr streams, so they can be tinted like errors. */
  stderr?: boolean;
}

export interface NotebookCell {
  kind: NotebookCellKind;
  source: string;
  executionCount: number | null;
  outputs: NotebookOutput[];
}

export interface Notebook {
  cells: NotebookCell[];
  /** Language of code cells, used for syntax highlighting. Defaults to "python". */
  language: string;
  kernelName?: string;
}

/** Notebook `source`/`text` fields are either a string or an array of lines. */
function joinSource(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.filter((line) => typeof line === "string").join("");
  return "";
}

/** Strips the ANSI SGR escapes Jupyter embeds in tracebacks and colored stdout. */
export function stripAnsi(text: string): string {
  return text.replace(/\u001b\[[0-9;]*[A-Za-z]/g, "");
}

/**
 * Removes the parts of notebook HTML output that could execute or phone home.
 * Notebook output is repository content, not user input, so this is a
 * belt-and-braces pass rather than a full sanitizer.
 */
export function sanitizeNotebookHtml(html: string): string {
  return html
    .replace(/<\s*(script|iframe|object|embed|link|meta)\b[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|iframe|object|embed|link|meta)\b[^>]*\/?>/gi, "")
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "");
}

/** Picks the richest renderable representation out of an output's MIME bundle. */
function outputFromData(data: Record<string, unknown>): NotebookOutput | null {
  for (const mime of ["image/png", "image/jpeg", "image/gif"]) {
    const value = data[mime];
    if (value !== undefined) {
      return { kind: "image", mime, data: joinSource(value).replace(/\s/g, ""), encoding: "base64" };
    }
  }
  if (data["image/svg+xml"] !== undefined) {
    return { kind: "image", mime: "image/svg+xml", data: joinSource(data["image/svg+xml"]), encoding: "utf8" };
  }
  if (data["text/html"] !== undefined) {
    return { kind: "html", html: sanitizeNotebookHtml(joinSource(data["text/html"])) };
  }
  if (data["text/markdown"] !== undefined) {
    return { kind: "text", text: joinSource(data["text/markdown"]) };
  }
  if (data["text/plain"] !== undefined) {
    return { kind: "text", text: stripAnsi(joinSource(data["text/plain"])) };
  }
  if (data["application/json"] !== undefined) {
    return { kind: "text", text: JSON.stringify(data["application/json"], null, 2) };
  }
  return null;
}

function parseOutput(raw: unknown): NotebookOutput | null {
  if (!raw || typeof raw !== "object") return null;
  const output = raw as Record<string, unknown>;
  const type = output.output_type;

  if (type === "stream") {
    return {
      kind: "text",
      text: stripAnsi(joinSource(output.text)),
      stderr: output.name === "stderr",
    };
  }

  if (type === "error" || type === "pyerr") {
    const traceback = Array.isArray(output.traceback)
      ? output.traceback.map((line) => stripAnsi(String(line))).join("\n")
      : `${String(output.ename ?? "Error")}: ${String(output.evalue ?? "")}`;
    return { kind: "error", text: traceback };
  }

  if (type === "execute_result" || type === "display_data" || type === "pyout") {
    const data = output.data;
    if (data && typeof data === "object") return outputFromData(data as Record<string, unknown>);
    // nbformat 3 put the MIME bundle directly on the output object.
    return outputFromData(output);
  }

  return null;
}

function parseCell(raw: unknown): NotebookCell | null {
  if (!raw || typeof raw !== "object") return null;
  const cell = raw as Record<string, unknown>;

  const rawType = String(cell.cell_type ?? "");
  const kind: NotebookCellKind = rawType === "markdown" ? "markdown" : rawType === "code" ? "code" : "raw";

  const executionCount =
    typeof cell.execution_count === "number"
      ? cell.execution_count
      : typeof cell.prompt_number === "number"
        ? cell.prompt_number
        : null;

  const outputs = Array.isArray(cell.outputs)
    ? cell.outputs.map(parseOutput).filter((o): o is NotebookOutput => o !== null)
    : [];

  return { kind, source: joinSource(cell.source ?? cell.input), executionCount, outputs };
}

/** Parses raw .ipynb JSON into a normalized, render-ready notebook. Throws if it isn't a notebook. */
export function parseNotebook(text: string): Notebook {
  const doc = JSON.parse(text) as Record<string, unknown>;

  // nbformat 4 keeps cells at the top level; nbformat 3 nested them in worksheets.
  let rawCells: unknown[] = [];
  if (Array.isArray(doc.cells)) {
    rawCells = doc.cells;
  } else if (Array.isArray(doc.worksheets)) {
    for (const sheet of doc.worksheets) {
      if (sheet && typeof sheet === "object" && Array.isArray((sheet as { cells?: unknown[] }).cells)) {
        rawCells.push(...((sheet as { cells: unknown[] }).cells ?? []));
      }
    }
  } else {
    throw new Error("Not a Jupyter notebook: no cells found");
  }

  const metadata = (doc.metadata ?? {}) as Record<string, unknown>;
  const languageInfo = (metadata.language_info ?? {}) as Record<string, unknown>;
  const kernelspec = (metadata.kernelspec ?? {}) as Record<string, unknown>;

  return {
    cells: rawCells.map(parseCell).filter((c): c is NotebookCell => c !== null),
    language: typeof languageInfo.name === "string" ? languageInfo.name : "python",
    kernelName: typeof kernelspec.display_name === "string" ? kernelspec.display_name : undefined,
  };
}

/**
 * Extracts a card title/excerpt from a notebook's leading markdown cells, so
 * notebooks read like markdown notes in listings and search.
 */
export function notebookMeta(text: string): { title?: string; excerpt?: string } {
  let notebook: Notebook;
  try {
    notebook = parseNotebook(text);
  } catch {
    return {};
  }

  const markdown = notebook.cells
    .filter((cell) => cell.kind === "markdown")
    .map((cell) => cell.source)
    .join("\n\n");
  if (!markdown.trim()) return {};

  const title = markdown.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim();

  const plain = markdown
    .replace(/^#{1,6}\s+.+$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[>*_`#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    title,
    excerpt: plain.length > 0 ? plain.slice(0, 180) : undefined,
  };
}
