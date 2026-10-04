# Interview prep

Offline-first study app (PWA) for software interview preparation: a library of
short lessons, practice sessions by topic / subtopic / level, a full mixed exam,
spaced repetition, and an AI interviewer (Claude API, own key).

- Content: `content/<domain>/<subtopic>.json`, format in `CONTENT_GUIDE.md`.
- After any change: `node tools/validate.mjs` and `node tools/build-index.mjs`.
- Local run: `python -m http.server 8765`.
