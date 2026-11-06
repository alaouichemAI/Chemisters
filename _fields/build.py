"""Build one static page per field.

Run from the site root:   python _fields/build.py            (all fields)
                          python _fields/build.py organic-chemistry

Reads   _fields/site.json, _fields/channels.json, _fields/fields/<slug>.json
Writes  <slug>/index.html   (clean URL: chemisters.com/<slug>/)
        og/<slug>.png       (LinkedIn/Facebook share card; needs Pillow)
        data/live/<slug>.json  (created empty once; n8n updates it weekly)
"""
import html, json, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SITE = json.loads((HERE / "site.json").read_text(encoding="utf-8"))
CHANNELS = {c["name"]: c for c in json.loads((HERE / "channels.json").read_text(encoding="utf-8"))}
TEMPLATE = (HERE / "template.html").read_text(encoding="utf-8")
E = lambda s: html.escape(str(s or ""), quote=True)

LI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>'
FB = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/></svg>'


def motif(kind, color):
    """Background pattern as an SVG data URI. Add new shapes here; pick one per field in its JSON."""
    c = color.replace("#", "%23")
    a = "stroke-opacity='0.09' fill='none' stroke-width='1.2'"
    shapes = {
        # benzene-like hexagon grid
        "hexagon": ("84 97", f"<path d='M42 2l38 22v44L42 90 4 68V24z M42 14l28 16v32L42 78 14 62V30z' stroke='{c}' {a}/>"),
        # crystal lattice: dots + bonds
        "lattice": ("60 60", f"<path d='M0 30h60M30 0v60' stroke='{c}' {a}/><circle cx='30' cy='30' r='3' fill='{c}' fill-opacity='0.12'/>"),
        # spectra / waves
        "wave": ("120 40", f"<path d='M0 20c15-18 45-18 60 0s45 18 60 0' stroke='{c}' {a}/>"),
        # electron orbits
        "orbit": ("110 110", f"<ellipse cx='55' cy='55' rx='40' ry='14' stroke='{c}' {a}/><ellipse cx='55' cy='55' rx='14' ry='40' stroke='{c}' {a}/><circle cx='55' cy='55' r='3' fill='{c}' fill-opacity='0.14'/>"),
        # data grid
        "grid": ("40 40", f"<path d='M40 0H0v40' stroke='{c}' {a}/>"),
        # chain / polymer
        "chain": ("80 40", f"<path d='M0 30l20-20 20 20 20-20 20 20' stroke='{c}' {a}/>"),
        # dots / particles
        "dots": ("36 36", f"<circle cx='18' cy='18' r='2' fill='{c}' fill-opacity='0.16'/>"),
        # double helix
        "helix": ("60 120", f"<path d='M10 0c40 30 40 30 0 60s-40 30 0 60M50 0c-40 30-40 30 0 60s40 30 0 60' stroke='{c}' {a}/>"),
        # circuit traces
        "circuit": ("80 80", f"<path d='M0 20h30l10 10v30h40M40 0v10M60 80V60h20' stroke='{c}' {a}/><circle cx='40' cy='60' r='3' fill='{c}' fill-opacity='0.14'/>"),
        # concentric rings
        "rings": ("90 90", f"<circle cx='45' cy='45' r='14' stroke='{c}' {a}/><circle cx='45' cy='45' r='30' stroke='{c}' {a}/>"),
        # triangles
        "triangles": ("70 60", f"<path d='M35 6l29 50H6z' stroke='{c}' {a}/>"),
        # zigzag (alkane chain)
        "zigzag": ("100 50", f"<path d='M0 35l17-20 17 20 17-20 17 20 17-20 15 20' stroke='{c}' {a}/>"),
        # ball and stick
        "bonds": ("90 90", f"<path d='M20 20l25 25 25-15M45 45v30' stroke='{c}' {a}/><circle cx='45' cy='45' r='5' fill='{c}' fill-opacity='0.12'/><circle cx='20' cy='20' r='3.5' fill='{c}' fill-opacity='0.12'/><circle cx='70' cy='30' r='3.5' fill='{c}' fill-opacity='0.12'/>"),
        # drops
        "drops": ("60 70", f"<path d='M30 12c10 14 14 22 14 30a14 14 0 0 1-28 0c0-8 4-16 14-30z' stroke='{c}' {a}/>"),
        # spark / star
        "spark": ("80 80", f"<path d='M40 22v36M22 40h36M28 28l24 24M52 28L28 52' stroke='{c}' {a}/>"),
    }
    size, body = shapes.get(kind, shapes["grid"])
    w, h = size.split()
    svg = f"<svg xmlns='http://www.w3.org/2000/svg' width='{w}' height='{h}'>{body}</svg>"
    return "data:image/svg+xml;utf8," + svg.replace("<", "%3C").replace(">", "%3E").replace('"', "'"), f"{w}px {h}px"


