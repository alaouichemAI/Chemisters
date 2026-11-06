# Chemisters field pages

Copy this whole folder's contents into the root of the chemisters.com site (next to `index.html`).
GitHub Pages ignores folders starting with `_`, so `_fields/` (the sources) is never published.

```
_fields/
  template.html          the ONE page design, shared by every field
  build.py               turns each field JSON into a page
  site.json              base URL + link of the "Feature your research" page
  channels.json          every Chemisters page: name, LinkedIn, Facebook (from index.html)
  fields/<slug>.json     one file per field  ← the only thing you write for a new page
assets/field.css         shared styles for every field page
assets/field.js          shared behaviour: timeline, challenge, streaks, picker, live data
images/chemisters-logo-64.png / -128.png   light logo for the nav (the original is 1.5 MB)
data/live/<slug>.json    weekly top post, daily papers, extra quiz questions (n8n writes this)
<slug>/index.html        GENERATED page  → chemisters.com/<slug>/
og/<slug>.png            GENERATED share card shown when the link is posted on LinkedIn/Facebook
```

## The 56 pages

Every tile on the homepage now has a page: see `PAGE_LINKS.md` for the link of each tile (e.g. `/physical-chemistry/`).
`fonts/` holds Inter (open-source, OFL licence) for the share-card images. `src/` holds the compact files used to write the 55 newer pages;
you don't need them: the JSON files in `fields/` are the source of truth, edit those.

Pages that are not a field (News, Wisdom & Stories, Failed Discoveries…) override the section headings with a `labels` block
and the hero chips with `posts_about` in their JSON. Check that `posts_about` matches what each page really posts.

## Add a new field (e.g. Green Chemistry)

1. Copy `fields/organic-chemistry.json` to `fields/green-chemistry.json` and change the content.
   - `channel` must match a `name` in `channels.json` exactly — that is where the follow links come from.
   - `theme.motif`: `hexagon`, `lattice`, `wave`, `orbit`, `grid` or `chain`. With `accent`/`accent2`/`tile` colors this gives each page its own look.
   - `branches[].channel`: name of another Chemisters page → its Follow buttons appear on that branch card.
   - Aim for 20+ quiz questions; put the correct option anywhere and set `answer` to its index (options are shuffled on screen).
2. From the site root: `python _fields/build.py green-chemistry` (Pillow needed for the share card: `pip install pillow`).
3. Rebuild everything after editing `template.html`, `channels.json` or anything in `assets/`: `python _fields/build.py`
   (the build stamps a version on the CSS/JS links so browsers pick up changes)
   (pages also start linking to each other automatically once both exist).
4. On the homepage, point the tile's "Explore the field" link to `/green-chemistry/`.

Cheap way to write the JSONs: give gpt-oss-120b `fields/organic-chemistry.json` as the example and ask for the same structure for the new field. Check dates and facts before publishing.

## Click tracking (optional, free)

Create a free account at goatcounter.com (e.g. code `chemisters`), put it in `site.json` → `"goatcounter": "chemisters"`, rebuild.
You then see per page: visits, `follow-linkedin/<slug>`, `follow-facebook/<slug>`, `quiz-start/<slug>`, `quiz-done/<slug>/<score>`, `share-…/<slug>`.

## Live data: weekly top post + daily papers (n8n)

The page reads `/data/live/<slug>.json` on every visit. No rebuild needed: n8n edits this file in the GitHub repo once a week and the page updates by itself. If `top_posts` is empty, the section stays hidden.

