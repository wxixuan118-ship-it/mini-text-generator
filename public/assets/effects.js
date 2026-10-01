// Colour-text tool for the rainbow and fire pages.
// Unicode has no colour, so instead of fake "coloured characters" this emits the
// markup each destination actually understands, plus a PNG for everywhere else.
(function () {
  const root = document.getElementById('fx');
  if (!root) return;

  const PRESETS = {
    rainbow: ['#e81416', '#ffa500', '#faeb36', '#79c314', '#487de7', '#4b369d', '#70369d'],
    fire:    ['#fff3b0', '#ffd000', '#ff9a00', '#ff5400', '#e62400', '#a80000'],
    sunset:  ['#ff7b00', '#ff006e', '#8338ec'],
    ice:     ['#caf0f8', '#90e0ef', '#00b4d8', '#0077b6'],
    toxic:   ['#d9ed92', '#99d98c', '#52b69a', '#168aad'],
  };
  // Discord's ansi code block only has eight foreground colours.
  const ANSI = [['31', '#e81416'], ['33', '#ffa500'], ['33', '#faeb36'], ['32', '#79c314'],
                ['36', '#487de7'], ['34', '#4b369d'], ['35', '#70369d']];

  const input   = document.getElementById('fxInput');
  const preview = document.getElementById('fxPreview');
  const outputs = root.querySelector('.fx-outputs');
  const presetSel = document.getElementById('fxPreset');
  const dirSel  = document.getElementById('fxDir');
  const boldBox = document.getElementById('fxBold');
  const canvas  = document.getElementById('fxCanvas');
  const toast   = document.getElementById('toast');
  const PLACEHOLDER = root.dataset.placeholder || 'Rainbow Text';

  const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const rgb2hex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');

  // Position 0..1 along the gradient -> hex colour.
  function colourAt(stops, t) {
    if (stops.length === 1) return stops[0];
    const x = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1);
    const i = Math.floor(x), f = x - i;
    const a = hex2rgb(stops[i]), b = hex2rgb(stops[i + 1]);
    return rgb2hex(a.map((v, k) => v + (b[k] - v) * f));
  }

  function nearestAnsi(hex) {
    const c = hex2rgb(hex);
    let best = ANSI[0], bestD = Infinity;
    for (const entry of ANSI) {
      const d = hex2rgb(entry[1]).reduce((s, v, k) => s + (v - c[k]) ** 2, 0);
      if (d < bestD) { bestD = d; best = entry; }
    }
    return best[0];
  }

  function model() {
    const text = input.value || PLACEHOLDER;
    let stops = PRESETS[presetSel.value] || PRESETS.rainbow;
    if (dirSel.value === 'reverse') stops = stops.slice().reverse();
    const chars = Array.from(text);
    // Spaces still advance the gradient so words stay in sequence.
    const span = Math.max(1, chars.length - 1);
    return chars.map((ch, i) => ({ ch, colour: colourAt(stops, i / span) }));
  }

  function render() {
    const parts = model();
    const bold = boldBox.checked;
    preview.innerHTML = parts
      .map(p => `<span style="color:${p.colour}${bold ? ';font-weight:800' : ''}">${
        p.ch === ' ' ? '&nbsp;' : p.ch.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}</span>`)
      .join('');

    const html = parts.map(p => p.ch === ' ' ? ' '
      : `<span style="color:${p.colour}${bold ? ';font-weight:bold' : ''}">${p.ch}</span>`).join('');
    const bbcode = parts.map(p => p.ch === ' ' ? ' ' : `[color=${p.colour}]${p.ch}[/color]`).join('');
    const ansiBody = parts.map(p => p.ch === ' ' ? ' '
      : `\u001b[${bold ? '1;' : ''}${nearestAnsi(p.colour)}m${p.ch}`).join('') + '\u001b[0m';
    const ansi = '```ansi\n' + ansiBody + '\n```';
    const stops = parts.map((p, i) => `${p.colour} ${Math.round(i / Math.max(1, parts.length - 1) * 100)}%`);
    const css = `background:linear-gradient(90deg,${stops.join(',')});` +
                `-webkit-background-clip:text;background-clip:text;color:transparent;` +
                (bold ? 'font-weight:800;' : '');

    set('html', html); set('bbcode', bbcode); set('ansi', ansi); set('css', css);
    drawCanvas(parts, bold);
  }

  function set(key, value) {
    const el = outputs.querySelector(`[data-out="${key}"]`);
    if (el) { el.textContent = value; el.dataset.value = value; }
  }

  function drawCanvas(parts, bold) {
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = 72, pad = 24;
    const ctx = canvas.getContext('2d');
    const font = `${bold ? '800 ' : ''}${size}px Arial, Helvetica, sans-serif`;
    ctx.font = font;
    const width = Math.ceil(parts.reduce((w, p) => w + ctx.measureText(p.ch).width, 0)) + pad * 2;
    const height = size + pad * 2;
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = '100%'; canvas.style.maxWidth = width + 'px';
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    ctx.font = font; ctx.textBaseline = 'middle';
    let x = pad;
    for (const p of parts) {
      ctx.fillStyle = p.colour;
      ctx.fillText(p.ch, x, height / 2);
      x += ctx.measureText(p.ch).width;
    }
  }

  async function copy(value, btn) {
    try { await navigator.clipboard.writeText(value); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = value; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
    }
    const label = btn.textContent;
    btn.textContent = '✓ Copied'; btn.classList.add('copied');
    if (toast) toast.classList.add('show');
    setTimeout(() => { btn.textContent = label; btn.classList.remove('copied'); }, 1500);
    setTimeout(() => toast && toast.classList.remove('show'), 1500);
  }

  outputs.addEventListener('click', e => {
    const btn = e.target.closest('button[data-copy]');
    if (!btn) return;
    const el = outputs.querySelector(`[data-out="${btn.dataset.copy}"]`);
    if (el) copy(el.dataset.value || el.textContent, btn);
  });

  const dl = document.getElementById('fxDownload');
  if (dl && canvas) {
    dl.addEventListener('click', () => {
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = (input.value || PLACEHOLDER).trim().slice(0, 40).replace(/\s+/g, '-') + '.png';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, 'image/png');
    });
  }

  [input, presetSel, dirSel, boldBox].forEach(el => el && el.addEventListener('input', render));
  const clear = document.getElementById('fxClear');
  if (clear) clear.addEventListener('click', () => { input.value = ''; render(); input.focus(); });
  render();
})();
