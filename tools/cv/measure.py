#!/usr/bin/env python3
"""Measure a built CV PDF: page count, and where each page's content ends.

The two-page fit is a hard constraint in DESIGN.md, and a revision that spills
onto a third page is the failure mode this script exists to catch before the
PDF is committed. Prints the free space at the bottom of each page, so a trim
can be sized instead of guessed at.

    python3 tools/cv/measure.py [pdf]
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
import geom  # noqa: E402

# The content box ends here: A4 is 841.89pt tall, and the vertical margin is
# 1.5cm (42.52pt). DESIGN.md §2.
BOX_BOTTOM = 799.37

path = sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).parent.parent.parent / "cv.pdf"
pages = geom.extract(str(path))

print(f"{path}: {len(pages)} pages")
for i, runs in enumerate(pages, 1):
    if not runs:
        continue
    last = max(r[0] for r in runs)
    # A text baseline sits roughly 2.6pt above the bottom of its line box.
    bottom = last + 2.6
    print(f"  page {i}: last baseline {last:8.2f}  content ends {bottom:8.2f}  free {BOX_BOTTOM - bottom:7.2f}pt")
