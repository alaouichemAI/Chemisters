#!/usr/bin/env python3
"""
Chemisters site builder. Run it from the site's root folder every time you
add, rename or change a page in the PAGES list of index.html:

    pip install pillow
    python tools/build_site.py

It reads PAGES, PICKER and PLATFORMS straight from index.html, plus the field
texts in tools/fields.json (nothing else to keep in sync), and writes:

  <slug>/index.html      the element page for every field, e.g. chemisters.com/electrochemistry/
                         (follow buttons, what the field covers, latest posts, close fields,
                         the rest of its area, previous/next element), from tools/element_template.html
  assets/og/<slug>.png   1200x630 preview image for each page
  sitemap.xml            every page, for Google (robots.txt is created if you don't have one)
  badge/<slug>.svg       "Featured on Chemisters" badge for researchers
  badge/index.html       badge gallery with copy-paste code
  data/pages.json        page list used by the badge gallery and the n8n live-data workflow

Fonts: it uses assets/fonts/unbounded + figtree if your Pillow can read them,
otherwise any system font it finds. Pass --display / --body to force TTF files.
"""
import argparse
import html
import json
import math
import os
import re
import sys

SITE = "https://chemisters.com"
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# ---------------------------------------------------------------- read index.html
def read_index():
    with open(os.path.join(ROOT, "index.html"), encoding="utf-8") as f:
        src = f.read()
    colors = dict(re.findall(r"--(core|synthetic|applied|bio|comp|materials|community):\s*(#[0-9a-fA-F]{6})", src))
    areas = re.search(r"const AREAS = (\[.*?\n\]);", src, re.S).group(1)
    pages = re.search(r"const PAGES = (\[.*?\n\]);", src, re.S).group(1)

    def js_to_json(block):
        lines = [l for l in block.splitlines() if not l.strip().startswith("//")]
        block = "\n".join(lines)
        block = re.sub(r'([{,]\s*)([A-Za-z_]\w*)\s*:', r'\1"\2":', block)
        block = re.sub(r",\s*([}\]])", r"\1", block)
        return json.loads(block)

    picker = re.search(r"const PICKER = (\{.*?\n\});", src, re.S).group(1)
    platforms = {k: {"name": n, "color": c, "svg": svg} for k, n, c, svg in
                 re.findall(r'(\w+): \{ name: "([^"]+)", color: "([^"]+)", svg: \'([^\']*)\' \}', src)}
    areas = js_to_json(areas)
    pages = js_to_json(pages)
    picker = js_to_json(picker)
    return colors, areas, pages, picker, platforms


def slugify(t):
    import unicodedata
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    t = t.replace("&", "and")
    t = re.sub(r"[^a-z0-9]+", "-", t)
    return t.strip("-")


