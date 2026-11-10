/**
 * ============================================================================
 * KONFIGURASI RESMI BANAY KITCHEN (BAGAS & NAYLAH HOMEMADE KITCHEN)
 * Nomor WA: 08124449609 | IG: @banay_kitchen | Lokasi: Dapur Rumah BaNay
 * ============================================================================
 */
const STORE_CONFIG = {
  storeName: 'BaNay Kitchen',
  whatsappNumber: '628124449609',
  whatsappDisplay: '0812-4449-609',
  instagramUrl: 'https://www.instagram.com/banay_kitchen?cplk=OTV3bjJnamZrZmNy',
  googleMapsUrl: 'https://maps.app.goo.gl/5kShEDrs7w14mmXK6',
  products: {
    strudel: {
      id: 'strudel',
      name: 'Banana Strudel',
      price: 65000,
      unit: 'box',
      isCustomPrice: false
    },
    crispy: {
      id: 'crispy',
      name: 'Banana Milk Crispy',
      price: 35000,
      unit: 'box',
      isCustomPrice: false
    },
    qqball: {
      id: 'qqball',
      name: 'QQ Ball Dessert',
      price: 12000,
      unit: 'porsi',
      isCustomPrice: false
    },
    bengroll: {
      id: 'bengroll',
      name: 'Beng Roll Pastry',
      price: 20000,
      unit: 'box',
      isCustomPrice: false
    },
    allpastry: {
      id: 'allpastry',
      name: 'All Pastry (Request Kue Kulit Pastry)',
      price: 0,
      unit: 'request',
      isCustomPrice: true
    }
  }
};

// State keranjang default (1 Banana Strudel + 1 Banana Milk Crispy = Rp 100.000)
const cartState = {
  strudel: 1,
  crispy: 1,
  qqball: 0,
  bengroll: 0,
  allpastry: 0
};

