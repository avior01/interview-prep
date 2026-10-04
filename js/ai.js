// AI interviewer: grades oral and code answers through the Claude API with the
// user's own API key (stored only on this device). Offline, answers wait in a
// queue and are graded once the connection is back.
import { get, save } from './store.js';
import { content } from './content.js';

const MODEL = 'claude-opus-5';

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['score', 'verdict', 'missing', 'followUp'],
  properties: {
    score: { type: 'integer', description: '1-5' },
    verdict: { type: 'string', description: 'Hebrew, 2-4 sentences: what was good and what was wrong' },
    missing: { type: 'array', items: { type: 'string' }, description: 'Hebrew: key points the answer missed or got wrong' },
    followUp: { type: 'string', description: 'Hebrew: one follow-up question a tough interviewer would ask next' },
  },
};

const SYSTEM = `You are a demanding senior software interviewer at a top company (NVIDIA / Microsoft level), grading a candidate's answer.
The candidate is preparing for senior embedded / real-time C++ / DSP-adjacent software roles. Do not be lenient: partial or vague answers do not earn a high score.
Score 1-5: 1 = wrong or empty, 2 = major gaps, 3 = acceptable for mid-level, 4 = solid senior answer with small gaps, 5 = excellent, complete, precise.
For code answers, check correctness, edge cases, complexity, and idiomatic, safe C++ / Python.
Write verdict, missing and followUp in Hebrew, keeping technical terms in English. Respond only with the JSON object.`;

export const hasKey = () => !!get().settings.apiKey;
export const online = () => navigator.onLine !== false;

function buildPrompt(q, answer, followUp) {
  const level = ['', 'basic', 'junior', 'mid', 'senior', 'strong senior'][q.level];
  return [
    `Question (level ${q.level}, ${level}, type ${q.type}${q.lang ? ', ' + q.lang : ''}):\n${q.prompt}`,
    q.code ? `Code given with the question:\n${q.code}` : '',
    `Reference answer (for your grading only):\n${q.modelAnswer || ''}`,
    q.rubric?.length ? `Rubric checkpoints:\n- ${q.rubric.join('\n- ')}` : '',
    followUp ? `The candidate is now answering this follow-up question: ${followUp}` : '',
    `Candidate's answer:\n${answer || '(empty)'}`,
  ].filter(Boolean).join('\n\n');
}

export async function grade(q, answer, followUp = '') {
  const key = get().settings.apiKey;
  if (!key) throw Object.assign(new Error('אין מפתח API'), { code: 'no_key' });
  const body = {
    model: MODEL,
    max_tokens: 4000,
    system: SYSTEM,
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
    messages: [{ role: 'user', content: buildPrompt(q, answer, followUp) }],
  };
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = `שגיאה ${res.status}`;
    try { const j = await res.json(); msg += `: ${j.error?.message || ''}`; } catch { /* ignore */ }
    throw Object.assign(new Error(msg), { code: res.status === 401 ? 'bad_key' : 'http', status: res.status });
  }
  const data = await res.json();
  if (data.stop_reason === 'refusal') throw Object.assign(new Error('הבקשה נדחתה'), { code: 'refusal' });
  const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
  const out = JSON.parse(text);
  out.score = Math.min(5, Math.max(1, Math.round(out.score)));
  return out;
}

export function enqueue(q, answer) {
  const st = get();
  st.aiQueue.push({ id: `${q.id}:${Date.now()}`, qid: q.id, answer, ts: Date.now() });
  save();
}

let draining = false;
// Grades queued answers. Returns how many were graded.
export async function drainQueue(onResult) {
  const st = get();
  if (draining || !hasKey() || !online() || !st.aiQueue.length) return 0;
  draining = true;
  let n = 0;
  try {
    while (st.aiQueue.length) {
      const item = st.aiQueue[0];
      const q = content.questionById[item.qid];
      if (!q) { st.aiQueue.shift(); continue; }
      const r = await grade(q, item.answer);
      st.aiQueue.shift();
      const result = { id: item.id, qid: q.id, answer: item.answer, ts: Date.now(), ...r };
      st.aiResults.push(result);
      save();
      n++;
      onResult?.(q, result);
    }
  } catch (e) {
    // Network, rate limit or server error: try again later. A request the API
    // rejects (4xx other than 429) would fail forever, so drop it.
    if (e.status && e.status !== 429 && e.status < 500 && e.code !== 'bad_key') { st.aiQueue.shift(); save(); }
  }
  finally { draining = false; }
  return n;
}
