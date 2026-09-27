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
