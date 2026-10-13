// Session runner: shows one question at a time, checks answers, schedules
// reviews. Also runs the interview simulation (mode 'mock'), where nothing is
// graded until the end.
import { content } from './content.js';
import { get, save, touchStreak } from './store.js';
import { md, esc, codeBlock, inlineMd } from './md.js';
import { schedule, recordLevel, timeLimit, checkShort, shuffle, isDesktop } from './engine.js';
import * as ai from './ai.js';
import * as rec from './recorder.js';
import { lessonHtml } from './lesson.js';
import { companyName } from './companies.js';
import { storiesPanelHtml } from './stories.js';

const TYPE_NAMES = { mcq: 'בחירה', multi: 'כמה תשובות', output: 'מה הפלט', bug: 'מצא את הבאג', order: 'סידור', short: 'תשובה קצרה', oral: 'בעל-פה', code: 'כתיבת קוד' };
const LEVEL_NAMES = ['', 'בסיס', "ג'וניור", 'mid', 'סניור', 'סניור חזק'];
export const MODE_NAMES = { continue: 'המשך', domain: 'תחום', sub: 'תת-נושא', exam: 'מבחן כולל', review: 'חזרות', weak: 'חולשות', mock: 'סימולציית ראיון', interview: 'מראיין AI' };
export const SECTION_NAMES = { code: 'קוד ואלגוריתמים', depth: 'שאלות עומק', design: 'System design', beh: 'התנהגותי' };
const CHOICE_TYPES = ['mcq', 'multi', 'output', 'bug'];

let ui = null;   // per-question UI state (not persisted)
let timerId = null;
let root, toast, navigate;

export function startSession(opts, qs, sections) {
  const st = get();
  const scopeName = content.subById[opts.scope]?.name || content.domainById[opts.scope]?.name || '';
  const mock = opts.mode === 'mock';
  st.current = {
    title: [MODE_NAMES[opts.mode], scopeName, opts.level ? `רמה ${opts.level}` : ''].filter(Boolean).join(' · '),
    mode: opts.mode, scope: opts.scope || '', level: opts.level || 0,
    recall: !mock && !!opts.recall, followUps: !mock && opts.followUps !== false,
    ids: qs.map((q) => q.id), idx: 0, results: [], requeued: [], startedAt: Date.now(), timeLeft: {},
    ...(mock ? { sections: sections || {}, answers: {}, elapsed: 0, limit: (isDesktop() ? 50 : 35) * 60, review: { main: {}, fu: {}, comm: [] } } : {}),
  };
  save();
}

export function renderSession(el, helpers) {
  root = el; toast = helpers.toast; navigate = helpers.navigate;
  const cur = get().current;
  if (!cur) { navigate('#/practice'); return; }
  if (cur.mode === 'mock' && (cur.idx >= cur.ids.length || cur.reviewing)) { renderMockReview(); return; }
  if (cur.idx >= cur.ids.length) { finish(); return; }
  const q = content.questionById[cur.ids[cur.idx]];
  if (!q) { cur.idx++; save(); renderSession(el, helpers); return; }
  rec.stop();
  ui = {
    q, done: false, sel: q.type === 'multi' ? new Set() : null, order: [], line: null,
    pool: q.items ? shuffle(q.items.map((t, i) => ({ t, i }))) : null, choiceOrder: null,
    // Recall mode: at levels 3+ the choices stay hidden until you answered in your head.
    gated: !!cur.recall && q.level >= 3 && CHOICE_TYPES.includes(q.type), revealed: false,
    chk: { main: new Set(), fu: new Set() },
  };
  if (q.choices) ui.choiceOrder = shuffle(q.choices.map((_, i) => i));
  if (cur.mode === 'mock') { ui.stage = 'main'; ui.text = cur.answers[q.id]?.text; }
  draw();
  startTimer();
}

const isMock = () => get().current?.mode === 'mock';

function header(q) {
  const cur = get().current;
  const sub = content.subById[q.sub];
  const pct = Math.round((cur.idx / cur.ids.length) * 100);
  const mock = cur.mode === 'mock';
  return `<div class="session-top">
    <div class="row spread">
      <span class="row"><button class="btn ghost small" data-act="quit">✕ סיום</button><button class="btn ghost small" data-act="leave" title="הסשן נשמר, ואפשר להמשיך אותו מהבית">⏸ הפסקה</button></span>
      <span class="small muted">${MODE_NAMES[cur.mode] || ''} · ${cur.idx + 1}/${cur.ids.length}</span>
      <span class="timer" id="timer"></span>
    </div>
    <div class="bar" aria-hidden="true"><i style="width:${pct}%"></i></div>
  </div>
  <div class="q-head">
    <div class="row">
      ${mock ? `<span class="chip accent">${SECTION_NAMES[cur.sections[q.id]] || ''}</span>` : `<span class="chip accent">${esc(sub?.name || '')}</span>`}
      <span class="chip">רמה ${q.level} · ${LEVEL_NAMES[q.level]}</span>
      <span class="chip">${TYPE_NAMES[q.type]}${q.lang ? ' · ' + (q.lang === 'cpp' ? 'C++' : 'Python') : ''}</span>
      ${ui.gated ? '<span class="chip">מצב שליפה</span>' : ''}
      ${q.tags?.map((t) => `<span class="chip warn">${companyName(t)}</span>`).join('') || ''}
      ${q.problem ? `<span class="chip" dir="ltr">${esc(q.problem)}</span>` : ''}
    </div>
  </div>`;
}

