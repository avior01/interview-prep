// Enforces the "company tag = public source says it was asked there" rule on existing content.
// - A question keeps a company tag only if its `problem` appears in that company's list in
//   tools/company-problems.md (collected from the pages below); those page URLs become `sources`.
// - Questions that already carry `sources` are left as they are.
// - Every other company tag is removed (those were judgment calls, not sourced).
// Usage: node tools/fix-tags.mjs   (then validate + build-index)
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIST_URLS = {
  nvidia: ['https://www.geeksforgeeks.org/dsa/nvidia-coding-interview-questions/', 'https://interviewsolver.com/interview-questions/nvidia'],
  microsoft: ['https://leetcode.com/problem-list/55vr69d7/', 'https://interviewsolver.com/interview-questions/microsoft'],
  meta: ['https://leetcode.com/problem-list/7p59281/', 'https://www.geeksforgeeks.org/dsa/facebookmeta-sde-sheet-interview-questions-and-answers/'],
};
const norm = (s) => String(s || '').toLowerCase().replace(/^leetcode\s*\d+\s*·\s*/, '').replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, '');

const md = readFileSync(join(root, 'tools', 'company-problems.md'), 'utf8');
const lists = {};
for (const [, name, body] of md.matchAll(/^## (NVIDIA|Microsoft|Meta)[^\n]*\n([^#]+)/gm)) {
  lists[name.toLowerCase()] = new Set(body.split('·').map(norm).filter(Boolean));
}

const index = JSON.parse(readFileSync(join(root, 'content', 'index.json'), 'utf8'));
let kept = 0, removed = 0, untouched = 0;
for (const f of index.files) {
  const p = join(root, 'content', f);
  const data = JSON.parse(readFileSync(p, 'utf8'));
  let changed = false;
  for (const q of data.questions) {
    if (!q.tags?.length) continue;
    if (q.sources?.length) { untouched++; continue; }
    const keep = q.problem ? q.tags.filter((t) => lists[t]?.has(norm(q.problem))) : [];
    removed += q.tags.length - keep.length;
    kept += keep.length;
    if (keep.length) { q.tags = keep; q.sources = keep.flatMap((t) => LIST_URLS[t]); }
    else delete q.tags;
    changed = true;
  }
  if (changed) writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}
console.log(`tags kept with sources: ${kept}, removed: ${removed}, questions already sourced: ${untouched}`);
