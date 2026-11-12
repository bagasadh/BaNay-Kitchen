/* BaNay Kitchen - script.js */

// Konfigurasi toko & state keranjang
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

const cartState = {
  strudel: 0,
  crispy: 0,
  qqball: 0,
  bengroll: 0,
  allpastry: 0
};

// Helper fungsi umum
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

// Animasi teks & split typography
function initChoreographedAnimations() {
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

  const footerWord = document.getElementById('footer-brand-word');
  if (footerWord) {
    const chars = footerWord.textContent.trim().split('');
    footerWord.innerHTML = chars
      .map((c, i) => {
        if (c === ' ') return ' ';
        return `<span class="bouncy-char" style="--char-delay:${i * 45}ms">${c}</span>`;
      })
      .join('');
  }

  document.querySelectorAll('.bento-pillar').forEach((pillar, i) => {
    pillar.style.setProperty('--anim-delay', `${i * 120}ms`);
  });

  document.querySelectorAll('.menu-arch-card').forEach((card, i) => {
    card.style.setProperty('--anim-delay', `${(i % 2) * 140}ms`);
  });
}

// Scroll animations & marquee
function initScrollScrubbingEngine() {
  const progressBar = document.getElementById('scroll-progress-bar');
  const animTargets = Array.from(
    document.querySelectorAll('[data-anim], [data-anim-lines="true"], [data-anim-chars="true"]')
  );

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

    // Reveal animasi saat elemen masuk viewport
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

    // Hero section scroll effects
    const heroProg = getSectionProgress(heroArchStage);
    const heroCentered = (heroProg - 0.5) * 2;

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

    const mod = (n, m) => ((n % m) + m) % m;

    // Ribbon marquee scroll
    const r1W = ribbon1SetWidth || (ribbonTrack1 ? ribbonTrack1.scrollWidth / 6 : 0);
    if (ribbonTrack1 && r1W > 0) {
      const shift1 = -mod(scrollVal * 0.38, r1W);
      ribbonTrack1.style.transform = `translate3d(${shift1.toFixed(1)}px, 0, 0)`;
    }
    const r2W = ribbon2SetWidth || (ribbonTrack2 ? ribbonTrack2.scrollWidth / 6 : 0);
    if (ribbonTrack2 && r2W > 0) {
      const shift2 = -r2W + mod(scrollVal * 0.38, r2W);
      ribbonTrack2.style.transform = `translate3d(${shift2.toFixed(1)}px, 0, 0)`;
    }

    // Story logo rotation
    if (storySection && storyHalo) {
      const p = getSectionProgress(storySection);
      const scale = 0.92 + Math.sin(p * Math.PI) * 0.16;
      storyHalo.style.transform = `rotate(${(p * 240).toFixed(1)}deg) scale(${scale.toFixed(3)})`;
    }

    // Gallery polaroid fan & filmstrip
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
  });

  requestTick();
}

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

// Efek partikel emoji saat klik
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

// Menu samping & keranjang drawer
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

// Logika keranjang & WhatsApp order
function renderDrawerCart() {
  const container = document.getElementById('drawer-cart-items');
  const countBadgeNav = document.getElementById('cart-count-badge');
  const countBadgeDrawer = document.getElementById('drawer-cart-badge');
  const totalDisplay = document.getElementById('drawer-total-price');
  if (!container) return;

  const { items, grandTotal, totalItems, hasCustomItem } = Utils.getCartBreakdown();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-state">
        <span class="empty-cart-icon">🛒</span>
        <p>Keranjangmu masih kosong nih.</p>
        <a href="#menu" class="btn-warm btn-gold empty-browse-btn drawer-link">Pilih Menu Pastry</a>
      </div>
    `;
  } else {
    container.innerHTML = items
      .map(({ key, prod, qty, subtotal }) => {
        const subtotalText = prod.isCustomPrice ? 'Harga sesuai request' : Utils.formatRupiah(subtotal);
        return `
          <div class="drawer-cart-row">
            <div class="cart-row-info">
              <h4>${prod.name}</h4>
              <span class="cart-row-price">${subtotalText}</span>
            </div>
            <div class="cart-row-controls">
              <button type="button" class="cart-step-btn" data-cart-dec="${key}" aria-label="Kurangi ${prod.name}">−</button>
              <span class="cart-step-qty">${qty}</span>
              <button type="button" class="cart-step-btn" data-cart-inc="${key}" aria-label="Tambah ${prod.name}">+</button>
            </div>
          </div>
        `;
      })
      .join('');
  }

  if (totalDisplay) {
    if (grandTotal === 0 && !hasCustomItem) {
      totalDisplay.textContent = 'Rp 0';
    } else if (hasCustomItem && grandTotal === 0) {
      totalDisplay.textContent = 'Custom Order';
    } else if (hasCustomItem) {
      totalDisplay.textContent = `${Utils.formatRupiah(grandTotal)} + Custom`;
    } else {
      totalDisplay.textContent = Utils.formatRupiah(grandTotal);
    }
  }

  if (countBadgeNav) {
    countBadgeNav.textContent = String(totalItems);
    countBadgeNav.classList.toggle('has-items', totalItems > 0);
  }
  if (countBadgeDrawer) {
    countBadgeDrawer.textContent = String(totalItems);
  }
}

function applyStoreConfigToDOM() {
  document.querySelectorAll('[data-product-price]').forEach((el) => {
    const id = el.getAttribute('data-product-price');
    const prod = STORE_CONFIG.products[id];
    if (prod && !prod.isCustomPrice) {
      el.textContent = Utils.formatRupiah(prod.price);
    }
  });

  const waLink = document.getElementById('footer-wa-link');
  if (waLink) {
    waLink.href = Utils.buildWhatsAppUrl('Halo BaNay Kitchen! Mau tanya seputar pesanan.');
    waLink.textContent = STORE_CONFIG.whatsappDisplay;
  }
}

function initCartAndWhatsApp() {
  renderDrawerCart();

  // Tombol tambah/kurang qty di katalog
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

  // Tombol masuk keranjang
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

  // Event handler qty di dalam drawer
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

  // Order langsung via WA per kartu produk
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

  // Checkout keranjang via WhatsApp
  document.getElementById('drawer-checkout-wa')?.addEventListener('click', () => {
    const { items, grandTotal, hasCustomItem } = Utils.getCartBreakdown();

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

  // Tanya patokan via WhatsApp
  document.getElementById('ask-location-wa')?.addEventListener('click', () => {
    const msg = `Halo Kak Bagas & Naylah (*${STORE_CONFIG.storeName}*)! 👋 Saya mau tanya patokan rumah untuk Pick Up pesanan sesuai titik Google Maps (${STORE_CONFIG.googleMapsUrl}). Terima kasih!`;
    Utils.openWhatsApp(msg);
  });
}

// Inisialisasi aplikasi
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
