// Preloader
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const statusEl = document.getElementById('preloader-text');
  const barFill = document.getElementById('preloader-bar-fill');
  if (!preloader) return;

  const steps = [
    { pct: '45%', text: 'MENYIAPKAN ADONAN PUFF PASTRY HOMEMADE IBU...' },
    { pct: '80%', text: 'MENABUR COKELAT LUMER & KEJU GONDRONG...' },
    { pct: '100%', text: 'SELAMAT DATANG DI DAPUR BANAY KITCHEN!' }
  ];

  let idx = 0;
  const interval = setInterval(() => {
    if (idx < steps.length) {
      if (statusEl) statusEl.textContent = steps[idx].text;
      if (barFill) barFill.style.width = steps[idx].pct;
      idx++;
    }
  }, 430);

  setTimeout(() => {
    clearInterval(interval);
    preloader.classList.add('is-hidden');
    document.querySelectorAll('.hero-section [data-anim], .hero-editorial-title').forEach((el) => {
      el.classList.add('is-inview');
    });
  }, 1500);
}
