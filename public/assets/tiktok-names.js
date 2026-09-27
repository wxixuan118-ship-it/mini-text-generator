(() => {
  const form = document.getElementById('nameForm');
  const results = document.getElementById('nameResults');
  const status = document.getElementById('nameStatus');
  const banks = {
    aesthetic: [['velvet', 'lunar', 'soft', 'golden', 'peach', 'dreamy', 'misty', 'cosmic'], ['bloom', 'glow', 'cloud', 'muse', 'aura', 'diary', 'studio', 'petal']],
    funny: [['sleepy', 'spicy', 'chaotic', 'tiny', 'extra', 'awkward', 'silly', 'crispy'], ['noodle', 'potato', 'pickle', 'waffle', 'snack', 'panda', 'toast', 'goose']],
    gaming: [['pixel', 'neon', 'stealth', 'epic', 'turbo', 'nova', 'frost', 'swift'], ['quest', 'raven', 'arcade', 'knight', 'orbit', 'striker', 'level', 'comet']],
    creator: [['daily', 'hello', 'simply', 'fresh', 'bright', 'real', 'little', 'happy'], ['creates', 'stories', 'journal', 'edits', 'vibes', 'world', 'notes', 'life']]
  };
  function generate() {
    const raw = document.getElementById('nameSeed').value;
    const seed = raw.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
    const [adjectives, nouns] = banks[document.getElementById('nameStyle').value];
    const separator = document.getElementById('nameSeparator').value;
    const numbers = document.getElementById('nameNumbers').checked;
    const candidates = [];
    adjectives.forEach(a => nouns.forEach(n => {
      candidates.push([a, seed || n].join(separator), [seed || a, n].join(separator));
    }));
    const unique = [...new Set(candidates)];
    for (let i = unique.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unique[i], unique[j]] = [unique[j], unique[i]];
    }
    results.replaceChildren();
    unique.slice(0, 12).forEach(name => {
      if (numbers) name += String(Math.floor(Math.random() * 90) + 10);
      const row = document.createElement('div'); row.className = 'result';
      const label = document.createElement('span'); label.className = 'result-text'; label.textContent = '@' + name;
      const button = document.createElement('button'); button.type = 'button'; button.className = 'btn';
      button.textContent = 'Copy'; button.dataset.name = name; button.setAttribute('aria-label', 'Copy ' + name);
      row.append(label, button); results.append(row);
    });
    status.textContent = '12 ideas ready. ' + (raw && !seed ? 'Use Latin letters or numbers to include your keyword. ' : '') + 'Check availability in TikTok before choosing.';
  }
  form.addEventListener('submit', event => { event.preventDefault(); generate(); });
  results.addEventListener('click', async event => {
    const button = event.target.closest('button[data-name]'); if (!button) return;
    try {
      await navigator.clipboard.writeText(button.dataset.name);
      status.textContent = 'Copied ' + button.dataset.name + ' (without @).';
      button.textContent = 'Copied!'; setTimeout(() => { button.textContent = 'Copy'; }, 1500);
    } catch { status.textContent = 'Copy is unavailable here. Select the username text and copy it manually.'; }
  });
  generate();
})();
