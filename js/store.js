// Progress state, kept in localStorage. Every record carries `u` (last update,
// ms) so two devices can be merged record by record during sync.

const KEY = 'ip.state.v1';

export const DAY_MS = 86400000;
export const today = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / DAY_MS);
export const dayToDate = (d) => new Date(d * DAY_MS + new Date().getTimezoneOffset() * 60000);
export const dateStrToDay = (s) => (s ? Math.floor(Date.parse(s + 'T00:00:00Z') / DAY_MS) : null);

const defaults = () => ({
  settings: {
    startDate: '2026-10-04',
    interviewDate: '2027-01-15',
    company: '',            // '', 'nvidia', 'microsoft'
    sessionLen: 10,
    timer: true,            // timer in regular sessions at levels 4–5 (exam: always on)
    theme: 'auto',
    device: 'auto',         // 'auto', 'phone', 'desktop'
    apiKey: '',
    gistToken: '',
    gistId: '',
    lastSync: 0,
  },
  items: {},        // qid -> { reps, interval, ease, due, weak, weakStreak, lastOkDay, lapses, seen, u }
  levels: {},       // subKey -> { level, hist: [0/1...], u }
  lessonsRead: {},  // lessonId -> ts
  sessions: [],     // { ts, mode, scope, level, total, correct, perDomain }
  aiQueue: [],      // { id, qid, prompt, answer, ts }
  aiResults: [],    // { id, qid, score, verdict, missing, followUp, ts, answer }
  current: null,    // in-progress session (resumable)
  streak: { day: 0, count: 0 },
  u: 0,
});

let state;

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? { ...defaults(), ...JSON.parse(raw) } : defaults();
    state.settings = { ...defaults().settings, ...state.settings };
  } catch {
    state = defaults();
  }
  return state;
}

export function get() { return state; }

export function save() {
  state.u = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
  for (const fn of listeners) fn();
}

const listeners = new Set();
export function onSave(fn) { listeners.add(fn); }

export function replace(next) {
  state = { ...defaults(), ...next };
  state.settings = { ...defaults().settings, ...next.settings };
  save();
}

export function reset() {
  const keep = { apiKey: state.settings.apiKey, gistToken: state.settings.gistToken, gistId: state.settings.gistId };
  state = defaults();
  Object.assign(state.settings, keep);
  save();
}

export function touchStreak() {
  const d = today();
  if (state.streak.day === d) return;
  state.streak.count = state.streak.day === d - 1 ? state.streak.count + 1 : 1;
  state.streak.day = d;
}

// Merge another device's state into ours: newest record wins.
export function merge(remote) {
  if (!remote || typeof remote !== 'object') return;
  const pick = (a = {}, b = {}) => {
    const out = { ...a };
    for (const [k, v] of Object.entries(b)) {
      if (!out[k] || (v && (v.u || 0) > (out[k].u || 0))) out[k] = v;
    }
    return out;
  };
  state.items = pick(state.items, remote.items);
  state.levels = pick(state.levels, remote.levels);
  for (const [k, v] of Object.entries(remote.lessonsRead || {})) {
    state.lessonsRead[k] = Math.max(state.lessonsRead[k] || 0, v);
  }
  const byTs = new Map(state.sessions.map((s) => [s.ts, s]));
  for (const s of remote.sessions || []) byTs.set(s.ts, s);
  state.sessions = [...byTs.values()].sort((a, b) => a.ts - b.ts).slice(-500);
  const resIds = new Set(state.aiResults.map((r) => r.id));
  for (const r of remote.aiResults || []) if (!resIds.has(r.id)) state.aiResults.push(r);
  state.aiResults = state.aiResults.sort((a, b) => a.ts - b.ts).slice(-300);
  if ((remote.streak?.day || 0) > state.streak.day) state.streak = remote.streak;
  else if (remote.streak?.day === state.streak.day) state.streak.count = Math.max(state.streak.count, remote.streak.count);
  const rs = remote.settings || {};
  for (const k of ['interviewDate', 'company', 'startDate']) if (rs[k]) state.settings[k] = rs[k];
}

// What gets uploaded to the gist: everything except secrets and the
// in-progress session.
export function exportable() {
  const { apiKey, gistToken, gistId, lastSync, ...settings } = state.settings;
  return { ...state, settings, current: null, aiQueue: [] };
}
