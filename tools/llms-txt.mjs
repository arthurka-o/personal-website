/* ============================================================================
   LLM-FACING MARKDOWN — llms.txt, llms-full.txt and the page's markdown twin
   ----------------------------------------------------------------------------
   WHY THIS IS GENERATED AND NOT WRITTEN
   content.js is the source of truth for the page. A hand-written llms.txt would
   be a second copy of a CV that changes, and it would be the copy nobody proof-
   reads — an llms.txt is read by machines, so a stale job title there stays
   stale for years without anyone noticing. So it is rendered from the same
   model here, at build time, and written to dist/ alongside robots.txt and
   sitemap.xml. Editing content.js and pushing remains the whole workflow.

   WHY TWO FILES
   The split is the part of the convention that does the work: llms.txt stays
   small enough to read in one go, and the detail lives behind links, fetched
   only when an agent has decided it is worth the context. This site has both a
   version that fits on a screen and a version that does not, and collapsing
   them into one root file would mean an agent always pays for the long one.

   WHY index.md IS THE SAME BYTES
   The spec recommends publishing the markdown version of a page at its own URL
   — and, for a URL with no file name in it, appending index.md. Written twice
   they could disagree; written once and published under both names they cannot.
   So "follow rel=alternate" and "fetch /llms.txt" land on the same document.

   WHAT IS NOT HERE, AND WHY
   The brand marks, the logo rail and the third-party licence credits. They are
   about how the page is drawn, not about who the person is, and an agent asking
   what was built has no use for them.
   ========================================================================= */

/* ------------------------------------------------------------------ helpers */

/* content.js is hand-wrapped, so one field can carry a newline. Markdown treats
   a newline as a soft break in some renderers and a hard one in others, so runs
   of whitespace are squeezed to keep every field on the line it belongs to. */
const flat = (s) => String(s == null ? "" : s).replace(/\s+/g, " ").trim();

/* content.js carries relative paths where a page would ("cv.pdf"). An agent
   fetching one of these has no base to resolve against, so every URL emitted
   here is absolute. */
const abs = (origin, path) => {
  const p = flat(path);
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  return origin + (p.startsWith("/") ? p : "/" + p);
};

/* A skill is either a bare string or { name, logo }. Only the name is text. */
const skillNames = (group) =>
  (group.items || [])
    .map((i) => flat(typeof i === "string" ? i : i && i.name))
    .filter(Boolean);

/* Timeline entries name their technologies by logo key — "bnbchain", not "BNB
   Chain" — because that key is what the page uses to pick the mark. Markdown
   has no marks, so it needs the name the chip displays, which is what
   logoLibrary holds. An unknown key is passed through rather than dropped: a
   missing title is a gap in the logo library, not a reason for a technology to
   vanish out of someone's CV. */
const techNames = (list, logos) =>
  (list || [])
    .map((k) => {
      const key = flat(k);
      if (!key) return "";
      const entry = (logos || {})[key];
      return flat(entry && entry.title) || key;
    })
    .filter(Boolean);

const validLinks = (list) =>
  (list || []).filter((l) => l && flat(l.url));

/* "May 2024 – May 2026". The content model stores the two ends separately;
   joining them here means a missing end reads as an open period rather than a
   dangling dash. */
const period = (start, end) => {
  const a = flat(start);
  const b = flat(end);
  if (a && b) return `${a} – ${b}`;
  return a || b || "";
};

/* A job title with its employer: the second half is what tells one role from
   another, and on a single-line list entry it is what an agent scans for. */
const roleTitle = (role) => {
  const r = flat(role.role);
  const c = flat(role.company);
  return c ? `${r} — ${c}` : r;
};

const bullets = (items) => items.filter(Boolean).map((s) => `- ${s}`).join("\n");

/* Linked things render as one inline run: "Stack: A, B" or "Links: [a](u),
   [b](u)", with the fallback when there is nothing to link to. */
const linkedRun = (label, entries, fallback) => {
  if (entries.length) return `${label}: ${entries.join(", ")}`;
  return fallback ? `${label}: ${fallback}` : "";
};

/* One line per proof point, phrased once and used in both files. The headline
   is the project, the figure is the number, and the detail is what makes the
   number mean something — a bare metric is the one thing an agent cannot use.
   Written once so the short file and the long one cannot state the same claim
   two different ways. */