function formatRupiah(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function lerp(start, end, amt) {
  return start + (end - start) * amt;
}

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

/* ==========================================================================
   1. CARTOON BAKERY PRELOADER
   ========================================================================== */
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

/* ==========================================================================
   2. PER-ELEMENT CHOREOGRAPHED ENTRANCE & EXIT SYSTEM
   ========================================================================== */
function initChoreographedAnimations() {
  // Split Cartoon Headlines into Masked Bouncy Lines
  const headlines = document.querySelectorAll('.hero-editorial-title, .section-serif-title');
  headlines.forEach((heading) => {
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

  // Split Footer Signature Word into Bouncy Characters
  const footerWord = document.querySelector('.footer-giant-word');
  if (footerWord) {
    const text = footerWord.textContent.trim();
    footerWord.innerHTML = text
      .split('')
      .map((ch, idx) => {
        if (ch === ' ') return '&nbsp;';
        return `<span class="bouncy-char" style="--char-delay:${idx * 55}ms">${ch}</span>`;
      })
      .join('');
    footerWord.setAttribute('data-anim-chars', 'true');
  }

  // Staggered delays for grid items
  document.querySelectorAll('.bento-pillar').forEach((el, idx) => {
    el.style.setProperty('--anim-delay', `${idx * 115}ms`);
  });

  document.querySelectorAll('.menu-arch-card').forEach((el, idx) => {
    el.style.setProperty('--anim-delay', `${(idx % 2) * 115}ms`);
  });

  document.querySelectorAll('.gallery-polaroid').forEach((el, idx) => {
    el.style.setProperty('--anim-delay', `${idx * 95}ms`);
  });

  document.querySelectorAll('.ig-thumb').forEach((el, idx) => {
    el.setAttribute('data-anim', 'pop-scale');
    el.style.setProperty('--anim-delay', `${idx * 85}ms`);
  });

  document.querySelectorAll('.footer-nav-col a').forEach((el, idx) => {
    el.setAttribute('data-anim', 'fade-up');
    el.style.setProperty('--anim-delay', `${idx * 50}ms`);
  });
}

/* ==========================================================================
   3. 60FPS BIDIRECTIONAL SCROLL-SCRUBBING ENGINE (FORWARD DOWN, REVERSE UP)
   ========================================================================== */
function initScrollScrubbingEngine() {
  const progressBar = document.getElementById('scroll-progress-bar');

  const animTargets = Array.from(
    document.querySelectorAll('[data-anim], [data-anim-lines="true"], [data-anim-chars="true"]')
  );

  // Scrub Elements
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

  window.addEventListener(
    'scroll',
    () => {
      targetScroll = window.scrollY;
    },
    { passive: true }
  );

  function getSectionProgress(el) {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return clamp((vh - rect.top) / (vh + rect.height), 0, 1);
  }

  function animateScrollLoop() {
    currentScroll = lerp(currentScroll, targetScroll, 0.14);

    const vh = window.innerHeight;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    const pct = clamp((currentScroll / maxScroll) * 100, 0, 100);

    if (progressBar) {
      progressBar.style.width = `${pct.toFixed(2)}%`;
    }

    // A. Bidirectional Entrance & Exit for Every Element
    for (let i = 0; i < animTargets.length; i++) {
      const el = animTargets[i];
      const rect = el.getBoundingClientRect();
      const enterBottom = vh * 0.92;
      const exitTop = 40;

      if (rect.top < enterBottom && rect.bottom > exitTop) {
        el.classList.add('is-inview');
        el.classList.remove('exit-top');
      } else if (rect.bottom <= exitTop) {
        el.classList.remove('is-inview');
        el.classList.add('exit-top');
      } else if (rect.top >= enterBottom) {
        el.classList.remove('is-inview', 'exit-top');
      }
    }

    // B. Hero Backdrop Typography, Stickers, Seal & Orbiting Cards Scrub
    if (heroWordLeft) {
      heroWordLeft.style.transform = `translate3d(${(-currentScroll * 0.16).toFixed(1)}px, ${(currentScroll * 0.08).toFixed(1)}px, 0)`;
    }
    if (heroWordRight) {
      heroWordRight.style.transform = `translate3d(${(currentScroll * 0.16).toFixed(1)}px, ${(currentScroll * 0.08).toFixed(1)}px, 0)`;
    }
    if (heroSeal) {
      heroSeal.style.transform = `rotate(${(currentScroll * 0.3).toFixed(1)}deg)`;
    }
    if (heroSticker1) {
      heroSticker1.style.transform = `rotate(${(-11 - currentScroll * 0.03).toFixed(1)}deg) translateY(${(-currentScroll * 0.05).toFixed(1)}px)`;
    }
    if (heroSticker2) {
      heroSticker2.style.transform = `rotate(${(7 + currentScroll * 0.03).toFixed(1)}deg) translateY(${(currentScroll * 0.04).toFixed(1)}px)`;
    }
    if (orbitStrudel && !orbitStrudel.matches(':hover')) {
      const y1 = -currentScroll * 0.11;
      const r1 = -6 + currentScroll * 0.025;
      orbitStrudel.style.transform = `translate3d(0, ${y1.toFixed(1)}px, 0) rotate(${r1.toFixed(2)}deg)`;
    }
    if (orbitQqball && !orbitQqball.matches(':hover')) {
      const y2 = currentScroll * 0.09;
      const r2 = 6 - currentScroll * 0.025;
      orbitQqball.style.transform = `translate3d(0, ${y2.toFixed(1)}px, 0) rotate(${r2.toFixed(2)}deg)`;
    }

    // C. Bidirectional Ribbon Marquee Scrub
    if (ribbonTrack1) {
      const shift1 = -((currentScroll * 0.38) % 600);
      ribbonTrack1.style.transform = `translate3d(${shift1.toFixed(1)}px, 0, 0)`;
    }
    if (ribbonTrack2) {
      const shift2 = -320 + ((currentScroll * 0.38) % 600);
      ribbonTrack2.style.transform = `translate3d(${shift2.toFixed(1)}px, 0, 0)`;
    }

    // D. Story Section Halo Spin & Scale Scrub
    if (storySection && storyHalo) {
      const p = getSectionProgress(storySection);
      const scale = 0.92 + Math.sin(p * Math.PI) * 0.16;
      storyHalo.style.transform = `rotate(${(p * 240).toFixed(1)}deg) scale(${scale.toFixed(3)})`;
    }

    // E. Centered 4-Card Polaroid Fan Scrub + Seamless Infinite Filmstrip Loop
    if (galleryGrid && window.innerWidth > 1024) {
      const p = getSectionProgress(galleryGrid);
      const spread = (p - 0.5) * 2; // -1 to +1
      const baseAngles = [-4, 2.5, -2.5, 4];
      const baseY = [10, -8, -6, 10];

      polCards.forEach((card, idx) => {
        if (!card.matches(':hover') && card.classList.contains('is-inview')) {
          const rot = baseAngles[idx] + spread * (idx % 2 === 0 ? -5 : 5);
          const dy = baseY[idx] + spread * (idx % 2 === 0 ? -14 : 14);
          card.style.transform = `translate3d(0, ${dy.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
        }
      });
    }

    if (filmstripTrack) {
      // Seamless modulo loop so the strip ALWAYS fills 100% of screen width with zero empty space!
      const halfWidth = Math.max(600, filmstripTrack.scrollWidth / 2);
      const loopShift = -((currentScroll * 0.42) % halfWidth);
      filmstripTrack.style.transform = `translate3d(${loopShift.toFixed(1)}px, 0, 0)`;
    }

    requestAnimationFrame(animateScrollLoop);
  }

  requestAnimationFrame(animateScrollLoop);
}

/* ==========================================================================
   4. 3D PERSPECTIVE TILT CARDS & MAGNETIC BUTTONS
   ========================================================================== */
function init3DTiltAndMagnetic() {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  const warmBtns = document.querySelectorAll('.btn-warm');
  warmBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${(dx * 0.16).toFixed(1)}px, ${(dy * 0.22 - 2).toFixed(1)}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE PASTRY EMOJI BURST ON CLICK
   ========================================================================== */
function initInteractiveBurst() {
  const icons = ['🥐', '🍌', '🍫', '🧀', '✨', '🍨'];

  function spawnBurst(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.className = 'click-particle';
      particle.textContent = icons[Math.floor(Math.random() * icons.length)];

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const distance = 40 + Math.random() * 60;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 30;
      const rot = (Math.random() - 0.5) * 130;

      particle.style.left = `${x - 12}px`;
      particle.style.top = `${y - 12}px`;
      particle.style.setProperty('--tx', `${tx.toFixed(0)}px`);
      particle.style.setProperty('--ty', `${ty.toFixed(0)}px`);
      particle.style.setProperty('--rot', `${rot.toFixed(0)}deg`);

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 850);
    }
  }

  document
    .querySelectorAll(
      '.add-cart-btn, .direct-wa-btn, .qty-btn, .bouncy-char, .story-main-logo, .rotating-seal-badge, .cartoon-sticker'
    )
    .forEach((el) => {
      el.addEventListener('click', (e) => {
        spawnBurst(e.clientX, e.clientY, 6);
      });
    });
}

/* ==========================================================================
   6. SLIDE-OUT MENU & CART DRAWER
   ========================================================================== */
function initDrawerMenu() {
  const openBtn = document.getElementById('open-menu-btn');
  const closeBtn = document.getElementById('close-menu-btn');
  const floatingWaBtn = document.getElementById('floating-wa-btn');
  const drawer = document.getElementById('side-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    drawer?.classList.add('is-open');
    backdrop?.classList.add('is-open');
  }

  function closeDrawer() {
    drawer?.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
  }

  openBtn?.addEventListener('click', openDrawer);
  floatingWaBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   7. WHATSAPP ORDER & CART CALCULATOR
   ========================================================================== */
function applyStoreConfigToDOM() {
  const mapsLink = document.getElementById('maps-direct-link');
  if (mapsLink) {
    mapsLink.href = STORE_CONFIG.googleMapsUrl;
  }

  Object.keys(STORE_CONFIG.products).forEach((key) => {
    const prod = STORE_CONFIG.products[key];
    const priceEl = document.getElementById(`price-${key}-display`);
    if (priceEl) {
      priceEl.textContent = prod.isCustomPrice ? 'SESUAI REQUEST' : formatRupiah(prod.price);
    }
  });

  renderDrawerCart();
}

function renderDrawerCart() {
  const container = document.getElementById('drawer-cart-items');
  const totalEl = document.getElementById('drawer-cart-total');
  const badgeCountEl = document.getElementById('floating-cart-count');
  const navCountEl = document.getElementById('nav-cart-count');
  if (!container || !totalEl) return;

  container.innerHTML = '';
  let grandTotal = 0;
  let totalItems = 0;
  let hasCustomItem = false;

  Object.keys(STORE_CONFIG.products).forEach((key) => {
    const prod = STORE_CONFIG.products[key];
    const qty = cartState[key] || 0;
    if (qty > 0) {
      totalItems += qty;
      const subtotal = prod.isCustomPrice ? 0 : prod.price * qty;
      grandTotal += subtotal;
      if (prod.isCustomPrice) hasCustomItem = true;

      const priceLabel = prod.isCustomPrice
        ? `${qty}x (Sesuai Request)`
        : `${qty} × ${formatRupiah(prod.price)} = ${formatRupiah(subtotal)}`;

      const row = document.createElement('div');
      row.className = 'drawer-item-row';
      row.innerHTML = `
        <div>
          <div>${prod.name}</div>
          <small style="color:var(--ink-muted);">${priceLabel}</small>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <button type="button" data-cart-dec="${key}" style="padding:2px 8px;border-radius:6px;border:1.5px solid var(--choco-deep);background:var(--cream);color:var(--choco-deep);font-weight:800;cursor:pointer;">−</button>
          <span style="min-width:18px;text-align:center;">${qty}</span>
          <button type="button" data-cart-inc="${key}" style="padding:2px 8px;border-radius:6px;border:1.5px solid var(--choco-deep);background:var(--gold);color:var(--choco-deep);font-weight:800;cursor:pointer;">+</button>
        </div>
      `;
      container.appendChild(row);
    }
  });

  if (totalItems === 0) {
    container.innerHTML = `<p style="font-size:0.86rem;color:var(--ink-muted);">Keranjang masih kosong. Yuk pilih camilan dari dapur kami!</p>`;
  }

  if (grandTotal > 0 && hasCustomItem) {
    totalEl.textContent = `${formatRupiah(grandTotal)} + Request`;
  } else if (grandTotal > 0) {
    totalEl.textContent = formatRupiah(grandTotal);
  } else if (hasCustomItem) {
    totalEl.textContent = 'Sesuai Request';
  } else {
    totalEl.textContent = 'Rp 0';
  }

  if (badgeCountEl) badgeCountEl.textContent = String(totalItems);
  if (navCountEl) navCountEl.textContent = String(totalItems);

  container.querySelectorAll('[data-cart-dec]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-cart-dec');
      if (cartState[id] > 0) {
        cartState[id]--;
        renderDrawerCart();
      }
    });
  });

  container.querySelectorAll('[data-cart-inc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-cart-inc');
      cartState[id] = (cartState[id] || 0) + 1;
      renderDrawerCart();
    });
  });
}

function buildWhatsAppUrl(message) {
  const cleanPhone = STORE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

function initCartAndWhatsApp() {
  document.querySelectorAll('.qty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      const input = document.getElementById(`qty-${id}`);
      if (!input) return;

      let current = parseInt(input.value, 10) || 1;
      if (action === 'inc') current = Math.min(50, current + 1);
      if (action === 'dec') current = Math.max(1, current - 1);
      input.value = String(current);
    });
  });

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

  document.querySelectorAll('.direct-wa-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const prod = STORE_CONFIG.products[id];
      if (!prod) return;
      const input = document.getElementById(`qty-${id}`);
      const qty = input ? parseInt(input.value, 10) || 1 : 1;

      const priceInfo = prod.isCustomPrice
        ? `• Harga: Sesuai request kue pastry yang dipilih`
        : `• Harga Satuan: ${formatRupiah(prod.price)}\n• Estimasi Total: *${formatRupiah(prod.price * qty)}*`;

      const msg = [
        `Halo Kak Bagas & Naylah (*${STORE_CONFIG.storeName}*)! 👋`,
        `Saya mau pesan lewat website:`,
        ``,
        `🥐 *${prod.name}*`,
        `• Jumlah: ${qty} ${prod.unit}`,
        priceInfo,
        ``,
        `Apakah hari ini bisa diproses dari dapur BaNay Kak? Terima kasih!`
      ].join('\n');

      window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
    });
  });

  const drawerCheckoutBtn = document.getElementById('drawer-checkout-wa');
  drawerCheckoutBtn?.addEventListener('click', () => {
    const lines = [
      `Halo Kak Bagas & Naylah (*${STORE_CONFIG.storeName}*)! 👋`,
      `Saya mau pesan menu homemade berikut dari website:`,
      ``
    ];

    let grandTotal = 0;
    let hasItems = false;
    let hasCustom = false;

    Object.keys(STORE_CONFIG.products).forEach((key) => {
      const qty = cartState[key] || 0;
      if (qty > 0) {
        hasItems = true;
        const prod = STORE_CONFIG.products[key];
        if (prod.isCustomPrice) {
          hasCustom = true;
          lines.push(`• *${prod.name}* (${qty}x) = _Harga sesuai request_`);
        } else {
          const sub = prod.price * qty;
          grandTotal += sub;
          lines.push(`• *${prod.name}* (${qty} × ${formatRupiah(prod.price)}) = *${formatRupiah(sub)}*`);
        }
      }
    });

    if (!hasItems) {
      lines.push(`• 1x Banana Strudel (Rp 65.000)`);
      lines.push(`• 1x Banana Milk Crispy (Rp 35.000)`);
      grandTotal = 100000;
    }

    lines.push(``);
    if (grandTotal > 0 && hasCustom) {
      lines.push(`*Total Sementara: ${formatRupiah(grandTotal)}* (+ All Pastry sesuai request)`);
    } else if (grandTotal > 0) {
      lines.push(`*Total Estimasi: ${formatRupiah(grandTotal)}*`);
    }

    lines.push(`Mohon info ketersediaannya ya Kak. Terima kasih!`);

    window.open(buildWhatsAppUrl(lines.join('\n')), '_blank', 'noopener,noreferrer');
  });

  const customForm = document.getElementById('custom-wa-form');
  customForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cust-name')?.value.trim() || 'Pelanggan BaNay Kitchen';
    const delivery = document.getElementById('cust-delivery')?.value || 'Ambil di Rumah (Pick Up ke Dapur BaNay)';
    const note = document.getElementById('cust-note')?.value.trim() || '-';

    const itemLines = [];
    let grandTotal = 0;
    let hasCustom = false;

    Object.keys(STORE_CONFIG.products).forEach((key) => {
      const qty = cartState[key] || 0;
      if (qty > 0) {
        const prod = STORE_CONFIG.products[key];
        if (prod.isCustomPrice) {
          hasCustom = true;
          itemLines.push(`• *${prod.name}* (${qty}x - Sesuai request)`);
        } else {
          const sub = prod.price * qty;
          grandTotal += sub;
          itemLines.push(`• *${prod.name}* (${qty} × ${formatRupiah(prod.price)}) = ${formatRupiah(sub)}`);
        }
      }
    });

    const totalLine =
      grandTotal > 0
        ? `*Estimasi Total: ${formatRupiah(grandTotal)}${hasCustom ? ' + Request All Pastry' : ''}*`
        : `*Harga: Sesuai request All Pastry*`;

    const msg = [
      `Halo Kak Bagas & Naylah (*${STORE_CONFIG.storeName}*)! 👋`,
      `Perkenalkan saya *${name}*, mau pesan:`,
      ``,
      ...(itemLines.length ? itemLines : ['• Banana Strudel (Rp 65.000) & Banana Milk Crispy (Rp 35.000)']),
      totalLine,
      ``,
      `🏠 *Metode:* ${delivery}`,
      `📝 *Catatan / Request:* ${note}`,
      ``,
      `Mohon dibantu proses pesanannya dari dapur BaNay ya Kak. Terima kasih!`
    ].join('\n');

    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  });

  const askLocBtn = document.getElementById('ask-location-wa');
  askLocBtn?.addEventListener('click', () => {
    const msg = `Halo Kak Bagas & Naylah (*${STORE_CONFIG.storeName}*)! 👋 Saya mau tanya patokan rumah untuk Pick Up pesanan sesuai titik Google Maps (${STORE_CONFIG.googleMapsUrl}). Terima kasih!`;
    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  });
}
