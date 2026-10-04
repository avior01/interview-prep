import { loadContent, content, subKey, hasContent } from './content.js';
import * as store from './store.js';
import { esc } from './md.js';
import { lessonHtml } from './lesson.js';
import { buildSession, counts, currentWeek, levelOf, PLAN, isDesktop } from './engine.js';
import { startSession, renderSession, renderSummary, stopSessionTimer } from './session.js';
import * as ai from './ai.js';
import { syncNow, canSync } from './sync.js';

const app = document.getElementById('app');
const st = () => store.get();

// Android Chrome offers installation through this event.
let installEvent = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installEvent = e;
  if (content.questions.length && (!location.hash || location.hash === '#/')) home();
});

// ---------- helpers ----------
let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}
const navigate = (h) => { if (location.hash === h) route(); else location.hash = h; };
const levelDots = (lv) => `<span class="levels" aria-label="רמה ${lv} מתוך 5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= lv ? 'on' : ''}"></i>`).join('')}</span>`;
const fmtDate = (ts) => new Date(ts).toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });

function applyTheme() {
  const t = st().settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

function subStats(key) {
  const qs = content.qBySub[key] || [];
  const items = st().items;
  let seen = 0, weak = 0;
  for (const q of qs) { const it = items[q.id]; if (it) { seen++; if (it.weak) weak++; } }
  return { total: qs.length, seen, weak, level: levelOf(key) };
}

// ---------- views ----------
function home() {
  const c = counts();
  const cur = st().current;
  const week = currentWeek();
  const weekSubs = (PLAN[week - 1] || []).map((k) => content.subById[k]?.name).filter(Boolean);
  const s = st().settings;
  const ivDays = s.interviewDate ? Math.ceil((Date.parse(s.interviewDate) - Date.now()) / 86400000) : null;
  app.innerHTML = `
    <h1>שלום 👋</h1>
    <p class="muted">שבוע ${week} מתוך 16${ivDays !== null && ivDays >= 0 ? ` · ${ivDays} ימים לראיון` : ''}${s.company ? ` · ${s.company === 'nvidia' ? 'NVIDIA' : 'Microsoft'}` : ''}</p>
    ${cur ? `<div class="card"><p><strong>יש סשן פתוח</strong> (${cur.idx}/${cur.ids.length}).</p>
      <div class="actions"><a class="btn primary" href="#/session">להמשיך את הסשן</a><button class="btn" id="dropCur">לסגור אותו</button></div></div>` : ''}
    <div class="card">
      <div class="stats">
        <div class="stat"><b>${c.weak}</b><span>שאלות חלשות</span></div>
        <div class="stat"><b>${c.due}</b><span>חזרות להיום</span></div>
        <div class="stat"><b>${st().streak.count || 0}</b><span>ימים ברצף</span></div>
      </div>
    </div>
    <button class="btn primary big" id="go">המשך ← (${s.sessionLen} שאלות)</button>
    <p class="small muted" style="margin-top:8px">הנושאים של השבוע: ${weekSubs.length ? weekSubs.map((n) => `<bdi>${esc(n)}</bdi>`).join(' · ') : 'חזרה ממוקדת על נקודות חלשות'}</p>
    <div class="grid grid-3" style="margin-top:12px">
      <a class="btn" href="#/practice?m=exam">מבחן כולל</a>
      <a class="btn" href="#/practice?m=review">חזרות בלבד</a>
      <a class="btn" href="#/practice?m=interview">מראיין AI</a>
    </div>
    ${installEvent ? '<button class="btn" id="install" style="margin-top:12px;width:100%">התקנת האפליקציה במכשיר (עובדת גם בלי אינטרנט)</button>' : ''}
    ${st().aiQueue.length ? `<p class="small muted" style="margin-top:12px">${st().aiQueue.length} תשובות מחכות לבדיקת המראיין (ייבדקו כשיהיה חיבור).</p>` : ''}
    ${!content.questions.length ? '<div class="feedback bad">לא נטען תוכן. בדוק חיבור בפעם הראשונה שפותחים את האפליקציה.</div>' : ''}`;
  document.getElementById('go').onclick = () => begin({ mode: 'continue' });
  const inst = document.getElementById('install');
  if (inst) inst.onclick = async () => { installEvent.prompt(); await installEvent.userChoice; installEvent = null; home(); };
  const drop = document.getElementById('dropCur');
  if (drop) drop.onclick = () => { st().current = null; store.save(); home(); };
}

function begin(opts) {
  const qs = buildSession(opts);
  if (!qs.length) {
    toast(opts.mode === 'review' ? 'אין כרגע חזרות או שאלות חלשות. כל הכבוד.' : opts.mode === 'interview' && !isDesktop() ? 'אין מספיק שאלות בעל-פה ברמה הזאת.' : 'אין שאלות זמינות לבחירה הזאת.');
    return;
  }
  if (opts.mode === 'interview' && !ai.hasKey()) toast('אין מפתח API: התשובות ייבדקו בדירוג עצמי.');
  startSession(opts, qs);
  navigate('#/session');
}

function practice(params) {
  const mode = params.get('m') || 'sub';
  const scope = params.get('s') || '';
  const modes = [['continue', 'המשך'], ['sub', 'תת-נושא'], ['domain', 'תחום'], ['exam', 'מבחן כולל'], ['review', 'חזרות'], ['interview', 'מראיין AI']];
  const domainOpts = content.domains.map((d) => `<option value="${d.id}" ${scope === d.id ? 'selected' : ''}>${esc(d.name)}</option>`).join('');
  const subOpts = content.domains.map((d) => `<optgroup label="${esc(d.name)}">${d.subtopics.map((s) => {
    const k = subKey(d.id, s.id);
    return `<option value="${k}" ${scope === k ? 'selected' : ''} ${hasContent(k) ? '' : 'disabled'}>${esc(s.name)} (רמה ${levelOf(k)})</option>`;
  }).join('')}</optgroup>`).join('');
  const lenOpts = [5, 10, 15, 20, 30, 40].map((n) => `<option ${n === st().settings.sessionLen ? 'selected' : ''}>${n}</option>`).join('');
  app.innerHTML = `<h1>תרגול</h1>
    <div class="card">
      <div class="seg" role="group" aria-label="סוג סשן">${modes.map(([m, n]) => `<button class="btn small" data-mode="${m}" aria-pressed="${m === mode}">${n}</button>`).join('')}</div>
      <hr class="sep">
      <div id="opts"></div>
      <button class="btn primary big" id="start">התחל</button>
    </div>`;
  const opts = document.getElementById('opts');
  const levelSelect = (withCurrent) => `<label class="field"><span>רמה</span><select id="lv">
      ${withCurrent ? '<option value="0">הרמה הנוכחית שלי בכל תת-נושא</option>' : ''}
      ${[1, 2, 3, 4, 5].map((l) => `<option value="${l}" ${!withCurrent && l === 3 ? 'selected' : ''}>${l} · ${['', 'בסיס', "ג'וניור", 'mid', 'סניור', 'סניור חזק'][l]}</option>`).join('')}</select></label>`;
  const lenSelect = `<label class="field"><span>מספר שאלות</span><select id="len">${lenOpts}</select></label>`;
  const draw = (m) => {
    let h = '';
    if (m === 'continue') h = `<p class="muted">נושאי השבוע מהתוכנית, חזרות שהגיע זמנן ושאלות שטעית בהן.</p>${lenSelect}`;
    if (m === 'sub') h = `<label class="field"><span>תת-נושא</span><select id="scope">${subOpts}</select></label>${levelSelect(true)}${lenSelect}`;
    if (m === 'domain') h = `<label class="field"><span>תחום</span><select id="scope">${domainOpts}</select></label>${levelSelect(true)}${lenSelect}`;
    if (m === 'exam') h = `<p class="muted">שאלות אקראיות מכל התחומים, עם שעון. בסוף מקבלים ציון לכל תחום.</p>${levelSelect(false)}${lenSelect}
      ${st().settings.company ? `<label class="check"><input type="checkbox" id="co"> רק שאלות שמתאימות ל-${st().settings.company === 'nvidia' ? 'NVIDIA' : 'Microsoft'}</label>` : ''}`;
    if (m === 'review') h = `<p class="muted">רק שאלות שטעית בהן וחזרות שהגיע זמנן.</p>${lenSelect}`;
    if (m === 'interview') h = `<p class="muted">סימולציית ראיון: שאלות בעל-פה${isDesktop() ? ' ושאלות קוד' : ''} מתחומים שונים, עם שעון. המראיין בודק כל תשובה ושואל שאלת המשך.</p>
      ${ai.hasKey() ? '' : '<p class="feedback bad small">לא הוגדר מפתח API בהגדרות, אז הבדיקה תהיה עצמית.</p>'}
      ${levelSelect(false)}<label class="field"><span>מספר שאלות</span><select id="len"><option>3</option><option selected>5</option><option>7</option></select></label>`;
    opts.innerHTML = h;
    opts.dataset.mode = m;
  };
  draw(mode);
  app.querySelectorAll('[data-mode]').forEach((b) => b.onclick = () => {
    app.querySelectorAll('[data-mode]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    draw(b.dataset.mode);
  });
  document.getElementById('start').onclick = () => {
    const m = opts.dataset.mode;
    const val = (id) => document.getElementById(id)?.value;
    begin({ mode: m, scope: val('scope') || '', level: +(val('lv') || 0), length: +(val('len') || st().settings.sessionLen), companyOnly: document.getElementById('co')?.checked });
  };
}

function library(params) {
  const qtext = (params.get('q') || '').trim().toLowerCase();
  const read = st().lessonsRead;
  let body;
  if (qtext) {
    const hits = Object.values(content.lessons).filter((l) => (l.title + ' ' + content.subById[l.sub]?.name + ' ' + l.what).toLowerCase().includes(qtext));
    body = `<div class="card"><ul class="list">${hits.map((l) => `<li><a class="list-btn" href="#/lesson/${encodeURIComponent(l.id)}"><span>${esc(l.title)}</span><span class="small muted">${esc(content.domainById[content.subById[l.sub].domain].name)}</span></a></li>`).join('') || '<li class="muted">לא נמצא.</li>'}</ul></div>`;
  } else {
    body = content.domains.map((d) => {
      const subs = d.subtopics.map((s) => {
        const k = subKey(d.id, s.id);
        const ls = content.lessonsBySub[k] || [];
        if (!ls.length) return `<li><span class="list-btn muted">${esc(s.name)} <span class="small">בקרוב</span></span></li>`;
        return ls.map((l) => `<li><a class="list-btn" href="#/lesson/${encodeURIComponent(l.id)}"><span>${read[l.id] ? '✓ ' : ''}${esc(ls.length > 1 ? l.title : s.name)}</span>${levelDots(levelOf(k))}</a></li>`).join('');
      }).join('');
      return `<details class="card"><summary>${esc(d.name)}</summary><ul class="list">${subs}</ul></details>`;
    }).join('');
  }
  app.innerHTML = `<h1>ספרייה</h1>
    <label class="field"><span>חיפוש</span><input type="text" id="search" dir="auto" value="${esc(params.get('q') || '')}" placeholder="למשל: sliding window, mutex, FFT"></label>
    ${body}`;
  const inp = document.getElementById('search');
  inp.onkeydown = (e) => { if (e.key === 'Enter') navigate('#/library?q=' + encodeURIComponent(inp.value)); };
}

function lesson(id) {
  const l = content.lessons[id];
  if (!l) { app.innerHTML = '<p>השיעור לא נמצא.</p>'; return; }
  st().lessonsRead[id] = Date.now();
  store.save();
  const sub = content.subById[l.sub];
  app.innerHTML = `<p><a href="#/library">→ לספרייה</a></p>
    <p class="small muted">${esc(content.domainById[sub.domain].name)} · ${esc(sub.name)}</p>
    <div class="card">${lessonHtml(l)}</div>
    <div class="actions">
      <button class="btn primary" id="practiceSub">לתרגל את הנושא (רמה ${levelOf(l.sub)})</button>
      <button class="btn" onclick="history.back()">חזרה</button>
    </div>`;
  document.getElementById('practiceSub').onclick = () => begin({ mode: 'sub', scope: l.sub });
}

function progress() {
  const s = st();
  const week = currentWeek();
  const recent = [...s.sessions].reverse().slice(0, 12);
  const domains = content.domains.map((d) => {
    const rows = d.subtopics.map((sub) => {
      const k = subKey(d.id, sub.id);
      const ss = subStats(k);
      if (!ss.total) return `<tr><td>${esc(sub.name)}</td><td colspan="3" class="muted small">בקרוב</td></tr>`;
      return `<tr><td><a href="#/practice?m=sub&s=${k}">${esc(sub.name)}</a></td><td>${levelDots(ss.level)}</td><td>${ss.seen}/${ss.total}</td><td>${ss.weak ? `<span class="chip bad">${ss.weak}</span>` : ''}</td></tr>`;
    }).join('');
    return `<details class="card"><summary>${esc(d.name)}</summary>
      <table class="tbl"><thead><tr><th>תת-נושא</th><th>רמה</th><th>נראו</th><th>חלשות</th></tr></thead><tbody>${rows}</tbody></table></details>`;
  }).join('');
  const results = [...s.aiResults].reverse().slice(0, 10);
  app.innerHTML = `<h1>התקדמות</h1>
    <div class="card stats">
      <div class="stat"><b>${Object.keys(s.items).length}</b><span>שאלות שנענו</span></div>
      <div class="stat"><b>${Object.keys(s.lessonsRead).length}</b><span>שיעורים שנקראו</span></div>
      <div class="stat"><b>${s.sessions.length}</b><span>סשנים</span></div>
    </div>
    <h2>לפי תחום</h2>${domains}
    <h2>תוכנית 16 שבועות</h2>
    <div class="card"><ol>${PLAN.map((keys, i) => `<li ${i + 1 === week ? 'style="font-weight:700"' : ''}>${i + 1 === week ? '◀ ' : ''}${keys.length ? esc(keys.map((k) => content.subById[k]?.name).filter(Boolean).join(', ')) : 'חזרה ממוקדת לפי החברה ולפי נקודות חלשות'}</li>`).join('')}</ol></div>
    <h2>סשנים אחרונים</h2>
    <div class="card">${recent.length ? `<table class="tbl"><tbody>${recent.map((x) => `<tr><td>${fmtDate(x.ts)}</td><td>${esc({ continue: 'המשך', domain: 'תחום', sub: 'תת-נושא', exam: 'מבחן כולל', review: 'חזרות', interview: 'מראיין AI' }[x.mode] || x.mode)}${x.level ? ` · רמה ${x.level}` : ''}</td><td>${x.correct}/${x.total}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">עוד אין סשנים.</p>'}</div>
    <h2>בדיקות של המראיין</h2>
    <div class="card">${results.length ? results.map((r) => {
      const q = content.questionById[r.qid];
      return `<details><summary>${fmtDate(r.ts)} · ${esc(q ? content.subById[q.sub]?.name : r.qid)} · ציון ${r.score}/5</summary><div class="rich"><p>${esc(r.verdict)}</p>${r.missing?.length ? `<ul>${r.missing.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}</div></details>`;
    }).join('') : '<p class="muted">עוד אין.</p>'}
    ${s.aiQueue.length ? `<p class="small">${s.aiQueue.length} תשובות מחכות לבדיקה. <button class="btn small" id="drain">לבדוק עכשיו</button></p>` : ''}</div>`;
  const drain = document.getElementById('drain');
  if (drain) drain.onclick = async () => { drain.disabled = true; const n = await ai.drainQueue(); toast(n ? `נבדקו ${n} תשובות` : 'הבדיקה לא הצליחה. בדוק חיבור ומפתח API.'); progress(); };
}

function settings() {
  const s = st().settings;
  app.innerHTML = `<h1>הגדרות</h1>
    <div class="card">
      <h2>ראיון</h2>
      <label class="field"><span>תאריך הראיון</span><input type="date" id="interviewDate" value="${esc(s.interviewDate)}"></label>
      <label class="field"><span>חברה</span><select id="company">
        <option value="">כללי</option><option value="nvidia" ${s.company === 'nvidia' ? 'selected' : ''}>NVIDIA</option><option value="microsoft" ${s.company === 'microsoft' ? 'selected' : ''}>Microsoft</option></select></label>
      <label class="field"><span>תחילת התוכנית</span><input type="date" id="startDate" value="${esc(s.startDate)}"></label>
    </div>
    <div class="card">
      <h2>תרגול</h2>
      <label class="field"><span>אורך סשן ברירת מחדל</span><select id="sessionLen">${[5, 10, 15, 20].map((n) => `<option ${n === s.sessionLen ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      <label class="check"><input type="checkbox" id="timer" ${s.timer ? 'checked' : ''}> שעון ברמות 4–5 (במבחן כולל ובמראיין השעון תמיד פועל)</label>
      <label class="field"><span>מכשיר</span><select id="device">
        <option value="auto">זיהוי אוטומטי (עכשיו: ${isDesktop() ? 'מחשב' : 'טלפון'})</option>
        <option value="phone" ${s.device === 'phone' ? 'selected' : ''}>טלפון: בלי שאלות כתיבת קוד</option>
        <option value="desktop" ${s.device === 'desktop' ? 'selected' : ''}>מחשב: כולל שאלות כתיבת קוד</option></select></label>
      <label class="field"><span>ערכת צבעים</span><select id="theme">
        <option value="auto">לפי המערכת</option><option value="light" ${s.theme === 'light' ? 'selected' : ''}>בהיר</option><option value="dark" ${s.theme === 'dark' ? 'selected' : ''}>כהה</option></select></label>
    </div>
    <div class="card">
      <h2>מראיין AI</h2>
      <p class="small muted">מפתח API של Anthropic (מ-console.anthropic.com). הוא נשמר רק במכשיר הזה ונשלח רק ל-api.anthropic.com. החיוב לפי שימוש, על החשבון שלך.</p>
      <label class="field"><span>מפתח API</span><input type="password" id="apiKey" value="${esc(s.apiKey)}" autocomplete="off" dir="ltr"></label>
    </div>
    <div class="card">
      <h2>סנכרון בין הטלפון למחשב</h2>
      <p class="small muted">דרך Gist פרטי ב-GitHub. צריך טוקן עם הרשאת gist בלבד (GitHub → Settings → Developer settings → Personal access tokens). הטוקן נשמר רק במכשיר הזה. מכניסים אותו בשני המכשירים.</p>
      <label class="field"><span>טוקן GitHub</span><input type="password" id="gistToken" value="${esc(s.gistToken)}" autocomplete="off" dir="ltr"></label>
      <div class="actions"><button class="btn" id="syncBtn">סנכרן עכשיו</button></div>
      <p class="small muted">${s.lastSync ? `סנכרון אחרון: ${new Date(s.lastSync).toLocaleString('he-IL')}` : 'עוד לא סונכרן.'}</p>
    </div>
    <div class="card">
      <h2>גיבוי</h2>
      <div class="actions">
        <button class="btn" id="exportBtn">ייצוא לקובץ</button>
        <label class="btn">ייבוא מקובץ<input type="file" id="importIn" accept="application/json" class="hidden"></label>
        <button class="btn bad" id="resetBtn">איפוס התקדמות</button>
      </div>
    </div>
    <p class="small muted">${content.questions.length} שאלות · ${Object.keys(content.lessons).length} שיעורים</p>`;
  const bindField = (id, parse = (v) => v) => {
    const el = document.getElementById(id);
    el.onchange = () => { s[id] = el.type === 'checkbox' ? el.checked : parse(el.value); store.save(); if (id === 'theme') applyTheme(); toast('נשמר'); };
  };
  ['interviewDate', 'company', 'startDate', 'device', 'theme', 'apiKey', 'gistToken'].forEach((id) => bindField(id, (v) => v.trim()));
  bindField('sessionLen', Number);
  bindField('timer');
  document.getElementById('syncBtn').onclick = async () => {
    try { await syncNow(); toast('סונכרן'); settings(); } catch (e) { toast(`הסנכרון נכשל: ${e.message}`); }
  };
  document.getElementById('exportBtn').onclick = () => {
    const blob = new Blob([JSON.stringify(store.exportable(), null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `interview-prep-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  document.getElementById('importIn').onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try { store.merge(JSON.parse(await f.text())); store.save(); toast('יובא ומוזג'); } catch { toast('הקובץ לא תקין'); }
  };
  document.getElementById('resetBtn').onclick = () => {
    if (confirm('למחוק את כל ההתקדמות במכשיר הזה? (המפתחות נשמרים)')) { store.reset(); toast('אופס'); settings(); }
  };
}

// ---------- router ----------
function route() {
  stopSessionTimer();
  const [path, query] = location.hash.replace(/^#/, '').split('?');
  const params = new URLSearchParams(query || '');
  const parts = (path || '/').split('/').filter(Boolean);
  const top = parts[0] || 'home';
  document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === (top === 'lesson' ? 'library' : ['session', 'summary'].includes(top) ? 'practice' : top)));
  switch (top) {
    case 'home': home(); break;
    case 'practice': practice(params); break;
    case 'session': renderSession(app, { toast, navigate }); break;
    case 'summary': renderSummary(app); break;
    case 'library': library(params); break;
    case 'lesson': lesson(decodeURIComponent(parts.slice(1).join('/'))); break;
    case 'progress': progress(); break;
    case 'settings': settings(); break;
    default: home();
  }
  app.focus({ preventScroll: true });
}

// ---------- background work: AI queue and sync ----------
let syncTimer;
function scheduleSync() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => { if (canSync()) syncNow().catch(() => {}); }, 20000);
}
async function onlineWork() {
  const n = await ai.drainQueue();
  if (n) toast(`המראיין בדק ${n} תשובות שחיכו. התוצאות במסך ההתקדמות.`);
  if (canSync()) syncNow().catch(() => {});
}

// ---------- boot ----------
async function boot() {
  store.load();
  applyTheme();
  try { await loadContent(); } catch (e) { console.error(e); }
  window.addEventListener('hashchange', route);
  route();
  store.onSave(scheduleSync);
  window.addEventListener('online', onlineWork);
  if (navigator.onLine) onlineWork();
  // Local development: no service worker (so edits show up), unless testing offline on purpose.
  const devNoSw = location.hostname === 'localhost' && !localStorage.getItem('ip.devsw');
  if (devNoSw && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
  }
  if ('serviceWorker' in navigator && location.protocol !== 'file:' && !devNoSw) {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        w?.addEventListener('statechange', () => {
          if (w.state === 'installed' && navigator.serviceWorker.controller) toast('יש עדכון תוכן. הוא ייכנס בפתיחה הבאה של האפליקציה.');
        });
      });
    }).catch(() => {});
  }
}
boot();
