/**
 * ============================================================================
 * BANAY KITCHEN — Official JavaScript Core (Modular, High-Performance & DRY)
 * WhatsApp: 0812-4449-609 | IG: @banay_kitchen | Lokasi: Dapur Rumah BaNay
 * Compiled automatically from js/*.js
 * ============================================================================
 */

/* ----------------------------------------------------------------------------
 * 1. STORE CONFIGURATION & STATE
 * ------------------------------------------------------------------------- */
const STORE_CONFIG = {
  storeName: 'BaNay Kitchen',
  whatsappNumber: '628124449609',
  whatsappDisplay: '0812-4449-609',
  instagramUrl: 'https://www.instagram.com/banay_kitchen?cplk=OTV3bjJnamZrZmNy',
  googleMapsUrl: 'https://maps.app.goo.gl/5kShEDrs7w14mmXK6',
  products: {
    strudel: { id: 'strudel', name: 'Banana Strudel', price: 65000, unit: 'box', isCustomPrice: false },
    crispy: { id: 'crispy', name: 'Banana Milk Crispy', price: 35000, unit: 'box', isCustomPrice: false },
    qqball: { id: 'qqball', name: 'QQ Ball Dessert', price: 12000, unit: 'porsi', isCustomPrice: false },
    bengroll: { id: 'bengroll', name: 'Beng Roll Pastry', price: 20000, unit: 'box', isCustomPrice: false },
    allpastry: { id: 'allpastry', name: 'All Pastry (Request Kue Kulit Pastry)', price: 0, unit: 'request', isCustomPrice: true }
  }
};

// Initial cart state (empty by default)
const cartState = {
  strudel: 0,
  crispy: 0,
  qqball: 0,
  bengroll: 0,
  allpastry: 0
};

/* ----------------------------------------------------------------------------
 * 2. UTILITY HELPERS
 * ------------------------------------------------------------------------- */
