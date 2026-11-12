/* ----------------------------------------------------------------------------
 * 8. SLIDE-OUT MENU & CART DRAWER
 * ------------------------------------------------------------------------- */
function initDrawerMenu() {
  const drawer = document.getElementById('side-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
  };

  document.getElementById('open-menu-btn')?.addEventListener('click', openDrawer);
  document.getElementById('floating-wa-btn')?.addEventListener('click', openDrawer);
  document.getElementById('close-menu-btn')?.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });
}
