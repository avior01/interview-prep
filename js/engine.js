// Scheduling, levels and session building.
import { content, subKey } from './content.js';
import { get, today, dateStrToDay } from './store.js';

// ---------- Study plan (16 weeks) ----------
export const PLAN = [
  ['alg.complexity', 'cpp.pointers-refs', 'cpp.const-constexpr'],
  ['alg.two-pointers', 'alg.sliding-window', 'cpp.raii', 'cpp.smart-pointers'],
  ['alg.hashing', 'alg.prefix-sums', 'cpp.memory-layout'],
  ['alg.stacks', 'alg.linked-lists', 'beh.star', 'beh.why-software'],
  ['cpp.move-semantics', 'cpp.exceptions', 'bugs.off-by-one', 'bugs.lifetime'],
  ['alg.trees', 'alg.bfs-dfs', 'cpp.stl', 'cpp.lambdas'],
  ['alg.heaps', 'alg.binary-search', 'cv.jammer', 'cv.nco-impl'],
  ['conc.threads', 'conc.mutex-locks', 'conc.condvars', 'conc.deadlock', 'sys.processes-threads', 'sys.syscalls', 'sys.ipc'],
  ['conc.atomics', 'conc.memory-order', 'conc.lock-free', 'sys.interrupts', 'sys.volatile-mmio', 'sys.dma'],
  ['alg.graphs', 'alg.intervals', 'cpp.templates', 'cpp.polymorphism'],
  ['alg.dp', 'alg.backtracking', 'dsp.fft', 'dsp.ring-buffers', 'dsp.sampling'],
  ['dsp.filters', 'dsp.fixed-point', 'dsp.simd', 'dsp.windows', 'py.data-model', 'py.generators', 'py.numpy'],
  ['design.producer-consumer', 'design.backpressure', 'design.latency-budget', 'design.pipelines', 'design.scaling', 'design.observability', 'design.rt-design', 'bugs.races', 'bugs.ub-bugs', 'bugs.overflow', 'cpp.ub'],
  ['cv.fft-rates', 'cv.design-decisions', 'alg.greedy', 'alg.tries', 'alg.bits', 'sys.virtual-memory', 'sys.caches', 'sys.scheduling'],
  ['conc.rt-scheduling', 'conc.latency-jitter', 'dsp.multirate', 'dsp.nco', 'py.gil', 'py.asyncio', 'beh.failure', 'beh.conflict', 'beh.leadership', 'bugs.leaks'],
  [], // week 16: weak spots + company focus
];

export function currentWeek() {
  const start = dateStrToDay(get().settings.startDate) ?? today();
  return Math.min(16, Math.max(1, Math.floor((today() - start) / 7) + 1));
}

// ---------- Levels (per subtopic) ----------
export const PASS = 0.8, DROP = 0.6, WINDOW = 10;

export function levelOf(key) {
  return get().levels[key]?.level || 1;
}

// Records an answer for level progression. Returns 'up' | 'down' | null.
export function recordLevel(q, correct) {
  const st = get();
  const rec = st.levels[q.sub] || { level: 1, hist: [] };
  if (q.level !== rec.level) return null;
  rec.hist = [...rec.hist, correct ? 1 : 0].slice(-WINDOW);
  rec.u = Date.now();
  // A subtopic may have fewer than 10 questions at a level: judge on what exists (min 3).
  const pool = (content.qBySub[q.sub] || []).filter((x) => x.level === rec.level && usable(x)).length;
  const window = Math.max(3, Math.min(WINDOW, pool));
  let change = null;
  if (rec.hist.length >= window) {
    const recent = rec.hist.slice(-window);
    const rate = recent.reduce((a, b) => a + b, 0) / recent.length;
    if (rate >= PASS && rec.level < 5) { rec.level++; rec.hist = []; change = 'up'; }
    else if (rate < DROP && rec.level > 1) { rec.level--; rec.hist = []; change = 'down'; }
  }
  st.levels[q.sub] = rec;
  return change;
}

// ---------- Spaced repetition ----------
function capDue(due) {
  const iv = dateStrToDay(get().settings.interviewDate);
  if (iv && today() < iv - 3) return Math.min(due, iv - 3);
  return due;
}

