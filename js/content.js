// Loads the taxonomy and every content file listed in content/index.json.
// The service worker caches all of them, so this works offline.

export const content = {
  domains: [],          // taxonomy domains
  domainById: {},
  subById: {},          // "alg.sliding-window" -> { id, name, domain }
  lessons: {},          // lessonId -> lesson
  lessonsBySub: {},     // subKey -> [lesson]
  questions: [],        // all questions, each with .domain and .sub
  questionById: {},
  qBySub: {},           // subKey -> [question]
};

export const subKey = (domainId, subId) => `${domainId}.${subId}`;

export async function loadContent() {
  const [taxonomy, index] = await Promise.all([
    fetch('content/taxonomy.json').then((r) => r.json()),
    fetch('content/index.json').then((r) => r.json()),
  ]);
  content.domains = taxonomy.domains;
  for (const d of taxonomy.domains) {
    content.domainById[d.id] = d;
    for (const s of d.subtopics) {
      const key = subKey(d.id, s.id);
      content.subById[key] = { ...s, key, domain: d.id };
      content.lessonsBySub[key] = [];
      content.qBySub[key] = [];
    }
  }
  const files = await Promise.all(
    index.files.map((f) => fetch(`content/${f}`).then((r) => r.json()).catch(() => null)),
  );
  for (const file of files) {
    if (!file) continue;
    const key = subKey(file.domain, file.subtopic);
    if (!content.subById[key]) continue;
    for (const l of file.lessons || []) {
      l.sub = key;
      content.lessons[l.id] = l;
      content.lessonsBySub[key].push(l);
    }
    for (const q of file.questions || []) {
      q.domain = file.domain;
      q.sub = key;
      content.questions.push(q);
      content.questionById[q.id] = q;
      content.qBySub[key].push(q);
    }
  }
  return content;
}

export function hasContent(key) {
  return (content.qBySub[key] || []).length > 0;
}
