// Shared tool script for every page. Each page picks its styles via data-styles on #results.
const SMALL_CAPS = {"a": "ᴀ", "b": "ʙ", "c": "ᴄ", "d": "ᴅ", "e": "ᴇ", "f": "ꜰ", "g": "ɢ", "h": "ʜ", "i": "ɪ", "j": "ᴊ", "k": "ᴋ", "l": "ʟ", "m": "ᴍ", "n": "ɴ", "o": "ᴏ", "p": "ᴘ", "q": "ǫ", "r": "ʀ", "s": "ꜱ", "t": "ᴛ", "u": "ᴜ", "v": "ᴠ", "w": "ᴡ", "x": "x", "y": "ʏ", "z": "ᴢ"};
const SUPERSCRIPT = {"a": "ᵃ", "b": "ᵇ", "c": "ᶜ", "d": "ᵈ", "e": "ᵉ", "f": "ᶠ", "g": "ᵍ", "h": "ʰ", "i": "ⁱ", "j": "ʲ", "k": "ᵏ", "l": "ˡ", "m": "ᵐ", "n": "ⁿ", "o": "ᵒ", "p": "ᵖ", "q": "ᑫ", "r": "ʳ", "s": "ˢ", "t": "ᵗ", "u": "ᵘ", "v": "ᵛ", "w": "ʷ", "x": "ˣ", "y": "ʸ", "z": "ᶻ", "A": "ᴬ", "B": "ᴮ", "C": "ᶜ", "D": "ᴰ", "E": "ᴱ", "F": "ᶠ", "G": "ᴳ", "H": "ᴴ", "I": "ᴵ", "J": "ᴶ", "K": "ᴷ", "L": "ᴸ", "M": "ᴹ", "N": "ᴺ", "O": "ᴼ", "P": "ᴾ", "Q": "Q", "R": "ᴿ", "S": "ˢ", "T": "ᵀ", "U": "ᵁ", "V": "ⱽ", "W": "ᵂ", "X": "ˣ", "Y": "ʸ", "Z": "ᶻ", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾"};
const SUBSCRIPT = {"a": "ₐ", "b": "ᵦ", "c": "꜀", "e": "ₑ", "h": "ₕ", "i": "ᵢ", "j": "ⱼ", "k": "ₖ", "l": "ₗ", "m": "ₘ", "n": "ₙ", "o": "ₒ", "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ", "u": "ᵤ", "v": "ᵥ", "x": "ₓ", "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉", "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎"};

const FRAKTUR = {"a": "𝔞", "b": "𝔟", "c": "𝔠", "d": "𝔡", "e": "𝔢", "f": "𝔣", "g": "𝔤", "h": "𝔥", "i": "𝔦", "j": "𝔧", "k": "𝔨", "l": "𝔩", "m": "𝔪", "n": "𝔫", "o": "𝔬", "p": "𝔭", "q": "𝔮", "r": "𝔯", "s": "𝔰", "t": "𝔱", "u": "𝔲", "v": "𝔳", "w": "𝔴", "x": "𝔵", "y": "𝔶", "z": "𝔷", "A": "𝔄", "B": "𝔅", "C": "ℭ", "D": "𝔇", "E": "𝔈", "F": "𝔉", "G": "𝔊", "H": "ℌ", "I": "ℑ", "J": "𝔍", "K": "𝔎", "L": "𝔏", "M": "𝔐", "N": "𝔑", "O": "𝔒", "P": "𝔓", "Q": "𝔔", "R": "ℜ", "S": "𝔖", "T": "𝔗", "U": "𝔘", "V": "𝔙", "W": "𝔚", "X": "𝔛", "Y": "𝔜", "Z": "ℨ"};
const FRAKTUR_BOLD = {"a": "𝖆", "b": "𝖇", "c": "𝖈", "d": "𝖉", "e": "𝖊", "f": "𝖋", "g": "𝖌", "h": "𝖍", "i": "𝖎", "j": "𝖏", "k": "𝖐", "l": "𝖑", "m": "𝖒", "n": "𝖓", "o": "𝖔", "p": "𝖕", "q": "𝖖", "r": "𝖗", "s": "𝖘", "t": "𝖙", "u": "𝖚", "v": "𝖛", "w": "𝖜", "x": "𝖝", "y": "𝖞", "z": "𝖟", "A": "𝕬", "B": "𝕭", "C": "𝕮", "D": "𝕯", "E": "𝕰", "F": "𝕱", "G": "𝕲", "H": "𝕳", "I": "𝕴", "J": "𝕵", "K": "𝕶", "L": "𝕷", "M": "𝕸", "N": "𝕹", "O": "𝕺", "P": "𝕻", "Q": "𝕼", "R": "𝕽", "S": "𝕾", "T": "𝕿", "U": "𝖀", "V": "𝖁", "W": "𝖂", "X": "𝖃", "Y": "𝖄", "Z": "𝖅"};
const FULLWIDTH = {"a": "ａ", "b": "ｂ", "c": "ｃ", "d": "ｄ", "e": "ｅ", "f": "ｆ", "g": "ｇ", "h": "ｈ", "i": "ｉ", "j": "ｊ", "k": "ｋ", "l": "ｌ", "m": "ｍ", "n": "ｎ", "o": "ｏ", "p": "ｐ", "q": "ｑ", "r": "ｒ", "s": "ｓ", "t": "ｔ", "u": "ｕ", "v": "ｖ", "w": "ｗ", "x": "ｘ", "y": "ｙ", "z": "ｚ", "A": "Ａ", "B": "Ｂ", "C": "Ｃ", "D": "Ｄ", "E": "Ｅ", "F": "Ｆ", "G": "Ｇ", "H": "Ｈ", "I": "Ｉ", "J": "Ｊ", "K": "Ｋ", "L": "Ｌ", "M": "Ｍ", "N": "Ｎ", "O": "Ｏ", "P": "Ｐ", "Q": "Ｑ", "R": "Ｒ", "S": "Ｓ", "T": "Ｔ", "U": "Ｕ", "V": "Ｖ", "W": "Ｗ", "X": "Ｘ", "Y": "Ｙ", "Z": "Ｚ", "0": "０", "1": "１", "2": "２", "3": "３", "4": "４", "5": "５", "6": "６", "7": "７", "8": "８", "9": "９", " ": "　", "!": "！", "?": "？", ".": "．", ",": "，", "'": "＇", "-": "－"};
const ALIEN = {"a": "ǟ", "b": "Ь", "c": "ƈ", "d": "ɖ", "e": "ɛ", "f": "ʄ", "g": "ɢ", "h": "ɦ", "i": "ɨ", "j": "ʝ", "k": "ӄ", "l": "ʟ", "m": "ʍ", "n": "ր", "o": "օ", "p": "ք", "q": "զ", "r": "ʀ", "s": "ֆ", "t": "ɶ", "u": "ʊ", "v": "ʋ", "w": "ա", "x": "Ӻ", "y": "ʏ", "z": "ʐ"};
const ALIEN_BLOCK = {"a": "ᗩ", "b": "ᗷ", "c": "ᑕ", "d": "ᗪ", "e": "E", "f": "ᖴ", "g": "G", "h": "ᕼ", "i": "I", "j": "ᒍ", "k": "K", "l": "ᒪ", "m": "ᗰ", "n": "ᑎ", "o": "O", "p": "ᑭ", "q": "ᑫ", "r": "ᖇ", "s": "ᔕ", "t": "T", "u": "ᑌ", "v": "ᐯ", "w": "ᗯ", "x": "᙭", "y": "Y", "z": "ᘔ"};

const convert = (text, map, lowerFirst = false) =>
  Array.from(text).map(ch => {
    const key = lowerFirst ? ch.toLowerCase() : ch;
    return map[key] ?? map[ch.toLowerCase()] ?? ch;
  }).join('');
const decorate = (text, mark) =>
  Array.from(text).map(ch => (ch === ' ' || ch === '\n') ? ch : ch + mark).join('');
// Continuous variant marks spaces too, so the line never breaks between words.
const decorateAll = (text, mark) =>
  Array.from(text).map(ch => ch === '\n' ? ch : ch + mark).join('');

// 5-row block alphabet for the huge text generator.
const BLOCK_FONT = {
  A:['█▀▀█','█▄▄█','█  █'], B:['█▀▀▄','█▀▀▄','█▄▄▀'], C:['█▀▀','█  ','█▄▄'],
  D:['█▀▀▄','█  █','█▄▄▀'], E:['█▀▀','█▀▀','█▄▄'], F:['█▀▀','█▀▀','█  '],
  G:['█▀▀','█ ▀█','█▄▄█'], H:['█  █','█▀▀█','█  █'], I:['▀█▀',' █ ','▄█▄'],
  J:['  █','  █','█▄█'], K:['█ █','██ ','█ █'], L:['█  ','█  ','█▄▄'],
  M:['█▄ ▄█','█ ▀ █','█   █'], N:['█▄ █','█ ▀█','█  █'], O:['█▀▀█','█  █','█▄▄█'],
  P:['█▀▀█','█▄▄█','█   '], Q:['█▀▀█','█  █','█▄▄█▄'], R:['█▀▀█','█▄▄▀','█  █'],
  S:['█▀▀','▀▀▄','▄▄▀'], T:['▀█▀',' █ ',' █ '], U:['█  █','█  █','█▄▄█'],
  V:['█   █','▀▄ ▄▀','  ▀  '], W:['█   █','█ █ █','▀▄▀▄▀'], X:['▀▄ ▄▀',' ▀█▀ ','▄▀ ▀▄'],
  Y:['█ █',' █ ',' █ '], Z:['▀▀█',' ▄▀','█▄▄'],
  '0':['█▀▀█','█  █','█▄▄█'], '1':['▀█ ',' █ ','▄█▄'], '2':['▀▀█','▄▀ ','█▄▄'],
  '3':['▀▀█',' ▀▄','▄▄▀'], '4':['█ █','█▄█','  █'], '5':['█▀▀','▀▀▄','▄▄▀'],
  '6':['█▀▀','█▀▄','▀▄▀'], '7':['▀▀█','  █','  █'], '8':['▀█▀','▄▀▄','▀▄▀'],
  '9':['▀█▀','▀▄█','▄▄▀'], ' ':['  ','  ','  '], '!':['█','█','▄'], '?':['▀▀█',' ▄▀',' ▄ '],
};
const blockify = text => {
  const chars = Array.from(text.toUpperCase()).filter(c => BLOCK_FONT[c]);
  if (!chars.length) return '';
  return [0, 1, 2].map(row => chars.map(c => BLOCK_FONT[c][row]).join(' ')).join('\n');
};

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
  uline:       { label: 'Underline',                 fn: t => decorate(t, '̲') },
  ulineCont:   { label: 'Continuous Underline',      fn: t => decorateAll(t, '̲') },
  ulineDouble: { label: 'Double Underline',          fn: t => decorate(t, '̳') },
  ulineWavy:   { label: 'Wavy Underline',            fn: t => decorate(t, '̰') },
  ulineDotted: { label: 'Dotted Underline',          fn: t => decorate(t, '̣') },
  ulineLow:    { label: 'Low Line (thin)',           fn: t => decorate(t, '̱') },
  ulineStrike: { label: 'Underline + Strikethrough', fn: t => decorate(t, '̶̲') },
  oldenglish:  { label: 'Old English (Fraktur)',     fn: t => convert(t, FRAKTUR) },
  oldenglishB: { label: 'Old English Bold',          fn: t => convert(t, FRAKTUR_BOLD) },
  oldenglishU: { label: 'Old English Underline',     fn: t => decorate(convert(t, FRAKTUR), '̲') },
  oldenglishO: { label: 'Old English Ornate',        fn: t => '꧁༺' + convert(t, FRAKTUR_BOLD) + '༻꧂' },
  fullwidth:   { label: 'Fullwidth (Huge)',          fn: t => convert(t, FULLWIDTH) },
  blockart:    { label: 'Block Letters (ASCII art)', fn: blockify, mono: true },
  blockSpaced: { label: 'Spaced Out',                fn: t => Array.from(t).join(' ') },
  alien:       { label: 'Alien',                     fn: t => convert(t, ALIEN, true) },
  alienBlock:  { label: 'Alien Blocks',              fn: t => convert(t, ALIEN_BLOCK, true) },
  alienGlitch: { label: 'Alien Glitch',              fn: t => decorate(convert(t, ALIEN, true), '͆͑') },
  alienWrap:   { label: 'Alien Transmission',        fn: t => '☁️⁉ ' + convert(t, ALIEN, true) + ' ⁉☁️' },
  fireWrap:    { label: 'Fire Wrap',                 fn: t => '🔥 ' + t + ' 🔥' },
  fireSpaced:  { label: 'Fire Between Letters',      fn: t => Array.from(t).map(c => c === ' ' ? ' ' : c).join('🔥') },
  fireBold:    { label: 'Fire Blackletter',          fn: t => '🔥' + convert(t, FRAKTUR_BOLD) + '🔥' },
  fireBanner:  { label: 'Fire Banner',               fn: t => '🔥'.repeat(Math.max(3, Math.ceil(Array.from(t).length / 2))) + '\n' + t + '\n' + '🔥'.repeat(Math.max(3, Math.ceil(Array.from(t).length / 2))) },
};

