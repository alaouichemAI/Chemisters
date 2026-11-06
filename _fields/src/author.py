"""Compact authoring helper: each batch file calls P(...) and this writes _fields/fields/<slug>.json.
Not needed to run the site; the JSON files are the source of truth for later edits."""
import colorsys, json
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "fields"
CH = {c["name"]: c for c in json.loads((HERE.parent / "channels.json").read_text(encoding="utf-8"))}

# category: (label, base hue, tile colour) — hues follow the homepage tile colours
CAT = {
    "core": ("Core chemistry", 222, "#15213d"),
    "synthetic": ("Synthesis & reactivity", 24, "#2e1c12"),
    "applied": ("Applied & industrial", 84, "#1b2513"),
    "bio": ("Life & health", 342, "#2b1420"),
    "comp": ("Computational & AI", 256, "#1e1936"),
    "materials": ("Materials & nano", 172, "#0e2a29"),
    "community": ("Community", 42, "#2a2311"),
}


def _hex(h, l, s):
    r, g, b = colorsys.hls_to_rgb((h % 360) / 360, l, s)
    return "#%02x%02x%02x" % (round(r * 255), round(g * 255), round(b * 255))


def B(name, summary, example, channel=""):
    return {"name": name, "summary": summary, "example": example, "channel": channel}


def T(year, title, text, why):
    return {"year": year, "title": title, "text": text, "why": why}


def Q(q, options, explain):
    """First option is the correct one (options are shuffled on screen)."""
    return {"q": q, "options": options, "answer": 0, "explain": explain}


def P(channel, number, symbol, *, hue=0, motif, lead, body, facts, branches, timeline, quiz, related,
      topics, labels=None, posts=None, seo_title=None, name=None):
    ch = CH[channel]
    label, base, tile = CAT[ch["cat"]]
    h = base + hue
    nm = name or channel
    quiz = [{"id": f"{symbol.lower()}-{i:03d}", "q": q["q"], "options": q["options"], "answer": 0, "explain": q["explain"]}
            for i, q in enumerate(quiz, 1)]
    data = {
        "slug": ch["slug"], "channel": channel, "number": number, "symbol": symbol,
        "category": label, "name": nm, "tagline": ch["desc"],
        "seo_title": seo_title or f"{nm} — paper summaries, news & innovations | Chemisters",
        "seo_description": f"Follow Chemisters {nm} on LinkedIn and Facebook: {topics}.",
        "posts_about": posts or ["Paper summaries", "Field news", "Innovations"],
        "theme": {"accent": _hex(h, .72, .82), "accent2": _hex(h + 38, .74, .78), "tile": tile, "motif": motif},
        "definition": {"lead": lead, "body": body, "facts": [{"value": v, "label": l} for v, l in facts]},
        "branches": branches, "timeline": sorted(timeline, key=lambda e: e["year"]), "quiz": quiz, "related": related,
    }
    if labels:
        data["labels"] = labels
    bad = [r for r in related if r not in CH] + [b["channel"] for b in branches if b["channel"] and b["channel"] not in CH]
    if bad:
        raise SystemExit(f"{channel}: unknown channel names {bad}")
    OUT.mkdir(exist_ok=True)
    (OUT / f"{ch['slug']}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"  wrote {ch['slug']}.json  ({len(branches)} branches, {len(timeline)} events, {len(quiz)} questions)")
