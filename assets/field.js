/* Chemisters field page — shared by every field page. Data comes from <script id="field-data">. */
(() => {
'use strict';
const F = JSON.parse(document.getElementById('field-data').textContent);
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const buzz = p => { try { navigator.vibrate && navigator.vibrate(p); } catch {} };
const day = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5);

/* ---------- analytics (only if GoatCounter is enabled in site.json) ---------- */
const track = name => { try { window.goatcounter && window.goatcounter.count && window.goatcounter.count({ path: name, title: name, event: true }); } catch {} };
document.addEventListener('click', e => {
  const a = e.target.closest('a.btn.li:not(.read), a.btn.fb:not(.read), a.chip.li, a.chip.fb');
  if (a) track(`follow-${a.classList.contains('li') ? 'linkedin' : 'facebook'}/${F.slug}`);
});

/* ---------- copy link + toast ---------- */
const toastEl = $('#toast');
const toast = msg => { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('show'), 1600); };
$$('[data-copy]').forEach(b => b.addEventListener('click', async () => { try { await navigator.clipboard.writeText(F.url); } catch {} toast('Link copied'); }));

/* ---------- sticky follow bar ---------- */
const sticky = $('#sticky');
let stickyClosed = store.get('chem-sticky-closed', 0) > Date.now() - 864e5;
$('#sticky-x').onclick = () => { stickyClosed = true; sticky.classList.remove('show'); store.set('chem-sticky-closed', Date.now()); };
let heroGone = false, quizInView = false;
const paintSticky = () => sticky.classList.toggle('show', heroGone && !quizInView && !stickyClosed);
new IntersectionObserver(([e]) => { heroGone = !e.isIntersecting && e.boundingClientRect.top < 0; paintSticky(); }).observe($('#hero-follow'));
new IntersectionObserver(([e]) => { quizInView = e.isIntersecting; paintSticky(); }).observe($('#qz'));

/* ---------- timeline ---------- */
const T = F.timeline, tlTrack = $('#tl-track'), tlPanel = $('#tl-panel');
let ti = 0;
tlTrack.innerHTML = T.map((e, i) => `<button class="tl-dot" role="tab" data-i="${i}">${e.year}</button>`).join('');
function showT(i, focus) {
  ti = Math.max(0, Math.min(T.length - 1, i));
  const e = T[ti];
  tlPanel.innerHTML = `<div class="tl-year">${e.year}</div><div><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p>${e.why ? `<p class="tl-why"><b>Why it matters:</b> ${esc(e.why)}</p>` : ''}</div>`;
  tlPanel.classList.remove('anim'); void tlPanel.offsetWidth; tlPanel.classList.add('anim');
  $$('.tl-dot').forEach((d, k) => d.setAttribute('aria-selected', k === ti));
  const dot = tlTrack.children[ti];
  tlTrack.scrollTo({ left: dot.offsetLeft - tlTrack.clientWidth / 2 + dot.clientWidth / 2, behavior: 'smooth' });
  if (focus) dot.focus({ preventScroll: true });
  $('#tl-prev').disabled = ti === 0; $('#tl-next').disabled = ti === T.length - 1;
}
tlTrack.addEventListener('click', e => { const b = e.target.closest('.tl-dot'); if (b) showT(+b.dataset.i); });
tlTrack.addEventListener('keydown', e => { if (e.key === 'ArrowRight') showT(ti + 1, 1); if (e.key === 'ArrowLeft') showT(ti - 1, 1); });
$('#tl-prev').onclick = () => showT(ti - 1); $('#tl-next').onclick = () => showT(ti + 1);
showT(0);

/* ---------- "What are you into?" picker ---------- */
(() => {
  const chips = $$('.pk-chip'), cards = $$('.pk-card'), hint = $('#pk-hint');
  if (!chips.length) return;
  const KEY = 'chem-interests', saved = new Set(store.get(KEY, []));
  function apply() {
    const sel = chips.filter(c => c.getAttribute('aria-pressed') === 'true').map(c => c.dataset.k);
    cards.forEach(c => c.classList.toggle('on', sel.length ? sel.includes(c.dataset.k) : c.hasAttribute('data-def')));
    hint.textContent = sel.length ? `Follow these ${sel.length} page${sel.length > 1 ? 's' : ''} to fill your feed:` : `Popular with ${F.name} followers:`;
    store.set(KEY, [...new Set([...store.get(KEY, []).filter(k => !chips.some(c => c.dataset.k === k)), ...sel])]);
  }
  chips.forEach(c => {
    if (saved.has(c.dataset.k)) c.setAttribute('aria-pressed', 'true');
    c.onclick = () => { c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); apply(); };
  });
  apply();
})();

/* ---------- live data: weekly top post, daily papers, extra quiz questions (written by n8n) ---------- */
const live = fetch(`/data/live/${F.slug}.json?v=${Math.floor(Date.now() / 36e5)}`).then(r => r.ok ? r.json() : {}).catch(() => ({}));
const ICON = { linkedin: F.icons.li, facebook: F.icons.fb };

