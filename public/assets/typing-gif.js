const gifText = document.getElementById('gifText');
const gifCanvas = document.getElementById('gifCanvas');
const gifCtx = gifCanvas.getContext('2d', { willReadFrequently: true });
const generateBtn = document.getElementById('generateGif');
const downloadLink = document.getElementById('downloadGif');
const gifOutput = document.getElementById('gifOutput');
const gifStatus = document.getElementById('gifStatus');
const controls = ['gifSize', 'gifSpeed', 'gifFont', 'gifFontSize', 'gifTextColor', 'gifBgColor'].map(id => document.getElementById(id));
let previewTimer = 0;
let previewStart = performance.now();
let outputUrl = '';

function settings() {
  const [width, height] = document.getElementById('gifSize').value.split('x').map(Number);
  return {
    width, height,
    speed: Number(document.getElementById('gifSpeed').value),
    font: document.getElementById('gifFont').value,
    fontSize: Number(document.getElementById('gifFontSize').value),
    color: document.getElementById('gifTextColor').value,
    background: document.getElementById('gifBgColor').value
  };
}

function fitCanvas(width, height) {
  if (gifCanvas.width !== width) gifCanvas.width = width;
  if (gifCanvas.height !== height) gifCanvas.height = height;
}

function drawFrame(text, cursor, cfg) {
  fitCanvas(cfg.width, cfg.height);
  gifCtx.fillStyle = cfg.background;
  gifCtx.fillRect(0, 0, cfg.width, cfg.height);
  gifCtx.fillStyle = cfg.color;
  gifCtx.textBaseline = 'middle';
  gifCtx.textAlign = 'left';
  gifCtx.font = `700 ${cfg.fontSize}px ${cfg.font}`;
  const padding = Math.max(22, Math.round(cfg.width * .06));
  const available = cfg.width - padding * 2;
  let shown = text;
  while (shown && gifCtx.measureText(shown).width > available) shown = shown.slice(1);
  const metrics = gifCtx.measureText(shown);
  const x = padding;
  const y = cfg.height / 2;
  gifCtx.fillText(shown, x, y);
  if (cursor) {
    const cursorX = Math.min(x + metrics.width + 5, cfg.width - padding);
    const cursorH = Math.round(cfg.fontSize * 1.08);
    gifCtx.fillRect(cursorX, y - cursorH / 2, Math.max(3, Math.round(cfg.fontSize / 12)), cursorH);
  }
}

function preview(now) {
  const text = Array.from(gifText.value || 'Make typing text GIF');
  const cfg = settings();
  const cycle = (text.length + 5) * cfg.speed;
  const elapsed = (now - previewStart) % cycle;
  const count = Math.min(text.length, Math.floor(elapsed / cfg.speed));
  const hold = elapsed >= text.length * cfg.speed;
  const cursor = hold ? Math.floor(elapsed / 450) % 2 === 0 : true;
  drawFrame(text.slice(0, count).join(''), cursor, cfg);
  previewTimer = requestAnimationFrame(preview);
}

function resetPreview() { previewStart = performance.now(); }
gifText.addEventListener('input', resetPreview);
controls.forEach(control => control.addEventListener('input', resetPreview));
previewTimer = requestAnimationFrame(preview);

function word(value, bytes) {
  bytes.push(value & 255, (value >> 8) & 255);
}

function ascii(value, bytes) {
  for (let i = 0; i < value.length; i++) bytes.push(value.charCodeAt(i));
}

function palette332() {
  const palette = [];
  for (let r = 0; r < 8; r++) {
    for (let g = 0; g < 8; g++) {
      for (let b = 0; b < 4; b++) palette.push(Math.round(r * 255 / 7), Math.round(g * 255 / 7), Math.round(b * 255 / 3));
    }
  }
  return palette;
}

function pixels332(imageData) {
  const rgba = imageData.data;
  const pixels = new Uint8Array(rgba.length / 4);
  for (let i = 0, p = 0; i < rgba.length; i += 4, p++) pixels[p] = (rgba[i] >> 5) << 5 | (rgba[i + 1] >> 5) << 2 | (rgba[i + 2] >> 6);
  return pixels;
}

