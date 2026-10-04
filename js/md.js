// Tiny markdown subset used by the content: paragraphs, "- " bullets,
// `inline code`, **bold**, and fenced code blocks.

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

export function codeBlock(code, { numbered = false, pick = false } = {}) {
  const lines = String(code).replace(/\n$/, '').split('\n');
  const cls = ['code', numbered && 'numbered', pick && 'pick'].filter(Boolean).join(' ');
  return `<pre class="${cls}" dir="ltr"><code>${lines
    .map((l, i) => `<span class="ln" data-n="${i + 1}" data-line="${i + 1}">${esc(l)}</span>`)
    .join('')}</code></pre>`;
}

export function md(text) {
  const src = String(text ?? '').replace(/\r\n/g, '\n');
  const out = [];
  const parts = src.split(/```[a-zA-Z+]*\n?/);
  parts.forEach((part, i) => {
    if (i % 2 === 1) { out.push(codeBlock(part)); return; }
    for (const block of part.split(/\n{2,}/)) {
      const lines = block.split('\n').filter((l) => l.trim() !== '');
      if (!lines.length) continue;
      if (lines.every((l) => /^\s*[-•]\s+/.test(l))) {
        out.push(`<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-•]\s+/, ''))}</li>`).join('')}</ul>`);
      } else {
        out.push(`<p>${lines.map(inline).join('<br>')}</p>`);
      }
    }
  });
  return `<div class="rich">${out.join('')}</div>`;
}

export function inlineMd(text) {
  return inline(text);
}
