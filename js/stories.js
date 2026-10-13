// Behavioral story bank: the learner's own STAR stories, written once and
// practiced out loud. Stored in state.stories (synced like other progress).
import { get, save } from './store.js';
import { esc, md } from './md.js';
import * as rec from './recorder.js';

export const KINDS = {
  pitch: 'ספר על עצמך (pitch)',
  project: 'הפרויקט המאתגר ביותר',
  failure: 'כישלון וטעות',
  conflict: 'קונפליקט ומחלוקת',
  leadership: 'הובלה והשפעה בלי סמכות',
  pressure: 'לחץ, דדליין ועדיפויות',
  learning: 'למידה מהירה של תחום חדש',
  why: 'למה תוכנה, למה החברה הזאת',
};

// Questions interviewers actually ask for each kind (generic wording, used for practice).
export const PROMPTS = {
  pitch: ['ספר לי על עצמך.', 'עבור איתי על קורות החיים שלך בשתי דקות.'],
  project: ['ספר על הפרויקט הטכני הכי מאתגר שעשית. מה היה החלק הכי קשה?', 'מה ההחלטה הטכנית שאתה הכי גאה בה, ומה היו החלופות?'],
  failure: ['ספר על פעם שנכשלת או טעית. מה עשית אחר כך?', 'ספר על באג או תקלה שהיית אחראי להם.'],
  conflict: ['ספר על מחלוקת עם עמית או מנהל. איך זה נגמר?', 'ספר על פעם שקיבלת ביקורת קשה.'],
  leadership: ['ספר על פעם שהובלת שינוי בלי סמכות פורמלית.', 'ספר על פעם ששכנעת צוות לאמץ גישה טכנית.'],
  pressure: ['ספר על דדליין שנראה בלתי אפשרי. מה ויתרת ומה לא?', 'איך אתה מחליט מה לעשות קודם כשהכול דחוף?'],
  learning: ['ספר על פעם שהיית צריך ללמוד תחום חדש מהר.', 'איך אתה ניגש לקוד בסיס גדול שאתה לא מכיר?'],
  why: ['למה אתה עובר מ-RF/DSP לתוכנה?', 'למה NVIDIA? למה Microsoft? מה תביא לצוות?'],
};

const SUB_KINDS = { 'beh.failure': ['failure'], 'beh.conflict': ['conflict'], 'beh.leadership': ['leadership', 'project'], 'beh.why-software': ['why', 'pitch'], 'beh.star': ['project', 'pressure', 'learning', 'failure'] };

export const STAR_CHECK = [
  'הקשר קצר (Situation/Task) של 2–3 משפטים, בלי להיתקע בו',
  'מה **אני** עשיתי, בגוף ראשון, עם החלטות ולמה',
  'תוצאה מדידה: מספר, זמן, אחוז, או השפעה ברורה',
  'מה למדתי ומה הייתי עושה אחרת',
  'פחות משלוש דקות, בלי לקפוץ קדימה ואחורה',
];

export const allStories = () => Object.values(get().stories).filter((s) => !s.deleted).sort((a, b) => (b.u || 0) - (a.u || 0));

export function storiesPanelHtml(sub) {
  const kinds = SUB_KINDS[sub] || Object.keys(KINDS);
  const list = allStories().filter((s) => s.kinds?.some((k) => kinds.includes(k)));
  if (!list.length) return `<p class="small muted">טיפ: כתוב את הסיפורים שלך ב<a href="#/stories">מאגר הסיפורים</a>, והם יופיעו כאן כשתענה על שאלות כאלה.</p>`;
  return `<details class="stories-panel"><summary>הסיפורים שלך שמתאימים (${list.length})</summary>${list.map(storyCard).join('')}</details>`;
}

function storyCard(s) {
  return `<div class="story-mini"><strong>${esc(s.title || 'ללא כותרת')}</strong>
    ${s.s ? `<p><b>S/T:</b> ${esc(s.s)}</p>` : ''}${s.a ? `<p><b>A:</b> ${esc(s.a)}</p>` : ''}${s.r ? `<p><b>R:</b> ${esc(s.r)}</p>` : ''}${s.l ? `<p><b>למדתי:</b> ${esc(s.l)}</p>` : ''}</div>`;
}

// ---------- Screens ----------
export function renderStories(el) {
  const list = allStories();
  const covered = new Set(list.flatMap((s) => s.kinds || []));
  el.innerHTML = `<p><a href="#/library">→ לספרייה</a></p><h1>הסיפורים שלי</h1>
    <p class="muted">בשאלות התנהגותיות המראיין רוצה סיפורים אמיתיים שלך, לא תשובה מהספר. כתוב כאן 6–8 סיפורים בשיטת STAR פעם אחת, ותרגל לספר אותם בקול. אותו סיפור טוב עונה על כמה סוגי שאלות.</p>
    <div class="card"><h2>כיסוי</h2><div class="row">${Object.entries(KINDS).map(([k, n]) => `<span class="chip ${covered.has(k) ? 'good' : ''}">${covered.has(k) ? '✓ ' : ''}${n}</span>`).join('')}</div></div>
    <div class="actions"><a class="btn primary" href="#/story/new">+ סיפור חדש</a>${list.length ? '<a class="btn" href="#/story-practice">תרגול: ספר סיפור בקול</a>' : ''}</div>
    ${list.length ? `<div class="card"><ul class="list">${list.map((s) => `<li><a class="list-btn" href="#/story/${encodeURIComponent(s.id)}"><span>${esc(s.title || 'ללא כותרת')}</span><span class="small muted">${(s.kinds || []).map((k) => KINDS[k]?.split(' ')[0]).join(' · ')}</span></a></li>`).join('')}</ul></div>` : ''}
    <div class="card"><h2>מה מראיינים בודקים בסיפור</h2><ul>${STAR_CHECK.map((c) => `<li class="rich">${md(c).replace(/^<p>|<\/p>$/g, '')}</li>`).join('')}</ul></div>`;
}

