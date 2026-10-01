// Animated-text tool. CSS animation is the only way to animate real, selectable
// text; for platforms that take neither CSS nor HTML the page points at the GIF maker.
(function () {
  const root = document.getElementById('anim');
  if (!root) return;

  const PRESETS = {
    typing: {
      label: 'Typewriter',
      css: steps => `.anim-text{display:inline-block;overflow:hidden;white-space:nowrap;border-right:.1em solid currentColor;width:0;animation:anim-type 3s steps(${steps}) infinite alternate,anim-caret .7s step-end infinite}
@keyframes anim-type{from{width:0}to{width:${steps}ch}}
@keyframes anim-caret{50%{border-color:transparent}}`,
    },
    blink:  { label: 'Blink',
      css: () => `.anim-text{animation:anim-blink 1s steps(2,start) infinite}
@keyframes anim-blink{50%{opacity:0}}` },
    bounce: { label: 'Bounce',
      css: () => `.anim-text{display:inline-block;animation:anim-bounce .8s ease-in-out infinite alternate}
@keyframes anim-bounce{from{transform:translateY(0)}to{transform:translateY(-.25em)}}` },
    wave:   { label: 'Wave (per letter)',
      css: () => `.anim-text span{display:inline-block;animation:anim-wave 1.4s ease-in-out infinite}
@keyframes anim-wave{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-.3em)}}` },
    glow:   { label: 'Neon glow',
      css: () => `.anim-text{animation:anim-glow 1.6s ease-in-out infinite alternate}
@keyframes anim-glow{from{text-shadow:0 0 4px currentColor}to{text-shadow:0 0 18px currentColor,0 0 32px currentColor}}` },
    rainbow:{ label: 'Rainbow cycle',
      css: () => `.anim-text{background:linear-gradient(90deg,#e81416,#ffa500,#faeb36,#79c314,#487de7,#70369d,#e81416);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:anim-rainbow 3s linear infinite}
@keyframes anim-rainbow{to{background-position:-200% 0}}` },
    shake:  { label: 'Shake',
      css: () => `.anim-text{display:inline-block;animation:anim-shake .4s linear infinite}
@keyframes anim-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-.06em)}75%{transform:translateX(.06em)}}` },
  };

  const input   = document.getElementById('animInput');
  const presetS = document.getElementById('animPreset');
  const preview = document.getElementById('animPreview');
  const styleEl = document.getElementById('animStyle');
  const outputs = root.querySelector('.fx-outputs');
  const toast   = document.getElementById('toast');
  const PLACEHOLDER = root.dataset.placeholder || 'Animated Text';

  const esc = t => t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  function render() {
    const text = input.value || PLACEHOLDER;
    const key = presetS.value;
    const preset = PRESETS[key] || PRESETS.typing;
    const css = preset.css(Array.from(text).length);

    // Per-letter presets need each character wrapped, with a stagger.
    const perLetter = key === 'wave';
    const markup = perLetter
      ? `<span class="anim-text">${Array.from(text).map((c, i) =>
          `<span style="animation-delay:${(i * 0.06).toFixed(2)}s">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('')}</span>`
      : `<span class="anim-text">${esc(text)}</span>`;

    styleEl.textContent = css;
    preview.innerHTML = markup;

    set('html', markup);
    set('css', css);
    set('full', `<style>\n${css}\n</style>\n${markup}`);
  }

  function set(key, v) {
    const el = outputs.querySelector(`[data-out="${key}"]`);
    if (el) { el.textContent = v; el.dataset.value = v; }
  }

  outputs.addEventListener('click', async e => {
    const btn = e.target.closest('button[data-copy]');
    if (!btn) return;
    const el = outputs.querySelector(`[data-out="${btn.dataset.copy}"]`);
    if (!el) return;
    const v = el.dataset.value || el.textContent;
    try { await navigator.clipboard.writeText(v); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = v; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
    }
    const label = btn.textContent;
    btn.textContent = '✓ Copied'; btn.classList.add('copied');
    if (toast) toast.classList.add('show');
    setTimeout(() => { btn.textContent = label; btn.classList.remove('copied'); }, 1500);
    setTimeout(() => toast && toast.classList.remove('show'), 1500);
  });

  [input, presetS].forEach(el => el && el.addEventListener('input', render));
  const clear = document.getElementById('animClear');
  if (clear) clear.addEventListener('click', () => { input.value = ''; render(); input.focus(); });
  render();
})();
