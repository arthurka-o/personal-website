/* ============================================================================
   BUILD — render the site into dist/ for deployment
   ----------------------------------------------------------------------------
   WHY A BUILD AT ALL
   content.js is the source of truth and app.js paints it, but a crawler that
   does not execute JavaScript — most search engines on their first pass, and
   nearly every AI crawler and link-unfurl bot — would receive a page with no
   work history, no projects and no skills. Google runs a second JavaScript
   pass, but the first one sees an empty page.

   So the page is rendered to static HTML before it is published. The rendered
   file is written to dist/ and deployed as an artifact. It is NOT committed to
   the repository: nothing generated is ever a source file, so nothing generated
   can drift out of step with what it was generated from.

   WHY jsdom AND NOT A SECOND RENDERER
   The obvious shortcut is to reimplement the markup here. That is a second
   implementation of the same page, and the two would drift — someone fixes a
   card in app.js, the build's copy goes stale, and the stale copy is what the
   search engine reads. Instead this runs the real app.js against a real DOM
   and copies out what it produced. There is exactly one renderer.

   WHAT RUNS HERE, AND WHY IT DOES NOT SHIP
   app.js is written for a browser and reaches for matchMedia, scroll position
   and IntersectionObserver. Each is feature-detected there and skipped when
   absent, so it runs here unchanged. jsdom is a devDependency: the published
   site does not contain it.

   USAGE
     npm run build     render dist/
     npm start         render dist/ and serve it on :4321
   ========================================================================= */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, cpSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { JSDOM } from "jsdom";
import { renderLlmsTxt, renderLlmsFull } from "./llms-txt.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

const ORIGIN = "https://arthurka.eu";
const SITE_PATH = "/";

function read(relative) {
  return readFileSync(join(ROOT, relative), "utf8");
}

/* ------------------------------------------------------------------ clean */

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

/* --------------------------------------------------------------- the render

   index.html is the template. It is read as-is, never written back: the file in
   the repository stays exactly as a human left it, and the rendered copy is the
   one that goes to dist/. */

const template = read("index.html");

const dom = new JSDOM(template, {
  runScripts: "outside-only",
  pretendToBeVisual: true,
  url: ORIGIN + SITE_PATH,
});
const { window } = dom;
const { document } = window;

// Snapshot every bound element so untouched regions are recognised and left
// byte-identical, instead of being reformatted by a machine.
const bound = [...document.querySelectorAll("[data-bind]")].map((el) => ({
  el,
  name: el.getAttribute("data-bind"),
  before: el.innerHTML,
}));

// content.js first, then app.js: app.js reads its data model off window.
// Both are evaluated inside the jsdom window, which is the global scope they
// expect — running them here would touch Node's globals instead.
window.eval(read("content.js"));
window.eval(read("app.js"));

if (!window.PORTFOLIO) throw new Error("content.js did not define window.PORTFOLIO");
if (!bound.length) throw new Error("no [data-bind] elements found in index.html");

/* app.js marks the nav link for whichever section it thinks is under the reader.
   In a DOM with no layout every section reports offsetTop 0, so it settles on
   the last one and would bake "you are in Contact" into the built HTML. That is
   live scroll state, not content — drop it and let the real page compute it on
   first scroll. */
document
  .querySelectorAll("[aria-current]")
  .forEach((el) => el.removeAttribute("aria-current"));

/* ------------------------------------------------------- splicing the regions

   index.html is hand-formatted with wrapped attributes and two-space indents,
   and serialising the whole document through jsdom would rewrite all of it. So
   each rendered region is located in the ORIGINAL source by its data-bind
   attribute and spliced in as text, leaving every untouched byte alone. */

const indentOf = (offset) => {
  const lineStart = template.lastIndexOf("\n", offset) + 1;
  const line = template.slice(lineStart, offset);
  const m = /^[ \t]*/.exec(line);
  return m ? m[0] : "";
};

/* Text nodes have to be handled separately: outerHTML exists on Elements only,
   so serialising a text node through it yields the string "undefined" rather
   than the text. Several bound elements are pure text — the h1, the role, the
   email — so this is the common case, not an edge one. */
function serialize(node) {
  if (node.nodeType === 3) return node.textContent.trim().replace(/\s+/g, " ");
  if (node.nodeType === 8) return `<!--${node.data}-->`;
  return node.outerHTML;
}

