// Shared tool script for every page. Each page picks its styles via data-styles on #results.
const SMALL_CAPS = {"a": "ᴀ", "b": "ʙ", "c": "ᴄ", "d": "ᴅ", "e": "ᴇ", "f": "ꜰ", "g": "ɢ", "h": "ʜ", "i": "ɪ", "j": "ᴊ", "k": "ᴋ", "l": "ʟ", "m": "ᴍ", "n": "ɴ", "o": "ᴏ", "p": "ᴘ", "q": "ǫ", "r": "ʀ", "s": "ꜱ", "t": "ᴛ", "u": "ᴜ", "v": "ᴠ", "w": "ᴡ", "x": "x", "y": "ʏ", "z": "ᴢ"};
const SUPERSCRIPT = {"a": "ᵃ", "b": "ᵇ", "c": "ᶜ", "d": "ᵈ", "e": "ᵉ", "f": "ᶠ", "g": "ᵍ", "h": "ʰ", "i": "ⁱ", "j": "ʲ", "k": "ᵏ", "l": "ˡ", "m": "ᵐ", "n": "ⁿ", "o": "ᵒ", "p": "ᵖ", "q": "ᑫ", "r": "ʳ", "s": "ˢ", "t": "ᵗ", "u": "ᵘ", "v": "ᵛ", "w": "ʷ", "x": "ˣ", "y": "ʸ", "z": "ᶻ", "A": "ᴬ", "B": "ᴮ", "C": "ᶜ", "D": "ᴰ", "E": "ᴱ", "F": "ᶠ", "G": "ᴳ", "H": "ᴴ", "I": "ᴵ", "J": "ᴶ", "K": "ᴷ", "L": "ᴸ", "M": "ᴹ", "N": "ᴺ", "O": "ᴼ", "P": "ᴾ", "Q": "Q", "R": "ᴿ", "S": "ˢ", "T": "ᵀ", "U": "ᵁ", "V": "ⱽ", "W": "ᵂ", "X": "ˣ", "Y": "ʸ", "Z": "ᶻ", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾"};
const SUBSCRIPT = {"a": "ₐ", "b": "ᵦ", "c": "꜀", "e": "ₑ", "h": "ₕ", "i": "ᵢ", "j": "ⱼ", "k": "ₖ", "l": "ₗ", "m": "ₘ", "n": "ₙ", "o": "ₒ", "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ", "u": "ᵤ", "v": "ᵥ", "x": "ₓ", "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉", "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎"};

const convert = (text, map, lowerFirst = false) =>
  Array.from(text).map(ch => {
    const key = lowerFirst ? ch.toLowerCase() : ch;
    return map[key] ?? map[ch.toLowerCase()] ?? ch;
  }).join('');
const decorate = (text, mark) =>
  Array.from(text).map(ch => (ch === ' ' || ch === '\n') ? ch : ch + mark).join('');

const STYLES = {
  smallcaps:   { label: 'Small Caps',               fn: t => convert(t, SMALL_CAPS, true) },
  superscript: { label: 'Superscript (Tiny Text)',  fn: t => convert(t, SUPERSCRIPT) },
  subscript:   { label: 'Subscript',                fn: t => convert(t, SUBSCRIPT, true) },
  strike:      { label: 'Small Caps Strikethrough', fn: t => decorate(convert(t, SMALL_CAPS, true), '̶') },
  underline:   { label: 'Small Caps Underline',     fn: t => decorate(convert(t, SMALL_CAPS, true), '̲') },
  tinystrike:  { label: 'Tiny Text Strikethrough',  fn: t => decorate(convert(t, SUPERSCRIPT), '̶') },
  tinyunder:   { label: 'Tiny Text Underline',      fn: t => decorate(convert(t, SUPERSCRIPT), '̲') },
  substrike:   { label: 'Subscript Strikethrough',  fn: t => decorate(convert(t, SUBSCRIPT, true), '̶') },
  subunder:    { label: 'Subscript Underline',      fn: t => decorate(convert(t, SUBSCRIPT, true), '̲') },
};

const input = document.getElementById('input');
const results = document.getElementById('results');
const count = document.getElementById('count');
const toast = document.getElementById('toast');
const PLACEHOLDER = results.dataset.placeholder || 'Small Text Generator';
const active = (results.dataset.styles || Object.keys(STYLES).join(',')).split(',').map(s => s.trim()).filter(s => STYLES[s]);

results.innerHTML = active.map(id => `
  <div class="result">
    <div>
      <div class="result-label">${STYLES[id].label}</div>
      <div class="result-text" id="out-${id}"></div>
    </div>
    <button class="btn btn-primary" data-style="${id}">Copy</button>
  </div>`).join('');

function render() {
  const text = input.value;
  const isEmpty = text.length === 0;
  count.textContent = `${Array.from(text).length} characters`;
  active.forEach(id => {
    const el = document.getElementById('out-' + id);
    el.textContent = STYLES[id].fn(isEmpty ? PLACEHOLDER : text);
    el.classList.toggle('empty', isEmpty);
  });
}
input.addEventListener('input', render);
render();

results.addEventListener('click', async e => {
  const btn = e.target.closest('button[data-style]');
  if (!btn) return;
  const value = STYLES[btn.dataset.style].fn(input.value || PLACEHOLDER);
  try { await navigator.clipboard.writeText(value); }
  catch {
    const ta = document.createElement('textarea');
    ta.value = value; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
  }
  btn.textContent = '✓ Copied'; btn.classList.add('copied'); toast.classList.add('show');
  setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
  setTimeout(() => toast.classList.remove('show'), 1500);
});

document.getElementById('clearBtn').addEventListener('click', () => { input.value = ''; render(); input.focus(); });
document.getElementById('pasteBtn').addEventListener('click', async () => {
  try { input.value = await navigator.clipboard.readText(); render(); } catch { input.focus(); }
});

const themeBtn = document.getElementById('themeBtn');
const applyTheme = t => { document.documentElement.setAttribute('data-theme', t); themeBtn.textContent = t === 'dark' ? '☀️' : '🌙'; };
let saved = null; try { saved = localStorage.getItem('theme'); } catch {}
applyTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next); try { localStorage.setItem('theme', next); } catch {}
});
document.getElementById('year').textContent = new Date().getFullYear();
