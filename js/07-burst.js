/* ----------------------------------------------------------------------------
 * 7. INTERACTIVE PASTRY EMOJI BURST (ALL SHAPES, BADGES & BUTTONS)
 * ------------------------------------------------------------------------- */
function initInteractiveBurst() {
  const icons = ['🥐', '🍌', '🍫', '🧀', '✨', '🍨'];

  function spawnBurst(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.className = 'click-particle';
      particle.textContent = icons[Math.floor(Math.random() * icons.length)];

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const distance = 36 + Math.random() * 58;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 28;
      const rot = (Math.random() - 0.5) * 130;

      particle.style.left = `${x - 12}px`;
      particle.style.top = `${y - 12}px`;
      particle.style.setProperty('--tx', `${tx.toFixed(0)}px`);
      particle.style.setProperty('--ty', `${ty.toFixed(0)}px`);
      particle.style.setProperty('--rot', `${rot.toFixed(0)}deg`);

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 820);
    }
  }

  const burstSelector = [
    '.add-cart-btn',
    '.direct-wa-btn',
    '.qty-btn',
    '.bouncy-char',
    '.story-main-logo',
    '.story-logo-stage',
    '.rotating-seal-badge',
    '.cartoon-sticker',
    '.eyebrow-pill',
    '.section-kicker',
    '.live-status-badge',
    '.name-pill',
    '.plus-circle',
    '.pillar-num',
    '.arch-badge',
    '.arch-price-pill',
    '.pol-tag',
    '.film-pill',
    '.menu-arch-tags span',
    '.contact-chip',
    '.trust-item'
  ].join(', ');

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest(burstSelector);
    if (trigger) {
      spawnBurst(e.clientX, e.clientY, 6);
    }
  });
}
