# CV PDF design — Arthur Galiullin

Everything needed to regenerate the CV PDF **without changing how it looks**.
Derived by reverse-engineering the original PDF's content stream (WeasyPrint 69.0), then
verified to sub-pixel accuracy against the original.

This folder holds the whole pipeline, and the markdown is the source of truth:

| file | role |
|---|---|
| `Arthur_Galiullin_CV.md` | the CV itself — edit here |
| `build.py` | markdown → HTML → PDF |
| `cv.css`  | the design (every value below comes from this file) |
| `geom.py` | extracts/diffs text-run geometry from two PDFs — the verification tool |
| `measure.py` | page count and the free space at the bottom of each page |
| `lines.py` | how many lines a candidate paragraph takes in the CV's column |
| `DESIGN.md` | this file |

The built PDF is `cv.pdf` in the repository root, which is what the site serves.
There is a convenience copy on the Desktop — if you edit that one, copy it back
here or the next build will silently use the older text.

---

## 1. Pipeline

```
Arthur_Galiullin_CV.md        (this folder)
   │  python-markdown (extensions: extra, sane_lists) → HTML5
   │  cv.css
   ▼
WeasyPrint 69.0  →  ../../cv.pdf
```

Rebuild — the whole thing, defaults included:

```bash
cd tools/cv
python3 build.py
```

Explicit paths, if you are rebuilding the Desktop copy instead:

```bash
python3 build.py ~/Desktop/Arthur_Galiullin_CV.md ~/Desktop/Arthur_Galiullin_CV.pdf
cp ~/Desktop/Arthur_Galiullin_CV.pdf ../../cv.pdf     # the site's copy
```

Add `--html` to also write the intermediate HTML next to the PDF, which is what WeasyPrint
actually lays out — the first thing to look at when something wraps oddly.

**Pinning matters.** WeasyPrint's Pango text layout decides line breaks and kerning, so the
same markdown can wrap differently on another version. Verified against WeasyPrint 69.0.

### Document metadata

Set as constants at the top of `build.py`, not scraped from the markdown, so a wording
change cannot desync them. WeasyPrint maps `<title>` and the `<meta>` tags onto the PDF
`/Info` keys and writes the root `lang` into the catalog's `/Lang`; `custom_metadata=True`
stores the non-standard `<meta>` tags (`role`, `location`, `source`) as extra keys.

Current values: title, author, a one-paragraph subject, 54 keywords, `/Lang en-GB`.
Check with `pdfinfo cv.pdf` after any change — the July 2025 PDF had none of this.

---

## 2. Design constants

Page A4 (595.276 × 841.89 pt), margins **1.5cm** vertical, **48.52pt** horizontal.
Content box: x 48.52 → 546.76 pt (498.24 pt wide).

| element | size | weight | colour | notes |
|---|---|---|---|---|
| body / `li` | **9.8pt** (`0.98em`) | 400 | `#1a1a1a` | line-height `1.42` inherited from body |
| `h1` name | **22pt** (`2.2em`) | 700 | `#1a5276` | letter-spacing `0.3px` |
| subtitle (`h1 + p`) | **9.5pt** (`0.95em`) | 400 | `#555555` | role + location |
| contact (`h1 + p + p`) | **9pt** (`0.9em`) | 400 | links `#1a5276` | |
| work-authorisation (`h1 + p + p + p`) | **9pt** (`0.9em`) | 400 | `#555555` | grey so it reads as a footnote |
| `h2` section | **10.5pt** (`1.05em`) | 600 | `#1a5276` | **uppercase**, letter-spacing `0.7px`, 1.2px blue underline |
| `h3` role | **10pt** (`1em`) | 600 | `#1a5276` | |
| `strong` | inherited | 600 | — | semibold, never bold |
| `em` | inherited | italic | `#555555` | dates in titles, *(Solo)* etc. |
| `a` | inherited | — | `#1a5276` | no underline |
| `hr` | — | — | `#bbbbbb` | hairline, `0.5px` top border |

Base `body { font-size: 10pt; line-height: 1.42 }` — everything else is `em` off that.
Line advance inside a paragraph = **13.916pt**.

### Spacing (the part that is easy to break)

Margins collapse, so the numbers below are *effective gaps* between rendered boxes.

| gap | value |
|---|---|
| page top → `h1` box | 6pt (`h1` margin-top) |
| `h1` → subtitle | 0.75pt |
| subtitle → contact | 1.5pt |
| contact → `hr` | 6pt |
| `hr` → paragraph | 6pt |
| paragraph → `hr` | 6pt |
| `hr` → `h2` | 9.75pt |
| paragraph → `h2` | 16.125pt |
| `h2` → paragraph | 3.75pt (+1.5pt padding under the rule) |
| `h2` → `h3` | 6.75pt |
| `h3` → paragraph | 1.5pt |
| paragraph → `ul` | 1.5pt |
| `li` → `li` | 0.75pt |
| `ul` → "Stack:" paragraph | 1.5pt |
| "Stack:" paragraph → `hr` → `h3` | 6pt + 0.5px rule + 6.75pt |

---

## 3. Gotchas

