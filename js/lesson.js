import { esc, inlineMd, md } from './md.js';

const list = (items, ordered) => {
  const tag = ordered ? 'ol' : 'ul';
  return `<${tag}>${(items || []).map((i) => `<li>${inlineMd(i)}</li>`).join('')}</${tag}>`;
};

export function lessonHtml(l) {
  if (!l) return '<p class="muted">אין שיעור לנושא הזה עדיין.</p>';
  const details = (l.details || []).map((d) => `<section><h3>${esc(d.title)}</h3>${md(d.body)}</section>`).join('');
  const examples = (l.examples || []).map((x) => `<details class="example" open><summary>${esc(x.title)}</summary>${md(x.body)}</details>`).join('');
  const glossary = (l.glossary || []).length
    ? `<section><h3>מונחים</h3><dl class="glossary">${l.glossary.map((g) => `<dt>${inlineMd(g.term)}</dt><dd>${inlineMd(g.def)}</dd>`).join('')}</dl></section>`
    : '';
  return `<article class="lesson">
    <h2>${esc(l.title)}</h2>
    <section><h3>מה זה</h3><p>${inlineMd(l.what)}</p></section>
    <section><h3>מתי משתמשים</h3>${list(l.when)}</section>
    <section><h3>איך זה עובד</h3>${list(l.how, true)}</section>
    ${l.diagram ? `<section><pre class="diagram">${esc(l.diagram)}</pre></section>` : ''}
    ${details}
    ${examples ? `<section><h3>דוגמאות</h3>${examples}</section>` : ''}
    <section><h3>סיבוכיות</h3><p>${inlineMd(l.complexity)}</p></section>
    <section><h3>מלכודות</h3>${list(l.pitfalls)}</section>
    <section><h3>מה מראיין סניור רוצה לשמוע</h3>${list(l.senior)}</section>
    ${glossary}
  </article>`;
}

// Plain text of a lesson, for library search.
export function lessonText(l) {
  return [l.title, l.what, ...(l.when || []), ...(l.how || []),
    ...(l.details || []).flatMap((d) => [d.title, d.body]),
    ...(l.examples || []).flatMap((x) => [x.title, x.body]),
    ...(l.glossary || []).flatMap((g) => [g.term, g.def])].join(' ').toLowerCase();
}