// grade: 'wrong' | 'hard' | 'good'
export function schedule(qid, grade) {
  const st = get();
  const d = today();
  const it = st.items[qid] || { reps: 0, interval: 0, ease: 2.5, due: d, weak: false, weakStreak: 0, lapses: 0, seen: 0 };
  it.seen = (it.seen || 0) + 1;
  if (grade === 'wrong') {
    it.weak = true;
    it.weakStreak = 0;
    it.lapses = (it.lapses || 0) + 1;
    it.reps = 0;
    it.interval = 1;
    it.ease = Math.max(1.3, it.ease - 0.2);
    it.due = d + 1;
  } else if (it.weak) {
    // Leaving the weak pool needs two correct answers on different days.
    if (it.lastOkDay !== d) it.weakStreak = (it.weakStreak || 0) + 1;
    it.lastOkDay = d;
    if (it.weakStreak >= 2) { it.weak = false; it.reps = 1; it.interval = 7; }
    else it.interval = 3;
    it.due = d + it.interval;
  } else {
    if (grade === 'hard') { it.ease = Math.max(1.3, it.ease - 0.15); }
    it.interval = it.reps === 0 ? 1 : it.reps === 1 ? 3 : Math.round(it.interval * (grade === 'hard' ? 1.2 : it.ease));
    it.reps++;
    it.lastOkDay = d;
    it.due = d + Math.max(1, it.interval);
  }
  it.due = capDue(it.due);
  it.u = Date.now();
  st.items[qid] = it;
  return it;
}

// ---------- Device ----------
export function isDesktop() {
  const pref = get().settings.device;
  if (pref === 'desktop') return true;
  if (pref === 'phone') return false;
  return window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;
}
export const usable = (q) => q.type !== 'code' || isDesktop();

// ---------- Timer ----------
const TIMES = { // seconds at level 4, level 5
  quick: [180, 150],  // mcq, multi, output, short
  bug: [240, 180],    // bug, order
  oral: [360, 300],
  code: [2400, 2100],
};
export function timeLimit(q, mode) {
  const on = mode === 'exam' || mode === 'interview' || (get().settings.timer && q.level >= 4);
  if (!on) return 0;
  const kind = ['mcq', 'multi', 'output', 'short'].includes(q.type) ? 'quick'
    : ['bug', 'order'].includes(q.type) ? 'bug' : q.type;
  return TIMES[kind][q.level >= 5 ? 1 : 0];
}

// ---------- Session building ----------
const shuffle = (a) => {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
};

function takeUnique(target, pool, n, used) {
  for (const q of pool) {
    if (target.length >= n) break;
    if (!used.has(q.id)) { used.add(q.id); target.push(q); }
  }
}

const isWeak = (q) => get().items[q.id]?.weak;
const isDue = (q) => { const it = get().items[q.id]; return it && it.due <= today(); };
const isNew = (q) => !get().items[q.id];
const companyBoost = (qs) => {
  const c = get().settings.company;
  if (!c) return qs;
  return [...qs.filter((q) => q.tags?.includes(c)), ...qs.filter((q) => !q.tags?.includes(c))];
};

// Questions for a subtopic at its current level: new ones first, then the rest.
function atLevel(key, level) {
  const qs = (content.qBySub[key] || []).filter(usable);
  const exact = qs.filter((q) => q.level === level);
  const below = qs.filter((q) => q.level < level).sort((a, b) => b.level - a.level);
  return [...shuffle(exact.filter(isNew)), ...shuffle(exact.filter((q) => !isNew(q))), ...below.filter(isNew)];
}

function domainKeys(domainId) {
  return content.domainById[domainId].subtopics.map((s) => subKey(domainId, s.id));
}