# ---------------------------------------------------------------- fonts
def find_font(preferred, weight_hint):
    from PIL import ImageFont
    candidates = list(preferred) + [
        f"/usr/share/fonts/opentype/inter/Inter-{weight_hint}.otf",
        f"/usr/share/fonts/opentype/inter/InterDisplay-{weight_hint}.otf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if weight_hint != "Regular" else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "C:/Windows/Fonts/segoeuib.ttf" if weight_hint != "Regular" else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if weight_hint != "Regular" else "C:/Windows/Fonts/arial.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if weight_hint != "Regular" else "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]
    for c in candidates:
        if c and os.path.exists(c):
            try:
                ImageFont.truetype(c, 20)
                return c
            except Exception:
                continue
    return None


def font(path, size, variation=None):
    from PIL import ImageFont
    if not path:
        return ImageFont.load_default(size=size)
    f = ImageFont.truetype(path, size)
    if variation:
        try:
            f.set_variation_by_axes([variation])
        except Exception:
            pass
    return f


# ---------------------------------------------------------------- preview images
def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    return tuple(round(a[i] * (1 - t) + b[i] * t) for i in range(3))


def wrap(draw, text, fnt, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=fnt) <= width:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def og_image(p, area_label, color, platforms, fonts, logo, out):
    from PIL import Image, ImageDraw, ImageFilter
    W, H = 1200, 630
    night, night2, glow, mist = (7, 11, 22), (12, 19, 36), (233, 238, 252), (147, 160, 191)
    c = hex_rgb(color)
    img = Image.new("RGB", (W, H), night)
    d = ImageDraw.Draw(img)
    # background glow + bench grid
    halo = Image.new("RGB", (W, H), night)
    hd = ImageDraw.Draw(halo)
    hd.ellipse((-160, -200, 620, 640), fill=mix(night, c, .32))
    halo = halo.filter(ImageFilter.GaussianBlur(120))
    img = Image.blend(img, halo, 1)
    d = ImageDraw.Draw(img)
    for x in range(0, W, 44):
        d.line([(x, 0), (x, H)], fill=(16, 22, 38))
    for y in range(0, H, 44):
        d.line([(0, y), (W, y)], fill=(16, 22, 38))

    # the element tile
    tx, ty, tw, th = 80, 120, 340, 370
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((tx - 10, ty - 10, tx + tw + 10, ty + th + 10), 40, fill=c + (110,))
    shadow = shadow.filter(ImageFilter.GaussianBlur(34))
    img.paste(shadow, (0, 0), shadow)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((tx, ty, tx + tw, ty + th), 30, fill=mix(night2, c, .26), outline=mix(night2, c, .75), width=3)
    d.text((tx + 30, ty + 26), str(p["z"]), font=font(fonts["mono"], 34), fill=mix(c, (255, 255, 255), .55))
    sym_f = font(fonts["display"], 170, 800)
    d.text((tx + 28, ty + 92), p["sym"], font=sym_f, fill=mix(c, (255, 255, 255), .45))
    small = font(fonts["body"], 24)
    name_lines = wrap(d, p["name"], small, tw - 60)[:2]
    for i, ln in enumerate(name_lines):
        d.text((tx + 30, ty + th - 36 - (len(name_lines) - i) * 30), ln, font=small, fill=(213, 220, 240))
    # platform dots
    for i in range(platforms):
        d.ellipse((tx + tw - 44 - i * 22, ty + 32, tx + tw - 30 - i * 22, ty + 46), fill=c)

    # text side
    x0, maxw = 490, W - 490 - 70
    d.text((x0, 128), area_label.upper(), font=font(fonts["mono"], 24), fill=c)
    title_f = font(fonts["display"], 58, 800)
    lines = wrap(d, p["name"], title_f, maxw)
    if len(lines) > 2:
        title_f = font(fonts["display"], 46, 800)
        lines = wrap(d, p["name"], title_f, maxw)[:3]
    y = 172
    for ln in lines:
        d.text((x0, y), ln, font=title_f, fill=glow)
        y += int(title_f.size * 1.12)
    desc_f = font(fonts["body"], 29)
    y += 18
    for ln in wrap(d, p["desc"], desc_f, maxw)[:3]:
        d.text((x0, y), ln, font=desc_f, fill=(185, 195, 221))
        y += 40
    # footer
    d.text((x0, H - 100), "Follow this page", font=font(fonts["display"], 26, 700), fill=glow)
    d.text((x0, H - 62), "chemisters.com", font=font(fonts["mono"], 24), fill=mist)
    right = W - 70
    if logo:
        try:
            lg = Image.open(logo).convert("RGBA").resize((64, 64))
            mask = Image.new("L", (64, 64), 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, 63, 63), 16, fill=255)
            img.paste(lg, (W - 70 - 64, 52), mask)
            right = W - 70 - 64 - 16
        except Exception:
            pass
    d.text((right, 70), "Chemisters", font=font(fonts["display"], 26, 700), fill=glow, anchor="ra")
    img.save(out, "PNG", optimize=True)


