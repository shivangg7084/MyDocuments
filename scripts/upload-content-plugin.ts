/**
 * Dev-only Vite middleware that lets the running app write an uploaded folder
 * into public/content and regenerate the manifest.
 *
 * GitHub Pages has no backend, so this is deliberately `apply: "serve"` — on the
 * deployed site the endpoints don't exist and the app hides the upload UI.
 * Uploading locally writes real files you then commit and push.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Connect, Plugin } from "vite";
import type { ServerResponse } from "node:http";
import { CONTENT_DIR, generateContentManifest } from "./content-manifest";

/** Endpoint prefix, kept in sync with src/lib/upload.ts. */
export const UPLOAD_ENDPOINT = "/__library/upload";
export const MANIFEST_ENDPOINT = "/__library/manifest";

const MAX_FILE_BYTES = 100 * 1024 * 1024;

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(payload);
}

/**
 * Validates a client-supplied content-relative path and resolves it to an
 * absolute one. Returns null for anything that escapes public/content, is
 * hidden (the manifest scanner skips dotfiles), or is otherwise unusable.
 */
export function resolveContentPath(relPath: string): string | null {
  const normalized = relPath.replace(/\\/g, "/");
  // Absolute paths are rejected rather than silently reinterpreted as relative.
  if (normalized.startsWith("/")) return null;

  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  for (const segment of segments) {
    if (segment === "." || segment === ".." || segment.startsWith(".")) return null;
    if (segment.includes("\0") || segment.includes(":")) return null;
  }

  const abs = path.resolve(CONTENT_DIR, ...segments);
  const root = path.resolve(CONTENT_DIR);
  if (abs !== root && !abs.startsWith(root + path.sep)) return null;
  return abs;
}

function readBody(req: Connect.IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    req.on("data", (chunk: Buffer) => {
      total += chunk.length;
      if (total > MAX_FILE_BYTES) {
        reject(new Error(`File exceeds the ${MAX_FILE_BYTES / (1024 * 1024)} MB upload limit`));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export function uploadContentPlugin(): Plugin {
  return {
    name: "library-upload-content",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(UPLOAD_ENDPOINT, async (req, res, next) => {
        if (req.method !== "POST") return next();

        try {
          const url = new URL(req.url ?? "", "http://localhost");
          const relPath = url.searchParams.get("path") ?? "";
          const absPath = resolveContentPath(relPath);
          if (!absPath) {
            sendJson(res, 400, { error: `Invalid upload path: ${relPath}` });
            return;
          }

          const body = await readBody(req);
          await fs.mkdir(path.dirname(absPath), { recursive: true });
          await fs.writeFile(absPath, body);
          sendJson(res, 200, { path: relPath, size: body.length });
        } catch (err) {
          sendJson(res, 500, { error: err instanceof Error ? err.message : "Upload failed" });
        }
      });

      server.middlewares.use(MANIFEST_ENDPOINT, async (req, res, next) => {
        if (req.method !== "POST") return next();

        try {
          const stats = await generateContentManifest();
          sendJson(res, 200, { stats });
        } catch (err) {
          sendJson(res, 500, {
            error: err instanceof Error ? err.message : "Failed to regenerate the manifest",
          });
        }
      });
    },
  };
}
