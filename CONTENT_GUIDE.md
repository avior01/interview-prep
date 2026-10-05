# Content guide

Content for the interview-prep app. One JSON file per subtopic:
`content/<domainId>/<subtopicId>.json`. Domain and subtopic ids come from
`content/taxonomy.json` and must match exactly.

Check your files with `node tools/validate.mjs <domainId>` (no argument = everything).
Fix every error before you finish.

## Learner

An RF/DSP engineer (M.Sc., strong math and signals, real-time C++ SDR project on
USRP X310) who is weaker in classic software-interview material. The target is a
**senior** offer at NVIDIA or Microsoft in January 2027. Levels 1–2 must be
approachable. Levels 4–5 must be truly hard, at the level of a demanding senior
interview: no mercy, no giveaway distractors.

## Language and format

- Hebrew for all prose. Technical terms, identifiers and code stay in English, as
  Israeli engineers actually say them (e.g. "ה-mutex משתחרר", "סיבוכיות O(n log n)").
- Text fields support a tiny markdown: `inline code`, **bold**, fenced code blocks
  (```cpp ... ```), `- ` bullet lines and blank-line paragraphs. Nothing else.
- Keep code short: at most ~20 lines in a question. Mobile screens are narrow.
- Accuracy matters more than volume. Double-check every answer, complexity, and
  claim about the standard. If something is implementation-defined or debatable,
  don't ask it or say so in the explanation.

## File shape

```json
{
  "domain": "alg",
  "subtopic": "sliding-window",
  "lessons": [ { ...lesson } ],
  "questions": [ { ...question } ]
}
```

## Lesson (exactly one per subtopic, sometimes two if the subtopic is broad)

A concise lesson (2–5 minutes of reading) that lets someone who never heard of the
topic answer the level 1–3 questions and understand the explanations of 4–5.
**No code teaching and no bug-spotting in lessons.** Explain in words, numbered
steps, small ASCII diagrams, and complexity. Pseudocode is not allowed; a
one-line formula is fine.

```json
{
  "id": "alg.sliding-window",            // "<domain>.<subtopic>" (+ "-2" for a second lesson)
  "title": "Sliding window",
  "what": "מה זה, בשתיים-שלוש שורות",
  "when": ["איך מזהים בשאלה שזה הדפוס", "..."],
  "how": ["שלב 1 ...", "שלב 2 ..."],     // how it works, step by step
  "complexity": "זמן O(n), זיכרון O(k) ...",
  "pitfalls": ["מלכודת נפוצה", "..."],
  "senior": ["מה מראיין סניור מצפה לשמוע: trade-offs, follow-ups, וריאציות"],
  "diagram": "optional ASCII diagram, monospace, max ~40 chars wide",
  "details": [                            // 3–7 in-depth sections, the core of the lesson
    { "title": "כותרת", "body": "2–5 פסקאות קצרות (מותר bullets). הסבר מעמיק: למה זה עובד, וריאציות, מקרי קצה, השוואה לחלופות." }
  ],
  "examples": [                           // 2–4 worked examples
    { "title": "דוגמה: ...", "body": "מקרה קונקרטי עם מספרים, מעקב שלב אחר שלב במילים (מה המצב אחרי כל צעד), ומה לומדים ממנו." }
  ],
  "glossary": [                           // every term/concept used in this subtopic's questions
    { "term": "ABA problem", "def": "1–3 משפטים: מה זה, למה זה חשוב, ואיך מתמודדים." }
  ]
}
```

### Depth requirements (v2)

The learner reported that lessons were too thin: short, simple explanations, few
examples, and questions about concepts the lesson never mentions (e.g. a question
about the ABA problem when the lesson never explains ABA). Therefore:

- A lesson must let someone who never met the topic answer **every** question in
  the file at levels 1–4 and understand the explanations at level 5.
