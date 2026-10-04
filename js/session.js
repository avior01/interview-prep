// Session runner: shows one question at a time, checks answers, schedules
// reviews, re-asks missed questions later in the same session.
import { content } from './content.js';
import { get, save, touchStreak } from './store.js';
import { md, esc, codeBlock, inlineMd } from './md.js';
import { schedule, recordLevel, timeLimit, checkShort, shuffle, isDesktop } from './engine.js';
import * as ai from './ai.js';
import { lessonHtml } from './lesson.js';

const TYPE_NAMES = { mcq: 'בחירה', multi: 'כמה תשובות', output: 'מה הפלט', bug: 'מצא את הבאג', order: 'סידור', short: 'תשובה קצרה', oral: 'בעל-פה', code: 'כתיבת קוד' };
const LEVEL_NAMES = ['', 'בסיס', "ג'וניור", 'mid', 'סניור', 'סניור חזק'];
const MODE_NAMES = { continue: 'המשך', domain: 'תחום', sub: 'תת-נושא', exam: 'מבחן כולל', review: 'חזרות', interview: 'מראיין AI' };

let ui = null;   // per-question UI state (not persisted)
let timerId = null;
let root, toast, navigate;

export function startSession(opts, qs) {
  const st = get();
  st.current = {
    mode: opts.mode, scope: opts.scope || '', level: opts.level || 0,
    ids: qs.map((q) => q.id), idx: 0, results: [], requeued: [], startedAt: Date.now(), timeLeft: {},
  };
  save();
}

export function renderSession(el, helpers) {
  root = el; toast = helpers.toast; navigate = helpers.navigate;
  const cur = get().current;
  if (!cur) { navigate('#/practice'); return; }
  if (cur.idx >= cur.ids.length) { finish(); return; }
  const q = content.questionById[cur.ids[cur.idx]];
  if (!q) { cur.idx++; save(); renderSession(el, helpers); return; }
  ui = { q, done: false, sel: q.type === 'multi' ? new Set() : null, order: [], line: null, pool: q.items ? shuffle(q.items.map((t, i) => ({ t, i }))) : null, choiceOrder: null };
  if (q.choices) ui.choiceOrder = shuffle(q.choices.map((_, i) => i));
  draw();
  startTimer();
}

function header(q) {
  const cur = get().current;
  const sub = content.subById[q.sub];
  const pct = Math.round((cur.idx / cur.ids.length) * 100);
  return `<div class="session-top">
    <div class="row spread">
      <button class="btn ghost small" data-act="quit">✕ סיום</button>
      <span class="small muted">${MODE_NAMES[cur.mode] || ''} · ${cur.idx + 1}/${cur.ids.length}</span>
      <span class="timer" id="timer"></span>
    </div>
    <div class="bar" aria-hidden="true"><i style="width:${pct}%"></i></div>
  </div>
  <div class="q-head">
    <div class="row">
      <span class="chip accent">${esc(sub?.name || '')}</span>
      <span class="chip">רמה ${q.level} · ${LEVEL_NAMES[q.level]}</span>
      <span class="chip">${TYPE_NAMES[q.type]}${q.lang ? ' · ' + (q.lang === 'cpp' ? 'C++' : 'Python') : ''}</span>
      ${q.tags?.map((t) => `<span class="chip warn">${t === 'nvidia' ? 'NVIDIA' : 'Microsoft'}</span>`).join('') || ''}
    </div>
  </div>`;
}

function choiceButtons(q) {
  const keys = 'אבגדהו';
  return `<div class="choices" role="group">${ui.choiceOrder.map((ci, pos) => {
    let cls = '';
    const selected = q.type === 'multi' ? ui.sel.has(ci) : ui.sel === ci;
    if (ui.done) {
      const right = q.type === 'multi' ? q.answer.includes(ci) : q.answer === ci;
      cls = right ? 'right' : selected ? 'wrong' : '';
    } else if (selected) cls = 'sel';
    return `<button class="choice ${cls}" data-choice="${ci}" ${ui.done ? 'disabled' : ''} aria-pressed="${selected}">
      <span class="key">${q.type === 'multi' ? (selected ? '✓' : '') : keys[pos]}</span><span class="rich">${inlineMd(q.choices[ci])}</span></button>`;
  }).join('')}</div>`;
}

