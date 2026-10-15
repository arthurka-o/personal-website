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

  /* Nothing sits between the blockquote and the first section. The file used to
     carry 156 words here explaining that the build renders it from the same
     content model as the website, and what to make of the parts that are
     linked and the parts that are private. None of it survives contact with an
     agent: it infers the same thing from seeing links and from "Repository is
     private", it never fetches on instruction, and the reassurance that the
     file "cannot disagree with the page" is a promise nobody can check - one
     that a duplicated sentence elsewhere in this document would have falsified.

     What is left of it is a fact an agent uses: the link to the full document,
     which is now a file list like any other. */

  /* The proof points are the section worth reading first: each one is a claim
     with something attached to it, which is the whole point of the page.
     Named as llms-full.txt names them — one renderer, one name, one set of
     facts. */
  const proofs = proofLines(P, origin);
  if (proofs.length) {
    L.push("## Proof points", "");
    L.push(bullets(proofs), "");
  }

  /* Employer names linked, because this is the section where a claim about
     someone else's company is made — "$2.9M raised", "selected for the ABN AMRO
     accelerator" — and a reviewer has no way to check either without going
     hunting. The BscScan link two sections up proves this file knows how to
     point at something verifiable, so pointing at nothing here read as a
     choice rather than an omission. */
  const exp = (P.experience || []).filter((e) => e && flat(e.role));
  if (exp.length) {
    L.push("## Experience", "");
    L.push(
      bullets(
        exp.map((e) => {
          const meta = [period(e.start, e.end), flat(e.location)].filter(Boolean).join(", ");
          const who = flat(e.url)
            ? `[${flat(e.company) || flat(e.role)}](${abs(origin, e.url)})`
            : roleTitle(e);
          const named = flat(e.url) && flat(e.role) && flat(e.company) ? ` — ${flat(e.role)}` : "";
          return `**${who}${named}**${meta ? ` (${meta})` : ""}. ${flat(e.summary)}`;
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

  /* Note the shape of these bullets: `- [name](url): notes`, with nothing
     between the bullet marker and the opening bracket. Bold link text reads
     almost the same to a person and completely differently to the parser the
     spec says this format exists for — `**[name](url)**:` matches no
     `- [name](url)` pattern at all, so the link graph came back empty. The
     link text is already visually distinct; the asterisks bought nothing. */
  L.push("## Full content", "");
  L.push(
    bullets([
      `[Complete CV as markdown](${origin}/llms-full.txt): every role with its highlights, every project with its own detail, education and working setup.`,
      resume ? `[CV as PDF](${resume}): the same CV as a document to read or forward.` : "",
      github ? `[GitHub](${github}): public repositories.` : "",
      linkedin ? `[LinkedIn](${linkedin}): professional profile.` : "",
    ]),
    ""
  );

  /* There used to be an Optional section here describing the schema.org JSON-LD
     in the page markup. It was there because the spec says an llms.txt "can
     also reference structured data markup used on the site". That is permission,
     not a reason, and two reviewers independently called it the most purely
     self-referential passage in either file: it pointed the agent back at the
     HTML page it came here to avoid, and the one claim in it — that the markup
     is generated from the same content model — is not checkable from outside.
     Removed. An Optional section that costs 7% of the file and earns nothing is
     the same mistake as the meta-prose above it. */
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

  return L.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}