def follow_html(ch, name, small=False):
    out = []
    if ch.get("linkedin"):
        out.append(f'<a class="btn li" href="{E(ch["linkedin"])}" target="_blank" rel="noopener" aria-label="Follow {E(name)} on LinkedIn">{LI}{"LinkedIn" if small else "Follow on LinkedIn"}</a>')
    if ch.get("facebook"):
        out.append(f'<a class="btn fb" href="{E(ch["facebook"])}" target="_blank" rel="noopener" aria-label="Follow {E(name)} on Facebook">{FB}{"Facebook" if small else "Follow on Facebook"}</a>')
    return "".join(out)


def chips(ch, own_page=None):
    out = []
    if own_page:
        out.append(f'<a class="chip pg" href="/{own_page}/">Explore →</a>')
    if ch.get("linkedin"):
        out.append(f'<a class="chip li" href="{E(ch["linkedin"])}" target="_blank" rel="noopener">{LI}Follow</a>')
    if ch.get("facebook"):
        out.append(f'<a class="chip fb" href="{E(ch["facebook"])}" target="_blank" rel="noopener">{FB}Follow</a>')
    return "".join(out)


def _asset_version():
    import hashlib
    h = hashlib.md5()
    for name in ("field.css", "field.js"):
        p = ROOT / "assets" / name
        if p.exists():
            h.update(p.read_bytes())
    return h.hexdigest()[:8]


ASSET_V = _asset_version()


def analytics():
    """Optional GoatCounter (free): put your code in site.json, e.g. "goatcounter": "chemisters"."""
    code = SITE.get("goatcounter", "").strip()
    if not code:
        return ""
    return f'<script data-goatcounter="https://{E(code)}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>'


def labels(f):
    """Section headings. A field JSON can override any of them in "labels" (useful for pages that are not a field)."""
    n = E(f["name"])
    d = {"L_FIELD_EYEBROW": "What it is", "L_FIELD": "The field in one minute",
         "L_MAP_EYEBROW": "Branches", "L_MAP": f"The map of {n}",
         "L_MAP_SUB": "Each branch is a world of its own. Several have their own Chemisters page — follow the ones you care about.",
         "L_HIST_EYEBROW": "History", "L_HIST": f"How {n} got here"}
    for k, v in (f.get("labels") or {}).items():
        d["L_" + k.upper()] = E(v)
    return d


def built_pages():
    return {p.stem for p in (HERE / "fields").glob("*.json")}