export function buildSession({ mode, scope, level, length, companyOnly }) {
  const n = length || get().settings.sessionLen || 10;
  const used = new Set();
  const out = [];
  const all = content.questions.filter(usable);

  if (mode === 'exam') {
    // Random questions from every domain, weighted by domain weight, at the chosen level.
    let pool = all.filter((q) => q.level === level);
    if (companyOnly && get().settings.company) pool = pool.filter((q) => q.tags?.includes(get().settings.company));
    const byDomain = {};
    for (const q of shuffle(pool)) (byDomain[q.domain] ||= []).push(q);
    const weights = content.domains.filter((d) => byDomain[d.id]).map((d) => [d.id, d.weight]);
    const total = weights.reduce((a, [, w]) => a + w, 0);
    while (out.length < n && weights.some(([id]) => byDomain[id].length)) {
      let r = Math.random() * total;
      for (const [id, w] of weights) {
        r -= w;
        if (r <= 0) { const q = byDomain[id].shift(); if (q && !used.has(q.id)) { used.add(q.id); out.push(q); } break; }
      }
    }
    return out;
  }

  if (mode === 'interview') {
    let pool = all.filter((q) => (q.type === 'oral' || q.type === 'code') && q.level >= Math.min(level, 3) && q.level <= level);
    pool = companyBoost(shuffle(pool));
    // One per domain where possible, so the interview covers several areas.
    const seenDomains = new Set();
    for (const q of pool) {
      if (out.length >= n) break;
      if (!seenDomains.has(q.domain)) { seenDomains.add(q.domain); used.add(q.id); out.push(q); }
    }
    takeUnique(out, pool, n, used);
    return out;
  }

  if (mode === 'review') {
    takeUnique(out, shuffle(all.filter(isWeak)), n, used);
    takeUnique(out, shuffle(all.filter(isDue)), n, used);
    return out;
  }

  if (mode === 'domain' || mode === 'sub') {
    const keys = mode === 'domain' ? domainKeys(scope) : [scope];
    const inScope = all.filter((q) => keys.includes(q.sub));
    takeUnique(out, shuffle(inScope.filter(isWeak)), Math.ceil(n * 0.3), used);
    const fresh = [];
    for (const k of shuffle(keys)) {
      const lv = level || levelOf(k);
      fresh.push(...atLevel(k, lv));
    }
    takeUnique(out, mode === 'domain' ? shuffle(fresh) : fresh, n, used);
    takeUnique(out, shuffle(inScope.filter(isDue)), n, used);
    // Still short: stretch one level up, then repeat seen questions at the level.
    takeUnique(out, shuffle(inScope.filter((q) => isNew(q) && q.level === (level || levelOf(q.sub)) + 1)), n, used);
    takeUnique(out, shuffle(inScope.filter((q) => q.level === (level || levelOf(q.sub)))), n, used);
    return shuffle(out);
  }

  // mode 'continue': 30% weak, 30% due, 40%+ new material from the plan.
  const week = currentWeek();
  takeUnique(out, companyBoost(shuffle(all.filter(isWeak))), Math.round(n * 0.3), used);
  takeUnique(out, shuffle(all.filter(isDue)), Math.round(n * 0.6), used);
  const weekKeys = week === 16 ? [] : PLAN[week - 1];
  const earlier = PLAN.slice(0, week - 1).flat();
  const later = PLAN.slice(week).flat();
  for (const keys of [weekKeys, earlier, later]) {
    const fresh = [];
    for (const k of shuffle(keys)) fresh.push(...atLevel(k, levelOf(k)).filter(isNew));
    takeUnique(out, companyBoost(shuffle(fresh)), n, used);
    if (out.length >= n) break;
  }
  takeUnique(out, shuffle(all.filter(isDue)), n, used);
  return shuffle(out);
}

export function counts() {
  const all = content.questions.filter(usable);
  return {
    weak: all.filter(isWeak).length,
    due: all.filter((q) => !isWeak(q) && isDue(q)).length,
    total: content.questions.length,
    seen: Object.keys(get().items).length,
  };
}

// ---------- Answer checking ----------
const norm = (s) => String(s).toLowerCase().replace(/[\s,'"״׳`]/g, '').replace(/^ה-?/, '');

export function checkShort(q, input) {
  const a = norm(input);
  if (!a) return false;
  return q.accept.some((acc) => {
    const b = norm(acc);
    if (a === b) return true;
    const x = parseFloat(a), y = parseFloat(b);
    if (Number.isFinite(x) && Number.isFinite(y) && /^-?[\d.e+]+[a-z%]*$/.test(a)) {
      return y === 0 ? x === 0 : Math.abs(x - y) / Math.abs(y) <= 0.01;
    }
    return false;
  });
}

export { shuffle };
