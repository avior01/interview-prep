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
    company: '',            // '' or a key of COMPANIES (companies.js)
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
  open: [],         // in-progress sessions, each resumable where it stopped: { sid, title, updatedAt, ... }
  activeSid: null,  // the open session currently shown
  streak: { day: 0, count: 0 },
  u: 0,
});

let state;
const MAX_OPEN = 30;

// `state.current` is the active open session. It is a non-enumerable accessor, so it
// is never saved twice: assigning a session opens it (and makes it active), assigning
// null closes the active one.
function attachCurrent(s) {
  if (s.current !== undefined && Object.getOwnPropertyDescriptor(s, 'current')?.value !== undefined) {
    // Older saves kept a single in-progress session here: keep it as an open session.
    const old = s.current;
    delete s.current;
    if (old) { old.sid ||= `s${old.startedAt || Date.now()}`; s.open = [...(s.open || []), old]; s.activeSid = old.sid; }
  }
  Object.defineProperty(s, 'current', {
    enumerable: false,
    configurable: true,
    get: () => s.open.find((x) => x.sid === s.activeSid) || null,
    set: (v) => {
      if (v) {
        v.sid ||= `s${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
        v.updatedAt = Date.now();
        s.open = [v, ...s.open.filter((x) => x.sid !== v.sid)].slice(0, MAX_OPEN);
        s.activeSid = v.sid;
      } else {
        s.open = s.open.filter((x) => x.sid !== s.activeSid);
        s.activeSid = null;
      }
    },
  });
  return s;
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? { ...defaults(), ...JSON.parse(raw) } : defaults();
    state.settings = { ...defaults().settings, ...state.settings };
  } catch {
    state = defaults();
  }
  return attachCurrent(state);
}

// Open sessions, most recently used first.
export function openSessions() {
  return [...state.open].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}
export function activate(sid) {
  if (state.open.some((x) => x.sid === sid)) state.activeSid = sid;
}
export function closeSession(sid) {
  state.open = state.open.filter((x) => x.sid !== sid);
  if (state.activeSid === sid) state.activeSid = null;
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
  state = attachCurrent({ ...defaults(), ...next });
  state.settings = { ...defaults().settings, ...next.settings };
  save();
}

export function reset() {
  const keep = { apiKey: state.settings.apiKey, gistToken: state.settings.gistToken, gistId: state.settings.gistId };
  state = attachCurrent(defaults());
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
  return { ...state, settings, open: [], activeSid: null, aiQueue: [] };
}
