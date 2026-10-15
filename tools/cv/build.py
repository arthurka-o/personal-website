#!/usr/bin/env python3
"""Arthur Galiullin — CV build.

markdown -> HTML (python-markdown) -> PDF (WeasyPrint), using cv.css.

    python3 build.py [input.md] [output.pdf] [--html]

With no arguments it rebuilds the site's cv.pdf in the repository root from the
markdown in this folder, which is the source of truth. The copy on the Desktop
is for convenience and has to be refreshed by hand if you edit there instead.

The design behind cv.css is documented in DESIGN.md, next to this file. WeasyPrint's Pango
text layout decides line breaks, so the version matters — this was built and verified
against WeasyPrint 69.0.

Document metadata is set from constants below rather than scraped out of the markdown,
so a wording change in the CV cannot silently desync the metadata from the page. WeasyPrint
maps the <title>/<meta> tags onto the standard PDF /Info keys and writes the root `lang`
into the catalog's /Lang; `custom_metadata` adds the non-standard keys some parsers read.
"""
import pathlib
import sys

import markdown
from weasyprint import CSS, HTML

HERE = pathlib.Path(__file__).parent
REPO = HERE.parent.parent

args = [a for a in sys.argv[1:] if a != "--html"]
keep_html = "--html" in sys.argv[1:]

# Defaults: the markdown in this folder is the source of truth, and the site's copy
# of the PDF is what the build refreshes. Both can be overridden.
md_path = pathlib.Path(args[0]) if args else HERE / "Arthur_Galiullin_CV.md"
out_path = pathlib.Path(args[1]) if len(args) > 1 else REPO / "cv.pdf"

# Keep in step with the header of Arthur_Galiullin_CV.md.
NAME = "Arthur Galiullin"
ROLE = "Solidity / Protocol Engineer"
LOCATION = "Warsaw, Poland (Remote)"
LANG = "en-GB"
DESCRIPTION = (
    f"{NAME} — {ROLE}, {LOCATION}. Four years of Solidity and eight years of production "
    "engineering. Core engineer on Overlay, an exotic perps DEX on BSC, from testnet to "
    "TGE ($2.9M raised, Polychain Capital, 1kx, ParaFi). Before that, Solidity developer "
    "on KUMO, a carbon-credit lending protocol selected for the ABN AMRO and Techstars "
    "Future of Finance Accelerator. Smart contracts, oracle and collateral risk design, "
    "on-chain plus off-chain protocol systems, and the data layer around them. Twice a "
    "hackathon prize winner: ETHGlobal Prague 2025 and ETHWarsaw 2025."
)
KEYWORDS = (
    "Solidity, Smart Contract Engineer, Protocol Engineer, DeFi, EVM, perps DEX, lending "
    "protocol, Foundry, Hardhat, UUPS, Diamond Pattern, EIP-2535, OpenZeppelin, Safe, Zodiac, "
    "Chainlink, Tellor, Merkle trees, LayerZero, invariant testing, Chimera, The Graph, "
    "subgraph, TypeScript, Node.js, MongoDB, PostgreSQL, React, Next.js, Ruby on Rails, "
    "AWS, Docker, Web3, blockchain, Warsaw"
)

body = markdown.markdown(
    md_path.read_text(encoding="utf-8"),
    extensions=["extra", "sane_lists"],
    output_format="html5",
)
doc = f"""<!DOCTYPE html>
<html lang="{LANG}"><head><meta charset="utf-8">
<title>{NAME} — {ROLE} — CV</title>
<meta name="author" content="{NAME}">
<meta name="description" content="{DESCRIPTION}">
<meta name="keywords" content="{KEYWORDS}">
<meta name="generator" content="cvless">
<meta name="role" content="{ROLE}">
<meta name="location" content="{LOCATION}">
<meta name="source" content="https://arthurka.eu">
</head>
<body>{body}</body></html>"""

# WeasyPrint lays out this HTML, so --html writes it next to the PDF when a layout
# problem needs debugging.
if keep_html:
    out_path.with_suffix(".html").write_text(doc, encoding="utf-8")

HTML(string=doc, base_url=str(HERE)).write_pdf(
    str(out_path),
    stylesheets=[CSS(filename=str(HERE / "cv.css"))],
    # Stores the non-standard <meta> tags above as /Info keys, sanitised to alphanumerics.
    custom_metadata=True,
)
print("wrote", out_path)