1. **`h2` is uppercase-transformed.** Write section titles in title case in the markdown
   (`## Work Experience`); the PDF shows `WORK EXPERIENCE`. Because the transform happens
   *before* layout, uppercase is ~7% wider — it is the reason the headings look spaced out.
2. **Letter-spacing is quantised.** WeasyPrint passes it to Pango as
   `int(value × 1024)` Pango units, so only certain values reproduce the exact glyph
   positions: `0.3px` for `h1`, `0.7px` for `h2`. Nearby values (0.698px, 0.701px) shift
   the text by ~0.03pt — invisible, but the values above are the ones that match exactly.
3. **Spacing constants are load-bearing.** Adding a paragraph is free; adding a *new kind
   of element* (e.g. a second `ul` after a paragraph, or an `h3` that is not preceded by
   `h2`/`hr`) changes which margin-collapsing rule applies and shifts everything below it.
   Re-run the diff (§4) after any structural edit.
4. **Three pages, and the third one is deliberate.** The content box on each page
   ends at 799.37pt. Page 2 finishes at 775.68pt — 23.69pt of slack — and page 3
   carries the Relocation & Work Authorisation block, the Selected Public Work
   list, Education and Languages, ending at 476.57pt.

   The third page used to be an accident. The AI Tooling section grew past the
   two-page fit and pushed Education, Languages and a links row onto a page that
   was 17% full, which reads as a spillover rather than a plan. It is now a back
   page with two sections on it. The links row it replaced became Selected
   Public Work, carrying the same seven repositories with a line about what each
   one is.

   If the copy ever has to come back to two pages, the cheapest places to
   reclaim space, in order: the KUMO pilot-contract bullet, the StreamBeam
   description, the Rails paragraph. That is about 9 lines — roughly 120pt — and
   the AI Tooling block is the other candidate, since it is the section that
   pushed the document over in the first place.

   The vertical margin was 1.6cm until the skills list grew past what 1.6cm left
   room for; it is 1.5cm now, which buys 5.7pt on every page. That is the last
   cheap lever — the next one is trimming copy, and after that the document has to
   become three pages on purpose rather than by accident.
5. **`ul` padding is `1.2em` of the list's own size** (0.98em → 11.76pt indent). Adding
   `font-size` to `li` instead of `ul` compounds the em and shifts the whole list.

---

## 4. How to verify a rebuild

```bash
cd tools/cv
python3 build.py ~/Desktop/Arthur_Galiullin_CV.md /tmp/new.pdf
python3 geom.py ~/Desktop/Arthur_Galiullin_CV.pdf /tmp/new.pdf     # per-run x/y/size/colour diff
pdftoppm -r 300 -png ~/Desktop/Arthur_Galiullin_CV.pdf /tmp/old
pdftoppm -r 300 -png /tmp/new.pdf /tmp/new
python3 - <<'EOF'
from PIL import Image, ImageChops
for p in (1, 2):
    a = Image.open(f'/tmp/old-{p}.png').convert('RGB')
    b = Image.open(f'/tmp/new-{p}.png').convert('RGB')
    d = ImageChops.difference(a, b).convert('L').load()
    w, h = a.size
    n = sum(1 for y in range(h) for x in range(w) if d[x, y] > 24)
    print(p, n, "px", f"{100*n/(w*h):.4f}%")
EOF
```

Baseline for an **unchanged** rebuild (same content, same machine):

* every text run within **0.001pt** in x, y, font size and colour
* all rules (hairlines + blue underlines) within 0.001pt, same thickness and colour
* the same link annotations — 5 in the July 2025 revision, 11 in the current one
* pixel diff **0.014%** page 1, **0.002%** page 2 — isolated glyph rasterisation noise,
  not layout (a few hundred pixels in 8 tiny clusters)

Anything above that means the stylesheet drifted. Compare `geom.py` output first: it
tells you which line moved and by how much.

### The two measuring tools

`geom.py` compares two PDFs. These two do one job each, and both exist because
guessing at the layout is how the third page happened in the first place:

| tool | what it answers |
|---|---|
| `measure.py` | How many pages is this, and where does each page's content end? Prints the free space at the bottom of every page, so a trim can be sized instead of guessed at. Run it on every rebuild. |
| `lines.py` | How many lines does this paragraph take? Renders a candidate string in the CV's own column — 498.24pt wide, 9.8pt on a 1.42 line-height — and counts the lines. `--indent` measures it as a list item, which is a narrower column. Use it before editing a bullet, to find out whether the rewrite is actually shorter. |

```bash
cd tools/cv
python3 measure.py ../../cv.pdf
python3 lines.py "**A bullet** — with the wording you are considering."
```

## 5. History

* **Jul 2025** — the original. WeasyPrint 69.0, no metadata, the CSS was not kept.
* **Oct 2026** — content refreshed (see `git log` for `cv.pdf`), metadata added, and this
  pipeline reconstructed from the PDF itself so the next revision does not start from
  scratch. `cv.css` gained one rule since: `h1 + p + p + p` for the work-authorisation line.
* **Nov 2026** — relocation opened up, and the document went to three pages on purpose.
  The Relocation & Work Authorisation block and the Selected Public Work list now sit
  on page 3, replacing a links row that was the only thing there before.
