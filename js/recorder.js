// Voice answers: record yourself answering out loud and listen back.
// Recordings stay in memory only (never saved or synced); they are gone after a reload.

const clips = new Map();   // key -> object URL
let rec = null;            // { key, mr, chunks, stream, started }
let tick = null;

export const canRecord = () => !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
export const hasClip = (key) => clips.has(key);
export const isRecording = (key) => rec?.key === key;

export function recorderHtml(key) {
  if (!canRecord()) return '';
  const on = isRecording(key);
  return `<div class="rec" data-rec-box="${key}">
    <button class="btn small ${on ? 'bad' : ''}" data-rec="${key}" type="button">${on ? '■ עצור הקלטה' : clips.has(key) ? '🎙 הקלט מחדש' : '🎙 ענה בקול (הקלטה)'}</button>
    <span class="small muted" data-rec-time="${key}">${on ? '0:00' : ''}</span>
    ${clips.has(key) && !on ? `<audio controls src="${clips.get(key)}"></audio>` : ''}
  </div>`;
}

// Starts or stops recording for `key`; `redraw` re-renders the recorder area.
export async function toggle(key, redraw) {
  if (rec) {
    const wasKey = rec.key;
    stop();
    if (wasKey === key) return;
  }
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
  catch { alert('אין גישה למיקרופון. אשר הרשאת מיקרופון לאפליקציה בהגדרות הדפדפן.'); return; }
  const mr = new MediaRecorder(stream);
  const chunks = [];
  mr.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  mr.onstop = () => {
    stream.getTracks().forEach((t) => t.stop());
    if (chunks.length) {
      if (clips.has(key)) URL.revokeObjectURL(clips.get(key));
      clips.set(key, URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || 'audio/webm' })));
    }
    redraw();
  };
  rec = { key, mr, started: Date.now() };
  mr.start();
  redraw();
  clearInterval(tick);
  tick = setInterval(() => {
    const el = document.querySelector(`[data-rec-time="${key}"]`);
    if (!rec || !el) return;
    const s = Math.floor((Date.now() - rec.started) / 1000);
    el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }, 500);
}

export function stop() {
  clearInterval(tick);
  if (rec && rec.mr.state !== 'inactive') rec.mr.stop();
  rec = null;
}

export function clear(prefix) {
  for (const [k, url] of clips) if (!prefix || k.startsWith(prefix)) { URL.revokeObjectURL(url); clips.delete(k); }
}