function proofLines(P, origin) {
  return (P.proofPoints || [])
    .filter((p) => p && flat(p.title))
    .map((p) => {
      const title = flat(p.title);
      const figure = [flat(p.stat), flat(p.label)].filter(Boolean).join(" ");
      const head = figure ? `**${title}** — ${figure}.` : `**${title}**.`;
      const link = flat(p.url)
        ? ` ([${flat(p.urlLabel) || "source"}](${abs(origin, p.url)}))`
        : "";
      const detail = flat(p.detail);
      return detail ? `${head} ${detail}${link}` : `${head}${link}`;
    });
}

/* ------------------------------------------------------------- llms.txt */

/* The short one. Identity, what is verifiable, where the detail is. An agent
   should be able to read this and know whether llms-full.txt is worth fetching. */
export function renderLlmsTxt(P, origin) {
  const profile = P.profile || {};
  const links = P.links || {};

  const github = flat(links.github);
  const linkedin = flat(links.linkedin);
  const resume = abs(origin, links.resume);
  const email = flat(profile.email);

  const L = [];

  /* The blockquote is the one part of the file guaranteed to be read, so it
     carries the facts needed to act on rather than the facts needed to
     appreciate: who, where, whether he is available, and how to reach him. The
     summary is last because it is the one line that is about the work rather
     than the situation. */
  L.push(`# ${profile.name} — ${profile.role}`, "");
  /* One line per fact rather than one run of them: an agent reading the top of
     this file should not have to parse a row of separators to find out whether
     the person is looking, and "Contact" is the one fact worth being able to
     act on without a second fetch. */
  L.push(`> **${profile.role}**${profile.location ? ` — ${profile.location}` : ""}`);
  if (flat(profile.availability)) L.push(">", `> **${flat(profile.availability)}**`);
  if (profile.summary) L.push(">", `> ${flat(profile.summary)}`);
  if (email) L.push(">", `> Contact: [${email}](mailto:${email})`);
  L.push("");

  /* One sentence on what this file is, then the file list. The old version
     spent two paragraphs explaining that the build renders both files from one
     content model — true, and aimed at a reviewer rather than at an agent, so
     it cost context that the facts below could have used. */
  L.push(
    "Rendered from the same content model as the website, so it cannot disagree",
    "with the page. This file is the short version; the detail is one fetch away:",
    "",
    bullets([
      "Identity, the verifiable highlights, career history at a glance, skills, education and how to get in touch — enough to answer most questions without another request.",
      `**[llms-full.txt](${origin}/llms-full.txt)** — the complete CV as markdown: every role, every project, and every shipped system, with the reasoning behind the engineering decisions. Fetch it when a question needs specifics rather than a summary.`,
    ]),
    ""
  );

  L.push(
    "Work that can be linked is linked, so it can be checked rather than taken on",
    "trust. Work behind a private repository is named and described, and marked as",
    "private, because omitting it would make a real system read as one that does",
    "not exist. Figures are the ones the site makes, not rounded versions of them.",
    ""
  );

  /* The proof points are the section worth reading first: each one is a claim
     with something attached to it, which is the whole point of the page.
     Named as llms-full.txt names them — one renderer, one name, one set of
     facts. */
  const proofs = proofLines(P, origin);
  if (proofs.length) {
    L.push("## Proof points", "");
    L.push(bullets(proofs), "");
  }

  const exp = (P.experience || []).filter((e) => e && flat(e.role));
  if (exp.length) {
    L.push("## Experience", "");
    L.push(
      bullets(
        exp.map((e) => {
          const meta = [period(e.start, e.end), flat(e.location)].filter(Boolean).join(", ");
          return `**${roleTitle(e)}**${meta ? ` (${meta})` : ""}. ${flat(e.summary)}`;
        })
      ),
      ""
    );
  }

  const groups = (P.skills || []).filter((g) => g && skillNames(g).length);
  if (groups.length) {
    L.push("## Skills", "");
    L.push(
      bullets(
        groups.map((g) => `**${flat(g.label)}**: ${skillNames(g).join(", ")}`)
      ),
      ""
    );
  }

  /* Education was the one screening answer that could not be reached without a
     second fetch, which is a poor showing for a two-line section. The two
     degrees are also the strongest non-work signal on the page. */
  const edu = (P.education || []).filter((e) => e && flat(e.degree));
  if (edu.length) {
    L.push("## Education", "");
    L.push(
      bullets(
        edu.map((e) => {
          const meta = [flat(e.school), flat(e.period)].filter(Boolean).join(", ");
          return `**${flat(e.degree)}**${meta ? ` — ${meta}` : ""}`;
        })
      ),
      ""
    );
  }

  /* The same two sections llms-full.txt uses, under the same names, for the
     same data. They were called "Practicalities" here and "Working setup" there,
     which is a small thing that makes cross-reading the two files harder than
     it needs to be. */
  const setup = P.workingSetup || [];
  const langs = (P.languages || []).filter((l) => l && flat(l.name));
  if (setup.length) {
    L.push("## Working setup", "");
    L.push(bullets(setup.map((s) => `**${flat(s.label)}**: ${flat(s.value)}`)), "");
  }
  if (langs.length) {
    L.push("## Languages", "");
    L.push(
      bullets(langs.map((l) => `**${flat(l.name)}**: ${flat(l.level)}`)),
      ""
    );
  }

  L.push("## Full content", "");
  L.push(
    bullets([
      `**[Complete CV as markdown](${origin}/llms-full.txt)**: everything on the page as one markdown document — every role with its highlights, every project, the full list of shipped systems, and the reasoning behind each. This file has the shape of it; that one has the detail.`,
      resume ? `**[CV as PDF](${resume})**: the same CV as a document to read or forward.` : "",
      github ? `**[GitHub](${github})**: public repositories.` : "",
      linkedin ? `**[LinkedIn](${linkedin})**: professional profile.` : "",
    ]),
    ""
  );

  /* The spec reserves this section for links an agent can skip when it wants a
     shorter read, so it holds nothing an agent would otherwise need.

     It used to hold the HTML page and index.md. The first is a step backwards
     — an agent that fetched llms.txt is avoiding the HTML — and the second is
     the same 29,726 bytes as llms-full.txt, linked twice under two names. The
     structured data is the one thing here an agent cannot get anywhere else,
     and the spec names it as exactly what this file is allowed to point at. */
  L.push("## Optional", "");
  L.push(
    bullets([
      `**Structured data**: ${origin}/ carries schema.org \`Person\`, \`WebSite\` and \`ProfilePage\` as JSON-LD in the page markup, generated from the same content model. The \`Person\` node's \`sameAs\` links the GitHub and LinkedIn accounts, which is what identifies them as one person.`,
    ]),
    ""
  );

  return L.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

/* ---------------------------------------------------------- llms-full.txt */

/* The long one, and the page's markdown twin. Everything an agent might need
   to answer a detailed question, with no HTML and no navigation. */
export function renderLlmsFull(P, origin) {
  const profile = P.profile || {};
  const links = P.links || {};
  const L = [];

  L.push(`# ${profile.name}`, "");
  L.push(`**${profile.role}** · ${profile.location}`, "");
  /* Carried here as well as in the short file. This document is what an agent
     that already decided to go deep has in hand, and "is he looking" does not
     stop being a screening question just because the summary was read first. */
  if (flat(profile.availability)) L.push(`**${flat(profile.availability)}**`, "");
  L.push(profile.summary, "");

  const mail = flat(profile.email);
  const contact = [
    mail ? `[${mail}](mailto:${mail})` : "",
    flat(links.github) ? `[GitHub](${abs(origin, links.github)})` : "",
    flat(links.linkedin) ? `[LinkedIn](${abs(origin, links.linkedin)})` : "",
    flat(links.resume) ? `[CV (PDF)](${abs(origin, links.resume)})` : "",
  ].filter(Boolean);
  if (contact.length) {
    L.push(contact.join(" · "), "");
  }

  /* ---------------------------------------------------------- proof points */
  const proofs = proofLines(P, origin);
  if (proofs.length) {
    L.push("## Proof points", "");
    L.push(bullets(proofs), "");
  }

  /* ------------------------------------------------------------- experience */
  const exp = (P.experience || []).filter((e) => e && flat(e.role));
  if (exp.length) {
    L.push("## Experience", "");
    for (const e of exp) {
      const meta = [period(e.start, e.end), flat(e.location)].filter(Boolean).join(" · ");
      L.push(`### ${roleTitle(e)}`, "");
      if (meta) L.push(meta, "");
      if (flat(e.summary)) L.push(flat(e.summary), "");
      if (flat(e.url)) L.push(`Organisation: <${abs(origin, e.url)}>`, "");
      if ((e.stack || []).length) L.push(`Stack: ${e.stack.map(flat).filter(Boolean).join(", ")}`, "");
      if ((e.highlights || []).length) L.push(bullets(e.highlights.map(flat)), "");

      /* A period covered by several employers is one heading and several
         sub-entries — Flatstack/Galvanize, meyvn and Technokatos all sit
         under the same six years. Flattening them into the parent list would
         lose which company belongs to which years. */
      const nested = (e.entries || []).filter((n) => n && flat(n.title));
      for (const n of nested) {
        L.push(`#### ${flat(n.title)}`, "");
        if (flat(n.period)) L.push(flat(n.period), "");
        if (flat(n.detail)) L.push(flat(n.detail), "");
      }
    }
  }

  /* --------------------------------------------------------------- projects */
  const projects = (P.projects || []).filter((p) => p && flat(p.name));
  if (projects.length) {
    L.push("## Projects", "");
    for (const p of projects) {
      L.push(`### ${flat(p.name)}`, "");
      if (flat(p.kind)) L.push(`*${flat(p.kind)}*`, "");
      if (flat(p.description)) L.push(flat(p.description), "");
      if (flat(p.note)) L.push(`*${flat(p.note)}*`, "");
      if ((p.highlights || []).length) L.push(bullets(p.highlights.map(flat)), "");
      if ((p.stack || []).length) L.push(`Stack: ${p.stack.map(flat).filter(Boolean).join(", ")}`, "");
      /* A private repository is stated, not dropped. The card on the page says
         so, and a link list that simply went empty would read as "there is
         nothing here" instead of "this is real and you cannot click it". */
      const links_ = validLinks(p.links);
      if (links_.length || p.privateRepo) {
        L.push(
          linkedRun(
            "Links",
            links_.map((l) => `[${flat(l.label) || "Link"}](${abs(origin, l.url)})`),
            p.privateRepo ? "Repository is private" : ""
          ),
          ""
        );
      }
    }
  }

  /* ---------------------------------------------------------------- shipped
     The bar chart on the page carries month offsets against a hand-laid axis,
     not calendar dates. Turning those offsets into dates would mean inventing
     precision the content model does not have, so this section groups by the
     band the entry belongs to and states none. Chronology by role is in
     Experience above. */
  const timeline = P.timeline || {};
  const entries = (timeline.entries || []).filter((e) => e && flat(e.title));
  if (entries.length) {
    L.push("## Shipped", "");
    if (flat(timeline.lede)) L.push(flat(timeline.lede), "");
    const byGroup = new Map();
    for (const e of entries) {
      const g = flat(e.group) || "Other";
      if (!byGroup.has(g)) byGroup.set(g, []);
      byGroup.get(g).push(e);
    }
    for (const [g, items] of byGroup) {
      L.push(`### ${g}`, "");
      for (const e of items) {
        const org = flat(e.org);
        const orgTitle = flat((P.logoLibrary || {})[org] && P.logoLibrary[org].title);
        L.push(`- **${flat(e.title)}**${org ? ` (${orgTitle || org})` : ""}`);
        for (const para of (e.detail || []).map(flat).filter(Boolean)) {
          L.push(`  ${para}`, "");
        }
        const bits = [];
        const stack = techNames(e.stack, P.logoLibrary);
        if (stack.length) bits.push(`Stack: ${stack.join(", ")}`);
        if (flat(e.repo)) {
          bits.push(`[${flat(e.repoLabel) || "Source"}](${abs(origin, e.repo)})`);
        }
        if (bits.length) L.push(`  ${bits.join(" · ")}`, "");
      }
    }
  }

  /* ------------------------------------------------------------------ skills */
  const groups = (P.skills || []).filter((g) => g && skillNames(g).length);
  if (groups.length) {
    L.push("## Skills", "");
    L.push(
      bullets(
        groups.map((g) => `**${flat(g.label)}**: ${skillNames(g).join(", ")}`)
      ),
      ""
    );
  }

  /* --------------------------------------------------------------- education */
  const edu = (P.education || []).filter((e) => e && flat(e.degree));
  if (edu.length) {
    L.push("## Education", "");
    L.push(
      bullets(
        edu.map((e) => {
          const meta = [flat(e.school), flat(e.period)].filter(Boolean).join(", ");
          return `**${flat(e.degree)}**${meta ? ` — ${meta}` : ""}`;
        })
      ),
      ""
    );
  }

  /* ----------------------------------------------------------- arrangements */
  const setup = P.workingSetup || [];
  const langs = (P.languages || []).filter((l) => l && flat(l.name));
  if (setup.length) {
    L.push("## Working setup", "");
    L.push(bullets(setup.map((s) => `**${flat(s.label)}**: ${flat(s.value)}`)), "");
  }
  if (langs.length) {
    L.push("## Languages", "");
    L.push(
      bullets(langs.map((l) => `**${flat(l.name)}**: ${flat(l.level)}`)),
      ""
    );
  }

  L.push("---", "");
  L.push(
    "*Generated from the site's content model by `tools/build.mjs`. This document is",
    `the page at ${origin}/ in markdown, and is published under both this name and`,
    "index.md so that fetching `/llms.txt` and following a `rel=\"alternate\"` link land",
    "on the same bytes.*",
    ""
  );

  return L.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}