/* ============================================================================
   PORTFOLIO — behaviour layer
   ----------------------------------------------------------------------------
   Reads window.PORTFOLIO (content.js) and binds it into index.html.
   Nothing here hardcodes résumé content: every string comes from the data
   model, so editing content.js is the only edit needed to change the page.
   ========================================================================= */
(function () {
  "use strict";

  var DATA = window.PORTFOLIO;
  if (!DATA) return;

  var profile = DATA.profile || {};
  var links = DATA.links || {};
  var proofPoints = DATA.proofPoints || [];
  var experience = DATA.experience || [];
  var projects = DATA.projects || [];
  var skills = DATA.skills || [];
  var education = DATA.education || [];
  var workingSetup = DATA.workingSetup || [];
  var languages = DATA.languages || [];
  var logoLibrary = DATA.logoLibrary || {};
  var logoRail = DATA.logoRail || [];

  /* Pages declare where assets live. The canonical page sets data-ground="auto"
     because it themes dynamically; the archived variants still pin a static
     ground, so one binding layer serves all of them. */
  var ASSET_BASE = document.body.getAttribute("data-assets") || "assets";
  var GROUND_MODE = document.body.getAttribute("data-ground") || "dark";

  /* ------------------------------------------------------------ theme ----
     Resolution rule, identical to the bootstrap script in index.html:
     an explicit stored choice wins; otherwise the OS decides. If storage is
     unavailable the page still works, following the OS alone. */
  var THEME_KEY = "od-theme";
  var osQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;

  function storedTheme() {
    try {
      var v = localStorage.getItem(THEME_KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch (e) {
      return null;
    }
  }
  function osTheme() {
    return osQuery && osQuery.matches ? "dark" : "light";
  }
  function activeTheme() {
    return storedTheme() || osTheme();
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    syncToggleLabel();
    applyMarks();
  }
  function syncToggleLabel() {
    var btn = $('[data-action="toggle-theme"]');
    if (!btn) return;
    var next = activeTheme() === "dark" ? "light" : "dark";
    btn.setAttribute(
      "aria-label",
      next === "dark" ? "Switch to night mode" : "Switch to paper mode"
    );
    btn.setAttribute("title", next === "dark" ? "Switch to night mode" : "Switch to paper mode");
  }

  /* ------------------------------------------------------- mark treatment
     Brand marks are official single-colour vectors. The rule here is
     mechanical, not taste: a mark renders in its official brand colour only
     when that colour actually clears 3:1 against this page's own ground.
     Otherwise it renders as the same official path in black (light ground)
     or white (dark ground) — which is how every brand mark is licensed to be
     used. No mark is ever recoloured into a lookalike of something else. */
  function srgbToLinear(c) {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  function luminance(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex || "").trim());
    if (!m) return null;
    var r = parseInt(m[1], 16),
      g = parseInt(m[2], 16),
      b = parseInt(m[3], 16);
    return (
      0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
    );
  }
  function contrast(l1, l2) {
    var hi = Math.max(l1, l2),
      lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }
  /* The ground is measured, never hardcoded in a theme-to-colour map.
     It is read from the `--ground` custom property rather than from the body's
     rendered background-color, because a background-color transition makes
     getComputedStyle report the ground we are LEAVING for the length of the
     animation — which silently re-tinted every mark against the old theme on
     each toggle. Custom properties are not transitioned, so this always
     returns the ground that is actually being applied. */
  var markRegistry = [];

  function parseCssColor(value) {
    var v = String(value || "").trim();
    if (v.charAt(0) === "#") {
      var h = v.slice(1);
      if (h.length === 3) {
        h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      }
      return /^([0-9a-f]{6})$/i.test(h) ? "#" + h : null;
    }
    var m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i.exec(v);
    if (!m) return null;
    return "#" + [m[1], m[2], m[3]]
      .map(function (n) {
        return ("0" + Math.round(parseFloat(n)).toString(16)).slice(-2);
      })
      .join("");
  }
  function groundLuminance() {
    var cs = getComputedStyle(document.documentElement);
    var l = luminance(parseCssColor(cs.getPropertyValue("--ground")));
    return l === null ? 0.5 : l;
  }
  /* A mark keeps its official brand colour only when that colour is as
     legible against this ground as the body text we hold to 4.5:1. At the
     old 3:1 bar, mid-tone brand colours — Chainlink, PostgreSQL, TypeScript,
     Ruby on Rails, Kumo — survived at 3.2–4.3:1 and read as muddy on the dark
     ground rather than crisp. Below the bar a mark now renders as the same
     official path in black or white, which lands at ~17–19:1. Change this one
     number to trade brand colour back for dimmer marks. */
  var MARK_MIN_CONTRAST = 4.5;

  function markFile(logo, groundLum) {
    var base = ASSET_BASE + "/logos/" + logo.file;
    // A raster mark carries its own ink and is never recoloured; it is made
    // legible by the backing tile its wrapper paints, identical on both grounds.
    if (logo.tile) return base + ".png";
    var brand = luminance(logo.hex);
    var dark = groundLum < 0.5;
    if (brand === null) return base + (dark ? "-inv.svg" : ".svg");
    if (contrast(brand, groundLum) >= MARK_MIN_CONTRAST) return base + ".svg";
    return base + (dark ? "-inv.svg" : "-mono.svg");
  }
  function applyMarks() {
    var ground = groundLuminance();
    markRegistry.forEach(function (entry) {
      var next = markFile(entry.logo, ground);
      if (entry.img.getAttribute("src") !== next) {
        entry.img.setAttribute("src", next);
      }
    });
  }
  function markImg(logo, size, alt, extraClass) {
    var img = document.createElement("img");
    img.className = "chip-mark" + (extraClass ? " " + extraClass : "");
    img.width = size;
    img.height = size;
    img.loading = "lazy";
    img.decoding = "async";
    img.setAttribute("data-mark", logo.file);
    // A mark that needs an opaque backing says so on itself, rather than the
    // stylesheet hardcoding one logo's name.
    if (logo.tile) img.className += " is-tiled";
    // The name is always present as text beside the mark, so the mark itself
    // is decorative to a screen reader.
    img.alt = alt === undefined ? "" : alt;
    img.src = markFile(logo, groundLuminance());
    markRegistry.push({ img: img, logo: logo });

    // White-on-transparent marks (Overlay) cannot be recoloured without
    // falsifying the brand, so they keep their ink and get an opaque backing
    // tile. That tile is the dark ground colour, so on Night it disappears into
    // the page and on Paper it reads as a proper logo tile.
    if (logo.tile) {
      var tile = document.createElement("span");
      tile.className = "mark-tile";
      tile.setAttribute("data-mark", logo.file);
      tile.appendChild(img);
      return tile;
    }
    return img;
  }
  function markTitle(logo, size) {
    if (!logo) return null;
    return markImg(logo, size, logo.title, "mark-lg");
  }
  function skillName(item) {
    return typeof item === "string" ? item : item.name;
  }
  function skillLogo(item) {
    if (!item || typeof item === "string") return null;
    return item.logo ? logoLibrary[item.logo] || null : null;
  }

  /* ---------------------------------------------------------------- utils */
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function bind(name, value) {
    if (value == null || value === "") return;
    $$('[data-bind="' + name + '"]').forEach(function (node) {
      if (node.tagName === "INPUT") node.value = value;
      else node.textContent = value;
    });
  }
  function filled(v) {
    return typeof v === "string" && v.trim() !== "";
  }
  function show(node) {
    if (node) node.removeAttribute("hidden");
  }
  function hide(node) {
    if (node) node.setAttribute("hidden", "");
  }
  function externalLink(label, url) {
    var a = el("a", null, label);
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }

  /* ------------------------------------------------------- headline binds */
  bind("name", profile.name);
  bind("role", profile.role);
  bind("tagline", profile.tagline);
  bind("summary", profile.summary);
  bind("approach", profile.approach);
  bind("email", profile.email);
  bind("brandName", profile.name);
  bind("footerNote", (DATA.footer || {}).note);
  (function renderCredits() {
    var list = $('[data-bind="credits"]');
    var credits = DATA.credits || [];
    if (!list || credits.length === 0) return;
    credits.forEach(function (line) {
      list.appendChild(el("li", null, line));
    });
  })();
  if (profile.name && profile.role) {
    document.title = profile.name + " — " + profile.role;
  }

  /* ----------------------------------------------------------- hero links */
  var heroLinks = $('[data-bind="heroLinks"]');
  var LINK_DEFS = [
    {
      key: "github",
      label: "github.com/arthurka-o",
      icon: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: "M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.2 8.4h3.5V21H3.2zM9 8.4h3.35v1.72h.05c.47-.86 1.6-1.77 3.3-1.77 3.53 0 4.18 2.2 4.18 5.06V21h-3.5v-5.7c0-1.36-.03-3.1-1.92-3.1-1.92 0-2.22 1.47-2.22 3v5.8H9z",
    },
    {
      key: "website",
      label: "Website",
      icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2c1.2 0 2.63 2.4 2.9 6h-5.8C9.37 6.4 10.8 4 12 4zM4.34 11h3.2a24 24 0 0 0 .5 6H4.5a8 8 0 0 1-.16-6zM4.5 19h3.54c.5 1.5 1.1 2.6 1.7 3.2A8 8 0 0 1 4.5 19zm5.24 0h4.52c-.27 3.6-1.7 6-2.26 6s-2-2.4-2.26-6zm6.42 0h.5a24 24 0 0 0 .5-6h3.2a8 8 0 0 1-.16 6zM20.7 11h-3.2a24 24 0 0 0-.5-6h3.7a8 8 0 0 1 .16 6z",
    },
  ];
  if (heroLinks) {
    LINK_DEFS.forEach(function (def) {
      if (!filled(links[def.key])) return;
      var a = externalLink(def.label, links[def.key]);
      a.className = "hero-link";
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "icon");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("aria-hidden", "true");
      svg.innerHTML = '<path d="' + def.icon + '"/>';
      a.insertBefore(svg, a.firstChild);
      heroLinks.appendChild(a);
    });
  }

  /* ------------------------------------------------------------ logo rail */
  var logoRailEl = $('[data-bind="logoRail"]');
  if (logoRailEl) {
    logoRail.forEach(function (key) {
      var logo = logoLibrary[key];
      if (!logo) return;
      var li = el("li", "logo-mark");
      var img = markImg(logo, 24);
      img.alt = logo.title;
      li.appendChild(img);
      li.appendChild(el("span", "logo-name", logo.title));
      logoRailEl.appendChild(li);
    });
  }

  /* ----------------------------------------------------------- proof panel */
  var proofList = $('[data-bind="proofList"]');
  if (proofList) {
    if (proofPoints.length === 0) {
      proofList.appendChild(
        el("li", "section-empty", "Add proof points to content.js.")
      );
    }
    proofPoints.forEach(function (p) {
      var li = el("li", "proof-item");

      // numeral above, caption below — each its own block
      var stat = el("div", "od-stat");
      stat.appendChild(el("span", "proof-value", p.stat));
      stat.appendChild(el("span", "proof-label", p.label));
      li.appendChild(stat);

      if (filled(p.title)) li.appendChild(el("p", "proof-title", p.title));
      if (filled(p.detail)) li.appendChild(el("p", "proof-detail", p.detail));
      if (filled(p.url)) {
        var a = externalLink(p.urlLabel || "Link", p.url);
        a.className = "proof-link";
        li.appendChild(a);
      }
      proofList.appendChild(li);
    });
  }

  /* ------------------------------------------------------------ navigation */
  var navList = $('[data-bind="navList"]');
  var SECTIONS = [
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ];
  var navLinks = [];
  if (navList) {
    var sections = [];
    SECTIONS.forEach(function (s) {
      var li = el("li");
      var a = el("a", "nav-link", s.label);
      a.href = "#" + s.id;
      a.setAttribute("data-nav", s.id);
      li.appendChild(a);
      navList.appendChild(li);
      navLinks.push(a);
      var sec = document.getElementById(s.id);
      if (sec) sections.push(sec);
    });

    function setActive(id) {
      navLinks.forEach(function (a) {
        if (a.getAttribute("data-nav") === id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }
    function onScroll() {
      var topbar = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--topbar-h")
      );
      var probe = window.scrollY + (isNaN(topbar) ? 57 : topbar) + 24;
      var current = sections.length ? sections[0].id : "";
      sections.forEach(function (sec) {
        if (sec.offsetTop <= probe) current = sec.id;
      });
      setActive(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ------------------------------------------------------------ experience */
  var expList = $('[data-bind="experienceList"]');
  if (expList) {
    if (experience.length === 0) {
      show($('[data-bind="experienceEmpty"]'));
    } else {
      experience.forEach(function (job) {
        var li = el("li", "role");

        var marker = el("span", "role-marker", ">");
        marker.setAttribute("aria-hidden", "true");
        li.appendChild(marker);

        var body = el("div", "role-body");

        var head = el("div", "role-head");
        var titleWrap = el("div");
        titleWrap.appendChild(el("div", "role-title", job.role || ""));
        // Protocol mark sits with the organisation name — a former employer's
        // mark belongs on the role it actually belongs to, named in full beside
        // it, never as an implied current affiliation.
        var companyRow = el("div", "org-line");
        var orgContent = document.createDocumentFragment();
        var orgMark = markTitle(job.logo ? logoLibrary[job.logo] : null, 36);
        if (orgMark) orgContent.appendChild(orgMark);
        // No organisation means no empty span left behind in the row.
        if (filled(job.company)) {
          orgContent.appendChild(el("span", "role-company", job.company));
        }
        if (filled(job.url)) {
          // The mark and the organisation name are one link. The name is the
          // link text, so it is what a screen reader announces; the mark is
          // inside the same anchor rather than sitting beside a separate link.
          var orgLink = el("a", "org-link");
          orgLink.href = job.url;
          orgLink.target = "_blank";
          orgLink.rel = "noopener noreferrer";
          orgLink.title = job.company + " — opens in a new tab";
          orgLink.appendChild(orgContent);
          orgLink.appendChild(
            el("span", "visually-hidden", " (opens in a new tab)")
          );
          companyRow.appendChild(orgLink);
        } else {
          companyRow.appendChild(orgContent);
        }
        titleWrap.appendChild(companyRow);
        head.appendChild(titleWrap);
        head.appendChild(
          el("span", "role-period od-nowrap", (job.start || "") + " – " + (job.end || ""))
        );
        body.appendChild(head);

        if (filled(job.location)) {
          body.appendChild(el("p", "role-meta", job.location));
        }
        if (filled(job.summary)) {
          body.appendChild(el("p", "role-summary", job.summary));
        }

        // nested employers under one period heading
        if (job.entries && job.entries.length) {
          var entries = el("div", "role-entries");
          job.entries.forEach(function (entry) {
            var row = el("div", "role-entry");
            var eHead = el("div", "role-entry-head");
            eHead.appendChild(el("span", "role-entry-title", entry.title || ""));
            eHead.appendChild(el("span", "role-entry-period od-nowrap", entry.period || ""));
            row.appendChild(eHead);
            if (filled(entry.detail)) {
              row.appendChild(el("p", "role-entry-detail", entry.detail));
            }
            entries.appendChild(row);
          });
          body.appendChild(entries);
        }

        if (job.highlights && job.highlights.length) {
          var ul = el("ul", "bullets");
          job.highlights.forEach(function (h) {
            ul.appendChild(el("li", "bullet", h));
          });
          body.appendChild(ul);
        }

        if (job.stack && job.stack.length) {
          var chips = el("div", "chips");
          job.stack.forEach(function (s) {
            chips.appendChild(el("span", "chip", s));
          });
          body.appendChild(chips);
        }

        li.appendChild(body);
        expList.appendChild(li);
      });
    }
  }

  /* -------------------------------------------------------------- projects */
  var projList = $('[data-bind="projectList"]');
  if (projList) {
    if (projects.length === 0) {
      show($('[data-bind="projectEmpty"]'));
    } else {
      projects.forEach(function (proj, idx) {
        var li = el("li", "card");

        var head = el("div", "card-head");
        var nameWrap = el("div", "card-name-wrap");
        var projMark = markTitle(proj.logo ? logoLibrary[proj.logo] : null, 36);
        if (projMark) nameWrap.appendChild(projMark);
        nameWrap.appendChild(el("h3", "card-name", proj.name || "Untitled project"));
        head.appendChild(nameWrap);
        if (filled(proj.kind)) head.appendChild(el("span", "card-kind", proj.kind));
        li.appendChild(head);

        var body = el("div", "card-body");
        if (filled(proj.description)) {
          body.appendChild(el("p", "card-desc", proj.description));
        }
        if (proj.stack && proj.stack.length) {
          var stackChips = el("div", "chips");
          proj.stack.forEach(function (s) {
            stackChips.appendChild(el("span", "chip", s));
          });
          body.appendChild(stackChips);
        }
        li.appendChild(body);

        var hasMore = proj.highlights && proj.highlights.length;
        var moreId = "project-more-" + idx;
        if (hasMore) {
          var more = el("div", "card-more");
          more.id = moreId;
          more.setAttribute("hidden", "");
          var ul = el("ul", "bullets");
          proj.highlights.forEach(function (h) {
            ul.appendChild(el("li", "bullet", h));
          });
          more.appendChild(ul);
          li.appendChild(more);
        }

        var foot = el("div", "card-foot");
        if (hasMore) {
          var toggle = el("button", "btn ghost disclosure");
          toggle.type = "button";
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-controls", moreId);
          toggle.appendChild(document.createTextNode("Details"));
          var chev = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          chev.setAttribute("class", "icon chev");
          chev.setAttribute("viewBox", "0 0 24 24");
          chev.setAttribute("aria-hidden", "true");
          chev.innerHTML = '<path d="m6 9 6 6 6-6"/>';
          toggle.appendChild(chev);
          toggle.addEventListener("click", function () {
            var open = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", open ? "false" : "true");
            if (open) more.setAttribute("hidden", "");
            else more.removeAttribute("hidden");
            toggle.firstChild.textContent = open ? "Details" : "Hide details";
          });
          foot.appendChild(toggle);
        }

        var valid = (proj.links || []).filter(function (l) {
          return filled(l.url);
        });
        if (valid.length) {
          var linksWrap = el("div", "card-links");
          valid.forEach(function (l) {
            var a = externalLink(l.label || "Link", l.url);
            a.className = "card-link";
            linksWrap.appendChild(a);
          });
          foot.appendChild(linksWrap);
        }

        li.appendChild(foot);
        projList.appendChild(li);
      });
    }
  }

  /* ---------------------------------------------------------------- skills */
  var filtersWrap = $('[data-bind="skillFilters"]');
  var groupsWrap = $('[data-bind="skillGroups"]');
  var searchInput = $('[data-bind="skillSearch"]');
  var statusEl = $('[data-bind="skillStatus"]');
  var emptyEl = $('[data-bind="skillEmpty"]');

  var activeFilter = "all";
  var query = "";

  if (groupsWrap) {
    var groupNodes = [];
    skills.forEach(function (group) {
      var sec = el("section", "skill-group");
      sec.setAttribute("data-group", group.id);
      sec.appendChild(el("h3", "skill-group-title", group.label));

      var list = el("ul", "skill-list");
      (group.items || []).forEach(function (item) {
        var name = skillName(item);
        var li = el("li", "chip");
        var logo = skillLogo(item);
        if (logo) li.appendChild(markImg(logo, 14));
        li.appendChild(el("span", "chip-name", name));
        li.setAttribute("data-skill", String(name).toLowerCase());
        list.appendChild(li);
      });
      sec.appendChild(list);
      groupsWrap.appendChild(sec);
      groupNodes.push(sec);
    });

    if (filtersWrap) {
      var chips = [];
      [{ id: "all", label: "All" }]
        .concat(
          skills.map(function (g) {
            return { id: g.id, label: g.label };
          })
        )
        .forEach(function (def) {
          var b = el("button", "filter-chip", def.label);
          b.type = "button";
          b.setAttribute("aria-pressed", def.id === "all" ? "true" : "false");
          b.addEventListener("click", function () {
            activeFilter = def.id;
            chips.forEach(function (c) {
              c.setAttribute("aria-pressed", c === b ? "true" : "false");
            });
            applyFilters();
          });
          filtersWrap.appendChild(b);
          chips.push(b);
        });
    }

    function applyFilters() {
      var shownTotal = 0;
      var shownGroups = 0;

      skills.forEach(function (group, gi) {
        var sec = groupNodes[gi];
        var shown = 0;
        $$("[data-skill]", sec).forEach(function (node) {
          var groupOk = activeFilter === "all" || group.id === activeFilter;
          var queryOk =
            !query ||
            node.getAttribute("data-skill").indexOf(query) !== -1 ||
            group.label.toLowerCase().indexOf(query) !== -1;
          var ok = groupOk && queryOk;
          if (ok) {
            node.removeAttribute("hidden");
            shown++;
          } else {
            node.setAttribute("hidden", "");
          }
        });
        if (shown) {
          sec.removeAttribute("hidden");
          shownGroups++;
        } else {
          sec.setAttribute("hidden", "");
        }
        shownTotal += shown;
      });

      var anySkills = skills.length > 0;
      if (anySkills && shownTotal === 0) show(emptyEl);
      else hide(emptyEl);

      if (statusEl) {
        if (!anySkills) statusEl.textContent = "";
        else if (shownTotal === 0) statusEl.textContent = "No matching skills.";
        else
          statusEl.textContent =
            shownTotal +
            (shownTotal === 1 ? " skill" : " skills") +
            " across " +
            shownGroups +
            (shownGroups === 1 ? " area." : " areas.");
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        query = searchInput.value.trim().toLowerCase();
        applyFilters();
      });
    }

    $$('[data-action="reset-filters"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeFilter = "all";
        query = "";
        if (searchInput) searchInput.value = "";
        $$(".filter-chip", filtersWrap).forEach(function (c, i) {
          c.setAttribute("aria-pressed", i === 0 ? "true" : "false");
        });
        applyFilters();
        if (searchInput) searchInput.focus();
      });
    });

    applyFilters();
  }

  /* ------------------------------------------------------------- education */
  var eduList = $('[data-bind="educationList"]');
  if (eduList) {
    if (education.length === 0) {
      show($('[data-bind="educationEmpty"]'));
    } else {
      education.forEach(function (item) {
        var li = el("li", "edu-row");

        var marker = el("span", "edu-marker", ">");
        marker.setAttribute("aria-hidden", "true");
        li.appendChild(marker);

        // .edu-row is a TWO-column grid (marker | content). Everything else
        // goes inside one wrapper — a third direct child wrapped onto the next
        // grid row and landed in the 20px marker column.
        var eduBody = el("div", "edu-body");

        var head = el("div", "edu-head");
        var eduMark = markTitle(item.logo ? logoLibrary[item.logo] : null, 36);
        if (eduMark) head.appendChild(eduMark);
        head.appendChild(el("span", "edu-degree", item.degree || ""));
        head.appendChild(el("span", "edu-period od-nowrap", item.period || ""));
        eduBody.appendChild(head);

        if (filled(item.school)) {
          eduBody.appendChild(el("p", "edu-school", item.school));
        }
        li.appendChild(eduBody);
        eduList.appendChild(li);
      });
    }
  }

  /* --------------------------------------------------------------- contact */
  function copyText(text, btn) {
    var original = btn.textContent;
    function done(ok) {
      btn.textContent = ok ? "Copied" : "Copy manually";
      btn.classList.toggle("is-copied", ok);
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove("is-copied");
      }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          done(true);
        },
        function () {
          done(false);
        }
      );
    } else {
      done(false);
    }
  }

  var contactList = $('[data-bind="contactList"]');
  if (contactList) {
    function row(label, value, opts) {
      if (!filled(value)) return;
      var li = el("li", "contact-row");
      // Real marks on the contact rows, matching the rest of the page. The
      // row is already named in text, so the mark is decorative here.
      var logo = opts && opts.logo ? logoLibrary[opts.logo] : null;
      if (logo) {
        var mark = markImg(logo, 20);
        mark.setAttribute("aria-hidden", "true");
        li.appendChild(mark);
      }
      li.appendChild(el("span", "contact-label", label));
      if (opts && opts.href) {
        // `text` lets a row show a friendly label instead of a raw path.
        var link = el("a", "contact-value", opts.text || value);
        link.href = opts.href;
        if (opts.external) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        li.appendChild(link);
      } else {
        li.appendChild(el("span", "contact-value", value));
      }
      if (opts && opts.copy) {
        var btn = el("button", "btn ghost", "Copy");
        btn.type = "button";
        btn.setAttribute("aria-label", "Copy " + label.toLowerCase());
        btn.addEventListener("click", function () {
          copyText(opts.copy, btn);
        });
        li.appendChild(btn);
      }
      contactList.appendChild(li);
    }

    row("Email", profile.email, {
      copy: profile.email,
      href: profile.email ? "mailto:" + profile.email : null,
    });
    row("GitHub", links.github, {
      href: links.github,
      external: true,
      copy: links.github,
      logo: "github",
    });
    row("LinkedIn", links.linkedin, {
      href: links.linkedin,
      external: true,
      copy: links.linkedin,
      logo: "linkedin",
    });
    if (filled(links.resume)) {
      row("Résumé", links.resume, {
        href: links.resume,
        text: "Download PDF",
      });
    }

    if (!contactList.children.length) {
      contactList.appendChild(
        el("li", "section-empty", "No contact details yet — add them in content.js.")
      );
    }
  }

  var setupList = $('[data-bind="setupList"]');
  if (setupList) {
    workingSetup.forEach(function (item) {
      var rowEl = el("div", "glance-row");
      rowEl.appendChild(el("dt", null, item.label));
      rowEl.appendChild(el("dd", null, item.value));
      setupList.appendChild(rowEl);
    });
  }

  var langList = $('[data-bind="langList"]');
  if (langList) {
    languages.forEach(function (lang) {
      var li = el("li", "lang-item");
      li.appendChild(el("span", "lang-name", lang.name));
      li.appendChild(el("span", "lang-level", lang.level));
      langList.appendChild(li);
    });
  }

  $$('[data-action="copy-email"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (profile.email) copyText(profile.email, btn);
    });
  });

  /* ------------------------------------------------------------- theme wiring */
  // Archived variant pages have no toggle; bail out cleanly on those.
  if ($('[data-action="toggle-theme"]')) {
    // Reflect whatever the bootstrap script already decided, then let the
    // marks settle against the ground that is actually painted.
    applyTheme(activeTheme());
    applyMarks();

    $$('[data-action="toggle-theme"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = activeTheme() === "dark" ? "light" : "dark";
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (e) {
          /* storage unavailable — the toggle still works for this visit */
        }
        applyTheme(next);
      });
    });

    // An OS-level change only wins while the visitor has made no choice.
    if (osQuery) {
      if (typeof osQuery.addEventListener === "function") {
        osQuery.addEventListener("change", function () {
          if (!storedTheme()) applyTheme(osTheme());
        });
      } else if (typeof osQuery.addListener === "function") {
        osQuery.addListener(function () {
          if (!storedTheme()) applyTheme(osTheme());
        });
      }
    }
  } else {
    applyMarks();
  }
})();