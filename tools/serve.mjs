/* Serves dist/ so a build can be checked in a real browser before it is pushed.

   node tools/serve.mjs        -> http://localhost:4321

   Deliberately tiny and dependency-free. It exists so `npm start` gives a
   faithful local preview of exactly what GitHub Pages will serve, without
   adding a dev server the project otherwise does not need. */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, normalize, extname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const PORT = Number(process.env.PORT) || 4321;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    // Strip any traversal before it reaches the filesystem.
    const rel = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
    let file = join(DIST, rel);

    let info = await stat(file).catch(() => null);
    if (info?.isDirectory()) {
      file = join(file, "index.html");
      info = await stat(file).catch(() => null);
    }
    if (!info) {
      // GitHub Pages serves 404.html for an unknown path.
      file = join(DIST, "404.html");
      info = await stat(file).catch(() => null);
      if (!info) {
        res.writeHead(404).end("build first: npm run build");
        return;
      }
      res.writeHead(404, { "content-type": TYPES[".html"] });
      res.end(await readFile(file));
      return;
    }

    res.writeHead(200, {
      "content-type": TYPES[extname(file)] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(await readFile(file));
  } catch (err) {
    res.writeHead(500).end(String(err));
  }
}).listen(PORT, () => {
  console.log(`  serving  dist/ on http://localhost:${PORT}`);
});