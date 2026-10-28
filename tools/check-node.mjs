/* Refuses to run on a Node that carries CVE-2026-111497, the out-of-bounds
   write in the Brotli decoder that Node compiles in. The security press calls
   it "Node2Shell"; Node.js calls it a high severity flaw in the bundled
   decoder.

   WHAT THE BUG IS
   A malformed Brotli stream makes the decoder treat a block switch the
   stream has already ruled out as a temporary need for more input, instead
   of a permanent format error. The decoder keeps going and appends bytes to
   an eight-byte internal buffer, writing past the end of it. Crafted data
   that reaches the decoder can corrupt process memory, which means a crash,
   a leak of whatever else is in the heap, or code running as this process.

   WHY IT IS NOT FIXED IN A DEPENDENCY
   The decoder is part of the Node binary, not of any package, so there is no
   version of jsdom or of anything else here that avoids it. The fix is a
   patched Node and nothing else. Node published it on 21 October 2026 in
   22.23.4, 24.22.1 and 26.12.1.

   WHY THIS REPO CARRIES A CHECK AT ALL
   Nothing in this project decodes Brotli: no Brotli API is called, no URL is
   fetched that could answer with Content-Encoding: br, and the only
   compression used is DEFLATE, in make-icons.mjs. The bug is not reachable
   through the site's own code, so this check is not closing a hole in it. It
   is here because the build still runs a dependency tree and a zlib call on
   whatever Node happens to be installed, and a runtime with an out-of-bounds
   write in it is not a runtime worth building on.

   HOW IT IS ENFORCED
   package.json "engines" names the same floor, and .npmrc sets
   engine-strict, so npm refuses to install at all on an affected runtime.
   That covers a fresh install. This covers the other case: node_modules
   already in place, the build run without a fresh install, and a vulnerable
   Node still in use. */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* The lowest release of each line that carries the fix. A line missing here
   has no fixed release: 20.x, 23.x and 25.x reached end of life before the
   fix was published, and Node's policy is that an end-of-life version is
   always affected by a security release, because no fix is published for it.
   A newer line has to be added here, with its own floor, when the project
   moves onto it. */
export const PATCHED = { 22: "22.23.4", 24: "24.22.1", 26: "26.12.1" };

function parse(version) {
  return version.split(".").map((part) => Number.parseInt(part, 10));
}

function atLeast(version, floor) {
  const [vMajor, vMinor, vPatch] = parse(version);
  const [fMajor, fMinor, fPatch] = parse(floor);
  if (vMajor !== fMajor) return vMajor > fMajor;
  if (vMinor !== fMinor) return vMinor > fMinor;
  return vPatch >= fPatch;
}

export function checkNodeVersion() {
  const version = process.versions.node;
  const [major] = parse(version);
  const floor = PATCHED[major];

  if (!floor) {
    const lines = Object.entries(PATCHED)
      .map(([line, v]) => `${line}.x (${v} or newer)`)
      .join(", ");
    throw new Error(
      `Node ${version} is on a line that has no fixed release for CVE-2026-111497. ` +
        `Use ${lines}.`
    );
  }

  if (!atLeast(version, floor)) {
    throw new Error(
      `Node ${version} is affected by CVE-2026-111497, the out-of-bounds write in ` +
        `the Brotli decoder that Node bundles. Use ${floor} or newer on the ${major}.x line.`
    );
  }

  /* package.json "engines" is the floor npm enforces, and it has to agree
     with the one above. If the two drift apart, npm would install on a
     runtime this file refuses, so say so rather than let them disagree. */
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  const declared = pkg.engines?.node ?? "";
  for (const [line, v] of Object.entries(PATCHED)) {
    if (!declared.includes(v)) {
      throw new Error(
        `package.json "engines.node" (${declared}) does not name the patched ${line}.x ` +
          `release ${v}. Keep it in step with tools/check-node.mjs.`
      );
    }
  }
}
