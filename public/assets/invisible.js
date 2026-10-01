// Invisible-character tool. Each entry is a real character that renders as blank;
// they behave differently per platform, so the page lists them separately rather
// than pretending one "invisible character" works everywhere.
(function () {
  const root = document.getElementById('inv');
  if (!root) return;

  const CHARS = [
    { cp: 'U+3164', ch: 'ㅤ', name: 'Hangul Filler',
      note: 'The most widely accepted blank. Works in most usernames, bios and chat messages.' },
    { cp: 'U+2800', ch: '⠀', name: 'Braille Pattern Blank',
      note: 'An empty braille cell. Accepted where Hangul Filler is filtered, including many games.' },
    { cp: 'U+200B', ch: '​', name: 'Zero Width Space',
      note: 'Takes no width at all. Good for splitting words without a visible gap; often stripped by forms.' },
    { cp: 'U+200C', ch: '‌', name: 'Zero Width Non-Joiner',
      note: 'Separates characters without a space. Survives in places that strip U+200B.' },
    { cp: 'U+200D', ch: '‍', name: 'Zero Width Joiner',
      note: 'Normally glues emoji together. On its own it is invisible but can alter nearby emoji.' },
    { cp: 'U+FEFF', ch: '﻿', name: 'Zero Width No-Break Space',
      note: 'Historically the byte-order mark. Invisible, but some editors strip or flag it.' },
    { cp: 'U+00A0', ch: ' ', name: 'No-Break Space',
      note: 'A visible-width space that never collapses or wraps. The safest "real gap".' },
    { cp: 'U+3000', ch: '　', name: 'Ideographic Space',
      note: 'A full-width space, about twice as wide as a normal one.' },
  ];

  const list = document.getElementById('invResults');
  const countSel = document.getElementById('invCount');
  const toast = document.getElementById('toast');

  list.innerHTML = CHARS.map((c, i) => `
    <div class="result">
      <div>
        <div class="result-label">${c.name} · ${c.cp}</div>
        <div class="inv-box"><span class="inv-run" id="inv-${i}"></span></div>
        <p class="inv-note">${c.note}</p>
      </div>
      <button class="btn btn-primary" data-inv="${i}">Copy</button>
    </div>`).join('');

  const value = i => CHARS[i].ch.repeat(parseInt(countSel.value, 10) || 1);

  function render() {
    CHARS.forEach((c, i) => {
      // The run is wrapped in brackets so you can see how much space it takes.
      document.getElementById('inv-' + i).textContent = value(i);
    });
  }
  countSel.addEventListener('change', render);
  render();

  list.addEventListener('click', async e => {
    const btn = e.target.closest('button[data-inv]');
    if (!btn) return;
    const v = value(parseInt(btn.dataset.inv, 10));
    try { await navigator.clipboard.writeText(v); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = v; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
    }
    btn.textContent = '✓ Copied'; btn.classList.add('copied');
    if (toast) toast.classList.add('show');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
    setTimeout(() => toast && toast.classList.remove('show'), 1500);
  });
})();
