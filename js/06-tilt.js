// Tilt kartu 3D & efek magnetic hover
function init3DTiltAndMagnetic() {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

  // Tilt 3D pada kartu
  document.querySelectorAll('.tilt-card').forEach((card) => {
    let targetRX = 0;
    let targetRY = 0;
    let targetLift = 0;
    let targetScale = 1;
    let currRX = 0;
    let currRY = 0;
    let currLift = 0;
    let currScale = 1;
    let rafId = null;
    let isHovered = false;

    function updateTilt() {
      currRX = Utils.lerp(currRX, targetRX, 0.22);
      currRY = Utils.lerp(currRY, targetRY, 0.22);
      currLift = Utils.lerp(currLift, targetLift, 0.22);
      currScale = Utils.lerp(currScale, targetScale, 0.22);

      card.style.setProperty('--tilt-rx', `${currRX.toFixed(2)}deg`);
      card.style.setProperty('--tilt-ry', `${currRY.toFixed(2)}deg`);
      card.style.setProperty('--hover-lift', `${currLift.toFixed(2)}px`);
      card.style.setProperty('--hover-scale', currScale.toFixed(3));

      const stillMoving =
        Math.abs(targetRX - currRX) > 0.04 ||
        Math.abs(targetRY - currRY) > 0.04 ||
        Math.abs(targetLift - currLift) > 0.08 ||
        Math.abs(targetScale - currScale) > 0.002;

      if (isHovered || stillMoving) {
        rafId = requestAnimationFrame(updateTilt);
      } else {
        card.style.removeProperty('--tilt-rx');
        card.style.removeProperty('--tilt-ry');
        card.style.removeProperty('--hover-lift');
        card.style.removeProperty('--hover-scale');
        card.classList.remove('is-tilting');
      }
    }

    function onPointerMove(e) {
      if (!canHover.matches) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      const maxTilt = parseFloat(card.getAttribute('data-tilt-max') || '9');
      targetRX = (py - 0.5) * -maxTilt * 1.6;
      targetRY = (px - 0.5) * maxTilt * 1.6;
      targetLift = -8;
      targetScale = 1.025;

      if (!card.classList.contains('is-tilting')) {
        card.classList.add('is-tilting');
      }
      if (!rafId || !isHovered) {
        isHovered = true;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateTilt);
      }
    }

    card.addEventListener('mousemove', (e) => {
      if (e.target.closest('.qty-stepper, .btn-warm, .direct-wa-btn, button, a')) {
        targetRX = 0;
        targetRY = 0;
        targetLift = -3;
        targetScale = 1.01;
        return;
      }
      onPointerMove(e);
    });

    card.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      targetRX = 0;
      targetRY = 0;
      targetLift = 0;
      targetScale = 1;
      if (!rafId) {
        rafId = requestAnimationFrame(updateTilt);
      }
    });
  });

  // Magnetic cursor tracking
  const magneticElements = document.querySelectorAll(
    '.btn-warm, .rotating-seal-badge, .cartoon-sticker, .eyebrow-pill, .section-kicker, .live-status-badge'
  );

  magneticElements.forEach((el) => {
    let targetX = 0;
    let targetY = 0;
    let currX = 0;
    let currY = 0;
    let rafId = null;
    let active = false;

    function updateMag() {
      currX = Utils.lerp(currX, targetX, 0.26);
      currY = Utils.lerp(currY, targetY, 0.26);
      el.style.setProperty('--mag-x', `${currX.toFixed(2)}px`);
      el.style.setProperty('--mag-y', `${currY.toFixed(2)}px`);

      if (active || Math.abs(targetX - currX) > 0.05 || Math.abs(targetY - currY) > 0.05) {
        rafId = requestAnimationFrame(updateMag);
      } else {
        el.style.removeProperty('--mag-x');
        el.style.removeProperty('--mag-y');
        el.classList.remove('is-magnetic-active');
      }
    }

    el.addEventListener('mousemove', (e) => {
      if (!canHover.matches) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const pull = parseFloat(el.getAttribute('data-mag-pull') || '0.28');
      targetX = Utils.clamp(dx * pull, -14, 14);
      targetY = Utils.clamp(dy * pull, -12, 12);

      if (!el.classList.contains('is-magnetic-active')) {
        el.classList.add('is-magnetic-active');
      }
      if (!rafId || !active) {
        active = true;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateMag);
      }
    });

    el.addEventListener('mouseenter', () => {
      active = true;
    });

    el.addEventListener('mouseleave', () => {
      active = false;
      targetX = 0;
      targetY = 0;
      if (!rafId) {
        rafId = requestAnimationFrame(updateMag);
      }
    });
  });

  // Feedback klik / sentuhan pada tombol & elemen interaktif
  const tactileTargets = document.querySelectorAll(
    '.btn-warm, .tilt-card, .rotating-seal-badge, .cartoon-sticker, .eyebrow-pill, ' +
    '.section-kicker, .live-status-badge, .name-pill, .plus-circle, .pillar-num, ' +
    '.menu-arch-tags span, .arch-badge, .arch-price-pill, .pol-tag, .film-pill, ' +
    '.contact-chip, .trust-item, .qty-btn, .bouncy-char, .drawer-link'
  );

  tactileTargets.forEach((target) => {
    let holdTimeout = null;

    function triggerActiveFeedback() {
      target.classList.add('is-touch-active');
      clearTimeout(holdTimeout);
      holdTimeout = setTimeout(() => {
        target.classList.remove('is-touch-active');
      }, 260);
    }

    target.addEventListener('touchstart', triggerActiveFeedback, { passive: true });
    target.addEventListener('mousedown', triggerActiveFeedback);
  });
}