const Utils = {
  formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
  },

  clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  },

  lerp(start, end, amt) {
    return start + (end - start) * amt;
  },

  buildWhatsAppUrl(message) {
    const cleanPhone = STORE_CONFIG.whatsappNumber.replace(/\D/g, '');
    if (!message || !message.trim()) {
      return `https://wa.me/${cleanPhone}`;
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  },

  openWhatsApp(message) {
    window.open(this.buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  },

  getCartBreakdown() {
    let grandTotal = 0;
    let totalItems = 0;
    let hasCustomItem = false;
    const items = [];

    Object.keys(STORE_CONFIG.products).forEach((key) => {
      const prod = STORE_CONFIG.products[key];
      const qty = cartState[key] || 0;
      if (qty > 0) {
        totalItems += qty;
        const subtotal = prod.isCustomPrice ? 0 : prod.price * qty;
        grandTotal += subtotal;
        if (prod.isCustomPrice) hasCustomItem = true;
        items.push({ key, prod, qty, subtotal });
      }
    });

    return { items, grandTotal, totalItems, hasCustomItem };
  }
};

/* ----------------------------------------------------------------------------
 * 3. PRELOADER
 * ------------------------------------------------------------------------- */
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

/* ----------------------------------------------------------------------------
 * 4. CHOREOGRAPHED ENTRANCES & TEXT SPLITTING
 * ------------------------------------------------------------------------- */
function initChoreographedAnimations() {
  // Split Headlines into masked bouncy lines
  document.querySelectorAll('.hero-editorial-title, .section-serif-title').forEach((heading) => {
    const rawHtml = heading.innerHTML.trim();
    const lines = rawHtml.split(/<br\s*\/?>/i);
    heading.innerHTML = lines
      .map(
        (line, idx) =>
          `<span class="split-line-mask"><span class="split-line-inner" style="--line-delay:${idx * 100}ms">${line.trim()}</span></span>`
      )
      .join('');
    heading.setAttribute('data-anim-lines', 'true');
  });

  // Split Footer Signature Wordmark into bouncy interactive characters
  const footerWord = document.querySelector('.footer-giant-word');
  if (footerWord) {
    const text = footerWord.textContent.trim();
    footerWord.innerHTML = text
      .split('')
      .map((ch, idx) =>
        ch === ' '
          ? '&nbsp;'
          : `<span class="bouncy-char" style="--char-delay:${idx * 55}ms">${ch}</span>`
      )
      .join('');
    footerWord.setAttribute('data-anim-chars', 'true');
  }

  // Staggered delays setup
  const setStagger = (selector, delayFn, animAttr = null) => {
    document.querySelectorAll(selector).forEach((el, idx) => {
      if (animAttr) el.setAttribute('data-anim', animAttr);
      el.style.setProperty('--anim-delay', `${delayFn(idx)}ms`);
    });
  };

  setStagger('.bento-pillar', (i) => i * 115);
  setStagger('.menu-arch-card', (i) => (i % 2) * 115);
  setStagger('.gallery-polaroid', (i) => i * 95);
  setStagger('.ig-thumb', (i) => i * 85, 'pop-scale');
  setStagger('.footer-nav-col a', (i) => i * 50, 'fade-up');
}

/* ----------------------------------------------------------------------------
 * 5. 60FPS BIDIRECTIONAL SCROLL-SCRUBBING ENGINE (COMPOSABLE CSS VARIABLES)
 * ------------------------------------------------------------------------- */
function initScrollScrubbingEngine() {
  const progressBar = document.getElementById('scroll-progress-bar');
  const animTargets = Array.from(
    document.querySelectorAll('[data-anim], [data-anim-lines="true"], [data-anim-chars="true"]')
  );

  // Cached scrub element references
  const heroArchStage = document.getElementById('hero-arch-stage');
  const heroWordLeft = document.getElementById('hero-word-left');
  const heroWordRight = document.getElementById('hero-word-right');
  const heroSeal = document.getElementById('hero-seal-badge');
  const heroSticker1 = document.getElementById('hero-sticker-1');
  const heroSticker2 = document.getElementById('hero-sticker-2');
  const orbitStrudel = document.getElementById('orbit-strudel');
  const orbitQqball = document.getElementById('orbit-qqball');
  const ribbonTrack1 = document.getElementById('ribbon-track-1');
  const ribbonTrack2 = document.getElementById('ribbon-track-2');
  const storyHalo = document.getElementById('story-logo-halo');
  const storySection = document.getElementById('cerita');
  const galleryGrid = document.getElementById('gallery-fanned-grid');
  const polCards = document.querySelectorAll('.gallery-polaroid');
  const filmstripTrack = document.getElementById('filmstrip-track');

  let currentScroll = window.scrollY;
  let targetScroll = window.scrollY;
  let isTicking = false;

  // Cached unit set widths for seamless infinite marquee scrubbing
  let ribbon1SetWidth = 0;
  let ribbon2SetWidth = 0;
  let filmstripSetWidth = 0;

  function measureTrackSetWidth(track, itemsPerSet) {
    if (!track) return 0;
    const children = track.children;
    if (children.length > itemsPerSet) {
      const w = children[itemsPerSet].offsetLeft - children[0].offsetLeft;
      if (w > 0) return w;
    }
    const count = children.length;
    return count > 0 ? track.scrollWidth / Math.max(1, Math.floor(count / itemsPerSet)) : 0;
  }

  function setupMarqueeTracks() {
    function fillTrack(track, itemsPerSet) {
      if (!track) return;
      const initialChildren = Array.from(track.children);
      if (initialChildren.length < itemsPerSet) return;
      let setW = measureTrackSetWidth(track, itemsPerSet);
      if (setW <= 0) return;

      const neededWidth = window.innerWidth + setW * 2;
      const baseSlice = initialChildren.slice(0, itemsPerSet);
      let attempts = 0;
      while (track.scrollWidth < neededWidth && attempts < 8) {
        baseSlice.forEach((item) => {
          const clone = item.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          track.appendChild(clone);
        });
        attempts++;
      }
    }

    fillTrack(ribbonTrack1, 6);
    fillTrack(ribbonTrack2, 4);
    fillTrack(filmstripTrack, 6);

    ribbon1SetWidth = measureTrackSetWidth(ribbonTrack1, 6);
    ribbon2SetWidth = measureTrackSetWidth(ribbonTrack2, 4);
    filmstripSetWidth = measureTrackSetWidth(filmstripTrack, 6);
  }

  setupMarqueeTracks();

  function getSectionProgress(el) {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return Utils.clamp((vh - rect.top) / (vh + rect.height), 0, 1);
  }

  function updateScrubbedElements(scrollVal) {
    const vh = window.innerHeight;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    const pct = Utils.clamp((scrollVal / maxScroll) * 100, 0, 100);

    if (progressBar) {
      progressBar.style.width = `${pct.toFixed(2)}%`;
    }

    // A. Smooth In-View Reveal (Never hides elements at the top while still on screen)
    const enterBottom = vh * 0.94;
    const resetBottom = vh * 0.98;
    for (let i = 0; i < animTargets.length; i++) {
      const el = animTargets[i];
      const rect = el.getBoundingClientRect();
      if (rect.top < enterBottom && rect.bottom > -20) {
        if (!el.classList.contains('is-inview')) {
          el.classList.add('is-inview');
        }
      } else if (rect.top >= resetBottom) {
        el.classList.remove('is-inview');
      }
    }

    // B. Bounded Hero Elements Scrub (Orientation-Safe for Vertical & Horizontal Screens)
    const heroProg = getSectionProgress(heroArchStage);
    const heroCentered = (heroProg - 0.5) * 2; // -1 to +1

    if (heroWordLeft) {
      const shiftX = Utils.clamp(-scrollVal * 0.12, -90, 0);
      const shiftY = Utils.clamp(scrollVal * 0.05, 0, 40);
      heroWordLeft.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0)`;
    }
    if (heroWordRight) {
      const shiftX = Utils.clamp(scrollVal * 0.12, 0, 90);
      const shiftY = Utils.clamp(scrollVal * 0.05, 0, 40);
      heroWordRight.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0)`;
    }
    if (heroSeal) {
      // Gentle upright wobble (-10deg to +10deg) so mascot is never upside-down
      heroSeal.style.setProperty('--scroll-rot', `${(heroCentered * 10).toFixed(1)}deg`);
    }
    if (heroSticker1) {
      heroSticker1.style.setProperty('--scroll-rot', `${(-7 - heroCentered * 3.5).toFixed(1)}deg`);
      heroSticker1.style.setProperty('--scroll-y', `${(-heroCentered * 5).toFixed(1)}px`);
    }
    if (heroSticker2) {
      heroSticker2.style.setProperty('--scroll-rot', `${(5 + heroCentered * 3.5).toFixed(1)}deg`);
      heroSticker2.style.setProperty('--scroll-y', `${(heroCentered * 5).toFixed(1)}px`);
    }

    if (window.innerWidth > 768) {
      if (orbitStrudel) {
        orbitStrudel.style.setProperty('--scroll-y', `${(-heroCentered * 5).toFixed(1)}px`);
        orbitStrudel.style.setProperty('--scroll-rot', `${(-1.5 + heroCentered * 1.2).toFixed(2)}deg`);
      }
      if (orbitQqball) {
        orbitQqball.style.setProperty('--scroll-y', `${(heroCentered * 5).toFixed(1)}px`);
        orbitQqball.style.setProperty('--scroll-rot', `${(1.5 - heroCentered * 1.2).toFixed(2)}deg`);
      }
    } else {
      if (orbitStrudel) {
        orbitStrudel.style.setProperty('--scroll-y', '0px');
        orbitStrudel.style.setProperty('--scroll-rot', '0deg');
      }
      if (orbitQqball) {
        orbitQqball.style.setProperty('--scroll-y', '0px');
        orbitQqball.style.setProperty('--scroll-rot', '0deg');
      }
    }

    // Euclidean modulo: always positive, preventing glitches on rubber-banding / bounce
    const mod = (n, m) => ((n % m) + m) % m;

    // C. Pastry Ribbon Marquee Scrub
    const r1W = ribbon1SetWidth || (ribbonTrack1 ? ribbonTrack1.scrollWidth / 6 : 0);
    if (ribbonTrack1 && r1W > 0) {
      const shift1 = -mod(scrollVal * 0.38, r1W);
      ribbonTrack1.style.transform = `translate3d(${shift1.toFixed(1)}px, 0, 0)`;
    }
    const r2W = ribbon2SetWidth || (ribbonTrack2 ? ribbonTrack2.scrollWidth / 6 : 0);
    if (ribbonTrack2 && r2W > 0) {
      // Scrub in opposite direction while keeping both left & right edges seamlessly covered
      const shift2 = -r2W + mod(scrollVal * 0.38, r2W);
      ribbonTrack2.style.transform = `translate3d(${shift2.toFixed(1)}px, 0, 0)`;
    }

    // D. Story Logo Halo Scrub
    if (storySection && storyHalo) {
      const p = getSectionProgress(storySection);
      const scale = 0.92 + Math.sin(p * Math.PI) * 0.16;
      storyHalo.style.transform = `rotate(${(p * 240).toFixed(1)}deg) scale(${scale.toFixed(3)})`;
    }

    // E. Gallery Polaroid Fan (Composable CSS Variables) & Filmstrip Loop
    if (galleryGrid) {
      if (window.innerWidth > 1024) {
        const p = getSectionProgress(galleryGrid);
        const spread = (p - 0.5) * 2;
        const baseAngles = [-4, 2.5, -2.5, 4];
        const baseY = [10, -8, -6, 10];

        polCards.forEach((card, idx) => {
          const rot = baseAngles[idx] + spread * (idx % 2 === 0 ? -5 : 5);
          const dy = baseY[idx] + spread * (idx % 2 === 0 ? -14 : 14);
          card.style.setProperty('--scroll-y', `${dy.toFixed(1)}px`);
          card.style.setProperty('--scroll-rot', `${rot.toFixed(2)}deg`);
        });
      } else {
        polCards.forEach((card) => {
          card.style.setProperty('--scroll-y', '0px');
          card.style.setProperty('--scroll-rot', '0deg');
        });
      }
    }

    const fsW = filmstripSetWidth || (filmstripTrack ? filmstripTrack.scrollWidth / 6 : 0);
    if (filmstripTrack && fsW > 0) {
      const loopShift = -mod(scrollVal * 0.42, fsW);
      filmstripTrack.style.transform = `translate3d(${loopShift.toFixed(1)}px, 0, 0)`;
    }
  }

  function animateScrollLoop() {
    currentScroll = Utils.lerp(currentScroll, targetScroll, 0.16);
    updateScrubbedElements(currentScroll);

    if (Math.abs(targetScroll - currentScroll) > 0.08) {
      requestAnimationFrame(animateScrollLoop);
    } else {
      currentScroll = targetScroll;
      updateScrubbedElements(currentScroll);
      isTicking = false;
    }
  }

  function requestTick() {
    targetScroll = window.scrollY;
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(animateScrollLoop);
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', () => {
    setupMarqueeTracks();
    requestTick();
  }, { passive: true });
  window.addEventListener('orientationchange', () => {
    setupMarqueeTracks();
    requestTick();
  }, { passive: true });
  window.addEventListener('load', () => {
    setupMarqueeTracks();
    requestTick();
  }, { passive: true });
  requestTick();
}

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

