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


def built_pages():
    return {p.stem for p in (HERE / "fields").glob("*.json")}


def og_image(f, out):
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
    font = lambda s: ImageFont.load_default(size=s)
    d.rounded_rectangle([90, 150, 420, 480], 36, fill=T, outline=A, width=3)
    d.text((118, 172), str(f["number"]), font=font(34), fill=A)
    d.text((118, 270), f["symbol"], font=font(150), fill=tuple(min(255, a + 70) for a in A))
    d.text((480, 160), f["category"].upper(), font=font(28), fill=A)
    name = f["name"]
    size = 78 if len(name) < 20 else 60 if len(name) < 28 else 46
    d.text((480, 205), name, font=font(size), fill=(240, 244, 252))
    d.text((480, 205 + size + 30), " · ".join(f.get("posts_about", [])), font=font(30), fill=(170, 180, 205))
    d.rounded_rectangle([480, 400, 1100, 470], 16, fill=A)
    d.text((510, 418), "Follow on LinkedIn & Facebook", font=font(32), fill=(10, 15, 30))
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

    facts = "".join(f'<div class="fact"><b>{E(x["value"])}</b><span>{E(x["label"])}</span></div>' for x in f["definition"]["facts"])
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
    og_image(f, ROOT / og_rel)
    jsonld = {
        "@context": "https://schema.org", "@type": "WebPage", "name": f"{f['name']} | Chemisters", "url": url,
        "description": f["seo_description"], "about": {"@type": "Thing", "name": f["name"]},
        "isPartOf": {"@type": "WebSite", "name": "Chemisters", "url": base + "/"},
        "publisher": {"@type": "Organization", "name": "Chemisters", "url": base + "/",
                      "sameAs": [u for u in (ch.get("linkedin"), ch.get("facebook")) if u]},
    }
    data = {k: f[k] for k in ("slug", "name", "timeline", "branches", "quiz")}
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
