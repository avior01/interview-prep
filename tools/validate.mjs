// Validates content files against CONTENT_GUIDE.md.
// Usage: node tools/validate.mjs [domainId]
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'content');
const taxonomy = JSON.parse(readFileSync(join(root, 'taxonomy.json'), 'utf8'));
const only = process.argv[2];

const MIN_PER_LEVEL = 6;
const COMPANY_TAGS = ['nvidia', 'microsoft', 'meta', 'apple', 'google', 'amazon', 'qualcomm', 'intel'];
const TYPES =['mcq', 'multi', 'output', 'bug', 'order', 'short', 'oral', 'code'];
const errors = [];
const warnings = [];
const seenIds = new Set();
let lessonCount = 0, questionCount = 0;

const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const isStrArr = (v, min = 1) => Array.isArray(v) && v.length >= min && v.every(isStr);

for (const domain of taxonomy.domains) {
  if (only && domain.id !== only) continue;
  for (const sub of domain.subtopics) {
    const file = join(root, domain.id, `${sub.id}.json`);
    const where = `${domain.id}/${sub.id}.json`;
    if (!existsSync(file)) { warnings.push(`${where}: missing`); continue; }
    let data;
    try { data = JSON.parse(readFileSync(file, 'utf8')); }
    catch (e) { errors.push(`${where}: invalid JSON: ${e.message}`); continue; }
    const err = (m) => errors.push(`${where}: ${m}`);

    if (data.domain !== domain.id) err(`domain should be "${domain.id}"`);
    if (data.subtopic !== sub.id) err(`subtopic should be "${sub.id}"`);
    if (!Array.isArray(data.lessons) || data.lessons.length === 0) err('needs at least one lesson');
    if (!Array.isArray(data.questions)) { err('questions must be an array'); continue; }

    const lessonIds = new Set();
    for (const l of data.lessons || []) {
      lessonCount++;
      const lw = `lesson ${l.id}`;
      if (!isStr(l.id) || !l.id.startsWith(`${domain.id}.${sub.id}`)) err(`${lw}: id must start with ${domain.id}.${sub.id}`);
      if (seenIds.has(l.id)) err(`${lw}: duplicate id`);
      seenIds.add(l.id); lessonIds.add(l.id);
      for (const f of ['title', 'what', 'complexity']) if (!isStr(l[f])) err(`${lw}: missing ${f}`);
      for (const f of ['when', 'how', 'pitfalls', 'senior']) if (!isStrArr(l[f])) err(`${lw}: ${f} must be a non-empty string array`);
      if (l.diagram !== undefined && typeof l.diagram !== 'string') err(`${lw}: diagram must be a string`);
      const titled = (arr, min, a, b) => Array.isArray(arr) && arr.length >= min && arr.every((x) => x && isStr(x[a]) && isStr(x[b]));
      if (!titled(l.details, 3, 'title', 'body')) err(`${lw}: details needs ≥3 {title, body}`);
      if (!titled(l.examples, 2, 'title', 'body')) err(`${lw}: examples needs ≥2 {title, body}`);
      if (!titled(l.glossary, 5, 'term', 'def')) err(`${lw}: glossary needs ≥5 {term, def}`);
      const blob = JSON.stringify(l);
      if (blob.includes('```')) err(`${lw}: lessons must not contain code blocks`);
    }

    const perLevel = [0, 0, 0, 0, 0, 0];
    for (const q of data.questions) {
      questionCount++;
      const qw = `question ${q.id}`;
      const qerr = (m) => err(`${qw}: ${m}`);
      if (!isStr(q.id) || !q.id.startsWith(`${domain.id}.${sub.id}.`)) qerr(`id must start with ${domain.id}.${sub.id}.`);
      if (seenIds.has(q.id)) qerr('duplicate id');
      seenIds.add(q.id);
      if (!Number.isInteger(q.level) || q.level < 1 || q.level > 5) qerr('level must be 1..5');
      else perLevel[q.level]++;
      if (!TYPES.includes(q.type)) { qerr(`unknown type ${q.type}`); continue; }
      if (!isStr(q.prompt)) qerr('missing prompt');
      if (!isStr(q.explanation)) qerr('missing explanation');
      if (!lessonIds.has(q.lesson)) qerr(`lesson "${q.lesson}" not in this file`);
      const text = `${q.prompt} ${q.explanation}`;
      if (/(השאלה הקודמת|בשאלה הקודמת|מהשאלה הקודמת|השאלה הבאה)/.test(text)) qerr('refers to another question; questions must stand alone');
      if (/(שתי|שלוש|ארבע) (הראשונות|האחרונות)|(האפשרות|התשובה|המסיח) (הראשונה|השנייה|השלישית|הרביעית|האחרונה)|תשובה [אבגד]'/.test(q.explanation)) qerr('explanation refers to a choice by position; choices are shuffled');
      if (q.tags !== undefined && !(Array.isArray(q.tags) && q.tags.every((t) => COMPANY_TAGS.includes(t)))) qerr(`tags must be one of ${COMPANY_TAGS.join('/')}`);
      if (q.sources !== undefined && !(Array.isArray(q.sources) && q.sources.length && q.sources.every((u) => /^https?:\/\//.test(u)))) qerr('sources must be a non-empty array of URLs');
      if (q.tags?.length && !q.sources?.length) qerr('company tags need sources (a public report that it was asked there)');
      if (q.problem !== undefined && !isStr(q.problem)) qerr('problem must be a string');
      if (['mcq', 'multi', 'output', 'bug'].includes(q.type)) {
        // One note per choice: why that exact choice is right or wrong.
        if (!Array.isArray(q.notes) || !Array.isArray(q.choices) || q.notes.length !== q.choices.length || !q.notes.every(isStr)) qerr('notes must have one non-empty string per choice');
      }
      const needLang = () => { if (!['cpp', 'python'].includes(q.lang)) qerr('lang must be cpp or python'); };
      const choiceAnswer = (n) => {
        if (!isStrArr(q.choices, n)) qerr(`choices must have at least ${n} strings`);
        else if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.choices.length) qerr('answer must be a valid choice index');
      };
      switch (q.type) {
        case 'mcq': choiceAnswer(4); break;
        case 'multi':
          if (!isStrArr(q.choices, 4)) qerr('choices must have 4-6 strings');
          else if (!Array.isArray(q.answer) || q.answer.length < 2 || !q.answer.every((i) => Number.isInteger(i) && i >= 0 && i < q.choices.length) || new Set(q.answer).size !== q.answer.length) qerr('answer must be ≥2 distinct valid indices');
          break;
        case 'output': needLang(); if (!isStr(q.code)) qerr('missing code'); choiceAnswer(4); break;
        case 'bug': {
          needLang(); choiceAnswer(4);
          if (!isStr(q.code)) { qerr('missing code'); break; }
          const lines = q.code.split('\n').length;
          if (!Number.isInteger(q.bugLine) || q.bugLine < 1 || q.bugLine > lines) qerr(`bugLine must be 1..${lines}`);
          break;
        }
        case 'order': if (!isStrArr(q.items, 3)) qerr('items must have ≥3 strings'); break;
        case 'short':
          if (!Array.isArray(q.accept) || q.accept.length === 0 || !q.accept.every((a) => isStr(String(a)))) qerr('accept must be a non-empty array');
          break;
        case 'oral':
          if (!isStr(q.modelAnswer)) qerr('missing modelAnswer');
          if (!isStrArr(q.rubric, 2)) qerr('rubric must have ≥2 items');
          break;
        case 'code':
          needLang();
          if (!isStr(q.modelAnswer)) qerr('missing modelAnswer');
          if (!isStrArr(q.rubric, 2)) qerr('rubric must have ≥2 items');
          break;
      }
    }
    for (let lv = 1; lv <= 5; lv++) if (perLevel[lv] < MIN_PER_LEVEL) err(`only ${perLevel[lv]} questions at level ${lv} (need ≥${MIN_PER_LEVEL})`);
  }
}

// Progress is keyed by question id: an id that existed before must not disappear.
const baselineFile = join(root, '..', 'tools', 'ids-baseline.json');
if (existsSync(baselineFile)) {
  for (const id of JSON.parse(readFileSync(baselineFile, 'utf8'))) {
    if (only && !id.startsWith(only + '.')) continue;
    if (!seenIds.has(id)) errors.push(`question id ${id} was removed or renamed (progress depends on it)`);
  }
}

for (const w of warnings) console.log('WARN ', w);
for (const e of errors) console.log('ERROR', e);
console.log(`\n${lessonCount} lessons, ${questionCount} questions, ${errors.length} errors, ${warnings.length} missing files`);
process.exit(errors.length ? 1 : 0);
