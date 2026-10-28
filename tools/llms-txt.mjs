/* Renders llms.txt and llms-full.txt from window.PORTFOLIO.

   Section names are the page's own - At a glance, Experience, Work, Skills,
   Education, Working setup, Languages - so a reader moving between the two
   sees the same words, rather than the content.js array names leaking out.

   Generated rather than written: a hand-maintained llms.txt would be a second
   CV that drifts, and it is the one file nobody proof-reads because machines
   read it. llms-full.txt is written under the name index.md as well, so that
   fetching /llms.txt and following rel="alternate" land on the same bytes. */

const flat = (s) => String(s == null ? "" : s).replace(/\s+/g, " ").trim();

/* The workingSetup row labelled Availability. The page renders it in its
   Working setup panel, so reading it here keeps one statement of whether he is
   looking rather than a page copy and a markdown copy that can disagree. */
const availability = (P) => {
  const row = (P.workingSetup || []).find((s) => flat(s.label).toLowerCase() === "availability");
  return flat(row && row.value);
};

const abs = (origin, path) => {
  const p = flat(path);
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  return origin + (p.startsWith("/") ? p : "/" + p);
};

const skillNames = (group) =>
  (group.items || [])
    .map((i) => flat(typeof i === "string" ? i : i && i.name))
    .filter(Boolean);

const validLinks = (list) => (list || []).filter((l) => l && flat(l.url));

const period = (start, end) => {
  const a = flat(start);
  const b = flat(end);
  if (a && b) return `${a} – ${b}`;
  return a || b || "";
};

const roleTitle = (role) => {
  const r = flat(role.role);
  const c = flat(role.company);
  return c ? `${r} — ${c}` : r;
};

const bullets = (items) => items.filter(Boolean).map((s) => `- ${s}`).join("\n");

const eduLines = (P) =>
  (P.education || [])
    .filter((e) => e && flat(e.degree))
    .map((e) => {
      const meta = [flat(e.school), flat(e.period)].filter(Boolean).join(", ");
      return `**${flat(e.degree)}**${meta ? ` — ${meta}` : ""}`;
    });

const skillLines = (P) =>
  (P.skills || [])
    .filter((g) => g && skillNames(g).length)
    .map((g) => `**${flat(g.label)}**: ${skillNames(g).join(", ")}`);

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

export function renderLlmsTxt(P, origin) {
  const profile = P.profile || {};
  const links = P.links || {};
  const github = flat(links.github);
  const linkedin = flat(links.linkedin);
  const upwork = flat(links.upwork);
  const resume = abs(origin, links.resume);
  const email = flat(profile.email);
  const L = [];

  L.push(`# ${profile.name} — ${profile.role}`, "");
  L.push(`> **${profile.role}**${profile.location ? ` — ${profile.location}` : ""}`);
  if (availability(P)) L.push(">", `> **${availability(P)}**`);
  if (profile.summary) L.push(">", `> ${flat(profile.summary)}`);
  if (email) L.push(">", `> Contact: [${email}](mailto:${email})`);
  L.push("");

  const proofs = proofLines(P, origin);
  if (proofs.length) L.push("## At a glance", "", bullets(proofs), "");

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

  const skills = skillLines(P);
  if (skills.length) L.push("## Skills", "", bullets(skills), "");

  const edu = eduLines(P);
  if (edu.length) L.push("## Education", "", bullets(edu), "");

  const setup = P.workingSetup || [];
  if (setup.length) {
    L.push("## Working setup", "", bullets(setup.map((s) => `**${flat(s.label)}**: ${flat(s.value)}`)), "");
  }

  const langs = (P.languages || []).filter((l) => l && flat(l.name));
  if (langs.length) {
    L.push("## Languages", "", bullets(langs.map((l) => `**${flat(l.name)}**: ${flat(l.level)}`)), "");
  }

  L.push("## Full content", "");
  L.push(
    bullets([
      `[Complete CV as markdown](${origin}/llms-full.txt): every role with its highlights, every project with its own detail, education and working setup.`,
      resume ? `[CV as PDF](${resume}): the same CV as a document to read or forward.` : "",
      github ? `[GitHub](${github}): public repositories.` : "",
      linkedin ? `[LinkedIn](${linkedin}): professional profile.` : "",
      upwork ? `[Upwork](${upwork}): freelance profile, for contract work.` : "",
    ]),
    ""
  );

  return L.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

export function renderLlmsFull(P, origin) {
  const profile = P.profile || {};
  const links = P.links || {};
  const L = [];

  L.push(`# ${profile.name}`, "");
  L.push(`**${profile.role}** · ${profile.location}`, "");
  if (availability(P)) L.push(`**${availability(P)}**`, "");
  L.push(profile.summary, "");

  const mail = flat(profile.email);
  const contact = [
    mail ? `[${mail}](mailto:${mail})` : "",
    flat(links.github) ? `[GitHub](${abs(origin, links.github)})` : "",
    flat(links.linkedin) ? `[LinkedIn](${abs(origin, links.linkedin)})` : "",
    flat(links.upwork) ? `[Upwork](${abs(origin, links.upwork)})` : "",
    flat(links.resume) ? `[CV (PDF)](${abs(origin, links.resume)})` : "",
  ].filter(Boolean);
  if (contact.length) L.push(contact.join(" · "), "");

  const proofs = proofLines(P, origin);
  if (proofs.length) L.push("## At a glance", "", bullets(proofs), "");

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

      for (const n of (e.entries || []).filter((n) => n && flat(n.title))) {
        L.push(`#### ${flat(n.title)}`, "");
        if (flat(n.period)) L.push(flat(n.period), "");
        if (flat(n.detail)) L.push(flat(n.detail), "");
      }
    }
  }

  const projects = (P.projects || []).filter((p) => p && flat(p.name));
  if (projects.length) {
    L.push("## Work", "");
    for (const p of projects) {
      L.push(`### ${flat(p.name)}`, "");
      if (flat(p.kind)) L.push(`*${flat(p.kind)}*`, "");
      if (flat(p.description)) L.push(flat(p.description), "");
      if (flat(p.note)) L.push(`*${flat(p.note)}*`, "");
      if ((p.highlights || []).length) L.push(bullets(p.highlights.map(flat)), "");
      if ((p.stack || []).length) L.push(`Stack: ${p.stack.map(flat).filter(Boolean).join(", ")}`, "");

      // A private repository is stated, not dropped: an empty link list would
      // read as "nothing here" rather than "real, and you cannot click it".
      const ls = validLinks(p.links);
      if (ls.length || p.privateRepo) {
        const rendered = ls.map((l) => `[${flat(l.label) || "Link"}](${abs(origin, l.url)})`);
        L.push(`Links: ${rendered.join(", ") || "Repository is private"}`, "");
      }
    }
  }

  const skills = skillLines(P);
  if (skills.length) L.push("## Skills", "", bullets(skills), "");

  const edu = eduLines(P);
  if (edu.length) L.push("## Education", "", bullets(edu), "");

  const setup = P.workingSetup || [];
  if (setup.length) {
    L.push("## Working setup", "", bullets(setup.map((s) => `**${flat(s.label)}**: ${flat(s.value)}`)), "");
  }

  const langs = (P.languages || []).filter((l) => l && flat(l.name));
  if (langs.length) {
    L.push("## Languages", "", bullets(langs.map((l) => `**${flat(l.name)}**: ${flat(l.level)}`)), "");
  }

  return L.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}