/* One line per top-level child, indented to the container, so a generated block
   stays reviewable when a built page is opened in a browser. Whitespace carries
   no meaning to a crawler. */
function prettyInner(el, baseIndent) {
  const children = [...el.childNodes].filter(
    (n) => !(n.nodeType === 3 && !n.textContent.trim())
  );
  if (!children.length) return "";
  const pad = baseIndent + "  ";
  return "\n" + children.map((c) => pad + serialize(c)).join("\n") + "\n" + baseIndent;
}

/* Find where the element that opens at `contentStart` actually closes.

   This cannot be a search for the next "</ul>". The bound containers hold
   markup that nests the same tag inside itself — a project card contains a
   <ul class="bullets">, a timeline row contains a nested list — so the first
   closing tag found belongs to something further in. Taking it would truncate
   the region mid-element and leave the tail behind as debris.

   So this walks the markup counting opens and closes of that one tag name and
   returns the position where the depth returns to zero: the real close. */
function findClose(html, tag, contentStart) {
  const scanner = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
  scanner.lastIndex = contentStart;
  let depth = 1;
  let m;
  while ((m = scanner.exec(html))) {
    // "/>" is a self-closing tag and opens nothing.
    const selfClosing = /\/>$/.test(m[0]);
    if (m[1] === "/") depth--;
    else if (!selfClosing) depth++;
    if (depth === 0) return m.index;
  }
  throw new Error(`unbalanced <${tag}> from offset ${contentStart}`);
}

function replaceRegion(html, name, rendered) {
  const open = new RegExp(`<([a-z0-9]+)\\b[^>]*data-bind="${name}"[^>]*>`, "i");
  const m = open.exec(html);
  if (!m) throw new Error(`could not find an opening tag for data-bind="${name}"`);
  const tag = m[1];
  const contentStart = m.index + m[0].length;
  const closeAt = findClose(html, tag, contentStart);
  // Splice back to WHERE the closing tag begins, not past its end — slicing
  // from the end would consume the </ul> itself and unbalance the document.
  const out = html.slice(0, contentStart) + rendered + html.slice(closeAt);

  // Cheap structural check. Every bound element must still be balanced after a
  // rewrite; if one is not, the next build reads a broken document and produces
  // nonsense from it. Failing here is much cheaper than debugging that.
  const openAfter = (out.match(new RegExp(`<${tag}\\b`, "gi")) || []).length;
  const closeAfter = (out.match(new RegExp(`</${tag}>`, "gi")) || []).length;
  if (openAfter !== closeAfter) {
    throw new Error(
      `rewriting data-bind="${name}" left <${tag}> unbalanced ` +
        `(${openAfter} open, ${closeAfter} close) — refusing to write`
    );
  }
  return out;
}

let html = template;
let rendered = 0;

for (const { el, name, before } of bound) {
  // An element app.js did not touch is left exactly as a human wrote it.
  if (el.innerHTML === before) continue;
  html = replaceRegion(html, name, prettyInner(el, indentOf(template.indexOf(`data-bind="${name}"`))));
  rendered++;
}

/* ------------------------------------------------------- structured data

   Person + WebSite + ProfilePage, generated from content.js rather than
   hand-written, so the name, the job title, the location and the profile links
   cannot fall out of step with the page they describe.

   sameAs is the part that matters most: it is how a search engine decides that
   the GitHub and LinkedIn accounts and this page are one person, which is what
   turns scattered profiles into a single entity in a knowledge graph. */

const P = window.PORTFOLIO;
const profile = P.profile || {};
const links = P.links || {};

const sameAs = [links.github, links.linkedin, links.website].filter(Boolean);
const skillNames = (P.skills || [])
  .flatMap((group) => (group.items || []).map((i) => (typeof i === "string" ? i : i.name)))
  .filter(Boolean);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": ORIGIN + "/#website",
      url: ORIGIN + SITE_PATH,
      name: profile.name,
      inLanguage: "en",
      publisher: { "@id": ORIGIN + "/#person" },
    },
    {
      "@type": "Person",
      "@id": ORIGIN + "/#person",
      name: profile.name,
      jobTitle: profile.role,
      description: profile.summary,
      email: `mailto:${profile.email}`,
      url: ORIGIN + SITE_PATH,
      ...(sameAs.length ? { sameAs } : {}),
      address: {
        "@type": "PostalAddress",
        addressLocality: "Warsaw",
        addressCountry: "PL",
      },
      knowsAbout: skillNames,
      hasOccupation: {
        "@type": "Occupation",
        name: profile.role,
        skills: skillNames.join(", "),
      },
    },
    {
      "@type": "ProfilePage",
      "@id": ORIGIN + SITE_PATH + "#webpage",
      url: ORIGIN + SITE_PATH,
      name: `${profile.name} — ${profile.role}`,
      isPartOf: { "@id": ORIGIN + "/#website" },
      about: { "@id": ORIGIN + "/#person" },
    },
  ],
};