# ---------------------------------------------------------------- badges
def badge_svg(p, color):
    name = p["name"]
    w = max(250, int(64 + 9 + len(name) * 7.6 + 20))
    e = html.escape
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="56" viewBox="0 0 {w} 56" role="img" aria-label="Featured on Chemisters: {e(name)}">
  <title>Featured on Chemisters: {e(name)}</title>
  <rect width="{w}" height="56" rx="12" fill="#0c1324"/>
  <rect x=".5" y=".5" width="{w - 1}" height="55" rx="11.5" fill="none" stroke="{color}" stroke-opacity=".55"/>
  <rect x="8" y="8" width="40" height="40" rx="8" fill="{color}" fill-opacity=".22" stroke="{color}" stroke-opacity=".8"/>
  <text x="13" y="20" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="8" fill="{color}">{p["z"]}</text>
  <text x="13" y="41" font-family="Arial Black,Arial,Helvetica,sans-serif" font-weight="900" font-size="17" fill="#ffffff">{e(p["sym"])}</text>
  <text x="60" y="23" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="9.5" letter-spacing="1.2" fill="#93a0bf">FEATURED ON CHEMISTERS</text>
  <text x="60" y="41" font-family="-apple-system,Segoe UI,Helvetica,Arial,sans-serif" font-weight="700" font-size="14" fill="#e9eefc">{e(name)}</text>