live.then(d => {
  const posts = (d.top_posts || []).filter(p => p && p.url);
  if (!posts.length) return;
  const p = posts[0], plat = p.platform === 'facebook' ? 'facebook' : 'linkedin';
  const when = [p.week, p.date].filter(Boolean).join(' · ');
  let html = p.embed_url
    ? `<iframe class="tp-embed" src="${esc(p.embed_url)}" title="Top post of the week" loading="lazy" allowfullscreen></iframe>`
    : `<article class="tp-card${p.image ? ' has-img' : ''}">${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy">` : ''}
      <div class="tp-body"><span class="tp-badge">${esc(p.label || 'Top post')}</span>${p.title ? `<h3>${esc(p.title)}</h3>` : ''}
      <p class="tp-text">${esc(p.text)}</p>${when ? `<span class="tp-meta">${esc(when)}</span>` : ''}
      <div class="follow"><a class="btn ${plat === 'facebook' ? 'fb' : 'li'} read" href="${esc(p.url)}" target="_blank" rel="noopener">${ICON[plat]}Read it on ${plat === 'facebook' ? 'Facebook' : 'LinkedIn'}</a></div></div></article>`;
  const older = posts.slice(1, 5);
  if (older.length) html += `<div class="tp-older"><span>Earlier top posts:</span>${older.map(o => `<a href="${esc(o.url)}" target="_blank" rel="noopener">${esc(o.week || o.date || 'Earlier')} — ${esc((o.title || o.text || '').slice(0, 48))}…</a>`).join('')}</div>`;
  $('#tp').innerHTML = html;
  $('#top-post').style.display = 'block';
});

live.then(d => {
  const papers = (d.papers || []).filter(p => p && p.title && p.url).slice(0, 6);
  if (!papers.length) return;
  $('#papers-list').innerHTML = papers.map(p => `<li><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title)}</a><span>${esc([p.source, p.date].filter(Boolean).join(' · '))}</span></li>`).join('');
  $('#papers').hidden = false;
});

/* =====================================================================
   THE CHALLENGE
   Modes: Classic (5 mixed rounds), Blitz (60 s), Survival (3 hearts).
   XP, levels, 66 badges, daily quests, streak + freezes, lifelines,
   speed bonus, sound effects, stats, answer review.
   Progress is shared across every Chemisters field page.
   ===================================================================== */
const qz = $('#qz'), PER = 5, SEEN = `chem-quiz-seen:${F.slug}`, GKEY = 'chem-game';
const TODAY = day();

/* ---------- sound effects: synthesized with Web Audio, no files ---------- */
const SFX = (() => {
  let ctx = null, on = store.get('chem-sound', true), lastTick = 0;
  const ac = () => { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); return ctx; };
  function tone(f, at, dur, o = {}) {
    const c = ac(), osc = c.createOscillator(), g = c.createGain(), t = c.currentTime + at, vol = o.vol || .14;
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    osc.connect(g).connect(c.destination); osc.start(t); osc.stop(t + dur + .03);
  }
  const seq = (fs, step, o = {}) => fs.forEach((f, i) => tone(f, i * step, o.dur || .18, o));
  const P = {
    tap: () => tone(660, 0, .05, { type: 'triangle', vol: .05 }),
    start: () => { tone(300, 0, .35, { type: 'triangle', vol: .08, to: 900 }); seq([523, 784], .12, { dur: .2, vol: .09 }); },
    correct: c => { const k = Math.pow(2, Math.min(c || 0, 10) / 12); seq([1047 * k, 1319 * k], .07, { dur: .22, vol: .12 }); },
    wrong: () => { tone(220, 0, .28, { type: 'sawtooth', vol: .06, to: 110 }); tone(233, .02, .26, { type: 'square', vol: .025, to: 116 }); },
    tick: () => { const n = performance.now(); if (n - lastTick < 45) return; lastTick = n; tone(1400, 0, .02, { type: 'square', vol: .02 }); },
    lock: () => tone(520, 0, .12, { type: 'triangle', vol: .1, to: 780 }),
    combo: c => seq([784, 988, 1175, 1568].map(f => f * Math.pow(2, Math.min(c, 12) / 24)), .05, { dur: .12, vol: .07 }),
    badge: () => seq([1047, 1319, 1568, 2093], .07, { dur: .26, vol: .09, type: 'triangle' }),
    level: () => { seq([523, 659, 784, 1047], .11, { dur: .3, vol: .11, type: 'triangle' }); tone(1047, .5, .7, { vol: .09 }); tone(1568, .5, .7, { vol: .05 }); },
    quest: () => seq([880, 1175, 1760], .08, { dur: .2, vol: .09 }),
    life: () => tone(440, 0, .5, { type: 'triangle', vol: .11, to: 140 }),
    clock: () => tone(1000, 0, .05, { type: 'square', vol: .035 }),
    pop: () => tone(900, 0, .1, { vol: .09, to: 420 }),
    whoosh: () => tone(200, 0, .4, { type: 'sawtooth', vol: .03, to: 1600 }),
    record: () => { seq([784, 988, 1175, 1568, 1976], .07, { dur: .25, vol: .09, type: 'triangle' }); },
    end: good => good ? seq([659, 784, 988, 1319], .1, { dur: .3, vol: .1, type: 'triangle' }) : seq([523, 494, 523], .14, { dur: .25, vol: .07 })
  };
  return { get on() { return on; }, toggle() { on = !on; store.set('chem-sound', on); if (on) P.tap(); return on; }, play(n, a) { if (!on) return; try { P[n](a); } catch {} } };
})();

/* ---------- player state (shared by all Chemisters pages) ---------- */
const G = Object.assign({
  xp: 0, streak: 0, best: 0, last: '', freezes: 0, freezesUsed: 0, playDays: 0,
  sets: 0, answered: 0, correct: 0, perfects: 0, bulls: 0, exacts: 0, orders: 0, matches: 0, speeds: 0,
  comboBest: 0, blitzBest: 0, blitzPlays: 0, survBest: 0, survPlays: 0,
  questsDone: 0, sweeps: 0, shares: 0, halves: 0, swaps: 0, badges: [], fields: [], quests: null
}, store.get(GKEY, {}));
const saveG = () => store.set(GKEY, G);

const LEVELS = [[0, 'Atom'], [60, 'Ion'], [150, 'Molecule'], [300, 'Reagent'], [500, 'Intermediate'], [800, 'Catalyst'], [1200, 'Synthesist'], [1700, 'Chemist'], [2400, 'Senior Chemist'], [3300, 'Professor'], [4500, 'Nobel Laureate']];
const level = xp => { let i = 0; while (i < LEVELS.length - 1 && xp >= LEVELS[i + 1][0]) i++; return { i, name: LEVELS[i][1], from: LEVELS[i][0], to: LEVELS[i + 1] ? LEVELS[i + 1][0] : null, next: LEVELS[i + 1] ? LEVELS[i + 1][1] : null }; };
const MODES = {
  classic: { icon: '🧪', name: 'Classic', desc: '5 rounds · 4 question types', unlock: 0 },
  blitz: { icon: '⏱️', name: 'Blitz', desc: '60 seconds. As many as you can.', unlock: 1 },
  surv: { icon: '❤️', name: 'Survival', desc: '3 hearts. How far can you go?', unlock: 2 }
};
const unlocked = m => level(G.xp).i >= MODES[m].unlock;

/* ---------- badges ---------- */
const CATS = { start: 'Getting started', know: 'Knowledge', acc: 'Accuracy', combo: 'Combos', speed: 'Speed', hist: 'History', blitz: 'Blitz', surv: 'Survival', streak: 'Streaks', level: 'Levels', explore: 'Exploration', quest: 'Quests', life: 'Lifestyle', secret: 'Secret' };
const TIERS = ['', 'Common', 'Rare', 'Epic', 'Legendary'];
const hourNow = () => new Date().getHours();
const BADGES = [
  ['first', '🧪', 'First reaction', 'Finish your first challenge', 1, 'start', g => g.sets + g.blitzPlays + g.survPlays >= 1],
  ['sets10', '⚗️', 'Regular', 'Finish 10 challenges', 1, 'start', g => g.sets >= 10],
  ['sets50', '🧫', 'Lab rat', 'Finish 50 challenges', 2, 'start', g => g.sets >= 50],
  ['sets200', '🏛️', 'Institution', 'Finish 200 challenges', 4, 'start', g => g.sets >= 200],
  ['c10', '✅', 'Warm-up', '10 right answers', 1, 'know', g => g.correct >= 10],
  ['c50', '📗', 'Well-read', '50 right answers', 2, 'know', g => g.correct >= 50],
  ['c200', '📚', 'Encyclopedic', '200 right answers', 3, 'know', g => g.correct >= 200],
  ['c1000', '🧠', 'Walking textbook', '1,000 right answers', 4, 'know', g => g.correct >= 1000],
  ['perfect', '💎', 'Flawless', '5/5 in a Classic challenge', 2, 'acc', g => g.perfects >= 1],
  ['perfect5', '💠', 'Diamond run', '5 flawless challenges', 3, 'acc', g => g.perfects >= 5],
  ['perfect25', '👑', 'Crown jewel', '25 flawless challenges', 4, 'acc', g => g.perfects >= 25],
  ['unassisted', '🦾', 'Unassisted', 'Flawless without any lifeline', 2, 'acc', (g, s) => s && s.end && s.mode === 'classic' && s.score === PER && !s.used.half && !s.used.swap],
  ['comeback', '🔄', 'Comeback', 'Miss the first round, then win the other 4', 2, 'acc', (g, s) => s && s.end && s.mode === 'classic' && s.firstWrong && s.score === PER - 1],
  ['combo3', '🔥', 'Ignition', 'Reach a ×3 combo', 1, 'combo', g => g.comboBest >= 3],
  ['combo', '💥', 'Chain reaction', 'Reach a ×5 combo', 2, 'combo', g => g.comboBest >= 5],
  ['combo10', '☄️', 'Runaway reaction', 'Reach a ×10 combo', 3, 'combo', g => g.comboBest >= 10],
  ['combo25', '🌋', 'Supernova', 'Reach a ×25 combo', 4, 'combo', g => g.comboBest >= 25],
  ['speed1', '⚡', 'Quick thinker', 'Earn a speed bonus', 1, 'speed', g => g.speeds >= 1],
  ['speedset', '🌩️', 'Lightning round', '3 speed bonuses in one challenge', 2, 'speed', (g, s) => s && s.speeds >= 3],
  ['speed50', '🏎️', 'Rapid kinetics', '50 speed bonuses', 3, 'speed', g => g.speeds >= 50],
  ['bull', '🎯', 'Time traveler', 'Guess a year within 3 years', 1, 'hist', g => g.bulls >= 1],
  ['exact', '🕰️', 'Precise clock', 'Guess the exact year', 3, 'hist', g => g.exacts >= 1],
  ['bull10', '🗓️', 'Living calendar', '10 bullseye years', 3, 'hist', g => g.bulls >= 10],
  ['order', '🧭', 'Historian', 'Put history in perfect order', 1, 'hist', g => g.orders >= 1],
  ['order10', '📜', 'Chronicler', '10 perfect orders', 3, 'hist', g => g.orders >= 10],
  ['match', '🧩', 'Connector', 'Match every pair', 1, 'hist', g => g.matches >= 1],
  ['match10', '🕸️', 'Master networker', '10 perfect matchings', 3, 'hist', g => g.matches >= 10],
  ['blitz1', '⏱️', 'Blitz debut', 'Play a Blitz round', 1, 'blitz', g => g.blitzPlays >= 1],
  ['blitz10', '🚀', 'Liftoff', '10 right in one Blitz', 2, 'blitz', g => g.blitzBest >= 10],
  ['blitz15', '🛸', 'Hyperdrive', '15 right in one Blitz', 3, 'blitz', g => g.blitzBest >= 15],
  ['blitz20', '🌠', 'Shooting star', '20 right in one Blitz', 4, 'blitz', g => g.blitzBest >= 20],
  ['surv1', '❤️', 'Survivor', 'Play Survival', 1, 'surv', g => g.survPlays >= 1],
  ['surv10', '🛡️', 'Shielded', 'Reach 10 in Survival', 2, 'surv', g => g.survBest >= 10],
  ['surv25', '🏰', 'Fortress', 'Reach 25 in Survival', 3, 'surv', g => g.survBest >= 25],
  ['surv50', '🐉', 'Unkillable', 'Reach 50 in Survival', 4, 'surv', g => g.survBest >= 50],
  ['s3', '📅', 'Three days running', 'Reach a 3-day streak', 1, 'streak', g => g.best >= 3],
  ['s7', '🏆', 'Week of chemistry', 'Reach a 7-day streak', 2, 'streak', g => g.best >= 7],
  ['s14', '🔆', 'Fortnight', 'Reach a 14-day streak', 3, 'streak', g => g.best >= 14],
  ['s30', '🌕', 'Full moon', 'Reach a 30-day streak', 4, 'streak', g => g.best >= 30],
  ['s100', '💯', 'Centurion', 'Reach a 100-day streak', 4, 'streak', g => g.best >= 100],
  ['freeze', '🧊', 'Ice cold', 'A streak freeze saved your streak', 2, 'streak', g => g.freezesUsed >= 1],
  ['lv3', '🫧', 'Molecule', 'Reach level 3', 1, 'level', g => level(g.xp).i >= 2],
  ['lv5', '🧬', 'Intermediate', 'Reach level 5', 2, 'level', g => level(g.xp).i >= 4],
  ['lv6', '⚙️', 'Catalyst', 'Reach level 6', 2, 'level', g => level(g.xp).i >= 5],
  ['lv8', '🥼', 'Chemist', 'Reach level 8', 3, 'level', g => level(g.xp).i >= 7],
  ['lv10', '🎓', 'Professor', 'Reach level 10', 4, 'level', g => level(g.xp).i >= 9],
  ['lv11', '🏅', 'Nobel Laureate', 'Reach the top level', 4, 'level', g => level(g.xp).i >= 10],
  ['ex2', '🚪', 'Curious', 'Play on 2 Chemisters pages', 1, 'explore', g => g.fields.length >= 2],
  ['explorer', '🗺️', 'Explorer', 'Play on 3 Chemisters pages', 2, 'explore', g => g.fields.length >= 3],
  ['ex10', '🌍', 'Globetrotter', 'Play on 10 Chemisters pages', 3, 'explore', g => g.fields.length >= 10],
  ['ex25', '🌌', 'Polymath', 'Play on 25 Chemisters pages', 4, 'explore', g => g.fields.length >= 25],
  ['q1', '📋', 'On a mission', 'Complete a daily quest', 1, 'quest', g => g.questsDone >= 1],
  ['sweep', '✨', 'Clean sweep', 'Complete all 3 quests in one day', 2, 'quest', g => g.sweeps >= 1],
  ['q30', '🎖️', 'Quest master', 'Complete 30 quests', 3, 'quest', g => g.questsDone >= 30],
  ['sweep10', '🌟', 'Unstoppable', '10 clean sweeps', 4, 'quest', g => g.sweeps >= 10],
  ['owl', '🦉', 'Night owl', 'Play between midnight and 5 am', 2, 'life', (g, s) => s && s.end && hourNow() < 5],
  ['bird', '🐦', 'Early bird', 'Play between 5 and 8 am', 2, 'life', (g, s) => s && s.end && hourNow() >= 5 && hourNow() < 8],
  ['weekend', '🛋️', 'Weekend scientist', 'Play on a weekend', 1, 'life', (g, s) => s && s.end && [0, 6].includes(new Date().getDay())],
  ['half', '✂️', 'Fifty-fifty', 'Use a 50/50', 1, 'life', g => g.halves >= 1],
  ['swap', '🔁', 'Second thoughts', 'Swap a question', 1, 'life', g => g.swaps >= 1],
  ['share', '📣', 'Spreading science', 'Share your score', 1, 'life', g => g.shares >= 1],
  ['share10', '📡', 'Broadcaster', 'Share 10 scores', 3, 'life', g => g.shares >= 10],
  ['accident', '🧯', 'Lab accident', 'Score 0/5 — every great chemist has one', 1, 'secret', (g, s) => s && s.end && s.mode === 'classic' && s.score === 0, 1],
  ['pi', '🥧', 'Pi time', 'Play at 3:14', 2, 'secret', (g, s) => { const d = new Date(); return s && s.end && d.getHours() % 12 === 3 && d.getMinutes() === 14; }, 1],
  ['answer42', '🪐', 'The answer', 'Exactly 42 right answers in total', 2, 'secret', g => g.correct === 42, 1],
  ['lastheart', '❤️‍🔥', 'Last-heart hero', '10 right in Survival on your last heart', 3, 'secret', (g, s) => s && s.mode === 'surv' && s.lastHeartRun >= 10, 1]
];

/* ---------- toasts for badges & quests ---------- */
const stack = document.createElement('div'); stack.className = 'btoasts'; document.body.appendChild(stack);
function bigToast(icon, title, sub, cls = '') {
  const el = document.createElement('div'); el.className = `btoast ${cls}`;
  el.innerHTML = `<span class="bt-i">${icon}</span><div><b>${esc(title)}</b><small>${esc(sub)}</small></div>`;
  stack.appendChild(el); setTimeout(() => el.classList.add('out'), 3200); setTimeout(() => el.remove(), 3700);
}
function checkBadges(S) {
  for (const [id, ic, nm, , tier, , test] of BADGES) {
    if (G.badges.includes(id)) continue;
    let ok = false; try { ok = test(G, S); } catch {}
    if (!ok) continue;
    G.badges.push(id); if (S) S.newBadges.push(id);
    bigToast(ic, nm, `${TIERS[tier]} badge unlocked`, `t${tier}`); SFX.play('badge');
    if (tier >= 3) confetti(120);
  }
  saveG();
}

/* ---------- daily quests ---------- */
const QUESTS = {
  answer10: ['Answer 10 questions', 10], correct8: ['Get 8 right answers', 8],
  combo3: ['Reach a ×3 combo', 3, 1], combo5: ['Reach a ×5 combo', 5, 1],
  bull: ['Guess a year within 3 years', 1], perfect: ['Score 5/5 in Classic', 1],
  speed3: ['Earn 3 speed bonuses', 3], history: ['Get a perfect order or matching', 1],
  classic2: ['Finish 2 Classic challenges', 2], pages2: ['Play on 2 Chemisters pages today', 2, 1],
  blitz8: ['Score 8+ in one Blitz', 1, 0, 'blitz'], surv5: ['Reach 5 in Survival', 1, 0, 'surv']
};
function ensureQuests() {
  if (G.quests && G.quests.day === TODAY) return;
  let h = 0; for (const c of TODAY) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const rnd = () => { h = (h + 0x6D2B79F5) >>> 0; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const pool = Object.keys(QUESTS).filter(k => !QUESTS[k][3] || unlocked(QUESTS[k][3]));
  const ids = []; while (ids.length < 3 && pool.length) ids.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  G.quests = { day: TODAY, ids, prog: {}, done: [], pages: [] }; saveG();
}
function quest(id, v = 1) {
  ensureQuests();
  const Q = G.quests, def = QUESTS[id];
  if (!def || !Q.ids.includes(id) || Q.done.includes(id)) return;
  Q.prog[id] = def[2] ? Math.max(Q.prog[id] || 0, v) : (Q.prog[id] || 0) + v;
  if (Q.prog[id] >= def[1]) {
    Q.done.push(id); G.xp += 25; G.questsDone++;
    bigToast('📋', `Quest complete: ${def[0]}`, '+25 XP', 'quest'); SFX.play('quest');
    if (Q.done.length === Q.ids.length) { G.xp += 50; G.sweeps++; setTimeout(() => { bigToast('✨', 'Clean sweep!', 'All daily quests done · +50 XP', 'quest'); SFX.play('level'); confetti(140); }, 700); }
  }
  saveG();
}

/* ---------- streak (with freezes) ---------- */
function streakInfo() {
  if (!G.last) return { state: 'none', n: 0 };
  const d = daysBetween(G.last, TODAY);
  if (d === 0) return { state: 'done', n: G.streak };
  if (d === 1) return { state: 'alive', n: G.streak };
  if (d === 2 && G.freezes > 0) return { state: 'frozen', n: G.streak };
  return { state: 'lost', n: 0 };
}
function updateStreak(S) {
  if (G.last === TODAY) return;
  const d = G.last ? daysBetween(G.last, TODAY) : 99;
  if (d === 1) G.streak++;
  else if (d === 2 && G.freezes > 0) { G.freezes--; G.freezesUsed++; G.streak++; S.notes.push('🧊 A streak freeze saved your streak!'); }
  else G.streak = 1;
  G.last = TODAY; G.playDays++; S.xp += 10;
  if (G.streak % 7 === 0 && G.freezes < 2) { G.freezes++; S.notes.push('🧊 You earned a streak freeze (protects one missed day).'); }
  G.best = Math.max(G.best, G.streak);
  SFX.play('whoosh');
}

/* ---------- effects ---------- */
function confetti(n = 80, x = innerWidth / 2, y = innerHeight / 3) {
  if (REDUCED) return;
  const c = document.createElement('canvas'), ctx = c.getContext('2d'), dpr = devicePixelRatio || 1;
  c.className = 'confetti'; c.width = innerWidth * dpr; c.height = innerHeight * dpr; document.body.appendChild(c); ctx.scale(dpr, dpr);
  const cs = getComputedStyle(document.documentElement);
  const cols = ['--accent', '--accent2', '--ok'].map(v => cs.getPropertyValue(v).trim()).concat(['#fbbf24', '#f472b6']);
  const P = Array.from({ length: n }, () => ({ x, y, vx: (Math.random() - .5) * 13, vy: -Math.random() * 12 - 3, r: Math.random() * 6 + 3, c: pick(cols), a: Math.random() * 6, va: (Math.random() - .5) * .4, hex: Math.random() < .35 }));
  let t = 0;
  (function f() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    P.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += .35; p.vx *= .99; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - t / 90);
      if (p.hex) { ctx.beginPath(); for (let k = 0; k < 6; k++) ctx.lineTo(p.r * Math.cos(k * Math.PI / 3), p.r * Math.sin(k * Math.PI / 3)); ctx.closePath(); ctx.strokeStyle = p.c; ctx.lineWidth = 2; ctx.stroke(); }
      else ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
      ctx.restore();
    });
    if (++t < 90) requestAnimationFrame(f); else c.remove();
  })();
}
const burstAt = el => { const r = el.getBoundingClientRect(); confetti(30, r.left + r.width / 2, r.top + r.height / 2); };
function floatXP(el, txt, cls = '') {
  const r = el.getBoundingClientRect(), s = document.createElement('span');
  s.className = `xp-float ${cls}`; s.textContent = txt; s.style.left = `${r.left + r.width / 2}px`; s.style.top = `${r.top}px`;
  document.body.appendChild(s); setTimeout(() => s.remove(), 1100);
}

/* ---------- question generators ---------- */
const BR = F.branches.filter(b => b.example);
const EV = T.map((e, i) => ({ ...e, i }));
let BANK = [];
function genYear(avoid) { const c = shuffle(EV).find(e => !avoid.has(`y${e.i}`)) || pick(EV); return { id: `y${c.i}`, type: 'year', ev: c }; }
function genOrder() {
  const evs = [], used = new Set();
  for (const e of shuffle(EV)) { if (!used.has(e.year)) { used.add(e.year); evs.push(e); } if (evs.length === 4) break; }
  return { id: `o${evs.map(e => e.i).sort((a, b) => a - b).join('-')}`, type: 'order', evs };
}
function genMatch() { const bs = shuffle(BR).slice(0, 3); return { id: `m${bs.map(b => b.name).join('|')}`, type: 'match', bs }; }
function genBranchMCQ(avoid = new Set()) {
  const i = shuffle(F.branches.map((_, k) => k)).find(k => !avoid.has(`b${k}`)) ?? 0, b = F.branches[i];
  return { id: `b${i}`, type: 'mcq', q: `Which branch is this? “${b.summary}”`, options: [b.name, ...shuffle(F.branches.filter((_, k) => k !== i)).slice(0, 3).map(x => x.name)], answer: 0, explain: `${b.name}. Example: ${b.example}` };
}
function genFirst() {
  let a, b; do { [a, b] = shuffle(EV).slice(0, 2); } while (a.year === b.year);
  const [e, l] = a.year < b.year ? [a, b] : [b, a];
  return { id: `f${e.i}-${l.i}`, type: 'mcq', q: 'Which came first?', options: [e.title, l.title], answer: 0, explain: `${e.title} — ${e.year}. ${l.title} — ${l.year}.` };
}
function genYearMCQ() {
  const e = pick(EV), others = shuffle([...new Set(EV.filter(x => x.year !== e.year).map(x => x.year))]).slice(0, 3);
  return { id: `ym${e.i}`, type: 'mcq', q: `In which year? ${e.title}`, options: [String(e.year), ...others.map(String)], answer: 0, explain: `${e.year}: ${e.text}` };
}
function quickQ(used) {
  for (let t = 0; t < 40; t++) {
    const r = Math.random();
    const q = r < .4 && BANK.length ? { ...pick(BANK), type: 'mcq' } : r < .62 ? genFirst() : r < .82 ? genYearMCQ() : genBranchMCQ();
    if (!used.has(q.id)) { used.add(q.id); return q; }
  }
  return genFirst();
}
function nextSet() {
  let seen = store.get(SEEN, []);
  const recent = new Set(seen.slice(-60));
  let fresh = shuffle(BANK.filter(q => !seen.includes(q.id)));
  if (fresh.length < 3) { const last = new Set(seen.slice(-PER)); seen = seen.slice(-PER); fresh = shuffle(BANK.filter(q => !last.has(q.id))); }
  const mcqs = fresh.slice(0, 3).map(q => ({ ...q, type: 'mcq' }));
  while (mcqs.length < 3) mcqs.push(genBranchMCQ(recent));
  const set = [mcqs[0], genYear(recent), mcqs[1], Math.random() < .5 && BR.length >= 3 ? genMatch() : genOrder(), mcqs[2]];
  store.set(SEEN, [...seen, ...set.map(q => q.id)].slice(-2000));
  return set;
}
function swapFor(q, set) {
  const ids = new Set(set.map(x => x.id));
  if (q.type === 'year') return genYear(ids);
  if (q.type === 'order') return genOrder();
  if (q.type === 'match') return genMatch();
  const seen = store.get(SEEN, []), cand = shuffle(BANK.filter(b => !seen.includes(b.id) && !ids.has(b.id)));
  if (cand.length) { store.set(SEEN, [...seen, cand[0].id]); return { ...cand[0], type: 'mcq' }; }
  return genBranchMCQ(ids);
}

/* ---------- HUD ---------- */
const sndBtn = () => `<button class="snd" type="button" aria-label="Sound on/off" title="Sound">${SFX.on ? '🔊' : '🔇'}</button>`;
function hud(S) {
  const xp = G.xp + (S ? S.xp : 0), L = level(xp), pct = L.to ? Math.min(100, (xp - L.from) / (L.to - L.from) * 100) : 100, st = streakInfo();
  return `<div class="hud">
    <div class="hud-lvl"><span class="lvl-badge">Lv ${L.i + 1}</span><div><b>${L.name}</b><div class="xpbar" title="${xp} XP"><i style="width:${pct}%"></i></div></div></div>
    <div class="hud-right">
      ${S && S.mode === 'surv' ? `<span class="hearts">${'❤️'.repeat(S.lives)}${'🖤'.repeat(3 - S.lives)}</span>` : ''}
      ${S ? `<span class="combo${S.combo > 1 ? ' on' : ''}" id="combo">🔥 ×${S.combo}</span>` : ''}
      <span class="streak${st.n ? ' on' : ''}" title="Daily streak">${st.n ? '🔥' : '🕯️'} ${st.n}<small>d</small></span>
      ${G.freezes ? `<span class="frz" title="Streak freezes: each protects one missed day">🧊${G.freezes}</span>` : ''}
      ${sndBtn()}</div></div>`;
}
qz.addEventListener('click', e => {
  if (e.target.closest('.snd')) { const on = SFX.toggle(); $$('.snd').forEach(b => b.textContent = on ? '🔊' : '🔇'); }
});

/* ---------- start screen ---------- */
function startScreen() {
  ensureQuests();
  const st = streakInfo(), Q = G.quests, L = level(G.xp);
  const line = st.state === 'done' ? `✅ Streak safe today — <b>${G.streak} day${G.streak > 1 ? 's' : ''}</b>. Keep playing for XP and quests.`
    : st.state === 'alive' ? `⏳ Play today to keep your <b>${G.streak}-day streak</b> alive.`
    : st.state === 'frozen' ? `🧊 You missed yesterday — a streak freeze will save your <b>${G.streak}-day streak</b> if you play today.`
    : st.state === 'lost' ? `Your ${G.streak}-day streak ended. Start a new one today.`
    : 'Play today to start your streak. It counts on every Chemisters page.';
  const best = { blitz: G.blitzBest, surv: G.survBest };
  qz.innerHTML = `${hud()}
  <div class="start">
    <div class="start-icon" aria-hidden="true">⚗️</div>
    <h3>Choose your mode</h3>
    <p class="start-streak">${line}</p>
    <div class="modes">${Object.entries(MODES).map(([k, m]) => {
      const open = unlocked(k);
      return `<button class="mode${open ? '' : ' locked'}" type="button" data-mode="${k}" ${open ? '' : 'aria-disabled="true"'}>
        <span class="m-ic">${open ? m.icon : '🔒'}</span><b>${m.name}</b><small>${open ? m.desc : `Unlocks at ${LEVELS[m.unlock][1]} (Lv ${m.unlock + 1})`}</small>
        ${open && best[k] ? `<em>Best: ${best[k]}</em>` : ''}</button>`;
    }).join('')}</div>
    <div class="quests"><div class="qh"><b>📋 Daily quests</b><small>New ones tomorrow · +25 XP each · +50 for all 3</small></div>
      ${Q.ids.map(id => { const [t, goal] = QUESTS[id], p = Math.min(goal, Q.prog[id] || 0), done = Q.done.includes(id);
        return `<div class="qr${done ? ' done' : ''}"><span>${done ? '✅' : '◻️'}</span><div><p>${esc(t)}</p><div class="qbar"><i style="width:${p / goal * 100}%"></i></div></div><small>${p}/${goal}</small></div>`; }).join('')}</div>
    <div class="start-links">
      <button class="pill" type="button" data-panel="badges">🏅 Badges ${G.badges.length}/${BADGES.length}</button>
      <button class="pill" type="button" data-panel="stats">📊 Stats</button>
      <button class="pill" type="button" data-panel="levels">🧗 Levels</button>
    </div>
    <div class="panel" id="panel" hidden></div>
  </div>`;
  $$('#qz .mode').forEach(b => b.onclick = () => {
    const m = b.dataset.mode;
    if (!unlocked(m)) { SFX.play('wrong'); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); toast(`Reach ${LEVELS[MODES[m].unlock][1]} to unlock ${MODES[m].name}`); return; }
    track(`quiz-start-${m}/${F.slug}`); SFX.play('start');
    ({ classic: playClassic, blitz: playBlitz, surv: playSurvival })[m]();
  });
  bindPanels(); void L;
}
function bindPanels() {
  $$('#qz [data-panel]').forEach(b => b.onclick = () => {
    const p = $('#panel'), which = b.dataset.panel;
    if (!p.hidden && p.dataset.on === which) { p.hidden = true; return; }
    p.dataset.on = which; p.hidden = false; SFX.play('tap');
    p.innerHTML = which === 'badges' ? badgeWall() : which === 'stats' ? statsPanel() : levelsPanel();
  });
}
function badgeWall(fresh = []) {
  return Object.entries(CATS).map(([c, title]) => {
    const list = BADGES.filter(b => b[5] === c), got = list.filter(b => G.badges.includes(b[0])).length;
    return `<div class="bw-cat"><h4>${title}<span>${got}/${list.length}</span></h4><div class="badges">${list.map(([id, ic, nm, how, tier, , , secret]) => {
      const has = G.badges.includes(id), hide = secret && !has;
      return `<div class="badge t${tier}${has ? ' got' : ''}${fresh.includes(id) ? ' new' : ''}" title="${esc(hide ? 'Secret badge' : how)}">
        <span>${hide ? '❓' : ic}</span><b>${esc(hide ? 'Secret' : nm)}</b><small>${esc(hide ? 'Keep playing to find it' : how)}</small><i>${TIERS[tier]}</i></div>`;
    }).join('')}</div></div>`;
  }).join('');
}
function statsPanel() {
  const acc = G.answered ? Math.round(G.correct / G.answered * 100) : 0;
  const tiles = [['🎯', `${acc}%`, 'accuracy'], ['✅', G.correct, 'right answers'], ['🧪', G.sets, 'Classic played'], ['💎', G.perfects, 'flawless'],
    ['🔥', G.comboBest, 'best combo'], ['📅', G.best, 'longest streak'], ['⏱️', G.blitzBest, 'best Blitz'], ['❤️', G.survBest, 'best Survival'],
    ['⚡', G.speeds, 'speed bonuses'], ['🎯', G.bulls, 'bullseye years'], ['🗺️', G.fields.length, 'pages played'], ['📋', G.questsDone, 'quests done']];
  return `<div class="stats">${tiles.map(([i, v, l]) => `<div><span>${i}</span><b>${v}</b><small>${l}</small></div>`).join('')}</div>`;
}
function levelsPanel() {
  const cur = level(G.xp).i;
  return `<ol class="lvls">${LEVELS.map(([xp, n], i) => `<li class="${i < cur ? 'past' : i === cur ? 'cur' : ''}"><b>Lv ${i + 1} · ${n}</b><small>${xp} XP${i === 1 ? ' · unlocks Blitz' : i === 2 ? ' · unlocks Survival' : ''}</small></li>`).join('')}</ol>`;
}

/* ---------- shared answer bookkeeping ---------- */
const PRAISE = ['Nailed it!', 'Exactly right!', 'Textbook!', 'Spot on!', 'Brilliant!', 'Perfect yield!', 'Clean reaction!', 'You know your stuff!', 'Sharp!', 'Beautiful!'];
const NUDGE = ['Not quite — here’s the trick:', 'Close call. Remember this:', 'Good guess, but:', 'This one fools many chemists:', 'Now you’ll never forget it:'];
function newS(mode) {
  return { mode, k: 0, score: 0, xp: 0, combo: 0, maxCombo: 0, lives: 3, log: [], newBadges: [], notes: [], used: { half: false, swap: false }, speeds: 0, lvl0: level(G.xp).i, firstWrong: false, lastHeartRun: 0, end: false };
}
function recordAnswer(S, ok, el, base, info = {}) {
  G.answered++; quest('answer10');
  if (ok) {
    S.score++; S.combo++; S.maxCombo = Math.max(S.maxCombo, S.combo); G.correct++;
    G.comboBest = Math.max(G.comboBest, S.combo);
    const bonus = Math.min(10, (S.combo - 1) * 2) + (info.speed ? 3 : 0);
    S.xp += base + bonus;
    if (el) { floatXP(el, `+${base + bonus} XP`); if (S.mode !== 'blitz') burstAt(el); }
    SFX.play('correct', S.combo);
    if ([3, 5, 10, 15, 20, 25].includes(S.combo)) { SFX.play('combo', S.combo); bigToast('🔥', `×${S.combo} combo!`, 'Keep the reaction going', 'combo'); }
    quest('correct8'); quest('combo3', S.combo); quest('combo5', S.combo);
    if (S.mode === 'surv' && S.lives === 1) S.lastHeartRun++;
    buzz(15);
  } else {
    if (S.k === 0 && S.mode === 'classic') S.firstWrong = true;
    S.combo = 0; S.xp += S.mode === 'blitz' ? 0 : 2; SFX.play('wrong'); buzz([30, 40, 30]);
    if (el) el.classList.add('shake');
  }
  if (info.speed) { G.speeds++; S.speeds++; quest('speed3'); }
  if (info.bull) { G.bulls++; quest('bull'); }
  if (info.exact) G.exacts++;
  if (info.order) { G.orders++; quest('history'); }
  if (info.match) { G.matches++; quest('history'); }
  checkBadges(S); saveG();
}

/* ---------- MCQ renderer (used by all modes) ---------- */
function mcqHTML(q, order, label) {
  return `<div class="q-kind">${label}</div><div class="q-text">${esc(q.q)}</div>
    <div class="opts${order.length === 2 ? ' two' : ''}">${order.map((o, i) => `<button class="opt" type="button" data-i="${i}"><kbd>${i + 1}</kbd><span>${esc(o.t)}</span></button>`).join('')}</div>`;
}
function bindMCQ(order, onPick) {
  const btns = $$('#qz .opt');
  const choose = i => {
    if (!btns[i] || btns[0].disabled || btns[i].classList.contains('gone')) return;
    btns.forEach((x, j) => { x.disabled = true; if (order[j].ok) x.classList.add('right'); });
    if (!order[i].ok) btns[i].classList.add('wrong');
    onPick(order[i].ok, btns[i], order[i].t, order.find(o => o.ok).t);
  };
  btns.forEach((b, i) => b.onclick = () => choose(i));
  qz.onkeydown = e => { const k = +e.key; if (k >= 1 && k <= btns.length) choose(k - 1); };
  return btns;
}

/* =============== CLASSIC =============== */
function playClassic() {
  const set = nextSet(), S = newS('classic');
  const dots = () => `<div class="q-bar">${set.map((_, i) => `<i class="${S.log[i] ? (S.log[i].ok ? 'ok' : 'no') : (i === S.k ? 'on' : '')}"></i>`).join('')}</div>`;
  let t0 = 0;
  function frame(inner) {
    const q = set[S.k], canHalf = !S.used.half && q.type === 'mcq' && q.options.length >= 4;
    qz.innerHTML = `${hud(S)}<div class="q-top"><span>Round ${S.k + 1} of ${set.length}</span>${dots()}</div>
      <div class="lifelines"><button type="button" class="ll" id="ll-half" ${canHalf ? '' : 'disabled'}>✂️ 50/50</button><button type="button" class="ll" id="ll-swap" ${S.used.swap ? 'disabled' : ''}>🔁 Swap</button><span class="ll-tip">⚡ answer fast for bonus XP</span></div>
      <div class="q-stage">${inner}</div><div class="qfb" id="fb" hidden></div>`;
    $('#ll-swap').onclick = () => { S.used.swap = true; G.swaps++; SFX.play('pop'); set[S.k] = swapFor(q, set); checkBadges(S); show(); };
    t0 = performance.now();
  }
  function lockLifelines() { $$('#qz .ll').forEach(b => b.disabled = true); }
  function resolve(ok, base, el, explain, headline, info = {}, logItem) {
    lockLifelines();
    recordAnswer(S, ok, el, base, info);
    S.log.push({ ok, ...logItem });
    const fb = $('#fb');
    fb.className = `qfb ${ok ? 'good' : 'bad'}`;
    fb.innerHTML = `<b>${headline || (ok ? pick(PRAISE) : pick(NUDGE))}</b>${info.speed ? '<span class="spd">⚡ Speed bonus +3</span>' : ''}<div>${explain}</div>
      <button class="btn go" type="button" id="cont">${S.k < set.length - 1 ? 'Continue →' : 'See results →'}</button>`;
    fb.hidden = false;
    qz.querySelector('.hud').outerHTML = hud(S);
    qz.querySelector('.q-bar').outerHTML = dots();
    $('#cont').onclick = () => { SFX.play('tap'); S.k++; S.k < set.length ? show() : finishClassic(S, set); };
    $('#cont').focus({ preventScroll: true });
    fb.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'nearest' });
  }
  function show() {
    const q = set[S.k];
    ({ mcq: showMCQ, year: showYear, order: showOrder, match: showMatch })[q.type](q);
  }
  function showMCQ(q) {
    const order = shuffle(q.options.map((t, i) => ({ t, ok: i === q.answer })));
    frame(mcqHTML(q, order, '🔤 Multiple choice'));
    const btns = bindMCQ(order, (ok, el, yours, right) => {
      const speed = ok && performance.now() - t0 < 7000;
      resolve(ok, 10, el, esc(q.explain), null, { speed }, { q: q.q, yours, right });
    });
    const half = $('#ll-half');
    if (!half.disabled) half.onclick = () => {
      S.used.half = true; G.halves++; SFX.play('pop'); half.disabled = true;
      shuffle(order.map((o, i) => i).filter(i => !order[i].ok)).slice(0, order.length - 2).forEach(i => { btns[i].classList.add('gone'); btns[i].disabled = true; });
      checkBadges(S);
    };
  }
  function showYear(q) {
    const e = q.ev, lo = Math.floor((Math.min(...T.map(t => t.year)) - 40) / 10) * 10, hi = Math.max(new Date().getFullYear(), Math.max(...T.map(t => t.year))), start = Math.round((lo + hi) / 2);
    frame(`<div class="q-kind">🎚️ Guess the year</div><div class="q-text">When did this happen?</div>
      <div class="yr-card"><b>${esc(e.title)}</b><p>${esc(e.text)}</p></div>
      <div class="yr"><output id="yr-out">${start}</output>
        <div class="yr-wrap"><input type="range" id="yr" min="${lo}" max="${hi}" value="${start}" step="1" aria-label="Year"><div class="yr-mark" id="yr-mark" hidden></div></div>
        <div class="yr-scale"><span>${lo}</span><span>${hi}</span></div>
        <div class="yr-fine"><button type="button" data-d="-10">−10</button><button type="button" data-d="-1">−1</button><button type="button" data-d="1">+1</button><button type="button" data-d="10">+10</button></div>
        <p class="yr-rule">🎯 within 3 years = bullseye · within 15 = correct</p>
        <button class="btn go" type="button" id="lock">Lock in</button></div>`);
    const r = $('#yr'), out = $('#yr-out');
    const upd = () => { out.textContent = r.value; r.style.setProperty('--p', `${(r.value - lo) / (hi - lo) * 100}%`); SFX.play('tick'); };
    r.oninput = upd; out.textContent = r.value; r.style.setProperty('--p', '50%');
    $$('.yr-fine button').forEach(b => b.onclick = () => { r.value = +r.value + +b.dataset.d; upd(); });
    $('#ll-half').disabled = true;
    $('#lock').onclick = () => {
      const g = +r.value, d = Math.abs(g - e.year);
      SFX.play('lock'); r.disabled = true; $$('.yr-fine button').forEach(b => b.disabled = true); $('#lock').remove();
      const m = $('#yr-mark'); m.hidden = false; m.style.left = `${(e.year - lo) / (hi - lo) * 100}%`; m.dataset.y = e.year;
      const ok = d <= 15, bull = d <= 3;
      const head = d === 0 ? '🕰️ The exact year! Incredible.' : bull ? `🎯 Bullseye — only ${d} year${d > 1 ? 's' : ''} off!` : ok ? `Close — ${d} years off. Counts!` : `${d} years off.`;
      resolve(ok, bull ? 15 : 10, out, `<b>${e.year}:</b> ${esc(e.title)}. ${esc(e.why || '')}`, head, { bull, exact: d === 0 }, { q: `When: ${e.title}`, yours: g, right: e.year });
    };
  }
  function showOrder(q) {
    const cards = shuffle(q.evs), seq = [];
    frame(`<div class="q-kind">🧭 Put in order</div><div class="q-text">Tap from the <u>earliest</u> to the <u>latest</u>.</div>
      <div class="ord">${cards.map((e, i) => `<button class="ord-card" type="button" data-i="${i}"><span class="ord-n"></span><span>${esc(e.title)}</span></button>`).join('')}</div>
      <button class="btn go" type="button" id="chk" disabled>Check order</button>`);
    $('#ll-half').disabled = true;
    const btns = $$('#qz .ord-card');
    const paint = () => { btns.forEach((b, i) => { const p = seq.indexOf(i); b.classList.toggle('sel', p >= 0); b.querySelector('.ord-n').textContent = p >= 0 ? p + 1 : ''; }); $('#chk').disabled = seq.length !== cards.length; };
    btns.forEach((b, i) => b.onclick = () => { const p = seq.indexOf(i); if (p >= 0) seq.splice(p); else seq.push(i); SFX.play('tap'); paint(); });
    $('#chk').onclick = () => {
      const right = cards.map((e, i) => i).sort((a, b) => cards[a].year - cards[b].year);
      let pos = 0; seq.forEach((i, k) => { if (right[k] === i) pos++; });
      btns.forEach((b, i) => { b.disabled = true; b.classList.add(right.indexOf(i) === seq.indexOf(i) ? 'right' : 'wrong'); b.insertAdjacentHTML('beforeend', `<em>${cards[i].year}</em>`); });
      $('#chk').remove();
      const ok = pos === cards.length;
      resolve(ok, 15, $('#qz .ord'), `Correct order: ${right.map(i => `<b>${cards[i].year}</b> ${esc(cards[i].title)}`).join(' → ')}`, ok ? '🧭 Perfect timeline!' : `${pos} of ${cards.length} in the right place.`, { order: ok }, { q: 'Put events in order', yours: `${pos}/${cards.length} in place`, right: 'all 4' });
    };
  }
  function showMatch(q) {
    const L = q.bs, R = shuffle(L.map((b, i) => ({ t: b.example, i }))), pairs = {}; let selL = 0;
    frame(`<div class="q-kind">🧩 Match the pairs</div><div class="q-text">Match each branch to its example.</div>
      <div class="mt"><div class="mt-col">${L.map((b, i) => `<button class="mt-l" type="button" data-i="${i}">${esc(b.name)}</button>`).join('')}</div>
      <div class="mt-col">${R.map((r, j) => `<button class="mt-r" type="button" data-j="${j}">${esc(r.t)}</button>`).join('')}</div></div>
      <button class="btn go" type="button" id="chk" disabled>Check pairs</button>`);
    $('#ll-half').disabled = true;
    const lb = $$('#qz .mt-l'), rb = $$('#qz .mt-r'), COL = ['c1', 'c2', 'c3'];
    const paint = () => {
      lb.forEach((b, i) => { b.className = 'mt-l' + (selL === i ? ' sel' : '') + (pairs[i] !== undefined ? ` ${COL[i]}` : ''); });
      rb.forEach((b, j) => { const i = Object.keys(pairs).find(k => pairs[k] === j); b.className = 'mt-r' + (i !== undefined ? ` ${COL[i]}` : ''); });
      $('#chk').disabled = Object.keys(pairs).length !== L.length;
    };
    lb.forEach((b, i) => b.onclick = () => { if (pairs[i] !== undefined) delete pairs[i]; selL = selL === i ? null : i; SFX.play('tap'); paint(); });
    rb.forEach((b, j) => b.onclick = () => {
      const owner = Object.keys(pairs).find(k => pairs[k] === j); if (owner !== undefined) delete pairs[owner];
      if (selL !== null) { pairs[selL] = j; const nx = L.findIndex((_, k) => pairs[k] === undefined); selL = nx < 0 ? null : nx; }
      SFX.play('tap'); paint();
    });
    paint();
    $('#chk').onclick = () => {
      let good = 0;
      lb.forEach((b, i) => { const ok = R[pairs[i]].i === i; good += ok; b.classList.add(ok ? 'right' : 'wrong'); b.disabled = true; });
      rb.forEach(b => b.disabled = true); $('#chk').remove();
      const ok = good === L.length;
      resolve(ok, 15, $('#qz .mt'), L.map(b => `<b>${esc(b.name)}</b> → ${esc(b.example)}`).join('<br>'), ok ? '🧩 All pairs matched!' : `${good} of ${L.length} pairs right.`, { match: ok }, { q: 'Match branches to examples', yours: `${good}/${L.length} pairs`, right: 'all 3' });
    };
  }
  show();
}

/* =============== BLITZ =============== */
function playBlitz() {
  const S = newS('blitz'), used = new Set(), END = Date.now() + 60000; let lastSec = 60, timer;
  qz.innerHTML = `${hud(S)}<div class="bz"><div class="bz-bar"><i id="bzbar"></i></div><b id="bzt">60</b></div>
    <div class="bz-score">Score <b id="bzs">0</b></div><div class="q-stage" id="stage"></div>`;
  const over = () => { if (S.end) return; S.end = true; clearInterval(timer); qz.onkeydown = null; finishQuick(S); };
  timer = setInterval(() => {
    const ms = END - Date.now(), sec = Math.max(0, Math.ceil(ms / 1000));
    const bar = $('#bzbar'); if (!bar) return clearInterval(timer);
    bar.style.width = `${Math.max(0, ms / 600)}%`; $('#bzt').textContent = sec;
    if (sec !== lastSec) { lastSec = sec; if (sec <= 5 && sec > 0) { SFX.play('clock'); $('#bzt').classList.add('hot'); } }
    if (ms <= 0) over();
  }, 100);
  function next() {
    if (S.end) return;
    const q = quickQ(used), order = shuffle(q.options.map((t, i) => ({ t, ok: i === q.answer })));
    $('#stage').innerHTML = mcqHTML(q, order, `⏱️ Question ${S.log.length + 1}`);
    $('#stage').classList.remove('q-stage'); void $('#stage').offsetWidth; $('#stage').classList.add('q-stage');
    bindMCQ(order, (ok, el, yours, right) => {
      if (S.end) return;
      recordAnswer(S, ok, el, 4);
      S.log.push({ ok, q: q.q, yours, right });
      $('#bzs').textContent = S.score; qz.querySelector('.hud').outerHTML = hud(S);
      setTimeout(next, ok ? 380 : 950);
    });
  }
  next();
}

/* =============== SURVIVAL =============== */
function playSurvival() {
  const S = newS('surv'), used = new Set();
  function next() {
    const q = quickQ(used), order = shuffle(q.options.map((t, i) => ({ t, ok: i === q.answer })));
    qz.innerHTML = `${hud(S)}<div class="q-top"><span>Question ${S.log.length + 1}</span><span class="surv-score">Score <b>${S.score}</b></span></div>
      <div class="q-stage">${mcqHTML(q, order, '❤️ Survival')}</div><div class="qfb" id="fb" hidden></div>`;
    bindMCQ(order, (ok, el, yours, right) => {
      if (!ok) { S.lives--; SFX.play('life'); }
      recordAnswer(S, ok, el, 5);
      S.log.push({ ok, q: q.q, yours, right });
      qz.querySelector('.hud').outerHTML = hud(S);
      if (S.score >= 5) quest('surv5');
      if (ok) { setTimeout(next, 650); return; }
      const fb = $('#fb'); fb.className = 'qfb bad'; fb.hidden = false;
      fb.innerHTML = `<b>${S.lives ? `💔 ${S.lives} heart${S.lives > 1 ? 's' : ''} left` : '💀 Out of hearts'}</b><div>${esc(q.explain)}</div>
        <button class="btn go" type="button" id="cont">${S.lives ? 'Keep going →' : 'See results →'}</button>`;
      $('#cont').onclick = () => { SFX.play('tap'); S.lives ? next() : (S.end = true, qz.onkeydown = null, finishQuick(S)); };
      $('#cont').focus({ preventScroll: true });
    });
  }
  next();
}

/* =============== RESULTS =============== */
function closeOut(S) {
  S.end = true;
  updateStreak(S);
  if (!G.fields.includes(F.slug)) G.fields.push(F.slug);
  ensureQuests(); if (!G.quests.pages.includes(F.slug)) G.quests.pages.push(F.slug); quest('pages2', G.quests.pages.length);
  G.xp += S.xp; S.xp = 0;
  checkBadges(S); saveG();
  const after = level(G.xp);
  return { after, leveled: after.i > S.lvl0 };
}
function reviewHTML(S) {
  return `<details class="review"><summary>📝 Review your answers</summary><ol>${S.log.map(l =>
    `<li class="${l.ok ? 'ok' : 'no'}"><span>${l.ok ? '✅' : '❌'}</span><div><p>${esc(l.q)}</p><small>${l.ok ? `Your answer: ${esc(l.yours)}` : `You: ${esc(l.yours)} · Correct: <b>${esc(l.right)}</b>`}</small></div></li>`).join('')}</ol></details>`;
}
function shareHTML(text) {
  return `<div class="res-share"><p>Challenge your colleagues</p><div class="follow">
    ${navigator.share ? '<button class="btn go" type="button" id="sh-native">Share my score</button>' : ''}
    <a class="btn share-li" href="https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}" target="_blank" rel="noopener">${F.icons.li}Post on LinkedIn</a>
    <a class="btn share-fb" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(F.url)}" target="_blank" rel="noopener">${F.icons.fb}Share on Facebook</a>
    <button class="btn ghost" type="button" id="sh-copy">Copy</button></div></div>`;
}
function bindShare(text) {
  const shared = kind => { G.shares++; checkBadges(null); saveG(); track(`share-${kind}/${F.slug}`); };
  $('#sh-copy').onclick = async () => { try { await navigator.clipboard.writeText(text); } catch {} toast('Score copied — paste it anywhere'); shared('copy'); };
  $$('.share-li, .share-fb').forEach(a => a.addEventListener('click', () => shared(a.classList.contains('share-li') ? 'linkedin' : 'facebook')));
  const ns = $('#sh-native'); if (ns) ns.onclick = () => navigator.share({ title: `${F.name} challenge`, text }).then(() => shared('native')).catch(() => {});
}
function tailHTML(S, fresh) {
  return `${fresh.length ? `<div class="res-badges"><p>New badge${fresh.length > 1 ? 's' : ''} unlocked</p>${fresh.map(id => { const b = BADGES.find(x => x[0] === id); return `<span class="nb t${b[4]}">${b[1]} ${esc(b[2])}</span>`; }).join('')}</div>` : ''}
    ${S.notes.map(n => `<p class="res-note">${n}</p>`).join('')}
    ${reviewHTML(S)}`;
}
function commonEnd(S, again) {
  $('#again').onclick = () => { SFX.play('start'); again(); qz.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' }); };
  $('#modes').onclick = () => { SFX.play('tap'); startScreen(); };
  bindPanels();
  qz.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
}
function countUp(el, n) { let v = 0; const step = Math.max(1, Math.ceil(n / 30)); (function up() { v = Math.min(n, v + step); el.textContent = `+${v}`; if (v < n) requestAnimationFrame(up); })(); }

function finishClassic(S, set) {
  G.sets++; quest('classic2');
  const perfect = S.score === set.length;
  if (perfect) { G.perfects++; S.xp += 20; quest('perfect'); }
  const gained = S.xp + (G.last === TODAY ? 0 : 10);
  const { after, leveled } = closeOut(S);
  const fresh = S.newBadges, pct = S.score / set.length, R = 52, C = 2 * Math.PI * R;
  const head = pct === 1 ? 'Flawless.' : pct >= .8 ? 'Excellent work!' : pct >= .6 ? 'Solid chemistry!' : pct >= .4 ? 'Good effort — you learned something new.' : 'Every chemist starts here.';
  const text = `I scored ${S.score}/${set.length} on the ${F.name} challenge on Chemisters${G.streak > 1 ? ` (🔥 ${G.streak}-day streak)` : ''}. Can you beat me? ${F.url}`;
  qz.innerHTML = `${hud()}
  <div class="res">
    ${leveled ? `<div class="lvlup">⬆ Level up! You're now a <b>${after.name}</b>${after.i === 1 ? ' · Blitz unlocked!' : after.i === 2 ? ' · Survival unlocked!' : ''}</div>` : ''}
    <div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${R}" class="trk"/><circle cx="60" cy="60" r="${R}" class="val" style="stroke-dasharray:${C};stroke-dashoffset:${C}" id="ringv"/></svg>
      <div class="ring-t"><b>${S.score}/${set.length}</b><span>${head}</span></div></div>
    <div class="res-stats"><div><b id="xpcount">+0</b><span>XP earned</span></div><div><b>🔥 ${G.streak}</b><span>day streak</span></div><div><b>×${S.maxCombo}</b><span>best combo</span></div></div>
    ${after.to ? `<p class="res-next">${after.to - G.xp} XP to <b>${after.next}</b></p>` : '<p class="res-next">Maximum level. Legend.</p>'}
    ${tailHTML(S, fresh)}
    ${shareHTML(text)}
    <div class="res-follow"><p>New questions every visit — and new posts every day. Follow ${esc(F.name)}:</p><div class="follow">${F.followHtml}</div></div>
    <button class="btn go big" type="button" id="again">Play 5 new questions →</button>
    <div class="start-links"><button class="pill" type="button" id="modes">🎮 Modes & quests</button><button class="pill" type="button" data-panel="badges">🏅 Badges ${G.badges.length}/${BADGES.length}</button><button class="pill" type="button" data-panel="stats">📊 Stats</button></div>
    <div class="panel" id="panel" hidden></div>
  </div>`;
  requestAnimationFrame(() => setTimeout(() => { const v = $('#ringv'); if (v) v.style.strokeDashoffset = C * (1 - pct); }, 60));
  countUp($('#xpcount'), gained);
  SFX.play('end', pct >= .6);
  if (leveled) setTimeout(() => SFX.play('level'), 500);
  if (pct >= .6 || leveled) setTimeout(() => confetti(pct === 1 || leveled ? 160 : 90), 250);
  bindShare(text); commonEnd(S, playClassic);
  track(`quiz-done-classic/${F.slug}/${S.score}`);
}

function finishQuick(S) {
  const isB = S.mode === 'blitz', key = isB ? 'blitzBest' : 'survBest', prev = G[key];
  if (isB) { G.blitzPlays++; if (S.score >= 8) quest('blitz8'); } else { G.survPlays++; if (S.score >= 5) quest('surv5'); }
  const record = S.score > prev && S.score > 0; G[key] = Math.max(prev, S.score);
  const gained = S.xp + (G.last === TODAY ? 0 : 10);
  const { after, leveled } = closeOut(S);
  const m = MODES[S.mode];
  const text = `I got ${S.score} in ${m.name} mode on the ${F.name} challenge on Chemisters. Can you beat me? ${F.url}`;
  qz.innerHTML = `${hud()}
  <div class="res">
    ${leveled ? `<div class="lvlup">⬆ Level up! You're now a <b>${after.name}</b></div>` : ''}
    <div class="big-score"><span>${m.icon} ${m.name}</span><b>${S.score}</b><small>${isB ? 'right answers in 60 seconds' : 'right answers before your hearts ran out'}</small>
      ${record ? '<em class="rec">🏆 New personal record!</em>' : prev ? `<em>Your best: ${prev}</em>` : ''}</div>
    <div class="res-stats"><div><b id="xpcount">+0</b><span>XP earned</span></div><div><b>×${S.maxCombo}</b><span>best combo</span></div><div><b>${S.log.length ? Math.round(S.score / S.log.length * 100) : 0}%</b><span>accuracy</span></div></div>
    ${after.to ? `<p class="res-next">${after.to - G.xp} XP to <b>${after.next}</b></p>` : ''}
    ${tailHTML(S, S.newBadges)}
    ${shareHTML(text)}
    <div class="res-follow"><p>Follow ${esc(F.name)} for new posts every day:</p><div class="follow">${F.followHtml}</div></div>
    <button class="btn go big" type="button" id="again">Play ${m.name} again →</button>
    <div class="start-links"><button class="pill" type="button" id="modes">🎮 Modes & quests</button><button class="pill" type="button" data-panel="badges">🏅 Badges ${G.badges.length}/${BADGES.length}</button><button class="pill" type="button" data-panel="stats">📊 Stats</button></div>
    <div class="panel" id="panel" hidden></div>
  </div>`;
  countUp($('#xpcount'), gained);
  if (record) { SFX.play('record'); confetti(150); } else SFX.play('end', S.score >= 5);
  if (leveled) setTimeout(() => SFX.play('level'), 600);
  bindShare(text); commonEnd(S, isB ? playBlitz : playSurvival);
  track(`quiz-done-${S.mode}/${F.slug}/${S.score}`);
}

live.then(d => {
  const extra = (d.quiz || []).filter(q => q && q.id && Array.isArray(q.options) && q.options.length > 1 && Number.isInteger(q.answer));
  const ids = new Set(F.quiz.map(q => q.id));
  BANK = [...F.quiz, ...extra.filter(q => !ids.has(q.id))];
  checkBadges(null);
  startScreen();
});
})();
