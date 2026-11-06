# Live data for chemisters.com (n8n)

The homepage reads two optional files. If a file is missing or empty, its features stay hidden, so the site works before this workflow exists.

| File | Turns on |
|---|---|
| `data/latest.json` | green "posted today" dots on tiles, "Last post X ago" in the hero, the **Live from the network** strip, the latest post inside each page's panel |
| `data/stats.json` | **Followers** button (heat view), total followers in the hero, follower count in each panel |

Nothing is stored on the computer: n8n reads the APIs and commits the two files to the GitHub repo.

---

## 1. File formats

`data/latest.json`
```json
{
  "updated": "2026-10-31T14:00:00Z",
  "posts": [
    { "slug": "electrochemistry", "platform": "linkedin", "url": "https://www.linkedin.com/feed/update/urn:li:share:123/", "title": "First line of the post", "time": "2026-10-31T12:40:00Z" }
  ]
}
```

`data/stats.json`
```json
{
  "updated": "2026-10-31T14:00:00Z",
  "followers": { "electrochemistry": { "linkedin": 1840, "facebook": 312 } }
}
```

`slug` is the page's address name, the same one as in `chemisters.com/electrochemistry/`. The full list, with each page's LinkedIn organization ID and Facebook page ID, is in `data/pages.json`, written by `tools/build_site.py`.

---

## 2. The workflow: "Chemisters · site live data"

Every 3 hours. Six nodes in a straight line.

### Node 1: Schedule Trigger
Every 3 hours.

### Node 2: HTTP Request, named **Get pages**
- Method `GET`, URL `https://chemisters.com/data/pages.json`
- The response is an array, so n8n outputs one item per page (56 items).

### Node 3: HTTP Request, named **LinkedIn latest post**
- Authentication: the same LinkedIn credential your posting workflows use
- Method `GET`
- URL:
  `https://api.linkedin.com/rest/posts?author=urn%3Ali%3Aorganization%3A{{ $json.linkedin_org_id }}&q=author&count=1&sortBy=LAST_MODIFIED`
- Headers: `LinkedIn-Version: 202603` and `X-Restli-Protocol-Version: 2.0.0`
- Options → Batching: 5 items every 1000 ms
- Settings → On Error: **Continue** (pages without a LinkedIn ID simply fail and are skipped, and the item order stays aligned)

### Node 4: HTTP Request, named **LinkedIn followers**
- Same credential, headers, batching and On Error setting as node 3
- URL:
  `https://api.linkedin.com/rest/networkSizes/urn%3Ali%3Aorganization%3A{{ $('Get pages').item.json.linkedin_org_id }}?edgeType=COMPANY_FOLLOWED_BY_COMPANY`

### Node 5: HTTP Request, named **Facebook page**
- Method `GET`
- URL (use the Graph API version your posting workflows use):
  `https://graph.facebook.com/v23.0/{{ $('Get pages').item.json.facebook_page_id }}?fields=followers_count,posts.limit(1){message,permalink_url,created_time}`
- Authentication: the page access token, the same way your Facebook posting workflows send it
- On Error: **Continue**

### Node 6: Code, named **Build files** (Run once for all items)
```js
const pages  = $('Get pages').all().map(i => i.json);
const liPost = $('LinkedIn latest post').all().map(i => i.json);
const liFol  = $('LinkedIn followers').all().map(i => i.json);
const fb     = $('Facebook page').all().map(i => i.json);

// first readable line of a post, without LinkedIn mention/escape syntax
const firstLine = t => String(t || '')
  .replace(/@\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/\\([()\[\]{}@#*_~<>|])/g, '$1')
  .split('\n').map(s => s.trim()).find(Boolean)?.slice(0, 160) || '';

const posts = [], followers = {};
const twoWeeks = Date.now() - 14 * 864e5;

pages.forEach((p, i) => {
  const f = {};

  const lp = liPost[i]?.elements?.[0];
  if (p.linkedin_org_id && lp) {
    const t = lp.publishedAt || lp.createdAt;
    if (t > twoWeeks) posts.push({
      slug: p.slug, platform: 'linkedin',
      url: `https://www.linkedin.com/feed/update/${lp.id}/`,
      title: firstLine(lp.commentary), time: new Date(t).toISOString()
    });
  }
  if (p.linkedin_org_id && typeof liFol[i]?.firstDegreeSize === 'number') f.linkedin = liFol[i].firstDegreeSize;

  const fp = fb[i]?.posts?.data?.[0];
  if (p.facebook_page_id && fp && Date.parse(fp.created_time) > twoWeeks) posts.push({
    slug: p.slug, platform: 'facebook', url: fp.permalink_url,
    title: firstLine(fp.message), time: new Date(fp.created_time).toISOString()
  });
  if (p.facebook_page_id && typeof fb[i]?.followers_count === 'number') f.facebook = fb[i].followers_count;

  if (Object.keys(f).length) followers[p.slug] = f;
});

posts.sort((a, b) => b.time.localeCompare(a.time));
const updated = new Date().toISOString();

return [
  { json: { path: 'data/latest.json', content: JSON.stringify({ updated, posts: posts.slice(0, 80) }, null, 1) } },
  { json: { path: 'data/stats.json',  content: JSON.stringify({ updated, followers }, null, 1) } }
];
```

### Node 7: GitHub, **Edit a file**
- Owner `alaouichemAI`, repository `Chemisters`
- File path `{{ $json.path }}`
- File content `{{ $json.content }}`
- Commit message `live data {{ $now.toISO() }}`

The node runs twice, once per file. The repo already contains both files with empty content, because "Edit" fails on a file that does not exist yet.

---

## 3. What can go wrong

- **LinkedIn returns 403.** Reading posts and follower counts needs the Community Management API read permissions (`r_organization_social`, and an organization admin role). Posting alone does not include them. If your app lacks them, the site keeps working without the follower view, and you can still fill `latest.json` from the Facebook branch.
- **A page shows no LinkedIn data.** The workflow needs the numeric company ID in the LinkedIn link (`linkedin.com/company/110123965`). A name link like `linkedin.com/company/the-inorganic-chemistry/` works for visitors but gives n8n no ID. Inorganic Chemistry uses one now. Open that page's admin view and copy the number from the address bar into its link in `index.html`. Then rerun `tools/build_site.py`.
- **Facebook "Unsupported get request".** The Facebook links now use the Page IDs from your Pages list, which is what the Graph API expects. If one still fails, the token in use doesn't manage that Page.
- **GitHub Pages rebuilds.** Two commits every 3 hours is well inside GitHub Pages' limits. Don't run this after every single post.

---

## 4. Analytics (optional, free)

Self-host Umami next to n8n, add the site, then uncomment the Umami script tag at the top of `index.html` and fill in its address and website ID. These events are already wired:

- `follow`, with the page and platform
- `tile_open`
- `picker_open` and `picker_done`
- `paper_match`
- `symbol_jump`
- `heat_view`
- `stream_click`

Add one sentence to the privacy policy, for example: "We use Umami, a privacy-friendly analytics tool that does not use cookies or collect personal data, to count page visits and clicks."