def og_image(f, out, cta="Follow on LinkedIn & Facebook"):
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        print("  (Pillow not installed: skipped share image)")
        return False
    W, H = 1200, 627
    acc = f["theme"]["accent"]
    hexc = lambda s: tuple(int(s.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4))
    A, T = hexc(acc), hexc(f["theme"].get("tile", "#15213d"))
    img = Image.new("RGB", (W, H), (10, 15, 30))
    d = ImageDraw.Draw(img)
    for r in range(420, 0, -6):  # soft glow
        k = (1 - r / 420) * 0.35
        d.ellipse([260 - r, 300 - r, 260 + r, 300 + r], fill=tuple(int(b + (a - b) * k * 0.6) for a, b in zip(A, (10, 15, 30))))
    fdir = HERE / "fonts"
    def font(s, bold=False):
        f = fdir / ("InterDisplay-SemiBold.otf" if bold else "Inter-Medium.otf")
        try:
            return ImageFont.truetype(str(f), s)
        except Exception:
            return ImageFont.load_default(size=s)
    d.rounded_rectangle([90, 150, 420, 480], 36, fill=T, outline=A, width=3)
    d.text((118, 172), str(f["number"]), font=font(34), fill=A)
    d.text((112, 268), f["symbol"], font=font(150, True), fill=tuple(min(255, a + 70) for a in A))
    d.text((480, 160), f["category"].upper(), font=font(28), fill=A)
    # title: one line if it fits at >= 58 px, otherwise two lines at <= 56 px
    name, maxw = f["name"], 650
    lines, size = [name], None
    for sz in (78, 70, 64, 58):
        if d.textlength(name, font=font(sz, True)) <= maxw:
            size = sz
            break
    if size is None:
        for sz in (56, 50, 44, 40):
            words, lines, cur = name.split(), [], ""
            for w in words:
                t = (cur + " " + w).strip()
                if d.textlength(t, font=font(sz, True)) <= maxw or not cur:
                    cur = t
                else:
                    lines.append(cur); cur = w
            lines.append(cur)
            size = sz
            if len(lines) <= 2 and all(d.textlength(l, font=font(sz, True)) <= maxw for l in lines):
                break
    y = 212 if len(lines) == 1 else 200
    for l in lines:
        d.text((480, y), l, font=font(size, True), fill=(240, 244, 252)); y += int(size * 1.15)
    d.text((480, y + 16), " · ".join(f.get("posts_about", [])), font=font(26), fill=(170, 180, 205))
    d.rounded_rectangle([480, 400, 1100, 470], 16, fill=A)
    d.text((510, 419), cta, font=font(30, True), fill=(10, 15, 30))
    d.text((90, 545), "chemisters.com", font=font(30), fill=(150, 160, 190))
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, optimize=True)
    return True