/* ----------------------------------------------------------------------------
 * 9. CART RENDERING & WHATSAPP ORDER MANAGEMENT
 * ------------------------------------------------------------------------- */
function renderDrawerCart() {
  const container = document.getElementById('drawer-cart-items');
  const totalEl = document.getElementById('drawer-cart-total');
  const badgeCountEl = document.getElementById('floating-cart-count');
  const navCountEl = document.getElementById('nav-cart-count');
  if (!container || !totalEl) return;

  const { items, grandTotal, totalItems, hasCustomItem } = Utils.getCartBreakdown();

  if (items.length === 0) {
    container.innerHTML = `<p class="drawer-empty-note">Keranjang masih kosong. Yuk pilih camilan dari dapur kami!</p>`;
  } else {
    container.innerHTML = items
      .map(({ key, prod, qty, subtotal }) => {
        const priceLabel = prod.isCustomPrice
          ? `${qty}x (Sesuai Request)`
          : `${qty} × ${Utils.formatRupiah(prod.price)} = ${Utils.formatRupiah(subtotal)}`;

        return `
          <div class="drawer-item-row">
            <div>
              <div>${prod.name}</div>
              <small class="drawer-item-sub">${priceLabel}</small>
            </div>
            <div class="drawer-item-controls">
              <button type="button" class="cart-step-btn" data-cart-dec="${key}">−</button>
              <span class="cart-step-qty">${qty}</span>
              <button type="button" class="cart-step-btn is-inc" data-cart-inc="${key}">+</button>
            </div>
          </div>
        `;
      })
      .join('');
  }

  // Update Total Label
  if (grandTotal > 0 && hasCustomItem) {
    totalEl.textContent = `${Utils.formatRupiah(grandTotal)} + Request`;
  } else if (grandTotal > 0) {
    totalEl.textContent = Utils.formatRupiah(grandTotal);
  } else if (hasCustomItem) {
    totalEl.textContent = 'Sesuai Request';
  } else {
    totalEl.textContent = 'Rp 0';
  }

  // Update Badge Counts
  const countStr = String(totalItems);
  if (badgeCountEl) badgeCountEl.textContent = countStr;
  if (navCountEl) navCountEl.textContent = countStr;
}