const input = document.getElementById('input');
const results = document.getElementById('results');
const count = document.getElementById('count');
const toast = document.getElementById('toast');
// Pages without a converter (the colour-effect tools) still load this file for
// the nav, theme toggle and footer year, so guard the converter on its elements.
if (input && results) {
  const PLACEHOLDER = results.dataset.placeholder || 'Small Text Generator';
  const active = (results.dataset.styles || Object.keys(STYLES).join(',')).split(',').map(s => s.trim()).filter(s => STYLES[s]);

  results.innerHTML = active.map(id => `
    <div class="result">
      <div>
        <div class="result-label">${STYLES[id].label}</div>
        <div class="result-text${STYLES[id].mono ? ' mono' : ''}" id="out-${id}"></div>
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
}

const themeBtn = document.getElementById('themeBtn');
const applyTheme = t => { document.documentElement.setAttribute('data-theme', t); themeBtn.textContent = t === 'dark' ? '☀️' : '🌙'; };
let saved = null; try { saved = localStorage.getItem('theme'); } catch {}
applyTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next); try { localStorage.setItem('theme', next); } catch {}
});

// Nav dropdowns
const dropdowns = document.querySelectorAll('.nav-dropdown');
dropdowns.forEach(dropdown => {
  const btn = dropdown.querySelector('.nav-dropdown-btn');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Close other dropdowns
    dropdowns.forEach(other => {
      if (other !== dropdown) {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.nav-dropdown-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      }
    });
    dropdown.classList.toggle('open');
    btn.setAttribute('aria-expanded', dropdown.classList.contains('open') ? 'true' : 'false');
  });
});
document.addEventListener('click', (e) => {
  dropdowns.forEach(dropdown => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      const btn = dropdown.querySelector('.nav-dropdown-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    dropdowns.forEach(dropdown => {
      if (dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
        const btn = dropdown.querySelector('.nav-dropdown-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
