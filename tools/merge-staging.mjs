// Appends staged questions into the content files, so agents can write new
// questions in parallel with others editing the same subtopic files.
//
// Staging file: staging/<domain>/<subtopic>.<anything>.json
//   { "questions": [ ...question objects, any "id" (replaced) ... ],
//     "glossary":  [ ...optional {term, def} added to the subtopic's first lesson ... ],
//     "details":   [ ...optional {title, body} added to the first lesson ... ] }
// Questions get fresh ids continuing the file's numbering; `lesson` defaults to
// the subtopic's first lesson. Merged staging files are moved to staging/merged/.
// Usage: node tools/merge-staging.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, renameSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const staging = join(root, 'staging');
if (!existsSync(staging)) { console.log('no staging folder'); process.exit(0); }
const done = join(staging, 'merged');
mkdirSync(done, { recursive: true });

let added = 0;
for (const domain of readdirSync(staging)) {
  const ddir = join(staging, domain);
  if (domain === 'merged' || !statSync(ddir).isDirectory()) continue;
  for (const f of readdirSync(ddir).filter((x) => x.endsWith('.json'))) {
    const sub = f.split('.')[0];
    const target = join(root, 'content', domain, `${sub}.json`);
    if (!existsSync(target)) { console.log(`skip ${domain}/${f}: no content file for ${sub}`); continue; }
    const data = JSON.parse(readFileSync(target, 'utf8'));
    const st = JSON.parse(readFileSync(join(ddir, f), 'utf8'));
    let max = 0;
    for (const q of data.questions) { const m = /\.q(\d+)$/.exec(q.id); if (m) max = Math.max(max, +m[1]); }
    const titles = new Set(data.questions.map((q) => q.problem).filter(Boolean));
    for (const q of st.questions || []) {
      max++;
      q.id = `${domain}.${sub}.q${String(max).padStart(2, '0')}`;
      if (!q.lesson) q.lesson = data.lessons[0].id;
      data.questions.push(q);
      added++;
      if (q.problem) titles.add(q.problem);
    }
    const lesson = data.lessons[0];
    const terms = new Set((lesson.glossary || []).map((g) => g.term.toLowerCase()));
    for (const g of st.glossary || []) if (!terms.has(g.term.toLowerCase())) { (lesson.glossary ||= []).push(g); terms.add(g.term.toLowerCase()); }
    for (const d of st.details || []) (lesson.details ||= []).push(d);
    writeFileSync(target, JSON.stringify(data, null, 2) + '\n');
    mkdirSync(join(done, domain), { recursive: true });
    renameSync(join(ddir, f), join(done, domain, f));
    console.log(`${domain}/${sub}: +${(st.questions || []).length} questions`);
  }
}
console.log(`merged ${added} questions. Next: node tools/validate.mjs && node tools/build-index.mjs`);