const JSONLD_START = "<!-- build:jsonld -->";
const JSONLD_END = "<!-- /build:jsonld -->";

function spliceJsonLd(doc) {
  const startAt = doc.indexOf(JSONLD_START);
  const endAt = doc.indexOf(JSONLD_END);
  if (startAt === -1 || endAt === -1) {
    throw new Error(
      `index.html is missing the ${JSONLD_START} / ${JSONLD_END} markers.\n` +
        `The build writes the structured data between them. Restore them around ` +
        `an empty <script type="application/ld+json"></script>.`
    );
  }

  // "<" is escaped so the JSON can never close the script element early. It is
  // legal in a JSON string and it means this block is safe no matter what a bio
  // or a link ever contains.
  const json = JSON.stringify(jsonLd, null, 2).replace(/</g, "\\u003c");
  const pad = " ".repeat(6);

  const block =
    `${JSONLD_START}\n` +
    `    <script type="application/ld+json">\n` +
    `${json.split("\n").map((line) => pad + line).join("\n")}\n` +
    `    </script>\n` +
    `    ${JSONLD_END}`;

  return doc.slice(0, startAt) + block + doc.slice(endAt + JSONLD_END.length);
}

html = spliceJsonLd(html);

/* ------------------------------------------------------------------ output

   Everything the live site serves is copied into dist/ and deployed from there.
   The generated index.html lives only here. It is never written back into the
   repository, so it cannot drift from content.js: there is nothing in git to
   compare it against. */

writeFileSync(join(DIST, "index.html"), html);

// Static files, copied verbatim.
for (const file of ["404.html", "CNAME", ".nojekyll", "styles.css", "content.js", "app.js", "cv.pdf"]) {
  const src = join(ROOT, file);
  if (existsSync(src)) cpSync(src, join(DIST, file));
}
cpSync(join(ROOT, "assets"), join(DIST, "assets"), { recursive: true });

/* robots.txt and sitemap.xml are written by hand. lastmod is deliberately
   omitted: a one-page site has a single URL that changes only when the page
   does, and a lastmod that moves on every deploy tells a crawler to re-crawl a
   URL whose content never changed — which is noise, not freshness. */

writeFileSync(
  join(DIST, "robots.txt"),
  `# arthurka.eu
User-agent: *
Allow: /
Disallow: /404.html

Sitemap: ${ORIGIN}/sitemap.xml
`
);

writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${ORIGIN}${SITE_PATH}</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
);

/* llms.txt and its two names, generated from window.PORTFOLIO like the JSON-LD
   above. index.md is the same bytes as llms-full.txt. */

if (!profile.name) {
  throw new Error(
    "content.js has no profile.name — there is nothing to call this site, and " +
      "an llms.txt whose H1 is empty is worse than no llms.txt at all."
  );
}

const llmsTxt = renderLlmsTxt(P, ORIGIN);
const llmsFull = renderLlmsFull(P, ORIGIN);

writeFileSync(join(DIST, "llms.txt"), llmsTxt);
writeFileSync(join(DIST, "llms-full.txt"), llmsFull);
writeFileSync(join(DIST, "index.md"), llmsFull);

/* ------------------------------------------------------------------ report */

const text = document.body.textContent.replace(/\s+/g, " ").trim();

console.log(`  built    dist/`);
console.log(`           ${rendered} regions rendered · ${skillNames.length} skills in JSON-LD`);
console.log(`           ${text.length} characters of crawler-visible text`);
console.log(`           ${document.querySelectorAll("img").length} images · ${document.querySelectorAll('a[href^="http"]').length} external links`);
console.log(`           llms.txt ${llmsTxt.length} chars · llms-full.txt ${llmsFull.length} chars`);