function lzwEncode(pixels) {
  const clear = 256;
  const end = 257;
  let codeSize = 9;
  let nextCode = 258;
  let dictionary = new Map();
  const packed = [];
  let buffer = 0;
  let bits = 0;
  const writeCode = code => {
    buffer |= code << bits;
    bits += codeSize;
    while (bits >= 8) { packed.push(buffer & 255); buffer >>>= 8; bits -= 8; }
  };
  const reset = () => { dictionary = new Map(); codeSize = 9; nextCode = 258; };
  writeCode(clear);
  if (pixels.length) {
    let prefix = pixels[0];
    for (let i = 1; i < pixels.length; i++) {
      const value = pixels[i];
      const key = prefix * 256 + value;
      if (dictionary.has(key)) {
        prefix = dictionary.get(key);
      } else {
        writeCode(prefix);
        if (nextCode < 4096) {
          dictionary.set(key, nextCode++);
          if (nextCode === (1 << codeSize) && codeSize < 12) codeSize++;
        } else {
          writeCode(clear);
          reset();
        }
        prefix = value;
      }
    }
    writeCode(prefix);
  }
  writeCode(end);
  if (bits) packed.push(buffer & 255);
  return packed;
}

function addBlocks(data, bytes) {
  for (let offset = 0; offset < data.length; offset += 255) {
    const size = Math.min(255, data.length - offset);
    bytes.push(size, ...data.slice(offset, offset + size));
  }
  bytes.push(0);
}

function makeGif(frames, width, height, delay) {
  const bytes = [];
  ascii('GIF89a', bytes);
  word(width, bytes); word(height, bytes);
  bytes.push(0xF7, 0, 0, ...palette332());
  bytes.push(0x21, 0xFF, 0x0B); ascii('NETSCAPE2.0', bytes); bytes.push(3, 1, 0, 0, 0);
  frames.forEach(frame => {
    bytes.push(0x21, 0xF9, 4, 0);
    word(delay, bytes);
    bytes.push(0, 0, 0x2C);
    word(0, bytes); word(0, bytes); word(width, bytes); word(height, bytes);
    bytes.push(0, 8);
    addBlocks(lzwEncode(frame), bytes);
  });
  bytes.push(0x3B);
  return new Blob([new Uint8Array(bytes)], { type: 'image/gif' });
}

generateBtn.addEventListener('click', async () => {
  const text = Array.from(gifText.value.trim() || 'Make typing text GIF').slice(0, 60);
  const cfg = settings();
  generateBtn.disabled = true;
  generateBtn.textContent = 'Creating GIF…';
  gifStatus.textContent = `Rendering ${text.length + 3} frames in your browser…`;
  await new Promise(resolve => requestAnimationFrame(resolve));
  try {
    const frames = [];
    for (let i = 0; i <= text.length; i++) {
      drawFrame(text.slice(0, i).join(''), true, cfg);
      frames.push(pixels332(gifCtx.getImageData(0, 0, cfg.width, cfg.height)));
    }
    drawFrame(text.join(''), false, cfg);
    const finalFrame = pixels332(gifCtx.getImageData(0, 0, cfg.width, cfg.height));
    frames.push(finalFrame, finalFrame);
    const blob = makeGif(frames, cfg.width, cfg.height, Math.max(2, Math.round(cfg.speed / 10)));
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    outputUrl = URL.createObjectURL(blob);
    gifOutput.width = cfg.width;
    gifOutput.height = cfg.height;
    gifOutput.src = outputUrl;
    gifOutput.hidden = false;
    downloadLink.href = outputUrl;
    downloadLink.download = 'typing-text.gif';
    downloadLink.hidden = false;
    gifStatus.textContent = `Done — ${(blob.size / 1024).toFixed(0)} KB animated GIF, ready to download.`;
  } catch (error) {
    gifStatus.textContent = 'Could not create the GIF in this browser. Try shorter text or a smaller size.';
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = '✨ Create GIF';
    resetPreview();
  }
});

const themeBtn = document.getElementById('themeBtn');
const applyTheme = theme => { document.documentElement.setAttribute('data-theme', theme); themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙'; };
let savedTheme = null; try { savedTheme = localStorage.getItem('theme'); } catch {}
applyTheme(savedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next); try { localStorage.setItem('theme', next); } catch {}
});

const dropdowns = document.querySelectorAll('.nav-dropdown');
dropdowns.forEach(dropdown => {
  const button = dropdown.querySelector('.nav-dropdown-btn');
  button.addEventListener('click', event => {
    event.stopPropagation();
    dropdowns.forEach(other => {
      if (other !== dropdown) { other.classList.remove('open'); other.querySelector('.nav-dropdown-btn').setAttribute('aria-expanded', 'false'); }
    });
    dropdown.classList.toggle('open');
    button.setAttribute('aria-expanded', String(dropdown.classList.contains('open')));
  });
});
document.addEventListener('click', () => dropdowns.forEach(dropdown => { dropdown.classList.remove('open'); dropdown.querySelector('.nav-dropdown-btn').setAttribute('aria-expanded', 'false'); }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') document.dispatchEvent(new Event('click')); });
document.getElementById('year').textContent = new Date().getFullYear();
