/* ----------------------------------------------------------------------------
 * 6. 60FPS SPRING TILT, MAGNETIC SHAPES & TOUCHSCREEN TACTILE ENGINE
 * ------------------------------------------------------------------------- */
function init3DTiltAndMagnetic() {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

  // A. Smooth 60FPS Lerped 3D Perspective Tilt for Cards (Zero Stutter, Zero Snap)
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
        rafId = null;
      }
    }

    function startLoop() {
      if (!rafId) rafId = requestAnimationFrame(updateTilt);
    }

    card.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      isHovered = true;
      card.classList.add('is-tilting');
      targetLift = -6;
      targetScale = 1.02;
      startLoop();
    });

    card.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      // Do not tilt the parent card if user is hovering an inner button/stepper
      if (e.target.closest('.btn-warm, .qty-stepper')) {
        targetRX = 0;
        targetRY = 0;
        return;
      }
      const rect = card.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      targetRX = ny * -10;
      targetRY = nx * 10;
      startLoop();
    });

    card.addEventListener('pointerleave', () => {
      isHovered = false;
      targetRX = 0;
      targetRY = 0;
      targetLift = 0;
      targetScale = 1;
      startLoop();
    });
  });

  // B. Smooth Magnetic Cursor Tracking on Buttons, Stickers, Seal & Pills
  const magneticSelector =
    '.btn-warm, .floating-wa-btn, .cartoon-sticker, .rotating-seal-badge, .eyebrow-pill, .section-kicker';

  document.querySelectorAll(magneticSelector).forEach((el) => {
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let magRaf = null;
    let active = false;

    function tickMagnetic() {
      cx = Utils.lerp(cx, tx, 0.26);
      cy = Utils.lerp(cy, ty, 0.26);
      el.style.setProperty('--mag-x', `${cx.toFixed(1)}px`);
      el.style.setProperty('--mag-y', `${cy.toFixed(1)}px`);

      if (active || Math.abs(tx - cx) > 0.08 || Math.abs(ty - cy) > 0.08) {
        magRaf = requestAnimationFrame(tickMagnetic);
      } else {
        el.style.removeProperty('--mag-x');
        el.style.removeProperty('--mag-y');
        el.classList.remove('is-magnetic-active');
        magRaf = null;
      }
    }

    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      active = true;
      el.classList.add('is-magnetic-active');
      if (!magRaf) magRaf = requestAnimationFrame(tickMagnetic);
    });

    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      tx = Utils.clamp(dx * 0.22, -10, 10);
      ty = Utils.clamp(dy * 0.26, -8, 8);
      if (!magRaf) magRaf = requestAnimationFrame(tickMagnetic);
    });

    el.addEventListener('pointerleave', () => {
      active = false;
      tx = 0;
      ty = 0;
      if (!magRaf) magRaf = requestAnimationFrame(tickMagnetic);
    });
  });

  // C. Universal Touchscreen & Click Tactile Spring Feedback (With 260ms Minimum Pop Hold)
  const interactiveSelector = [
    '.tilt-card',
    '.btn-warm',
    '.floating-wa-btn',
    '.cartoon-sticker',
    '.rotating-seal-badge',
    '.eyebrow-pill',
    '.section-kicker',
    '.live-status-badge',
    '.name-pill',
    '.plus-circle',
    '.pillar-num',
    '.story-logo-stage',
    '.menu-arch-tags span',
    '.arch-badge',
    '.arch-price-pill',
    '.pol-tag',
    '.film-pill',
    '.contact-chip',
    '.trust-item',
    '.bouncy-char'
  ].join(', ');

  const touchTimers = new WeakMap();

  document.addEventListener(
    'pointerdown',
    (e) => {
      const target = e.target.closest(interactiveSelector);
      if (!target) return;
      if (touchTimers.has(target)) {
        clearTimeout(touchTimers.get(target));
      }
      target.classList.add('is-touch-active');
      const timer = setTimeout(() => {
        target.classList.remove('is-touch-active');
        touchTimers.delete(target);
      }, 280);
      touchTimers.set(target, timer);
    },
    { passive: true }
  );

  const clearTouchActive = () => {
    document.querySelectorAll('.is-touch-active').forEach((el) => {
      if (!touchTimers.has(el)) {
        el.classList.remove('is-touch-active');
      }
    });
  };

  window.addEventListener('pointerup', clearTouchActive, { passive: true });
  window.addEventListener('pointercancel', clearTouchActive, { passive: true });
}
