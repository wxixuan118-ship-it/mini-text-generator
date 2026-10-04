// Preview strip for the text effects hub: one input drives a sample of every
// effect, and each card links on to the full generator that exports it.
(function () {
  const input = document.getElementById('fxhInput');
  if (!input) return;

  const targets = document.querySelectorAll('[data-fxh]');
  const PLACEHOLDER = input.dataset.placeholder || 'Make it pop';
  const esc = c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] || c);

  function render() {
    const text = input.value.trim() || PLACEHOLDER;
    const chars = Array.from(text);
    targets.forEach(el => {
      if (el.hasAttribute('data-split')) {
        // Per-letter effects need each character wrapped, with a stagger.
        el.innerHTML = chars.map((c, i) =>
          `<span style="animation-delay:${(i * 0.06).toFixed(2)}s">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
      } else {
        el.textContent = text;
      }
      if (el.classList.contains('fxh-type')) {
        // The typewriter steps once per character; restart it so it begins at the first letter.
        el.style.setProperty('--n', chars.length);
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      }
    });
  }

  input.addEventListener('input', render);
  render();
})();
