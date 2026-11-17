// Menu samping & keranjang drawer
function initDrawerMenu() {
  const drawer = document.getElementById('side-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('close-menu-btn');
  if (!drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('is-open');
    closeBtn?.focus();
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('is-open');
  };

  document.getElementById('open-menu-btn')?.addEventListener('click', openDrawer);
  document.getElementById('floating-wa-btn')?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Keyboard accessibility: tutup drawer saat tombol Escape ditekan (R-32)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  document.querySelectorAll('.drawer-link').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // Expose untuk pemanggilan dari toast atau tombol luar
  window.openBaNayDrawer = openDrawer;
  window.closeBaNayDrawer = closeDrawer;
}
