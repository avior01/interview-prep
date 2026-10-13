// Adds interviewer follow-up questions ("why?", "what if...?") to existing questions.
//
// Staging file: staging-fu/<domain>/<subtopic>.json
//   { "<question id>": { "prompt": "...", "modelAnswer": "...", "rubric": ["...", "..."] }, ... }
// Each entry becomes `followUp` on that question in content/<domain>/<subtopic>.json.
//
// Usage: node tools/merge-followups.mjs --check   (validate staging only, no writes)
//        node tools/merge-followups.mjs           (validate and merge)
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const staging = join(root, 'staging-fu');
const checkOnly = process.argv.includes('--check');
const onlyDomain = process.argv.find((a, i) => i > 1 && !a.startsWith('--'));
if (!existsSync(staging)) { console.log('no staging-fu folder'); process.exit(0); }

const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const ELIGIBLE = ['mcq', 'multi', 'output', 'bug', 'oral'];
const errors = [];
const writes = [];
let total = 0;

for (const domain of readdirSync(staging)) {
  const ddir = join(staging, domain);
  if (!statSync(ddir).isDirectory() || (onlyDomain && domain !== onlyDomain)) continue;
  for (const f of readdirSync(ddir).filter((x) => x.endsWith('.json'))) {
    const sub = f.replace(/\.json$/, '');
    const where = `${domain}/${f}`;
    const target = join(root, 'content', domain, `${sub}.json`);
    if (!existsSync(target)) { errors.push(`${where}: no content file content/${domain}/${sub}.json`); continue; }
    let fu;
    try { fu = JSON.parse(readFileSync(join(ddir, f), 'utf8')); } catch (e) { errors.push(`${where}: invalid JSON: ${e.message}`); continue; }
    const data = JSON.parse(readFileSync(target, 'utf8'));
    const byId = new Map(data.questions.map((q) => [q.id, q]));
    let n = 0;
    for (const [id, x] of Object.entries(fu)) {
      const e = (m) => errors.push(`${where}: ${id}: ${m}`);
      const q = byId.get(id);
      if (!q) { e('no such question in this subtopic'); continue; }
      if (!ELIGIBLE.includes(q.type)) e(`type ${q.type} does not take a follow-up`);
      if (!x || !isStr(x.prompt)) e('missing prompt');
      if (!isStr(x?.modelAnswer)) e('missing modelAnswer');
      if (!Array.isArray(x?.rubric) || x.rubric.length < 2 || x.rubric.length > 5 || !x.rubric.every(isStr)) e('rubric must have 2-5 strings');
      if (x && JSON.stringify(x).includes('```')) e('no code blocks in follow-ups (inline `code` is fine)');
      if (!checkOnly && q) { q.followUp = { prompt: x.prompt, modelAnswer: x.modelAnswer, rubric: x.rubric }; n++; }
    }
    total += Object.keys(fu).length;
    if (!checkOnly) writes.push([target, data, `${domain}/${sub}: +${n} follow-ups`]);
  }
}
for (const e of errors) console.log('ERROR', e);
// Nothing is written unless every staging file is clean.
if (!errors.length) for (const [target, data, msg] of writes) { writeFileSync(target, JSON.stringify(data, null, 2) + '\n'); console.log(msg); }
console.log(`${total} follow-ups checked, ${errors.length} errors${checkOnly ? ' (check only)' : ''}`);
process.exit(errors.length ? 1 : 0);