- **Coverage rule:** before finishing a file, list every concept, term, algorithm,
  API, hardware mechanism, and pattern that appears in any question, choice or
  explanation in the file. Each one must be explained somewhere in the lesson
  (`details`, `examples` or `glossary`). The glossary typically has 10–25 entries.
- `details` is a real explanation, the way a good textbook chapter or a senior
  colleague would teach it: mechanism, intuition, why, variants, edge cases,
  trade-offs, common interview variants. Typically 800–1,800 Hebrew words per
  lesson in total across all fields.
- `examples` walk through concrete cases with real numbers or real inputs, step by
  step in words (e.g. trace a sliding window over `[2,1,5,1,3,2]` with k=3, showing
  the window and the sum after each step). Words and small ASCII tables only.
- Still no code blocks and no pseudocode in lessons (inline `identifiers` are fine).
  Lessons teach concepts; questions test code.

## Question

Common fields on every question:

```json
{
  "id": "alg.sliding-window.q01",          // unique, "<domain>.<subtopic>.qNN"
  "level": 1,                               // 1..5
  "type": "mcq",                            // see types below
  "prompt": "השאלה",
  "explanation": "למה התשובה נכונה, ולמה המסיחים שגויים. 2–6 משפטים.",
  "lesson": "alg.sliding-window",           // a lesson id from this file
  "tags": ["nvidia"]                        // optional: "nvidia", "microsoft"
}
```

Types and their extra fields:

| type | device | extra fields |
| --- | --- | --- |
| `mcq` | any | `choices` (4 strings), `answer` (index) |
| `multi` | any | `choices` (4–6), `answer` (array of indices, ≥2 correct) |
| `output` | any | `code`, `lang` ("cpp"/"python"), `choices` (4), `answer` (index). "What does this print / what happens" |
| `bug` | any | `code`, `lang`, `bugLine` (1-based line in `code`), `choices` (4 reasons), `answer` (index of the correct reason) |
| `order` | any | `items` — strings in the CORRECT order (3–7). The app shuffles them |
| `short` | any | `accept` — array of accepted answers (number or 1–3 words; matching is case-insensitive and ignores spaces) |
| `oral` | any | `modelAnswer` (what a strong senior answer says), `rubric` (3–5 checkpoints). Graded by an AI interviewer or self-graded |
| `code` | desktop | `lang`, `starter` (optional signature), `modelAnswer` (full solution code), `rubric` (3–5 checkpoints incl. complexity and edge cases) |

Rules:

- Per subtopic: **at least 6 questions at each level 1–5** (≥30 total). More variety
  is the goal: new questions must test different angles, not reword existing ones.
- **Never change or remove an existing question's `id`** (the learner's progress is
  keyed by id). New questions continue the numbering (q21, q22, ...). Fixing an
  existing question's text or answer is fine.
- Every question must stand alone: never refer to "the previous question", and
  never refer to a choice by its position ("the first three", "option B"), because
  the app shuffles choices and question order.
- Mix types. Mostly `mcq`/`multi`/`output`/`bug`/`order`/`short` (they work on a
  phone). Add 1–3 `oral` per subtopic at levels 3–5, and 1–2 `code` questions per
  subtopic at levels 3–5 where coding makes sense (algorithms, C++, concurrency,
  Python, bugs). Code language: about 70% C++, 30% Python (Python domain is all Python).
- Distractors must be real mistakes people make, never obviously silly.
- Shuffle where the correct choice sits; don't favor one index.
- Level 1: definitions and recognition. Level 2: junior, reading simple code.
  Level 3: mid, choosing the approach, LeetCode medium. Level 4: senior, medium-hard,
  trade-offs, follow-ups. Level 5: strong senior: hard problems, subtle edge cases,
  standard-lawyer C++, deep "why", design under constraints.
- Add `"tags": ["nvidia"]` / `["microsoft"]` where the question is typical for that
  company (NVIDIA: C++, performance, systems, concurrency, GPU-adjacent thinking;
  Microsoft: algorithms, system design, behavioral).
- JSON must be valid: escape quotes and newlines (`\n`) inside strings.