function choiceButtons(q) {
  const keys = 'אבגדהו';
  const showResult = ui.done && !isMock();
  return `<div class="choices" role="group">${ui.choiceOrder.map((ci, pos) => {
    let cls = '';
    const selected = q.type === 'multi' ? ui.sel.has(ci) : ui.sel === ci;
    if (showResult) {
      const right = q.type === 'multi' ? q.answer.includes(ci) : q.answer === ci;
      cls = right ? 'right' : selected ? 'wrong' : '';
    } else if (selected) cls = 'sel';
    return `<button class="choice ${cls}" data-choice="${ci}" ${ui.done ? 'disabled' : ''} aria-pressed="${selected}">
      <span class="key">${q.type === 'multi' ? (selected ? '✓' : '') : keys[pos]}</span><span class="choice-body"><span class="rich">${inlineMd(q.choices[ci])}</span>${showResult && q.notes?.[ci] ? `<span class="choice-note">${inlineMd(q.notes[ci])}</span>` : ''}</span></button>`;
  }).join('')}</div>`;
}

const recallBox = () => `<div class="recall-box">
  <p><strong>מצב שליפה:</strong> ענה בראש או בקול לפני שאתה רואה את האפשרויות.</p>
  <button class="btn primary" data-act="reveal">חשבתי על תשובה, הצג אפשרויות</button></div>`;

function choicesOrGate(q) {
  return ui.gated && !ui.revealed && !ui.done ? recallBox() : choiceButtons(q);
}