function bodyHtml(q) {
  let h = `<div class="q-prompt">${md(q.prompt)}</div>`;
  if (q.type === 'bug') {
    h += `<p class="small muted">${ui.line ? `נבחרה שורה ${ui.line}. עכשיו בחר את הסיבה.` : 'גע בשורה שבה הבאג.'}</p>`;
    h += codeBlock(q.code, { numbered: true, pick: !ui.done });
    if (ui.line || ui.done) h += choiceButtons(q);
  } else if (q.code) {
    h += codeBlock(q.code, { numbered: q.code.split('\n').length > 3 });
  }
  if (q.type === 'mcq' || q.type === 'multi' || q.type === 'output') {
    if (q.type === 'multi') h += `<p class="small muted">סמן את כל התשובות הנכונות.</p>`;
    h += choiceButtons(q);
  }
  if (q.type === 'order') {
    h += `<p class="small muted">גע בפריטים לפי הסדר הנכון. נגיעה בפריט שנבחר מחזירה אותו.</p>`;
    h += `<div class="order-picked">${ui.order.map((o, k) => {
      const cls = ui.done ? (q.items[k] === o.t ? 'right' : 'wrong') : '';
      return `<button class="choice ${cls}" data-unpick="${k}" ${ui.done ? 'disabled' : ''}><span class="key">${k + 1}</span><span class="rich">${inlineMd(o.t)}</span></button>`;
    }).join('')}</div>`;
    if (!ui.done) h += `<div class="order-pool">${ui.pool.filter((p) => !ui.order.includes(p)).map((p) => `<button class="choice" data-pick="${p.i}"><span class="key">+</span><span class="rich">${inlineMd(p.t)}</span></button>`).join('')}</div>`;
  }
  if (q.type === 'short') {
    h += `<label class="field"><span>התשובה שלך</span><input type="text" id="shortIn" dir="auto" autocomplete="off" ${ui.done ? 'disabled' : ''} value="${esc(ui.text || '')}"></label>`;
  }
  if (q.type === 'oral' || q.type === 'code') {
    const isCode = q.type === 'code';
    if (isCode && q.starter && ui.text === undefined) ui.text = q.starter;
    h += `<label class="field"><span>${isCode ? 'הקוד שלך' : 'התשובה שלך (אפשר להקליד או להכתיב במיקרופון של המקלדת)'}</span>
      <textarea id="longIn" class="${isCode ? 'code-input' : ''}" ${isCode ? 'dir="ltr" spellcheck="false"' : 'dir="auto"'} ${ui.done ? 'disabled' : ''}>${esc(ui.text || '')}</textarea></label>`;
  }
  return h;
}

function canSubmit(q) {
  switch (q.type) {
    case 'mcq': case 'output': return ui.sel !== null && ui.sel !== undefined;
    case 'multi': return ui.sel.size > 0;
    case 'bug': return ui.line && ui.sel !== null && ui.sel !== undefined;
    case 'order': return ui.order.length === q.items.length;
    case 'short': return !!(ui.text || '').trim();
    default: return !!(ui.text || '').trim();
  }
}

function draw() {
  const q = ui.q;
  const side = ui.showLesson && isDesktop();
  const lessonPanel = ui.showLesson ? `<div class="card lesson side">${lessonHtml(content.lessons[q.lesson])}
     ${side ? '' : '<button class="btn" data-act="closeLesson">חזרה לשאלה</button>'}</div>` : '';
  if (ui.showLesson && !side) { root.innerHTML = header(q) + lessonPanel; bind(); return; }
  root.innerHTML = `${header(q)}<div class="split ${side ? 'with-side' : ''}"><div>
    <div class="card">${bodyHtml(q)}
      ${ui.done ? '' : `<div class="actions">
        <button class="btn primary" data-act="submit" ${canSubmit(q) ? '' : 'disabled'}>בדיקה</button>
        <button class="btn" data-act="dunno">לא יודע</button>
        <button class="btn ghost" data-act="unknown">לא מכיר את הנושא</button>
      </div>`}
    </div>
    <div id="fb">${ui.feedback || ''}</div>
  </div>${side ? lessonPanel : ''}</div>`;
  bind();
  markBugLines();
}