function applyStoreConfigToDOM() {
  const mapsLink = document.getElementById('maps-direct-link');
  if (mapsLink) {
    mapsLink.href = STORE_CONFIG.googleMapsUrl;
  }

  Object.keys(STORE_CONFIG.products).forEach((key) => {
    const prod = STORE_CONFIG.products[key];
    const priceEl = document.getElementById(`price-${key}-display`);
    if (priceEl) {
      priceEl.textContent = prod.isCustomPrice ? 'SESUAI REQUEST' : Utils.formatRupiah(prod.price);
    }
  });

  renderDrawerCart();
}

function initCartAndWhatsApp() {
  // Stepper increment/decrement on catalog cards
  document.querySelectorAll('.qty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      const input = document.getElementById(`qty-${id}`);
      if (!input) return;

      let current = parseInt(input.value, 10) || 1;
      current = action === 'inc' ? Math.min(50, current + 1) : Math.max(1, current - 1);
      input.value = String(current);
    });
  });

  // Add to cart button handler
  document.querySelectorAll('.add-cart-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const input = document.getElementById(`qty-${id}`);
      const qty = input ? parseInt(input.value, 10) || 1 : 1;

      cartState[id] = (cartState[id] || 0) + qty;
      renderDrawerCart();

      const originalText = btn.textContent;
      btn.textContent = '✓ MASUK KERANJANG';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1200);
    });
  });

  // Event delegation for cart item increment/decrement inside drawer
  const cartContainer = document.getElementById('drawer-cart-items');
  cartContainer?.addEventListener('click', (e) => {
    const decBtn = e.target.closest('[data-cart-dec]');
    if (decBtn) {
      const id = decBtn.getAttribute('data-cart-dec');
      if (cartState[id] > 0) {
        cartState[id]--;
        renderDrawerCart();
      }
      return;
    }

    const incBtn = e.target.closest('[data-cart-inc]');
    if (incBtn) {
      const id = incBtn.getAttribute('data-cart-inc');
      cartState[id] = (cartState[id] || 0) + 1;
      renderDrawerCart();
    }
  });

  // Direct WhatsApp order for single card
  document.querySelectorAll('.direct-wa-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const prod = STORE_CONFIG.products[id];
      if (!prod) return;

      const input = document.getElementById(`qty-${id}`);
      const qty = input ? parseInt(input.value, 10) || 1 : 1;

      const priceInfo = prod.isCustomPrice
        ? '• Harga: Sesuai request kue pastry yang dipilih'
        : `• Harga Satuan: ${Utils.formatRupiah(prod.price)}\n• Estimasi Total: *${Utils.formatRupiah(prod.price * qty)}*`;

      const msg = [
        `Halo Kak Bagas & Naylah (*${STORE_CONFIG.storeName}*)! 👋`,
        'Saya mau pesan lewat website:',
        '',
        `🥐 *${prod.name}*`,
        `• Jumlah: ${qty} ${prod.unit}`,
        priceInfo,
        '',
        'Apakah hari ini bisa diproses dari dapur BaNay Kak? Terima kasih!'
      ].join('\n');

      Utils.openWhatsApp(msg);
    });
  });

  // Drawer WhatsApp checkout
  document.getElementById('drawer-checkout-wa')?.addEventListener('click', () => {
    const { items, grandTotal, hasCustomItem } = Utils.getCartBreakdown();

    // If cart is empty (0 items), open WhatsApp directly with NO template message
    if (items.length === 0) {
      Utils.openWhatsApp('');
      return;
    }

    const lines = [
      `Halo Kak Bagas & Naylah (*${STORE_CONFIG.storeName}*)! 👋`,
      'Saya mau pesan menu homemade berikut dari website:',
      ''
    ];

    items.forEach(({ prod, qty, subtotal }) => {
      if (prod.isCustomPrice) {
        lines.push(`• *${prod.name}* (${qty}x) = _Harga sesuai request_`);
      } else {
        lines.push(`• *${prod.name}* (${qty} × ${Utils.formatRupiah(prod.price)}) = *${Utils.formatRupiah(subtotal)}*`);
      }
    });

    lines.push('');
    if (grandTotal > 0 && hasCustomItem) {
      lines.push(`*Total Sementara: ${Utils.formatRupiah(grandTotal)}* (+ All Pastry sesuai request)`);
    } else if (grandTotal > 0) {
      lines.push(`*Total Estimasi: ${Utils.formatRupiah(grandTotal)}*`);
    }

    lines.push('Mohon info ketersediaannya ya Kak. Terima kasih!');
    Utils.openWhatsApp(lines.join('\n'));
  });

  // Ask location via WhatsApp
  document.getElementById('ask-location-wa')?.addEventListener('click', () => {
    const msg = `Halo Kak Bagas & Naylah (*${STORE_CONFIG.storeName}*)! 👋 Saya mau tanya patokan rumah untuk Pick Up pesanan sesuai titik Google Maps (${STORE_CONFIG.googleMapsUrl}). Terima kasih!`;
    Utils.openWhatsApp(msg);
  });
}

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