function bodyHtml(q) {
  let h = `<div class="q-prompt">${md(q.prompt)}</div>`;
  if (q.type === 'bug') {
    h += `<p class="small muted">${ui.line ? `נבחרה שורה ${ui.line}. עכשיו בחר את הסיבה.` : 'גע בשורה שבה הבאג.'}</p>`;
    h += codeBlock(q.code, { numbered: true, pick: !ui.done });
    if (ui.line || ui.done) h += choicesOrGate(q);
  } else if (q.code) {
    h += codeBlock(q.code, { numbered: q.code.split('\n').length > 3 });
  }
  if (q.type === 'mcq' || q.type === 'multi' || q.type === 'output') {
    if (q.type === 'multi' && (!ui.gated || ui.revealed || ui.done)) h += `<p class="small muted">סמן את כל התשובות הנכונות.</p>`;
    h += choicesOrGate(q);
  }
  if (q.type === 'order') {
    h += `<p class="small muted">גע בפריטים לפי הסדר הנכון. נגיעה בפריט שנבחר מחזירה אותו.</p>`;
    h += `<div class="order-picked">${ui.order.map((o, k) => {
      const cls = ui.done && !isMock() ? (q.items[k] === o.t ? 'right' : 'wrong') : '';
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
    if (q.domain === 'beh') h += storiesPanelHtml(q.sub);
    h += `<label class="field"><span>${isCode ? 'הקוד שלך' : 'התשובה שלך: בקול (הקלטה), בכתב, או שניהם'}</span>
      <textarea id="longIn" class="${isCode ? 'code-input' : ''}" ${isCode ? 'dir="ltr" spellcheck="false"' : 'dir="auto"'} ${ui.done ? 'disabled' : ''}>${esc(ui.text || '')}</textarea></label>`;
    if (!isCode) h += `<div id="recMain">${rec.recorderHtml(q.id + ':main')}</div>`;
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
    case 'oral': return !!(ui.text || '').trim() || rec.hasClip(q.id + ':main');
    default: return !!(ui.text || '').trim();
  }
}

function draw() {
  const q = ui.q;
  if (isMock() && ui.stage === 'fu') { drawMockFollowUp(); return; }
  const side = ui.showLesson && isDesktop();
  const lessonPanel = ui.showLesson ? `<div class="card lesson side">${lessonHtml(content.lessons[q.lesson])}
     ${side ? '' : '<button class="btn" data-act="closeLesson">חזרה לשאלה</button>'}</div>` : '';
  if (ui.showLesson && !side) { root.innerHTML = header(q) + lessonPanel; bind(); return; }
  const mock = isMock();
  root.innerHTML = `${header(q)}<div class="split ${side ? 'with-side' : ''}"><div>
    <div class="card">${bodyHtml(q)}
      ${ui.done ? '' : `<div class="actions">
        <button class="btn primary" data-act="submit" ${canSubmit(q) ? '' : 'disabled'}>${mock ? 'סיימתי לענות' : 'בדיקה'}</button>
        <button class="btn" data-act="dunno">לא יודע</button>
        ${mock ? '' : '<button class="btn ghost" data-act="unknown">לא מכיר את הנושא</button>'}
      </div>`}
    </div>
    <div id="fb">${ui.feedback || ''}</div>
  </div>${side ? lessonPanel : ''}</div>`;
  bind();
  markBugLines();
}

function redrawRecorders() {
  const q = ui?.q;
  if (!q) return;
  const m = root.querySelector('#recMain');
  if (m) m.innerHTML = rec.recorderHtml(q.id + ':main');
  const f = root.querySelector('#recFu');
  if (f) f.innerHTML = rec.recorderHtml(q.id + ':fu');
  const b = root.querySelector('[data-act="submit"]');
  if (b) b.disabled = !canSubmit(q);
}

function bind() {
  root.onclick = (e) => {
    const t = e.target.closest('[data-act],[data-choice],[data-line],[data-pick],[data-unpick],[data-grade],[data-knew],[data-rec]');
    if (!t) return;
    const q = ui.q;
    if (t.dataset.rec) { rec.toggle(t.dataset.rec, redrawRecorders); return; }
    if (t.dataset.line && !ui.done && q.type === 'bug') { ui.line = +t.dataset.line; draw(); return; }
    if (t.dataset.choice !== undefined && !ui.done) {
      const ci = +t.dataset.choice;
      if (q.type === 'multi') { ui.sel.has(ci) ? ui.sel.delete(ci) : ui.sel.add(ci); } else ui.sel = ci;
      draw(); return;
    }
    if (t.dataset.pick !== undefined && !ui.done) { ui.order.push(ui.pool.find((p) => p.i === +t.dataset.pick)); draw(); return; }
    if (t.dataset.unpick !== undefined && !ui.done) { ui.order.splice(+t.dataset.unpick, 1); draw(); return; }
    if (t.dataset.knew) { knew(t.dataset.knew === 'yes'); return; }
    if (t.dataset.grade) { ui.grade = t.dataset.grade; markGradeButtons(); return; }
    switch (t.dataset.act) {
      case 'submit': submit(); break;
      case 'dunno': submit(true); break;
      case 'unknown': notKnown(); break;
      case 'reveal': ui.revealed = true; draw(); break;
      case 'next': next(); break;
      case 'lesson': ui.showLesson = true; draw(); break;
      case 'closeLesson': ui.showLesson = false; draw(); break;
      case 'quit':
        if (isMock()) { if (confirm('לסיים את הסימולציה עכשיו ולעבור לבדיקה?')) toReview(); break; }
        if (confirm('לסיים את הסשן עכשיו? התשובות שכבר נתת נשמרו.')) finish();
        break;
      case 'leave': rec.stop(); stopTimer(); get().current.updatedAt = Date.now(); save(); navigate('#/'); break;
      case 'pause': togglePause(); break;
      case 'followUp': followUp(); break;
      case 'followUpSend': followUpSend(); break;
      case 'gradeMain': gradeByChecklist(); break;
      case 'fuShow': ui.fu = 'shown'; refreshFeedback(); break;
      case 'fuDone': fuDone(); break;
      case 'fuSkip': ui.fu = 'skipped'; refreshFeedback(); break;
      case 'mockFuNext': mockFuNext(); break;
      case 'saveNote': saveNote(); break;
    }
  };
  root.onchange = (e) => {
    const c = e.target.closest('[data-chk]');
    if (c) { const set = ui.chk[c.dataset.chk]; c.checked ? set.add(+c.dataset.i) : set.delete(+c.dataset.i); }
  };
  root.oninput = (e) => {
    if (e.target.id === 'shortIn' || e.target.id === 'longIn') {
      ui.text = e.target.value;
      const b = root.querySelector('[data-act="submit"]');
      if (b) b.disabled = !canSubmit(ui.q);
    }
    if (e.target.id === 'fuIn') ui.fuText = e.target.value;
    if (e.target.id === 'noteIn') ui.noteText = e.target.value;
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
  if (!ui || !root?.isConnected || !location.hash.startsWith('#/session') || !ui.q) return;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
  const q = ui.q;
  if (e.key === 'Enter') {
    if (ui.done && ui.answered) { e.preventDefault(); next(); }
    else if (!ui.done && canSubmit(q)) { e.preventDefault(); submit(); }
    return;
  }
  const n = parseInt(e.key, 10);
  if (ui.gated && !ui.revealed) return;
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
  if (cur.mode === 'mock') { startMockClock(); return; }
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

// One clock for the whole simulation, like a real interview slot.
function startMockClock() {
  const cur = get().current;
  const show = () => {
    const el = document.getElementById('timer');
    const left = Math.max(0, cur.limit - cur.elapsed);
    if (el) { el.className = 'timer' + (left <= 300 ? ' low' : ''); el.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`; }
  };
  show();
  timerId = setInterval(() => {
    cur.elapsed++;
    if (cur.elapsed % 10 === 0) save();
    show();
    if (cur.elapsed >= cur.limit) { stopTimer(); toast('הזמן של הראיון נגמר. עוברים לבדיקה.'); toReview(); }
  }, 1000);
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
  rec.stop();
  if (isMock()) { mockSubmit(gaveUp); return; }
  if (q.type === 'oral' || q.type === 'code') {
    if (gaveUp) { record(false); ui.feedback = openFeedback(q, false, timedOut); }
    else { ui.feedback = openFeedback(q, null); }
    draw();
    if (!gaveUp) startAiOrSelf();
    return;
  }
  const ok = !gaveUp && isCorrect(q);
  if (ok && ui.gated) {
    // Picking the right choice is not enough in recall mode: did you know it before seeing them?
    ui.feedback = `<div class="feedback info"><h3>נכון. ידעת את התשובה לפני שראית את האפשרויות?</h3>
      <p class="small muted">אם רק זיהית אותה מתוך הרשימה, השאלה תיחשב טעות ותחזור.</p>
      <div class="actions"><button class="btn good" data-knew="yes">כן, ידעתי</button><button class="btn" data-knew="no">לא, זיהיתי מהרשימה</button></div></div>`;
    draw();
    return;
  }
  record(ok);
  ui.feedback = closedFeedback(q, ok, timedOut);
  draw();
}