function bind() {
  root.onclick = (e) => {
    const t = e.target.closest('[data-act],[data-choice],[data-line],[data-pick],[data-unpick],[data-self],[data-grade]');
    if (!t) return;
    const q = ui.q;
    if (t.dataset.line && !ui.done && q.type === 'bug') { ui.line = +t.dataset.line; draw(); return; }
    if (t.dataset.choice !== undefined && !ui.done) {
      const ci = +t.dataset.choice;
      if (q.type === 'multi') { ui.sel.has(ci) ? ui.sel.delete(ci) : ui.sel.add(ci); } else ui.sel = ci;
      draw(); return;
    }
    if (t.dataset.pick !== undefined && !ui.done) { ui.order.push(ui.pool.find((p) => p.i === +t.dataset.pick)); draw(); return; }
    if (t.dataset.unpick !== undefined && !ui.done) { ui.order.splice(+t.dataset.unpick, 1); draw(); return; }
    if (t.dataset.self) { selfGrade(+t.dataset.self); return; }
    if (t.dataset.grade) { ui.grade = t.dataset.grade; markGradeButtons(); return; }
    switch (t.dataset.act) {
      case 'submit': submit(); break;
      case 'dunno': submit(true); break;
      case 'unknown': notKnown(); break;
      case 'next': next(); break;
      case 'lesson': ui.showLesson = true; draw(); break;
      case 'closeLesson': ui.showLesson = false; draw(); break;
      case 'quit': if (confirm('לסיים את הסשן עכשיו? התשובות שכבר נתת נשמרו.')) finish(); break;
      case 'pause': togglePause(); break;
      case 'followUp': followUp(); break;
      case 'followUpSend': followUpSend(); break;
    }
  };
  root.oninput = (e) => {
    if (e.target.id === 'shortIn' || e.target.id === 'longIn') {
      ui.text = e.target.value;
      const b = root.querySelector('[data-act="submit"]');
      if (b) b.disabled = !canSubmit(ui.q);
    }
  };
  const ta = root.querySelector('textarea.code-input');
  if (ta) ta.onkeydown = (e) => {
    if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('    ', s, ta.selectionEnd, 'end'); ui.text = ta.value; }
  };
  const si = root.querySelector('#shortIn');
  if (si) si.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); if (canSubmit(ui.q)) submit(); } };
}

// Keyboard shortcuts on desktop: 1-6 choose, Enter checks / continues.
document.addEventListener('keydown', (e) => {
  if (!ui || !root?.isConnected || !location.hash.startsWith('#/session')) return;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
  const q = ui.q;
  if (e.key === 'Enter') {
    if (ui.done && ui.answered) { e.preventDefault(); next(); }
    else if (!ui.done && canSubmit(q)) { e.preventDefault(); submit(); }
    return;
  }
  const n = parseInt(e.key, 10);
  if (!ui.done && n >= 1 && n <= 6 && ui.choiceOrder && n <= ui.choiceOrder.length && (q.type !== 'bug' || ui.line)) {
    const ci = ui.choiceOrder[n - 1];
    if (q.type === 'multi') { ui.sel.has(ci) ? ui.sel.delete(ci) : ui.sel.add(ci); } else ui.sel = ci;
    draw();
  }
});

// ---------- Timer ----------
function startTimer() {
  stopTimer();
  const cur = get().current;
  const q = ui.q;
  const limit = timeLimit(q, cur.mode);
  if (!limit) return;
  ui.left = cur.timeLeft[q.id] ?? limit;
  ui.paused = false;
  tick();
  timerId = setInterval(() => {
    if (ui.paused || ui.done) return;
    ui.left--;
    get().current.timeLeft[q.id] = ui.left;
    if (ui.left % 10 === 0) save();
    tick();
    if (ui.left <= 0) { stopTimer(); timeout(); }
  }, 1000);
}
function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }
function tick() {
  const el = document.getElementById('timer');
  if (!el || ui.left === undefined) return;
  const m = Math.floor(Math.max(0, ui.left) / 60), s = Math.max(0, ui.left) % 60;
  el.className = 'timer' + (ui.left <= 60 ? ' low' : '');
  el.innerHTML = `<button class="btn ghost small" data-act="pause" aria-label="${ui.paused ? 'המשך' : 'השהיה'}">${ui.paused ? '▶' : '❚❚'}</button> ${m}:${String(s).padStart(2, '0')}`;
}
function togglePause() { ui.paused = !ui.paused; tick(); }
function timeout() {
  if (ui.done) return;
  toast('הזמן נגמר. השאלה נחשבת טעות.');
  submit(true, true);
}

