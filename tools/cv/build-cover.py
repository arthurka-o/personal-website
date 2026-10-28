#!/usr/bin/env python3
"""Arthur Galiullin — cover letter build.

markdown -> HTML (python-markdown) -> PDF (WeasyPrint), using cover-letter.css.

    python3 build-cover.py [input.md] [output.pdf] [--html]

Same pipeline and same design constants as build.py, so a letter renders as a page from
the same document family as the CV. The differences in the stylesheet (larger body,
open paragraph spacing, no uppercase section rule) are explained in cover-letter.css.

Metadata is set from constants below rather than scraped from the markdown, for the same
reason as build.py: a wording change in the letter cannot silently desync the metadata.

Per-letter details (role title, company) are passed in with --role and --company so the
title block and metadata track the posting rather than being hardcoded here.
"""
import argparse
import pathlib

import markdown
from weasyprint import CSS, HTML

HERE = pathlib.Path(__file__).parent

# Defaults; override with --role / --company for a specific application.
NAME = "Arthur Galiullin"
LOCATION = "Warsaw, Poland (Remote)"
LANG = "en-GB"

ap = argparse.ArgumentParser(add_help=False)
ap.add_argument("input", nargs="?", default=None)
ap.add_argument("output", nargs="?", default=None)
ap.add_argument("--role", default="Cover Letter")
ap.add_argument("--company", default="")
ap.add_argument("--html", action="store_true")
args = ap.parse_args()

md_path = pathlib.Path(args.input) if args.input else HERE / "cover-letter.md"
out_path = pathlib.Path(args.output) if args.output else HERE / "cover-letter.pdf"

title = f"{NAME} — {args.role} — Cover Letter"
subject = f"{NAME} — {args.role}"
if args.company:
    subject += f" at {args.company}"

body = markdown.markdown(
    md_path.read_text(encoding="utf-8"),
    extensions=["extra", "sane_lists"],
    output_format="html5",
)
doc = f"""<!DOCTYPE html>
<html lang="{LANG}"><head><meta charset="utf-8">
<title>{title}</title>
<meta name="author" content="{NAME}">
<meta name="description" content="{subject}">
<meta name="generator" content="cvless">
<meta name="role" content="{args.role}">
<meta name="location" content="{LOCATION}">
</head>
<body>{body}</body></html>"""

if args.html:
    out_path.with_suffix(".html").write_text(doc, encoding="utf-8")

HTML(string=doc, base_url=str(HERE)).write_pdf(
    str(out_path),
    stylesheets=[CSS(filename=str(HERE / "cover-letter.css"))],
    custom_metadata=True,
)
print("wrote", out_path)