</svg>
'''


# ---------------------------------------------------------------- element pages
def has_links(p):
    return any(v for v in (p.get("links") or {}).values())


def related(p, ordered, picker, n=3):
    """Same rule as assets/follow-kit.js: shared picker groups, then same area, then table neighbours."""
    score = {}
    for g in picker.get("work", []) + picker.get("feed", []):
        if p["sym"] in g["syms"]:
            for s_ in g["syms"]:
                if s_ != p["sym"]:
                    score[s_] = score.get(s_, 0) + 1
    for q in ordered:
        if q["sym"] == p["sym"]:
            continue
        if q["area"] == p["area"]:
            score[q["sym"]] = score.get(q["sym"], 0) + 0.6
        if abs(q["z"] - p["z"]) == 1:
            score[q["sym"]] = score.get(q["sym"], 0) + 0.2
    cands = [q for q in ordered if score.get(q["sym"]) and has_links(q)]
    cands.sort(key=lambda q: (-score[q["sym"]], abs(q["z"] - p["z"])))
    return cands[:n]


def follow_links(p, platforms, compact=False, sticky=False):
    e = html.escape
    out = []
    for k, u in (p.get("links") or {}).items():
        if not u:
            continue
        pf = platforms.get(k, {"name": k.capitalize(), "color": "#4b5563", "svg": ""})
        label = e(pf["name"]) if compact else (f'<span><span class="t">Follow on </span>{e(pf["name"])}</span>' if sticky else f"Follow on {e(pf['name'])}")
        out.append(f'<a href="{e(u)}" target="_blank" rel="noopener" style="--pc:{pf["color"]}" data-follow-slug="{p["slug"]}" data-follow-platform="{e(k)}" '
                   f'data-umami-event="follow" data-umami-event-page="{p["slug"]}" data-umami-event-platform="{e(k)}" aria-label="Follow {e(p["name"])} on {e(pf["name"])}">{pf["svg"]}{label}</a>')
    return "".join(out)


def mini(q, cls="mini", href=True):
    e = html.escape
    inner = f'<img src="/{e(q["logo"])}" alt="">' if q.get("logo") else f'<i>{q["z"]}</i><b>{e(q["sym"])}</b>'
    if href:
        return f'<a class="{cls}" href="/{q["slug"]}/" style="--fc: var(--{q["area"]})" data-got="{q["slug"]}" title="{e(q["name"])}" aria-label="{e(q["name"])}">{inner}</a>'
    return f'<span class="{cls}" style="--fc: var(--{q["area"]})" data-got="{q["slug"]}" aria-hidden="true">{inner}</span>'


def element_page(tpl, p, area_label, ordered, picker, platforms, fields, data_json):
    e = html.escape
    f = fields.get(p["slug"], {})
    about = f.get("about") or p["desc"]
    branches = f.get("branches") or []
    url = f"{SITE}/{p['slug']}/"
    desc_meta = f"{p['desc']} Follow the {p['name']} page on Chemisters."
    links = follow_links(p, platforms)
    follow = f'<div class="follow">{links}</div>' if links else '<p class="soon">This page is being set up. Follow the main Chemisters accounts in the meantime.</p>'
    sticky = f'<div class="follow">{follow_links(p, platforms, sticky=True)}</div>' if links else ""

    rel = related(p, ordered, picker)
    rel_html = "".join(
        f'<article class="rc" style="--fc: var(--{q["area"]})"><div class="rc-top">{mini(q)}<h3><a href="/{q["slug"]}/">{e(q["name"])}</a></h3></div>'
        f'<p>{e(q["desc"])}</p><span class="gotl" data-got-line="{q["slug"]}" hidden>✓ In your table</span><div class="fk-btns">{follow_links(q, platforms, compact=True)}</div></article>'
        for q in rel)
    same = [q for q in ordered if q["area"] == p["area"] and q["slug"] != p["slug"]]
    tiles = "".join(mini(q) for q in same) + '<a class="mini next" href="mailto:contact@chemisters.com?subject=A%20field%20for%20Chemisters" title="Suggest a field"><i>+</i><b>?</b></a>'
    idx = ordered.index(p)
    prev = ordered[idx - 1] if idx > 0 else None
    nxt = ordered[idx + 1] if idx + 1 < len(ordered) else None
    prev_html = f'<a class="pv" href="/{prev["slug"]}/">{mini(prev, href=False)}<span><small>Previous</small><b>{e(prev["name"])}</b></span></a>' if prev else "<span></span>"
    next_html = f'<a class="nx" href="/{nxt["slug"]}/"><span><small>Next</small><b>{e(nxt["name"])}</b></span>{mini(nxt, href=False)}</a>' if nxt else ""
    guide = f'<a class="guide" href="/{e(p["page"])}">Read the full field guide →</a>' if p.get("page") else ""
    sym_html = f'<img src="/{e(p["logo"])}" alt="">' if p.get("logo") else e(p["sym"])
    jsonld = json.dumps({
        "@context": "https://schema.org", "@type": "WebPage", "name": f"{p['name']} · Chemisters", "url": url,
        "description": p["desc"], "about": p["name"],
        "isPartOf": {"@type": "WebSite", "name": "Chemisters", "url": SITE + "/"},
        "breadcrumb": {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Chemisters", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": p["name"], "item": url}]}
    }, ensure_ascii=False)
    vals = {
        "TITLE": e(f"{p['name']} · Chemisters"), "DESC_META": e(desc_meta), "URL": url,
        "OG_IMAGE": f"{SITE}/assets/og/{p['slug']}.png", "OG_ALT": e(f"{p['name']}: {area_label}, a Chemisters page"),
        "AREA_ID": p["area"], "AREA_LABEL": e(area_label), "Z": str(p["z"]), "SYM_HTML": sym_html, "SYM": e(p["sym"]),
        "NAME": e(p["name"]), "DESC": e(p["desc"]), "FOLLOW": follow, "STICKY_FOLLOW": sticky,
        "ABOUT": e(about), "BRANCHES": "".join(f"<span>{e(b)}</span>" for b in branches), "GUIDE_LINK": guide,
        "RELATED": rel_html, "AREA_TILES": tiles, "PREV": prev_html, "NEXT": next_html,
        "JSONLD": jsonld.replace("</", "<\\/"), "DATA_JSON": data_json.replace("{{ME}}", p["slug"]),
    }
    out = tpl
    for k, v in vals.items():
        out = out.replace("{{" + k + "}}", v)
    left = re.findall(r"\{\{[A-Z_]+\}\}", out)
    if left:
        sys.exit(f"Template placeholders not filled: {set(left)}")
    return out, [q["slug"] for q in rel]


def badge_gallery(items):
    data = json.dumps(items, ensure_ascii=False)
    return '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Researcher badges · Chemisters</title>
<meta name="description" content="Was your work featured on a Chemisters page? Add the badge to your lab site, profile or email signature.">
<meta name="robots" content="noindex, follow">
<link rel="icon" type="image/png" href="../images/Chemisters_logo.png">
<style>
:root{--night:#070b16;--night-2:#0c1324;--line:#1f2a45;--glow:#e9eefc;--mist:#93a0bf;--accent:#3b6cf6}
*{box-sizing:border-box}body{margin:0;background:var(--night);color:var(--glow);font:16px/1.6 -apple-system,"Segoe UI",Helvetica,Arial,sans-serif}
.wrap{max-width:900px;margin:0 auto;padding:56px 20px 80px}
a{color:#9db7ff}h1{font-size:clamp(28px,5vw,42px);line-height:1.1;margin:10px 0 12px;letter-spacing:-.02em}
.top{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--glow);font-weight:800}
.top img{width:32px;height:32px;border-radius:8px}
p.lead{color:#b9c3dd;max-width:62ch;margin:0 0 26px}
input{width:100%;font:inherit;color:var(--glow);background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:12px;padding:12px 14px;outline:none;margin-bottom:18px}
input:focus{border-color:#5a6c99}
.b{display:grid;gap:12px;padding:18px;border:1px solid var(--line);border-radius:16px;background:var(--night-2);margin-bottom:12px}
.b img{max-width:100%;height:auto}
.b code{display:block;font:12.5px/1.5 ui-monospace,Menlo,Consolas,monospace;color:#cfd8f2;background:#070b16;border:1px solid var(--line);border-radius:10px;padding:10px 12px;white-space:pre-wrap;word-break:break-all}
.row{display:flex;flex-wrap:wrap;gap:8px}
button,.dl{font-family:inherit;font-size:14px;font-weight:600;line-height:1;border:1px solid var(--line);background:rgba(255,255,255,.05);color:var(--glow);padding:9px 13px;border-radius:10px;cursor:pointer;text-decoration:none}
button:hover,.dl:hover{border-color:#5a6c99}
.note{color:var(--mist);font-size:14px;margin-top:30px}
</style>
</head>
<body>
<div class="wrap">
  <a class="top" href="../"><img src="../images/Chemisters_logo.png" alt="">Chemisters</a>
  <h1>Featured on Chemisters</h1>
  <p class="lead">If your work was featured on one of our pages, add this badge to your lab website, personal page or email signature. It links to the page where your work was published.</p>
  <input id="q" type="search" placeholder="Find your page, e.g. Electrochemistry" aria-label="Find your page">
  <div id="list"></div>
  <p class="note">Questions about your badge? Write to <a href="mailto:contact@chemisters.com">contact@chemisters.com</a>.</p>
</div>
<script>
const ITEMS = ''' + data + ''';
const esc = t => String(t).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const code = i => `<a href="https://chemisters.com/${i.slug}/"><img src="https://chemisters.com/badge/${i.slug}.svg" alt="Featured on Chemisters: ${esc(i.name)}" height="56"></a>`;
function render(q) {
  q = (q || "").toLowerCase();
  document.getElementById("list").innerHTML = ITEMS.filter(i => !q || i.name.toLowerCase().includes(q)).map(i => `
    <div class="b"><img src="${i.slug}.svg" alt="Featured on Chemisters: ${esc(i.name)}"><code>${esc(code(i))}</code>
    <div class="row"><button type="button" data-copy="${esc(code(i))}">Copy HTML</button><a class="dl" href="${i.slug}.svg" download>Download SVG</a></div></div>`).join("");
}
document.getElementById("q").addEventListener("input", e => render(e.target.value));
document.addEventListener("click", async e => {
  const b = e.target.closest("[data-copy]"); if (!b) return;
  try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = "Copied"; } catch (err) { b.textContent = "Select the code above"; }
  setTimeout(() => b.textContent = "Copy HTML", 1800);
});
const want = new URLSearchParams(location.search).get("page");
if (want) { const i = ITEMS.find(x => x.slug === want); if (i) document.getElementById("q").value = i.name; }
render(document.getElementById("q").value);
</script>
</body>
</html>
'''


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--display", help="TTF/OTF for big titles")
    ap.add_argument("--body", help="TTF/OTF for body text")
    ap.add_argument("--mono", help="TTF/OTF for small labels")
    ap.add_argument("--no-images", action="store_true", help="skip preview images")
    a = ap.parse_args()

    colors, areas, pages, picker, platforms = read_index()
    with open(os.path.join(ROOT, "tools", "fields.json"), encoding="utf-8") as f:
        fields = json.load(f)
    with open(os.path.join(ROOT, "tools", "element_template.html"), encoding="utf-8") as f:
        tpl = f.read()
    area_label = {x["id"]: x["label"] for x in areas}
    ordered = [p for ar in areas for p in pages if p["area"] == ar["id"]]
    for i, p in enumerate(ordered):
        p["z"] = i + 1
        p["slug"] = p.get("slug") or slugify(p["name"])

    reserved = {"assets", "images", "data", "badge", "publish", "privacy", "terms", "pages", "tools"}
    clash = [p["slug"] for p in ordered if p["slug"] in reserved]
    if clash:
        sys.exit(f"These page slugs clash with site folders: {clash}")

    fonts_dir = os.path.join(ROOT, "assets", "fonts")
    fonts = {
        "display": find_font([a.display, os.path.join(fonts_dir, "unbounded.woff2")], "Bold"),
        "body": find_font([a.body, os.path.join(fonts_dir, "figtree.woff2")], "Regular"),
        "mono": find_font([a.mono, os.path.join(fonts_dir, "jetbrains-mono.woff2"), "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", "C:/Windows/Fonts/consola.ttf"], "Medium"),
    }
    logo = os.path.join(ROOT, "images", "Chemisters_logo.png")
    logo = logo if os.path.exists(logo) else None

    for sub in ("assets/og", "badge", "data"):
        os.makedirs(os.path.join(ROOT, sub), exist_ok=True)

    slim = [{k: p.get(k) for k in ("sym", "name", "slug", "area", "z", "links", "logo") if p.get(k) is not None} for p in ordered]
    data_json = json.dumps({"me": "{{ME}}", "pages": slim, "picker": picker, "platforms": platforms}, ensure_ascii=False).replace("</", "<\\/")
    missing = [p["slug"] for p in ordered if p["slug"] not in fields]
    if missing:
        print("No text in tools/fields.json yet for:", ", ".join(missing), "(the page uses its short description)")

    listing = []
    for p in ordered:
        color = colors.get(p["area"], "#5b8def")
        d = os.path.join(ROOT, p["slug"])
        os.makedirs(d, exist_ok=True)
        page_html, rel = element_page(tpl, p, area_label[p["area"]], ordered, picker, platforms, fields, data_json)
        with open(os.path.join(d, "index.html"), "w", encoding="utf-8") as f:
            f.write(page_html)
        with open(os.path.join(ROOT, "badge", p["slug"] + ".svg"), "w", encoding="utf-8") as f:
            f.write(badge_svg(p, color))
        links = {k: v for k, v in (p.get("links") or {}).items() if v}
        if not a.no_images:
            og_image(p, area_label[p["area"]], color, len(links), fonts, logo, os.path.join(ROOT, "assets", "og", p["slug"] + ".png"))
        li = re.search(r"/company/(\d+)", links.get("linkedin", ""))
        fb = re.search(r"facebook\.com/(?:profile\.php\?id=)?(\d+)", links.get("facebook", ""))
        listing.append({
            "z": p["z"], "sym": p["sym"], "name": p["name"], "slug": p["slug"], "area": p["area"], "color": color,
            "url": f"{SITE}/{p['slug']}/", "linkedin_org_id": li.group(1) if li else None,
            "facebook_page_id": fb.group(1) if fb else None, "links": links, "related": rel,
        })

    with open(os.path.join(ROOT, "data", "pages.json"), "w", encoding="utf-8") as f:
        json.dump(listing, f, ensure_ascii=False, indent=1)
    with open(os.path.join(ROOT, "badge", "index.html"), "w", encoding="utf-8") as f:
        f.write(badge_gallery([{"slug": x["slug"], "name": x["name"]} for x in listing]))

    from datetime import date
    today = date.today().isoformat()
    urls = [SITE + "/"] + [x["url"] for x in listing]
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for u in urls:
            f.write(f"  <url><loc>{u}</loc><lastmod>{today}</lastmod></url>\n")
        f.write("</urlset>\n")
    robots = os.path.join(ROOT, "robots.txt")
    if not os.path.exists(robots):
        with open(robots, "w", encoding="utf-8") as f:
            f.write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")

    print(f"Built {len(listing)} element pages, badges, sitemap{'' if a.no_images else ', preview images'}, data/pages.json")
    print("Fonts used:", {k: (os.path.basename(v) if v else "Pillow default") for k, v in fonts.items()})


if __name__ == "__main__":
    main()
