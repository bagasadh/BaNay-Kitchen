/* ----------------------------------------------------------------------------
 * 10. APP LIFECYCLE BOOTSTRAP
 * ------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initChoreographedAnimations();
  initPreloader();
  init3DTiltAndMagnetic();
  initDrawerMenu();
  initCartAndWhatsApp();
  initScrollScrubbingEngine();
  initInteractiveBurst();
  applyStoreConfigToDOM();
});
