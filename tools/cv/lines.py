#!/usr/bin/env python3
"""Count the lines a paragraph takes in the CV's own layout.

Tightening a bullet is a guess until it is measured: the CV's content box is
498.24pt wide, the body is 9.8pt on a 1.42 line-height, and a list item is
indented by 1.2em, so a paragraph's line count is not its character count over
some tidy average. This renders a candidate string in that box and says how
many lines it came to.

    python3 tools/cv/lines.py "text to measure" [--indent]

--indent measures the text as a list item, which is a narrower column than a
paragraph: the bullets carry an 11.76pt indent the paragraphs do not. The text
is markdown, so `**bold**` and `*italic*` are measured as they will render.
"""
import pathlib
import subprocess
import sys

import markdown
from weasyprint import CSS, HTML

HERE = pathlib.Path(__file__).parent

args = sys.argv[1:]
indent = "--indent" in args
if indent:
    args.remove("--indent")
text = " ".join(args)

body = markdown.markdown(text, extensions=["extra", "sane_lists"], output_format="html5").strip()
if indent:
    body = f"<ul>{body}</ul>"

html = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>html,body{{margin:0;padding:0}} body{{width:498.24pt; font-size:10pt;}}</style>
</head><body>{body}</body></html>"""

out = pathlib.Path("/tmp/lines.pdf")
HTML(string=html).write_pdf(str(out), stylesheets=[CSS(filename=str(HERE / "cv.css"))])

text_out = subprocess.run(
    ["pdftotext", "-layout", str(out), "-"], capture_output=True, text=True, check=True
).stdout
lines = [ln for ln in text_out.splitlines() if ln.strip()]
print(f"{len(lines)} line(s)")