export function renderStoryEdit(el, id, navigate, toast) {
  const st = get();
  const isNew = id === 'new';
  const s = isNew ? { id: `st${Date.now()}`, title: '', kinds: [], s: '', a: '', r: '', l: '' } : st.stories[id];
  if (!s) { el.innerHTML = '<p>הסיפור לא נמצא.</p>'; return; }
  const field = (k, label, ph, rows = 3) => `<label class="field"><span>${label}</span><textarea id="f-${k}" dir="auto" rows="${rows}" placeholder="${esc(ph)}">${esc(s[k] || '')}</textarea></label>`;
  el.innerHTML = `<p><a href="#/stories">→ לסיפורים</a></p><h1>${isNew ? 'סיפור חדש' : 'עריכת סיפור'}</h1>
    <div class="card">
      <label class="field"><span>כותרת קצרה (לך, לא למראיין)</span><input type="text" id="f-title" dir="auto" value="${esc(s.title)}" placeholder="למשל: ה-underrun ב-pipeline של ה-SDR"></label>
      <p class="small muted">לאילו שאלות הסיפור מתאים?</p>
      <div class="kinds">${Object.entries(KINDS).map(([k, n]) => `<label class="check"><input type="checkbox" data-kind="${k}" ${s.kinds.includes(k) ? 'checked' : ''}> ${n}</label>`).join('')}</div>
      ${field('s', 'Situation + Task: ההקשר והמשימה (2–3 משפטים)', 'איפה, מתי, מה היה על הכף, מה היה התפקיד שלי')}
      ${field('a', 'Action: מה אני עשיתי (הכי ארוך)', 'צעדים, החלטות ולמה, חלופות שפסלתי, מה עשיתי כשנתקעתי', 5)}
      ${field('r', 'Result: התוצאה, עם מספר אם אפשר', 'למשל: ה-latency ירד מ-X ל-Y, הפרויקט נמסר בזמן')}
      ${field('l', 'מה למדתי / מה הייתי עושה אחרת', '')}
      <div class="actions"><button class="btn primary" id="saveStory">שמור</button>${isNew ? '' : '<button class="btn bad" id="delStory">מחק</button>'}</div>
    </div>`;
  document.getElementById('saveStory').onclick = () => {
    const v = (k) => document.getElementById('f-' + k).value.trim();
    const kinds = [...el.querySelectorAll('[data-kind]')].filter((c) => c.checked).map((c) => c.dataset.kind);
    st.stories[s.id] = { id: s.id, title: v('title'), kinds, s: v('s'), a: v('a'), r: v('r'), l: v('l'), u: Date.now() };
    save();
    toast('נשמר');
    navigate('#/stories');
  };
  const del = document.getElementById('delStory');
  if (del) del.onclick = () => {
    if (!confirm('למחוק את הסיפור?')) return;
    // Kept as a tombstone so the deletion also reaches the other device.
    st.stories[s.id] = { id: s.id, deleted: true, u: Date.now() };
    save();
    navigate('#/stories');
  };
}

// Practice: a random behavioral question, pick a story, tell it out loud, check yourself.
export function renderStoryPractice(el) {
  const kinds = Object.keys(KINDS);
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  const prompts = PROMPTS[kind];
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];
  const fits = allStories().filter((s) => s.kinds?.includes(kind));
  const key = `story:${Date.now()}`;
  const redrawRec = () => { const b = el.querySelector('#recBox'); if (b) b.innerHTML = rec.recorderHtml(key); };
  el.innerHTML = `<p><a href="#/stories">→ לסיפורים</a></p><h1>תרגול סיפור</h1>
    <div class="card"><p class="small muted">${esc(KINDS[kind])}</p><div class="q-prompt"><p><strong>${esc(prompt)}</strong></p></div>
      <p class="small muted">ספר בקול, כאילו המראיין מולך. עדיף פחות משלוש דקות.</p>
      <div id="recBox">${rec.recorderHtml(key)}</div>
      ${fits.length ? `<details class="stories-panel"><summary>הסיפורים שלך שמתאימים (${fits.length})</summary>${fits.map(storyCard).join('')}</details>` : '<p class="small muted">אין לך עדיין סיפור מסומן לסוג הזה. זה בדיוק המקום לכתוב אחד.</p>'}
    </div>
    <div class="card"><h2>בדוק את עצמך</h2>${STAR_CHECK.map((c) => `<label class="check"><input type="checkbox"><span class="rich">${md(c).replace(/^<p>|<\/p>$/g, '')}</span></label>`).join('')}</div>
    <div class="actions"><button class="btn primary" id="again">שאלה אחרת</button><a class="btn" href="#/stories">סיום</a></div>`;
  el.onclick = (e) => {
    const t = e.target.closest('[data-rec]');
    if (t) rec.toggle(t.dataset.rec, redrawRec);
    if (e.target.id === 'again') { rec.stop(); el.onclick = null; renderStoryPractice(el); }
  };
}