def build(slug):
    f = json.loads((HERE / "fields" / f"{slug}.json").read_text(encoding="utf-8"))
    ch = CHANNELS.get(f["channel"], {})
    if not ch:
        print(f"  WARNING: '{f['channel']}' not found in channels.json — no follow links")
    base = SITE["base_url"].rstrip("/")
    url = f"{base}/{slug}/"
    pages = built_pages()
    th = f["theme"]
    motif_uri, motif_size = motif(th.get("motif", "grid"), th["accent"])

    facts = "".join(f'<div class="fact"><b{" class=long" if len(str(x["value"])) > 11 else ""}>{E(x["value"])}</b><span>{E(x["label"])}</span></div>' for x in f["definition"]["facts"])
    branches = []
    for b in f["branches"]:
        bc = CHANNELS.get(b.get("channel") or "", {})
        own = bc.get("slug") if bc.get("slug") in pages and bc.get("slug") != slug else None
        foot = f'<div class="ch">{chips(bc, own)}</div>' if bc else ""
        branches.append(f'<article class="br"><h3>{E(b["name"])}</h3><p>{E(b["summary"])}</p><p class="ex">{E(b["example"])}</p>{foot}</article>')
    # "What are you into?" picker: branch pages + related pages; related ones are shown by default
    picks = {}
    for b in f["branches"]:
        bc = CHANNELS.get(b.get("channel") or "")
        if bc and bc["slug"] != slug and (bc.get("linkedin") or bc.get("facebook")):
            picks.setdefault(bc["slug"], [b["name"], bc, False])
    for name in f.get("related", []):
        rc = CHANNELS.get(name)
        if rc and rc["slug"] != slug and (rc.get("linkedin") or rc.get("facebook")):
            picks.setdefault(rc["slug"], [rc["name"], rc, False])[2] = True
    pick_chips = "".join(f'<button type="button" class="pk-chip" data-k="{k}" aria-pressed="false">{E(lbl)}</button>' for k, (lbl, _, _) in picks.items())
    pick_cards = "".join(
        f'<article class="br pk-card{" on" if dflt else ""}" data-k="{k}"{" data-def" if dflt else ""}><h3>{E(c["name"])}</h3><p>{E(c["desc"])}</p>'
        f'<div class="ch">{chips(c, c["slug"] if c["slug"] in pages else None)}</div></article>'
        for k, (_, c, dflt) in picks.items())

    og_rel = f"og/{slug}.png"
    og_image(f, ROOT / og_rel, "Follow on LinkedIn & Facebook" if (ch.get("linkedin") and ch.get("facebook")) else "Follow on LinkedIn" if ch.get("linkedin") else "Follow on Facebook" if ch.get("facebook") else "Explore on chemisters.com")
    jsonld = {
        "@context": "https://schema.org", "@type": "WebPage", "name": f"{f['name']} | Chemisters", "url": url,
        "description": f["seo_description"], "about": {"@type": "Thing", "name": f["name"]},
        "isPartOf": {"@type": "WebSite", "name": "Chemisters", "url": base + "/"},
        "publisher": {"@type": "Organization", "name": "Chemisters", "url": base + "/",
                      "sameAs": [u for u in (ch.get("linkedin"), ch.get("facebook")) if u]},
    }
    data = {k: f[k] for k in ("slug", "name", "symbol", "number", "timeline", "branches", "quiz")}
    data.update(url=url, icons={"li": LI, "fb": FB}, followHtml=follow_html(ch, f["name"]))
    safe_json = lambda o: json.dumps(o, ensure_ascii=False).replace("</", "<\\/")

    gets = f.get("posts_about", [])
    gl = [gets[0]] + [g[:1].lower() + g[1:] for g in gets[1:]] if gets else []
    rep = {
        "SEO_TITLE": E(f["seo_title"]), "SEO_DESC": E(f["seo_description"]), "URL": E(url),
        "OG_IMAGE": E(f"{base}/{og_rel}"), "JSONLD": safe_json(jsonld),
        "ACCENT": th["accent"], "ACCENT2": th.get("accent2", th["accent"]), "TILE": th.get("tile", "#15213d"),
        "MOTIF": motif_uri, "MOTIF_SIZE": motif_size,
        "NAME": E(f["name"]), "NUMBER": E(f["number"]), "SYMBOL": E(f["symbol"]), "CATEGORY": E(f["category"]),
        "TAGLINE": E(f["tagline"]), "GETS": "".join(f"<span>{E(g)}</span>" for g in gets),
        "GETS_TEXT": E(", ".join(gl[:-1]) + (" and " + gl[-1] if len(gl) > 1 else "".join(gl))),
        "FOLLOW": follow_html(ch, f["name"]), "FOLLOW_SMALL": follow_html(ch, f["name"], small=True),
        "PUBLISH_URL": E(SITE.get("publish_url", "/")),
        "DEF_LEAD": E(f["definition"]["lead"]), "DEF_BODY": E(f["definition"]["body"]), "FACTS": facts,
        **labels(f), "STICKY_CLS": "" if (ch.get("linkedin") or ch.get("facebook")) else " none",
        "CTA_HIDDEN": "" if (ch.get("linkedin") or ch.get("facebook")) else " hidden",
        "BRANCHES": "".join(branches), "PICK_CHIPS": pick_chips, "PICK_CARDS": pick_cards, "DATA": safe_json(data),
        "ASSET_V": ASSET_V, "ANALYTICS": analytics(),
    }
    page = TEMPLATE
    for k, v in rep.items():
        page = page.replace("{{" + k + "}}", str(v))
    if not picks:
        page = page.replace('<section id="picker">', '<section id="picker" hidden>')

    out = ROOT / slug / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding="utf-8")
    live = ROOT / "data" / "live" / f"{slug}.json"
    if not live.exists():
        live.parent.mkdir(parents=True, exist_ok=True)
        live.write_text(json.dumps({"updated": None, "top_posts": [], "papers": [], "quiz": []}, indent=2), encoding="utf-8")
    print(f"  built /{slug}/  ({len(page) // 1024} KB)")


if __name__ == "__main__":
    slugs = sys.argv[1:] or sorted(built_pages())
    for s in slugs:
        build(s)