```json
{
  "updated": "2026-11-09",
  "top_posts": [
    {
      "week": "Week 45",
      "date": "2026-11-09",
      "platform": "linkedin",
      "label": "Paper summary",
      "title": "Short, catchy title of the post",
      "text": "First lines of the post…",
      "url": "https://www.linkedin.com/feed/update/urn:li:share:…",
      "image": "https://… (strongly recommended, see note below)",
      "reactions": 238, "comments": 31, "reposts": 12, "impressions": 14800,
      "embed_url": "(optional) https://www.linkedin.com/embed/feed/update/urn:li:share:… shows the real LinkedIn post instead of the card"
    }
  ],
  "papers": [
    { "title": "Paper title", "url": "https://doi.org/…", "source": "J. Org. Chem.", "date": "2026-11-08",
      "image": "(optional) the paper's graphical abstract or og:image", "summary": "(optional) one sentence" }
  ],
  "quiz": [
    { "id": "oc-w45-1", "q": "…", "options": ["…", "…", "…", "…"], "answer": 0, "explain": "…" }
  ]
}
```

Images: posts and papers look far better with a real image. Without one (or if the link breaks), the page draws a branded cover automatically, so nothing ever looks empty.
- Do NOT use LinkedIn's own image links (media.licdn.com): they are signed and expire after some days.
- Best: in n8n, save the post image into the repo (e.g. `data/live/img/organic-chemistry-2026-w45.jpg` with the GitHub node) and put `/data/live/img/…` in `image`.
- For papers: use the article page's `og:image` (most journals provide a graphical abstract there).
- `reactions`, `comments`, `reposts`, `impressions` are optional; when present they appear on the card (social proof makes people click).

- `papers`: newest first, the page shows 6. Feed it from your Daily Research Digest workflow (replace the `papers` array daily). Empty → section hidden.
- Newest post first; keep the last ~5 (the page shows #1 big and the next 4 as "Earlier top posts").
- `quiz` is optional: new questions added here join the pool. `id` must be unique and never reused.

Workflow (one per page, or one looping over all pages):
Schedule (weekly) → LinkedIn: posts of the last 7 days + their stats → Code: pick the highest engagement → (optional) gpt-oss: 5 new quiz questions from that week's posts → GitHub node "Edit a file" on `data/live/<slug>.json`.

## The challenge

Modes
- Classic: 5 rounds (multiple choice → guess the year → multiple choice → order OR match → multiple choice). Lifelines: 50/50 and Swap, once each. Speed bonus (+3 XP) for answers under 7 s.
- Blitz (unlocks at level 2): 60 seconds, as many quick questions as possible.
- Survival (unlocks at level 3): 3 hearts, keep going until they run out.

Progress (stored in the visitor's browser, shared across every Chemisters page)
- XP, 11 levels (Atom → Nobel Laureate), combo bonus, daily streak with streak freezes (one earned every 7 days, max 2).
- 66 badges in 14 categories, 4 rarities (Common, Rare, Epic, Legendary), 4 secret ones. Pop-up when unlocked, mid-game.
- 3 daily quests (same for everyone each day, +25 XP each, +50 for all three).
- Stats panel, level ladder, answer review at the end, personal records for Blitz/Survival.
- Sound effects are generated in the browser (no audio files); the speaker button mutes them and the choice is remembered.
- Fullscreen button (top right of the challenge). On iPhone, where real fullscreen is not allowed, it fills the screen instead.
- Screen effects: green glow + ripple + confetti on correct answers, red flash + shake on wrong ones, flame border and banner on combos, red pulse in the last 5 seconds of Blitz and on the last heart in Survival, gold sweep on a flawless round, full level-up animation.
- Speed ring (7 s) on multiple-choice rounds, keyboard answers A–D or 1–4, Enter to continue.
- Results: animated XP bar, "next badge" progress, answer review, and a downloadable score card image (1200×630) to attach to a LinkedIn post.
- Icons: Lucide (open source, ISC license), embedded in field.js. No emojis anywhere.

Questions
- Classic never repeats a written question until the whole bank has been seen. Blitz and Survival may reuse written questions (they need many fast ones), mixed with generated ones.
- Write every question so it makes sense on its own: questions are shuffled, so never refer to "the previous question".
- Year, order, match, "which came first?" and "which branch?" questions are generated from the page's timeline and branches, so every field gets them for free.
- A new device or cleared browser starts from zero.
