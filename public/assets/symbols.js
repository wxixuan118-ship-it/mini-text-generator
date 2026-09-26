// Click-to-copy symbol picker used by the symbol copy-and-paste pages.
const toast = document.getElementById('toast');
const grids = document.getElementById('symbols');

grids.addEventListener('click', async e => {
  const btn = e.target.closest('button.sym');
  if (!btn) return;
  const value = btn.dataset.sym || btn.textContent.trim();
  try { await navigator.clipboard.writeText(value); }
  catch {
    const ta = document.createElement('textarea');
    ta.value = value; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
  }
  btn.classList.add('copied'); toast.classList.add('show');
  setTimeout(() => btn.classList.remove('copied'), 900);
  setTimeout(() => toast.classList.remove('show'), 1500);
});

const search = document.getElementById('symSearch');
const empty = document.getElementById('symEmpty');
if (search) {
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    grids.querySelectorAll('button.sym').forEach(b => {
      const hit = !q || (b.getAttribute('title') || '').toLowerCase().includes(q);
      b.hidden = !hit; if (hit) shown++;
    });
    grids.querySelectorAll('.sym-group').forEach(g => {
      g.hidden = !g.querySelector('button.sym:not([hidden])');
    });
    if (empty) empty.hidden = shown !== 0;
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
