/* =====================================================================
   Chemisters follow kit — shared by the homepage and every element page.

   1. Collection: remembers, in the visitor's own browser, which pages they
      clicked Follow on, so tiles can light up ("collected").
   2. Next up: when the visitor comes back from LinkedIn/Facebook after a
      Follow click, a small card suggests three close fields to follow next.

   Any follow link opts in with: data-follow-slug="<slug>" data-follow-platform="linkedin"
   Nothing here is sent anywhere; it only uses localStorage.
   ===================================================================== */
window.FollowKit = (function () {
  "use strict";
  var KEY = "chemisters.collected.v1";
  var cfg = { pages: [], picker: { work: [], feed: [] }, platforms: {}, href: function (s) { return "/" + s + "/"; } };
  var store = load(), listeners = [], pending = null, snoozed = false, shownFor = {}, card = null;

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }
  function emit() { listeners.forEach(function (f) { try { f(); } catch (e) {} }); }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function bySlug(s) { return cfg.pages.find(function (p) { return p.slug === s; }); }
  function bySym(s) { return cfg.pages.find(function (p) { return p.sym === s; }); }
  function links(p) { return Object.keys(p.links || {}).filter(function (k) { return p.links[k]; }).map(function (k) { return [k, p.links[k]]; }); }
  function pf(k) { return cfg.platforms[k] || { name: k.charAt(0).toUpperCase() + k.slice(1), color: "#4b5563" }; }

  /* pages close to a page: shared "Find my pages" groups first, then same area, then table neighbours.
     tools/build_site.py uses the same rule for the "Close to" section of element pages. */
  function related(sym, n, opts) {
    opts = opts || {};
    var me = bySym(sym); if (!me) return [];
    var score = {};
    var groups = (cfg.picker.work || []).concat(cfg.picker.feed || []);
    groups.forEach(function (g) {
      if (g.syms.indexOf(sym) < 0) return;
      g.syms.forEach(function (s) { if (s !== sym) score[s] = (score[s] || 0) + 1; });
    });
    cfg.pages.forEach(function (p) {
      if (p.sym === sym) return;
      if (p.area === me.area) score[p.sym] = (score[p.sym] || 0) + 0.6;
      if (Math.abs(p.z - me.z) === 1) score[p.sym] = (score[p.sym] || 0) + 0.2;
    });
    return cfg.pages
      .filter(function (p) { return score[p.sym] && links(p).length && !(opts.skipCollected && has(p.slug)); })
      .sort(function (a, b) { return (score[b.sym] - score[a.sym]) || (Math.abs(a.z - me.z) - Math.abs(b.z - me.z)); })
      .slice(0, n || 3);
  }

  function has(slug) { return !!store[slug]; }
  function count(filter) { return cfg.pages.filter(function (p) { return has(p.slug) && (!filter || filter(p)); }).length; }
  function record(slug, platform) {
    if (!bySlug(slug)) return;
    var s = store[slug] || [];
    if (s.indexOf(platform) < 0) s.push(platform);
    store[slug] = s; save(); emit();
  }
  function clear() { store = {}; save(); emit(); }

  function followButtons(p, compact) {
    var l = links(p);
    if (!l.length) return "";
    return '<div class="fk-btns">' + l.map(function (e) {
      var k = e[0], u = e[1];
      return '<a href="' + esc(u) + '" target="_blank" rel="noopener" style="--pc:' + pf(k).color + '" data-follow-slug="' + esc(p.slug) + '" data-follow-platform="' + esc(k) +
        '" data-umami-event="follow" data-umami-event-page="' + esc(p.slug) + '" data-umami-event-platform="' + esc(k) + '" aria-label="Follow ' + esc(p.name) + " on " + esc(pf(k).name) + '">' +
        (pf(k).svg || "") + (compact ? "" : "Follow on ") + esc(pf(k).name) + "</a>";
    }).join("") + "</div>";
  }

  /* ---------- the "next up" card ---------- */
  function css() {
    if (document.getElementById("fk-css")) return;
    var s = document.createElement("style"); s.id = "fk-css";
    s.textContent =
      ".fk-next{position:fixed;right:max(18px,env(safe-area-inset-right,0px));bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:260;width:min(380px,calc(100vw - 28px));background:#0c1324;color:#e9eefc;border:1px solid #2a3758;border-radius:18px;padding:18px 18px 14px;box-shadow:0 24px 60px rgba(0,0,0,.45);font-family:var(--body,system-ui,sans-serif);transform:translateY(20px);opacity:0;transition:transform .35s cubic-bezier(.2,.8,.2,1),opacity .35s ease}" +
      ".fk-next.in{transform:none;opacity:1}" +
      ".fk-next .fk-x{position:absolute;right:10px;top:10px;width:32px;height:32px;border-radius:50%;border:1px solid #1f2a45;background:transparent;color:#e9eefc;cursor:pointer;font-size:16px;line-height:1}" +
      ".fk-k{margin:0;font:500 11.5px/1.3 var(--mono,ui-monospace,monospace);letter-spacing:.1em;text-transform:uppercase;color:#4ade80;display:flex;align-items:center;gap:8px}" +
      ".fk-k:before{content:'';width:7px;height:7px;border-radius:50%;background:#4ade80}" +
      ".fk-next h4{margin:6px 34px 12px 0;font:700 17px/1.3 var(--body,system-ui,sans-serif)}" +
      ".fk-row{--fc:#5b8def;display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px;align-items:center;padding:10px 0;border-top:1px solid #1f2a45}" +
      ".fk-mini{width:42px;height:44px;border-radius:9px;display:flex;flex-direction:column;justify-content:space-between;padding:4px 6px;text-decoration:none;border:1px solid color-mix(in srgb,var(--fc) 45%,transparent);background:color-mix(in srgb,var(--fc) 18%,#0c1324)}" +
      ".fk-mini i{font:400 9px/1 var(--mono,ui-monospace,monospace);font-style:normal;color:color-mix(in srgb,var(--fc) 70%,#fff)}" +
      ".fk-mini b{font:700 16px/1 var(--display,Arial Black,sans-serif);color:color-mix(in srgb,var(--fc) 55%,#fff)}" +
      ".fk-name{color:#fff;font-weight:700;font-size:14.5px;text-decoration:none;display:block;line-height:1.25}" +
      ".fk-name:hover{text-decoration:underline}" +
      ".fk-btns{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}" +
      ".fk-btns a{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:8px;text-decoration:none;font-weight:700;font-size:12.5px;color:#fff;background:var(--pc,#334);font-family:var(--body,system-ui,sans-serif)}" +
      ".fk-btns a:hover{filter:brightness(1.12)}" +
      ".fk-btns svg{width:14px;height:14px;fill:currentColor}" +
      ".fk-snooze{margin-top:8px;border:0;background:none;color:#93a0bf;font-size:12.5px;cursor:pointer;padding:0;text-decoration:underline;text-underline-offset:3px}" +
      "@media (max-width:560px){.fk-next{right:12px;left:12px;width:auto;bottom:calc(14px + env(safe-area-inset-bottom,0px))}}" +
      "@media (prefers-reduced-motion:reduce){.fk-next{transition:none}}";
    document.head.appendChild(s);
  }
  function hide() { if (!card) return; var c = card; card = null; c.classList.remove("in"); setTimeout(function () { c.remove(); }, 300); }
  function showNext(slug) {
    var p = bySlug(slug); if (!p || snoozed || shownFor[slug]) return;
    var next = related(p.sym, 3, { skipCollected: true });
    if (!next.length) return;
    shownFor[slug] = true;
    css(); hide();
    card = document.createElement("aside");
    card.className = "fk-next"; card.setAttribute("role", "dialog"); card.setAttribute("aria-label", "Fields close to " + p.name);
    card.innerHTML = '<button type="button" class="fk-x" aria-label="Close">×</button>' +
      '<p class="fk-k">' + esc(p.name) + " added to your table</p>" +
      "<h4>Fields close to " + esc(p.name) + "</h4>" +
      next.map(function (q) {
        return '<div class="fk-row" style="--fc:var(--' + q.area + ')"><a class="fk-mini" href="' + cfg.href(q.slug) + '" aria-hidden="true" tabindex="-1"><i>' + q.z + "</i><b>" + esc(q.sym) + "</b></a>" +
          '<div><a class="fk-name" href="' + cfg.href(q.slug) + '">' + esc(q.name) + "</a>" + followButtons(q, true) + "</div></div>";
      }).join("") +
      '<button type="button" class="fk-snooze">Don\'t suggest more this visit</button>';
    document.body.appendChild(card);
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (card) card.classList.add("in"); }); });
    card.querySelector(".fk-x").addEventListener("click", hide);
    card.querySelector(".fk-snooze").addEventListener("click", function () { snoozed = true; hide(); });
    try { window.umami && window.umami.track("next_up_shown", { page: slug }); } catch (e) {}
  }

  /* any follow click: record it, then suggest close fields when the visitor comes back */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-follow-slug]"); if (!a) return;
    var slug = a.getAttribute("data-follow-slug");
    record(slug, a.getAttribute("data-follow-platform") || "link");
    pending = { slug: slug, t: Date.now() };
    if (card && card.contains(a)) { hide(); }
    var mine = pending;
    setTimeout(function () { if (pending === mine && document.visibilityState === "visible") { pending = null; showNext(mine.slug); } }, 5000);
  }, true);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState !== "visible" || !pending) return;
    var p = pending; pending = null;
    if (Date.now() - p.t < 20 * 60 * 1000) setTimeout(function () { showNext(p.slug); }, 450);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && card) hide(); });

  return {
    init: function (o) { for (var k in o) cfg[k] = o[k]; emit(); return this; },
    has: has, count: count, record: record, clear: clear, related: related, followButtons: followButtons,
    onChange: function (f) { listeners.push(f); },
    showNext: showNext
  };
})();
