import { esc, inlineMd } from './md.js';

const list = (items, ordered) => {
  const tag = ordered ? 'ol' : 'ul';
  return `<${tag}>${(items || []).map((i) => `<li>${inlineMd(i)}</li>`).join('')}</${tag}>`;
};

export function lessonHtml(l) {
  if (!l) return '<p class="muted">אין שיעור לנושא הזה עדיין.</p>';
  return `<article class="lesson">
    <h2>${esc(l.title)}</h2>
    <section><h3>מה זה</h3><p>${inlineMd(l.what)}</p></section>
    <section><h3>מתי משתמשים</h3>${list(l.when)}</section>
    <section><h3>איך זה עובד</h3>${list(l.how, true)}</section>
    ${l.diagram ? `<section><pre class="diagram">${esc(l.diagram)}</pre></section>` : ''}
    <section><h3>סיבוכיות</h3><p>${inlineMd(l.complexity)}</p></section>
    <section><h3>מלכודות</h3>${list(l.pitfalls)}</section>
    <section><h3>מה מראיין סניור רוצה לשמוע</h3>${list(l.senior)}</section>
  </article>`;
}