// ---------- Answering ----------
function isCorrect(q) {
  switch (q.type) {
    case 'mcq': case 'output': return ui.sel === q.answer;
    case 'multi': return ui.sel.size === q.answer.length && q.answer.every((i) => ui.sel.has(i));
    case 'bug': return ui.line === q.bugLine && ui.sel === q.answer;
    case 'order': return ui.order.every((o, k) => q.items[k] === o.t);
    case 'short': return checkShort(q, ui.text || '');
    default: return false;
  }
}

function submit(gaveUp = false, timedOut = false) {
  const q = ui.q;
  if (ui.done) return;
  ui.done = true;
  stopTimer();
  if (q.type === 'oral' || q.type === 'code') {
    if (gaveUp) { record(false); ui.feedback = openFeedback(q, false, timedOut); }
    else { ui.feedback = openFeedback(q, null); }
    draw();
    if (!gaveUp) startAiOrSelf();
    return;
  }
  const ok = !gaveUp && isCorrect(q);
  record(ok);
  ui.feedback = closedFeedback(q, ok, timedOut);
  draw();
}

function markBugLines() {
  const q = ui.q;
  if (q.type !== 'bug') return;
  root.querySelectorAll('pre.code .ln').forEach((ln) => {
    const n = +ln.dataset.line;
    if (!ui.done) { if (n === ui.line) ln.classList.add('sel'); return; }
    if (n === q.bugLine) ln.classList.add('right');
    else if (n === ui.line) ln.classList.add('wrong');
  });
}

function closedFeedback(q, ok, timedOut) {
  let answer = '';
  if (!ok) {
    if (q.type === 'short') answer = `<p>התשובה: <strong dir="auto">${esc(q.accept[0])}</strong></p>`;
    if (q.type === 'order') answer = `<p>הסדר הנכון:</p><ol>${q.items.map((t) => `<li>${inlineMd(t)}</li>`).join('')}</ol>`;
    if (q.type === 'bug' && ui.line !== q.bugLine) answer = `<p>הבאג בשורה ${q.bugLine}.</p>`;
  }
  return `<div class="feedback ${ok ? 'good' : 'bad'}">
    <h3>${ok ? 'נכון' : timedOut ? 'נגמר הזמן' : 'לא נכון'}</h3>${answer}${md(q.explanation)}
  </div>${nextButtons(ok)}`;
}

function nextButtons(ok) {
  ui.answered = true;
  return `<div class="actions">
    ${ok ? `<div class="seg" role="group" aria-label="כמה זה היה קשה">
      <button class="btn small" data-grade="good" aria-pressed="${ui.grade !== 'hard'}">היה בסדר</button>
      <button class="btn small" data-grade="hard" aria-pressed="${ui.grade === 'hard'}">היה קשה</button></div>` : ''}
    <button class="btn" data-act="lesson">לשיעור</button>
    <button class="btn primary" data-act="next">הבא ←</button>
  </div>`;
}

