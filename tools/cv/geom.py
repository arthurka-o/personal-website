#!/usr/bin/env python3
"""Extract text-run geometry from a WeasyPrint PDF: (page, y_baseline_pt, x_pt, size_pt, color)."""
import re, sys, zlib


def extract(path):
    data = open(path, "rb").read()
    pages = []
    # page content streams: those containing BT/Tj
    streams = re.findall(rb"stream\r?\n(.*?)endstream", data, re.S)
    for s in streams:
        try:
            dec = zlib.decompress(s)
        except Exception:
            continue
        if b" Tf" not in dec or b" Tm" not in dec:
            continue
        txt = dec.decode("latin-1")
        lines = txt.split("\n")
        color = (0, 0, 0)
        runs = []
        for i, ln in enumerate(lines):
            t = ln.strip()
            m = re.match(r"^([\d.]+) ([\d.]+) ([\d.]+) rg$", t)
            if m:
                color = tuple(round(float(x) * 255) for x in m.groups())
                continue
            m = re.match(r"^1 0 0 -1 ([\d.]+) ([\d.]+) Tm$", t)
            if m:
                x, y = float(m.group(1)) * 0.75, float(m.group(2)) * 0.75
                size = 0.0
                for j in range(i + 1, min(i + 4, len(lines))):
                    mm = re.match(r"^/(\w+) ([\d.]+) Tf$", lines[j].strip())
                    if mm:
                        size = float(mm.group(2))
                        break
                runs.append((round(y, 4), round(x, 4), round(size * 0.75, 4), "%02x%02x%02x" % color))
        pages.append(runs)
    return pages


def rules(path):
    """Extract painted rectangles (horizontal rules) as (page, y_top, thickness) in pt."""
    data = open(path, "rb").read()
    out = []
    for s in re.findall(rb"stream\r?\n(.*?)endstream", data, re.S):
        try:
            dec = zlib.decompress(s)
        except Exception:
            continue
        if b" re" not in dec or b" Tf" not in dec:
            continue
        txt = dec.decode("latin-1")
        color = None
        rects = []
        for ln in txt.split("\n"):
            t = ln.strip()
            m = re.match(r"^([\d.]+) ([\d.]+) ([\d.]+) rg$", t)
            if m:
                color = "%02x%02x%02x" % tuple(round(float(x) * 255) for x in m.groups())
            m = re.match(r"^([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+) re$", t)
            if m:
                x, y, w, h = (float(g) for g in m.groups())
                rects.append((round(x * 0.75, 3), round(y * 0.75, 3), round(w * 0.75, 3), round(h * 0.75, 3), color))
        if rects:
            out.append(rects)
    return out


if __name__ == "__main__":
    a = extract(sys.argv[1])
    b = extract(sys.argv[2]) if len(sys.argv) > 2 else None
    if not b:
        for p, runs in enumerate(a, 1):
            print(f"--- page {p} ({len(runs)} runs)")
            for r in runs:
                print(f"  y={r[0]:9.4f} x={r[1]:8.4f} size={r[2]:7.4f} #{r[3]}")
    else:
        for p, (pa, pb) in enumerate(zip(a, b), 1):
            print(f"=== page {p}: target {len(pa)} runs / candidate {len(pb)} runs")
            n = max(len(pa), len(pb))
            for i in range(n):
                ra = pa[i] if i < len(pa) else None
                rb = pb[i] if i < len(pb) else None
                if ra and rb:
                    dy, dx, ds = rb[0] - ra[0], rb[1] - ra[1], rb[2] - ra[2]
                    flag = "" if (abs(dy) < 0.01 and abs(dx) < 0.01 and abs(ds) < 0.01) else "   <<<"
                    print(f"  {i:3d} dy={dy:+8.4f} dx={dx:+8.4f} dsize={ds:+7.4f}   tgt y={ra[0]:9.4f} x={ra[1]:8.4f} s={ra[2]:7.4f} #{ra[3]}{flag}")
                else:
                    print(f"  {i:3d} MISSING  tgt={ra} cand={rb}")