function knew(yes) {
  const q = ui.q;
  record(yes);
  ui.feedback = closedFeedback(q, yes, false, !yes);
  draw();
}

function markBugLines() {
  const q = ui.q;
  if (q.type !== 'bug') return;
  root.querySelectorAll('pre.code .ln').forEach((ln) => {
    const n = +ln.dataset.line;
    if (!ui.done || isMock()) { if (n === ui.line) ln.classList.add('sel'); return; }
    if (n === q.bugLine) ln.classList.add('right');
    else if (n === ui.line) ln.classList.add('wrong');
  });
}

// Where a company question was reported (links open outside the app; offline they just show the site name).
function sourcesHtml(q) {
  if (!q.sources?.length) return '';
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };
  return `<p class="small muted">מקור: ${q.sources.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener" dir="ltr">${esc(host(u))}</a>`).join(' · ')}</p>`;
}

// Closed-question feedback is rebuilt from state, so the follow-up box can update in place.
function closedFeedback(q, ok, timedOut, recognizedOnly = false) {
  ui.feedbackFn = () => closedFeedbackHtml(q, ok, timedOut, recognizedOnly);
  return ui.feedbackFn();
}

function closedFeedbackHtml(q, ok, timedOut, recognizedOnly) {
  let answer = '';
  if (!ok && !recognizedOnly) {
    if (q.type === 'short') answer = `<p>התשובה: <strong dir="auto">${esc(q.accept[0])}</strong></p>`;
    if (q.type === 'order') answer = `<p>הסדר הנכון:</p><ol>${q.items.map((t) => `<li>${inlineMd(t)}</li>`).join('')}</ol>`;
    if (q.type === 'bug' && ui.line !== q.bugLine) answer = `<p>הבאג בשורה ${q.bugLine}.</p>`;
  }
  const title = ok ? 'נכון' : recognizedOnly ? 'נחשב טעות: זיהית, אבל לא שלפת' : timedOut ? 'נגמר הזמן' : 'לא נכון';
  return `<div class="feedback ${ok ? 'good' : 'bad'}">
    <h3>${title}</h3>${recognizedOnly ? '<p class="small">השאלה חוזרת בסשנים הבאים, עד שתדע אותה בלי לראות את האפשרויות.</p>' : ''}${answer}${md(q.explanation)}${sourcesHtml(q)}
  </div>${noteHtml(q, ok)}${followUpHtml(ok)}${nextButtons(ok)}`;
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

// Re-renders only the feedback area (keeps what was typed in the follow-up box).
function refreshFeedback() {
  ui.feedback = ui.feedbackFn();
  const fb = document.getElementById('fb');
  if (fb) { fb.innerHTML = ui.feedback; } else draw();
}

// ---------- Mistake notebook ----------
function noteHtml(q, ok) {
  const prev = get().notes[q.id]?.text;
  if (ok) return prev ? `<div class="note-box"><span class="small muted">ההערה שלך מפעם קודמת:</span> ${esc(prev)}</div>` : '';
  if (ui.noteText === undefined) ui.noteText = prev || '';
  return `<div class="note-box">
    <label class="field"><span>למה טעיתי? משפט אחד, במילים שלך. ההערה תופיע כשהשאלה תחזור.</span>
      <input type="text" id="noteIn" dir="auto" value="${esc(ui.noteText)}" placeholder="למשל: בלבלתי בין ... ל-..."></label>
    <button class="btn small" data-act="saveNote">${ui.noteSaved ? 'נשמר ✓' : 'שמור הערה'}</button></div>`;
}

function saveNote() {
  const text = (root.querySelector('#noteIn')?.value || '').trim();
  const st = get();
  if (text) st.notes[ui.q.id] = { text, u: Date.now() };
  else if (st.notes[ui.q.id]) st.notes[ui.q.id] = { text: '', u: Date.now() };
  ui.noteText = text;
  ui.noteSaved = true;
  save();
  const b = root.querySelector('[data-act="saveNote"]');
  if (b) b.textContent = 'נשמר ✓';
}

// ---------- Interviewer follow-up ("why?", "what if?") ----------
function followUpHtml(ok) {
  const q = ui.q;
  const cur = get().current;
  if (!ok || !q.followUp || !cur.followUps || q.level < 3 || ui.fu === 'skipped') return '';
  const f = q.followUp;
  let inner;
  if (ui.fu === 'done') {
    const r = ui.fuRatio;
    inner = `<p><strong>${r >= 0.75 ? 'עבר' : r >= 0.5 ? 'חלקי' : 'עוד לא'}:</strong> כיסית ${ui.chk.fu.size} מתוך ${f.rubric.length} נקודות.${r < 0.5 ? ' השאלה תחזור מוקדם יותר.' : ''}</p>
      <details><summary>תשובת דוגמה</summary>${md(f.modelAnswer)}</details>`;
  } else if (ui.fu === 'shown') {
    inner = `${ui.fuText ? `<p class="small muted">מה שכתבת:</p><p class="rich">${esc(ui.fuText)}</p>` : ''}
      <h3>תשובת דוגמה</h3>${md(f.modelAnswer)}
      <h3>סמן מה כיסית בתשובה שלך</h3>${checklistHtml(f.rubric, 'fu')}
      <button class="btn primary small" data-act="fuDone">סיימתי לבדוק</button>`;
  } else {
    inner = `<p class="small muted">ענה בקול או בכתב, ורק אז פתח את התשובה.</p>
      <div id="recFu">${rec.recorderHtml(q.id + ':fu')}</div>
      <label class="field"><span>התשובה שלך (לא חובה)</span><textarea id="fuIn" dir="auto" class="short-ta">${esc(ui.fuText || '')}</textarea></label>
      <div class="actions"><button class="btn primary small" data-act="fuShow">הצג תשובה ובדוק את עצמי</button><button class="btn ghost small" data-act="fuSkip">דלג</button></div>`;
  }
  return `<div class="card followup"><h3>🎤 שאלת המשך של המראיין</h3>${md(f.prompt)}${inner}</div>`;
}

function fuDone() {
  const q = ui.q;
  ui.fuRatio = ui.chk.fu.size / q.followUp.rubric.length;
  ui.fu = 'done';
  rec.stop();
  // A weak follow-up keeps the question closer: it comes back sooner.
  if (ui.fuRatio < 0.5) ui.grade = 'hard';
  const r = get().current.results.at(-1);
  if (r && r.qid === q.id) r.fu = Math.round(ui.fuRatio * 100) / 100;
  save();
  refreshFeedback();
}

function checklistHtml(items, key) {
  return `<div class="checklist">${items.map((r, i) => `<label class="check"><input type="checkbox" data-chk="${key}" data-i="${i}" ${ui.chk[key].has(i) ? 'checked' : ''}><span class="rich">${inlineMd(r)}</span></label>`).join('')}</div>`;
}

const ratioToScore = (r) => (r >= 0.9 ? 5 : r >= 0.75 ? 4 : r >= 0.5 ? 3 : r >= 0.25 ? 2 : 1);

function record(ok) {
  const q = ui.q;
  const cur = get().current;
  ui.ok = ok;
  cur.results.push({ qid: q.id, ok, domain: q.domain });
  const change = recordLevel(q, ok);
  if (change === 'up') setTimeout(() => toast(`עלית לרמה ${get().levels[q.sub].level} ב${content.subById[q.sub].name}`), 300);
  if (change === 'down') setTimeout(() => toast(`ירדת לרמה ${get().levels[q.sub].level} ב${content.subById[q.sub].name}. כדאי לחזור לשיעור.`), 300);
  // A missed question goes to the weak pool (see next()) and comes back in
  // the following sessions, not later in this one.
  touchStreak();
  save();
}

// Schedules the review when leaving the question, so "היה קשה" can apply.
function next() {
  const q = ui.q;
  const cur = get().current;
  rec.stop();
  if (ui.ok !== undefined && !ui.skipSchedule) schedule(q.id, ui.ok ? (ui.grade === 'hard' ? 'hard' : 'good') : 'wrong');
  cur.idx++;
  cur.updatedAt = Date.now();
  save();
  renderSession(root, { toast, navigate });
  window.scrollTo(0, 0);
}

function notKnown() {
  // Not counted as a mistake for the level, but the question joins the weak
  // pool so it comes back in the next sessions, after the lesson was read.
  const q = ui.q;
  schedule(q.id, 'wrong');
  ui.skipSchedule = true;
  ui.showLesson = true;
  ui.done = true;
  ui.answered = true;
  stopTimer();
  ui.feedback = `<div class="feedback info"><h3>בסדר, קודם לומדים</h3><p>השאלה תחזור בסשן הבא, ולא תיחשב טעות ברמה שלך.</p></div>
    <div class="actions"><button class="btn" data-act="lesson">פתח את השיעור</button><button class="btn primary" data-act="next">הבא ←</button></div>`;
  save();
  draw();
}

// ---------- Oral and code answers ----------
function openFeedback(q, ok, timedOut) {
  if (ok === false) {
    return `<div class="feedback bad"><h3>${timedOut ? 'נגמר הזמן' : 'לא ענית'}</h3>${modelAnswerHtml(q)}</div>${noteHtml(q, false)}${nextButtons(false)}`;
  }
  return '<div class="feedback info" id="aiBox"><p>בודק…</p></div>';
}

function modelAnswerHtml(q, withRubric = true) {
  const isCode = q.type === 'code';
  return `<h3>תשובת דוגמה</h3>${isCode ? codeBlock(q.modelAnswer) : md(q.modelAnswer)}
    ${withRubric ? `<h3>מה בודקים</h3><ul>${q.rubric.map((r) => `<li>${inlineMd(r)}</li>`).join('')}</ul>` : ''}${q.explanation ? md(q.explanation) : ''}${sourcesHtml(q)}`;
}

// Self-check without the AI: tick the rubric points your answer covered.
function selfGradeHtml(note) {
  const q = ui.q;
  return `<div class="feedback info">${note ? `<p class="small">${note}</p>` : ''}${modelAnswerHtml(q, false)}
    <h3>סמן מה התשובה שלך כיסה</h3><p class="small muted">היה כן עם עצמך: נקודה נחשבת רק אם אמרת אותה במפורש. פחות מחצי נחשב טעות.</p>
    ${checklistHtml(q.rubric, 'main')}
    <button class="btn primary" data-act="gradeMain">סיימתי לבדוק</button></div>`;
}

async function startAiOrSelf() {
  const q = ui.q;
  const box = () => document.getElementById('fb');
  if (ai.hasKey() && ai.online() && (ui.text || '').trim()) {
    try {
      const r = await ai.grade(q, ui.text);
      ui.aiResult = r;
      get().aiResults.push({ id: `${q.id}:${Date.now()}`, qid: q.id, answer: ui.text, ts: Date.now(), ...r });
      applyScore(r.score);
      ui.feedback = aiResultHtml(q, r) + noteHtml(q, r.score >= 3) + nextButtons(r.score >= 3);
      if (box()) { draw(); }
      return;
    } catch (e) {
      const retryable = !e.status || e.status === 429 || e.status >= 500;
      if (e.code === 'bad_key') toast('מפתח ה-API לא תקין. בדוק בהגדרות.');
      if (retryable && ui.text) ai.enqueue(q, ui.text);
      ui.feedback = selfGradeHtml(`הבדיקה של המראיין נכשלה (${esc(e.message)}).${retryable ? ' התשובה נשמרה ותיבדק שוב כשיהיה חיבור.' : ''}`);
      draw();
      return;
    }
  }
  if (ai.hasKey() && ui.text) ai.enqueue(q, ui.text);
  const note = ai.hasKey() ? 'אין חיבור. התשובה נשמרה, והמראיין יבדוק אותה כשהחיבור יחזור. בינתיים:' : '';
  ui.feedback = selfGradeHtml(note);
  draw();
}

function applyScore(score) {
  ui.grade = score === 3 ? 'hard' : 'good';
  record(score >= 3);
}

function gradeByChecklist() {
  const q = ui.q;
  const ratio = ui.chk.main.size / q.rubric.length;
  const n = ratioToScore(ratio);
  applyScore(n);
  ui.feedbackFn = () => `<div class="feedback ${n >= 3 ? 'good' : 'bad'}"><h3>כיסית ${ui.chk.main.size} מתוך ${q.rubric.length} נקודות (${n}/5)</h3>
    <details><summary>תשובת דוגמה ומה בודקים</summary>${modelAnswerHtml(q)}</details></div>${noteHtml(q, n >= 3)}${followUpHtml(n >= 3)}${nextButtons(n >= 3)}`;
  ui.feedback = ui.feedbackFn();
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

// ---------- Interview simulation ----------
function mockSubmit(gaveUp) {
  const q = ui.q;
  const cur = get().current;
  const a = { text: gaveUp ? '' : (ui.text || ''), gaveUp, recorded: rec.hasClip(q.id + ':main') };
  if (CHOICE_TYPES.includes(q.type) || q.type === 'short' || q.type === 'order') a.ok = !gaveUp && isCorrect(q);
  if (q.type === 'bug') a.line = ui.line;
  if (ui.sel !== null && ui.sel !== undefined) a.sel = q.type === 'multi' ? [...ui.sel] : ui.sel;
  cur.answers[q.id] = a;
  cur.updatedAt = Date.now();
  save();
  if (q.followUp && !gaveUp) { ui.stage = 'fu'; ui.fuText = ''; draw(); startMockClock(); return; }
  mockAdvance();
}

function drawMockFollowUp() {
  const q = ui.q;
  root.innerHTML = `${header(q)}<div class="card"><div class="q-prompt muted small">${md(q.prompt)}</div><hr class="sep">
    <h3>🎤 המראיין ממשיך:</h3>${md(q.followUp.prompt)}
    <div id="recFu">${rec.recorderHtml(q.id + ':fu')}</div>
    <label class="field"><span>התשובה שלך (בקול, בכתב או שניהם)</span><textarea id="fuIn" dir="auto">${esc(ui.fuText || '')}</textarea></label>
    <div class="actions"><button class="btn primary" data-act="mockFuNext">הבא ←</button></div></div>`;
  bind();
}

function mockFuNext() {
  const q = ui.q;
  const cur = get().current;
  rec.stop();
  cur.answers[q.id] = { ...cur.answers[q.id], fuText: ui.fuText || '', fuRecorded: rec.hasClip(q.id + ':fu') };
  stopTimer();
  mockAdvance();
}

function mockAdvance() {
  const cur = get().current;
  stopTimer();
  cur.idx++;
  cur.updatedAt = Date.now();
  save();
  renderSession(root, { toast, navigate });
  window.scrollTo(0, 0);
}

function toReview() {
  const cur = get().current;
  rec.stop();
  stopTimer();
  cur.reviewing = true;
  cur.updatedAt = Date.now();
  save();
  renderSession(root, { toast, navigate });
  window.scrollTo(0, 0);
}

const COMM = [
  'שאלתי שאלות הבהרה לפני שהתחלתי לפתור',
  'חשבתי בקול: המראיין יכול היה לעקוב אחרי הדרך, לא רק אחרי התשובה',
  'התחלתי מפתרון פשוט ואז שיפרתי, ואמרתי סיבוכיות זמן וזיכרון',
  'הזכרתי מקרי קצה ואיך הייתי בודק את הפתרון',
  'בשאלה ההתנהגותית: סיפור אמיתי בגוף ראשון, עם תוצאה מדידה ומה למדתי',
];

function renderMockReview() {
  const cur = get().current;
  stopTimer();
  rec.stop();
  ui = null;
  const rv = cur.review;
  const items = cur.ids.map((id) => content.questionById[id]).filter(Boolean);
  const chk = (group, id, list) => `<div class="checklist">${list.map((r, i) => `<label class="check"><input type="checkbox" data-rv="${group}" data-q="${id}" data-i="${i}" ${(rv[group][id] || []).includes(i) ? 'checked' : ''}><span class="rich">${inlineMd(r)}</span></label>`).join('')}</div>`;
  const yourText = (t) => (t ? `<div class="your-answer">${esc(t)}</div>` : '<p class="small muted">(לא נכתב טקסט)</p>');
  const audio = (key) => (rec.hasClip(key) ? `<p class="small muted">ההקלטה שלך:</p>${rec.recorderHtml(key).replace(/<button[^>]*>.*?<\/button>/s, '')}` : '');
  root.innerHTML = `<h1>בדיקת הסימולציה</h1>
    <p class="muted">עכשיו, כמו מראיין: עבור על כל תשובה, השווה לתשובת הדוגמה וסמן רק מה שבאמת אמרת. ${cur.elapsed ? `זמן: ${Math.round(cur.elapsed / 60)} דקות.` : ''}</p>
    ${items.map((q, k) => {
      const a = cur.answers[q.id];
      const closed = a && 'ok' in a;
      let body;
      if (!a) body = '<p class="feedback bad">לא הגעת לשאלה הזאת בזמן.</p>';
      else if (closed) {
        const right = q.type === 'short' ? q.accept[0] : q.type === 'order' ? q.items.join(' ← ') : q.type === 'multi' ? q.answer.map((i) => q.choices[i]).join(' · ') : q.choices?.[q.answer];
        body = `<div class="feedback ${a.ok ? 'good' : 'bad'}"><h3>${a.ok ? 'נכון' : 'לא נכון'}</h3><p>התשובה הנכונה: <span class="rich">${inlineMd(right || '')}</span></p>${md(q.explanation)}</div>`;
      } else {
        body = `<h3>מה ענית</h3>${audio(q.id + ':main')}${yourText(a.text)}
          <details><summary>תשובת דוגמה</summary>${q.type === 'code' ? codeBlock(q.modelAnswer) : md(q.modelAnswer)}</details>
          <h3>סמן מה כיסית</h3>${chk('main', q.id, q.rubric)}
          ${ai.hasKey() && a.text ? `<button class="btn small" data-ai="${q.id}">בדיקה עם המראיין AI</button><div id="ai-${q.id}"></div>` : ''}`;
      }
      const fu = q.followUp && a && !a.gaveUp ? `<hr class="sep"><h3>🎤 שאלת ההמשך</h3>${md(q.followUp.prompt)}
        ${audio(q.id + ':fu')}${yourText(a.fuText)}
        <details><summary>תשובת דוגמה</summary>${md(q.followUp.modelAnswer)}</details>
        <h3>סמן מה כיסית</h3>${chk('fu', q.id, q.followUp.rubric)}` : '';
      return `<div class="card"><p class="small muted">${k + 1}. ${SECTION_NAMES[cur.sections[q.id]] || ''} · ${esc(content.subById[q.sub]?.name || '')} · רמה ${q.level}</p>
        <div class="q-prompt">${md(q.prompt)}</div>${q.code ? codeBlock(q.code) : ''}${body}${fu}</div>`;
    }).join('')}
    <div class="card"><h2>איך התנהלת</h2><p class="small muted">מראיינים מסתכלים גם על הדרך, לא רק על התשובה.</p>${chk('comm', 'all', COMM)}</div>
    <button class="btn primary big" data-act="mockScore">חשב ציון וסיים</button>`;
  root.onchange = (e) => {
    const c = e.target.closest('[data-rv]');
    if (!c) return;
    const g = c.dataset.rv, id = c.dataset.q, i = +c.dataset.i;
    const arr = new Set(g === 'comm' ? rv.comm : (rv[g][id] || []));
    c.checked ? arr.add(i) : arr.delete(i);
    if (g === 'comm') rv.comm = [...arr]; else rv[g][id] = [...arr];
    cur.updatedAt = Date.now();
    save();
  };
  root.oninput = null;
  root.onclick = async (e) => {
    const t = e.target.closest('[data-act="mockScore"],[data-ai]');
    if (!t) return;
    if (t.dataset.ai) {
      const q = content.questionById[t.dataset.ai];
      const box = document.getElementById('ai-' + q.id);
      t.disabled = true; box.innerHTML = '<p class="small">בודק…</p>';
      try { const r = await ai.grade(q, cur.answers[q.id].text); box.innerHTML = `<div class="feedback info"><h3>ציון המראיין: ${r.score}/5</h3>${md(r.verdict)}${r.missing?.length ? `<ul>${r.missing.map((m) => `<li>${inlineMd(m)}</li>`).join('')}</ul>` : ''}</div>`; }
      catch (err) { box.innerHTML = `<p class="small">הבדיקה נכשלה: ${esc(err.message)}</p>`; t.disabled = false; }
      return;
    }
    scoreMock();
  };
}

export const VERDICTS = [[0.8, 'עובר בביטחון (strong hire)'], [0.65, 'עובר (hire)'], [0.5, 'גבולי (lean no hire)'], [0, 'עוד לא (no hire)']];
export const verdictOf = (s) => VERDICTS.find(([t]) => s >= t)[1];

function scoreMock() {
  const st = get();
  const cur = st.current;
  const rv = cur.review;
  const per = {};
  for (const id of cur.ids) {
    const q = content.questionById[id];
    if (!q) continue;
    const a = cur.answers[id];
    let main = 0;
    if (a && 'ok' in a) main = a.ok ? 1 : 0;
    else if (a) main = (rv.main[id] || []).length / q.rubric.length;
    let score = main;
    if (q.followUp && a && !a.gaveUp) score = main * 0.65 + ((rv.fu[id] || []).length / q.followUp.rubric.length) * 0.35;
    const sec = cur.sections[id] || 'depth';
    (per[sec] ||= []).push(score);
    // The simulation feeds the review schedule like any other session.
    if (a) schedule(id, score >= 0.75 ? 'good' : score >= 0.5 ? 'hard' : 'wrong');
  }
  const sections = Object.fromEntries(Object.entries(per).map(([k, v]) => [k, v.reduce((x, y) => x + y, 0) / v.length]));
  const secVals = Object.values(sections);
  const content01 = secVals.length ? secVals.reduce((x, y) => x + y, 0) / secVals.length : 0;
  const comm = rv.comm.length / COMM.length;
  const score = content01 * 0.85 + comm * 0.15;
  const result = { ts: Date.now(), level: cur.level, score, verdict: verdictOf(score), sections, comm, minutes: Math.round(cur.elapsed / 60), u: Date.now() };
  st.mocks.push(result);
  st.lastMock = result;
  touchStreak();
  st.current = null;
  save();
  rec.clear();
  navigate('#/mock-result');
}

export function renderMockResult(el) {
  const m = get().lastMock || get().mocks.at(-1);
  if (!m) { el.innerHTML = '<p>אין סימולציה להצגה.</p>'; return; }
  const pct = (x) => `${Math.round(x * 100)}%`;
  el.innerHTML = `<h1>תוצאת הסימולציה</h1>
    <div class="card"><div class="stats">
      <div class="stat"><b>${pct(m.score)}</b><span>ציון</span></div>
      <div class="stat"><b>${m.minutes || 0}</b><span>דקות</span></div>
      <div class="stat"><b>${pct(m.comm || 0)}</b><span>התנהלות</span></div></div>
      <p class="verdict">${esc(m.verdict)}</p></div>
    <div class="card"><h2>לפי חלק</h2>${Object.entries(m.sections).map(([k, v]) => `<div class="ready-row"><span>${SECTION_NAMES[k] || k}</span><span class="bar"><i style="width:${pct(v)}"></i></span><b>${pct(v)}</b></div>`).join('')}</div>
    <p class="small muted">הציון מחושב מהנקודות שסימנת בכל תשובה (65% התשובה, 35% שאלת ההמשך) ומההתנהלות (15%). הספים: 80% עובר בביטחון, 65% עובר, 50% גבולי. שאלות שלא עברו נכנסו לחזרות.</p>
    <div class="actions"><a class="btn primary" href="#/practice?m=mock">סימולציה נוספת</a><a class="btn" href="#/">לבית</a></div>`;
}

// ---------- Finish ----------
function finish() {
  stopTimer();
  rec.stop();
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
  rec.clear();
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

export function stopSessionTimer() { stopTimer(); rec.stop(); }