function markGradeButtons() {
  root.querySelectorAll('[data-grade]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.grade === ui.grade)));
}

function record(ok) {
  const q = ui.q;
  const cur = get().current;
  ui.ok = ok;
  cur.results.push({ qid: q.id, ok, domain: q.domain });
  const change = recordLevel(q, ok);
  if (change === 'up') setTimeout(() => toast(`עלית לרמה ${get().levels[q.sub].level} ב${content.subById[q.sub].name}`), 300);
  if (change === 'down') setTimeout(() => toast(`ירדת לרמה ${get().levels[q.sub].level} ב${content.subById[q.sub].name}. כדאי לחזור לשיעור.`), 300);
  if (!ok && !cur.requeued.includes(q.id) && cur.mode !== 'exam' && cur.mode !== 'interview') {
    // Ask again 3–5 questions later in this session.
    cur.requeued.push(q.id);
    const pos = Math.min(cur.ids.length, cur.idx + 4 + Math.floor(Math.random() * 2));
    cur.ids.splice(pos, 0, q.id);
  }
  touchStreak();
  save();
}

// Schedules the review when leaving the question, so "היה קשה" can apply.
function next() {
  const q = ui.q;
  const cur = get().current;
  if (ui.ok !== undefined && !ui.skipSchedule) schedule(q.id, ui.ok ? (ui.grade === 'hard' ? 'hard' : 'good') : 'wrong');
  cur.idx++;
  save();
  renderSession(root, { toast, navigate });
  window.scrollTo(0, 0);
}

function notKnown() {
  // Not counted as a mistake: open the lesson and ask the question again at the end.
  const cur = get().current;
  const q = ui.q;
  if (!cur.requeued.includes(q.id)) { cur.requeued.push(q.id); cur.ids.push(q.id); }
  ui.skipSchedule = true;
  ui.showLesson = true;
  ui.done = true;
  ui.answered = true;
  stopTimer();
  ui.feedback = `<div class="feedback info"><h3>בסדר, קודם לומדים</h3><p>השאלה תחזור בסוף הסשן, ולא תיחשב טעות.</p></div>
    <div class="actions"><button class="btn" data-act="lesson">פתח את השיעור</button><button class="btn primary" data-act="next">הבא ←</button></div>`;
  save();
  draw();
}

// ---------- Oral and code answers ----------
function openFeedback(q, ok, timedOut) {
  if (ok === false) {
    return `<div class="feedback bad"><h3>${timedOut ? 'נגמר הזמן' : 'לא ענית'}</h3>${modelAnswerHtml(q)}</div>${nextButtons(false)}`;
  }
  return '<div class="feedback info" id="aiBox"><p>בודק…</p></div>';
}

function modelAnswerHtml(q) {
  const isCode = q.type === 'code';
  return `<h3>תשובת דוגמה</h3>${isCode ? codeBlock(q.modelAnswer) : md(q.modelAnswer)}
    <h3>מה בודקים</h3><ul>${q.rubric.map((r) => `<li>${inlineMd(r)}</li>`).join('')}</ul>${q.explanation ? md(q.explanation) : ''}`;
}

function selfGradeHtml(note) {
  return `<div class="feedback info">${note ? `<p class="small">${note}</p>` : ''}${modelAnswerHtml(ui.q)}
    <h3>דרג את עצמך</h3><p class="small muted">השווה לתשובת הדוגמה ולמה שבודקים. 1-2 נחשב טעות.</p>
    <div class="seg">${[1, 2, 3, 4, 5].map((n) => `<button class="btn" data-self="${n}">${n}</button>`).join('')}</div></div>`;
}

async function startAiOrSelf() {
  const q = ui.q;
  const box = () => document.getElementById('fb');
  if (ai.hasKey() && ai.online()) {
    try {
      const r = await ai.grade(q, ui.text);
      ui.aiResult = r;
      get().aiResults.push({ id: `${q.id}:${Date.now()}`, qid: q.id, answer: ui.text, ts: Date.now(), ...r });
      applyScore(r.score);
      ui.feedback = aiResultHtml(q, r) + nextButtons(r.score >= 3);
      if (box()) { draw(); }
      return;
    } catch (e) {
      const retryable = !e.status || e.status === 429 || e.status >= 500;
      if (e.code === 'bad_key') toast('מפתח ה-API לא תקין. בדוק בהגדרות.');
      if (retryable) ai.enqueue(q, ui.text);
      ui.feedback = selfGradeHtml(`הבדיקה של המראיין נכשלה (${esc(e.message)}).${retryable ? ' התשובה נשמרה ותיבדק שוב כשיהיה חיבור.' : ''}`);
      draw();
      return;
    }
  }
  if (ai.hasKey()) ai.enqueue(q, ui.text);
  const note = ai.hasKey() ? 'אין חיבור. התשובה נשמרה, והמראיין יבדוק אותה כשהחיבור יחזור. בינתיים:' : 'לא הוגדר מפתח API למראיין, אז הבדיקה עצמית.';
  ui.feedback = selfGradeHtml(note);
  draw();
}

function applyScore(score) {
  ui.grade = score === 3 ? 'hard' : 'good';
  record(score >= 3);
}

function selfGrade(n) {
  applyScore(n);
  ui.feedback = `<div class="feedback ${n >= 3 ? 'good' : 'bad'}"><h3>דירגת ${n}/5</h3>${modelAnswerHtml(ui.q)}</div>${nextButtons(n >= 3)}`;
  draw();
}

function aiResultHtml(q, r) {
  return `<div class="feedback ${r.score >= 4 ? 'good' : r.score >= 3 ? 'info' : 'bad'}">
    <h3>ציון המראיין: ${r.score}/5</h3>${md(r.verdict)}
    ${r.missing?.length ? `<h3>מה חסר</h3><ul>${r.missing.map((m) => `<li>${inlineMd(m)}</li>`).join('')}</ul>` : ''}
    ${r.followUp ? `<h3>שאלת המשך</h3>${md(r.followUp)}
      <div id="fu">${ui.fuResult || `<button class="btn small" data-act="followUp">לענות על שאלת ההמשך</button>`}</div>` : ''}
    <details><summary>תשובת דוגמה</summary>${modelAnswerHtml(q)}</details>
  </div>`;
}

function followUp() {
  ui.fuResult = `<label class="field"><span>התשובה שלך לשאלת ההמשך</span><textarea id="fuIn" dir="auto"></textarea></label>
    <button class="btn primary small" data-act="followUpSend">שלח למראיין</button>`;
  ui.feedback = aiResultHtml(ui.q, ui.aiResult) + nextButtons(ui.aiResult.score >= 3);
  draw();
}

async function followUpSend() {
  const text = document.getElementById('fuIn')?.value || '';
  if (!text.trim()) return;
  const fu = document.getElementById('fu');
  if (fu) fu.innerHTML = '<p>בודק…</p>';
  try {
    const r = await ai.grade(ui.q, text, ui.aiResult.followUp);
    ui.fuResult = `<div class="feedback info"><h3>ציון על שאלת ההמשך: ${r.score}/5</h3>${md(r.verdict)}
      ${r.missing?.length ? `<ul>${r.missing.map((m) => `<li>${inlineMd(m)}</li>`).join('')}</ul>` : ''}</div>`;
  } catch (e) {
    ui.fuResult = `<p class="small">הבדיקה נכשלה: ${esc(e.message)}</p>`;
  }
  ui.feedback = aiResultHtml(ui.q, ui.aiResult) + nextButtons(ui.aiResult.score >= 3);
  draw();
}

// ---------- Finish ----------
function finish() {
  stopTimer();
  const st = get();
  const cur = st.current;
  if (!cur) return;
  const firstTry = new Map();
  for (const r of cur.results) if (!firstTry.has(r.qid)) firstTry.set(r.qid, r);
  const res = [...firstTry.values()];
  const perDomain = {};
  for (const r of res) {
    const d = (perDomain[r.domain] ||= { total: 0, correct: 0 });
    d.total++; if (r.ok) d.correct++;
  }
  const summary = { ts: Date.now(), mode: cur.mode, scope: cur.scope, level: cur.level, total: res.length, correct: res.filter((r) => r.ok).length, perDomain, missed: res.filter((r) => !r.ok).map((r) => r.qid) };
  if (summary.total) st.sessions.push(summary);
  st.lastSummary = summary;
  st.current = null;
  save();
  navigate('#/summary');
}

export function renderSummary(el) {
  const s = get().lastSummary;
  if (!s) { el.innerHTML = '<p>אין סשן להצגה.</p>'; return; }
  const pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
  const domains = Object.entries(s.perDomain);
  el.innerHTML = `<h1>סיכום: ${MODE_NAMES[s.mode] || ''}</h1>
    <div class="card stats">
      <div class="stat"><b>${pct}%</b><span>הצלחה</span></div>
      <div class="stat"><b>${s.correct}/${s.total}</b><span>נכונות בניסיון ראשון</span></div>
      <div class="stat"><b>${s.missed.length}</b><span>נכנסו לחזרות</span></div>
    </div>
    ${domains.length > 1 ? `<div class="card"><h2>לפי תחום</h2><table class="tbl"><thead><tr><th>תחום</th><th>נכון</th><th>%</th></tr></thead><tbody>
      ${domains.map(([d, v]) => `<tr><td>${esc(content.domainById[d]?.name || d)}</td><td>${v.correct}/${v.total}</td><td>${Math.round((v.correct / v.total) * 100)}%</td></tr>`).join('')}
      </tbody></table></div>` : ''}
    ${s.missed.length ? `<div class="card"><h2>טעויות</h2><ul class="list">${s.missed.map((id) => {
      const q = content.questionById[id];
      return q ? `<li><a class="list-btn" href="#/lesson/${encodeURIComponent(q.lesson)}"><span>${esc(content.subById[q.sub]?.name)} · רמה ${q.level}</span><span class="small">לשיעור ←</span></a></li>` : '';
    }).join('')}</ul></div>` : ''}
    <div class="actions"><a class="btn primary" href="#/">לבית</a><a class="btn" href="#/practice">סשן נוסף</a></div>`;
}

export function stopSessionTimer() { stopTimer(); }
