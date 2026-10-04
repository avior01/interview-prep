// Syncs progress between devices through one private GitHub Gist.
// The token is a GitHub personal access token with the "gist" scope, stored
// only on this device.
import { get, save, merge, exportable } from './store.js';

const FILE = 'interview-prep-progress.json';
const DESC = 'interview-prep-progress (auto sync)';
const API = 'https://api.github.com';

function headers() {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${get().settings.gistToken}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function gh(path, opts = {}) {
  const res = await fetch(API + path, { ...opts, headers: { ...headers(), ...(opts.body ? { 'Content-Type': 'application/json' } : {}) } });
  if (!res.ok) throw Object.assign(new Error(`GitHub ${res.status}`), { status: res.status });
  return res.status === 204 ? null : res.json();
}

async function findGist() {
  for (let page = 1; page <= 5; page++) {
    const list = await gh(`/gists?per_page=100&page=${page}`);
    const hit = list.find((g) => g.description === DESC && g.files[FILE]);
    if (hit) return hit.id;
    if (list.length < 100) break;
  }
  return '';
}

async function readGist(id) {
  const g = await gh(`/gists/${id}`);
  const f = g.files[FILE];
  if (!f) return null;
  const text = f.truncated ? await fetch(f.raw_url).then((r) => r.text()) : f.content;
  return JSON.parse(text);
}

let running = null;
export function syncNow() {
  if (running) return running;
  running = doSync().finally(() => { running = null; });
  return running;
}

async function doSync() {
  const s = get().settings;
  if (!s.gistToken) throw Object.assign(new Error('אין טוקן GitHub'), { code: 'no_token' });
  if (navigator.onLine === false) throw Object.assign(new Error('אין חיבור'), { code: 'offline' });
  if (!s.gistId) s.gistId = await findGist();
  if (s.gistId) {
    try {
      const remote = await readGist(s.gistId);
      merge(remote);
    } catch (e) {
      if (e.status === 404) s.gistId = '';
      else throw e;
    }
  }
  const body = JSON.stringify({ files: { [FILE]: { content: JSON.stringify(exportable()) } } });
  if (s.gistId) {
    await gh(`/gists/${s.gistId}`, { method: 'PATCH', body });
  } else {
    const g = await gh('/gists', { method: 'POST', body: JSON.stringify({ description: DESC, public: false, files: { [FILE]: { content: JSON.stringify(exportable()) } } }) });
    s.gistId = g.id;
  }
  s.lastSync = Date.now();
  save();
}

export function canSync() {
  return !!get().settings.gistToken && navigator.onLine !== false;
}
