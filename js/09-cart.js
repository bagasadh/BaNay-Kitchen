// Logika keranjang, WhatsApp order, filter kategori, toast & lightbox modal

// Toast notification helper
function showToast(text, actionText, actionCallback) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.setAttribute('role', 'status');

  const textSpan = document.createElement('span');
  textSpan.textContent = text;
  toast.appendChild(textSpan);

  if (actionText && actionCallback) {
    const actionBtn = document.createElement('button');
    actionBtn.type = 'button';
    actionBtn.className = 'toast-btn';
    actionBtn.textContent = actionText;
    actionBtn.addEventListener('click', () => {
      actionCallback();
      toast.remove();
    });
    toast.appendChild(actionBtn);
  }

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px) scale(0.95)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 260);
  }, 3800);
}

function renderDrawerCart() {
  const container = document.getElementById('drawer-cart-items');
  const countBadgeNav = document.getElementById('cart-count-badge');
  const countBadgeDrawer = document.getElementById('drawer-cart-badge');
  const totalDisplay = document.getElementById('drawer-total-price');
  const formQuick = document.getElementById('drawer-form-quick');
  const clearBtn = document.getElementById('drawer-clear-cart');
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
    if (formQuick) formQuick.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'none';
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
    if (formQuick) formQuick.style.display = 'flex';
    if (clearBtn) clearBtn.style.display = 'block';
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
    countBadgeDrawer.textContent = `${totalItems} item`;
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
    waLink.textContent = `WhatsApp: ${STORE_CONFIG.whatsappDisplay}`;
  }
}

function initMenuCategoryFilter() {
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const cards = document.querySelectorAll('.menu-arch-card');
  if (filterBtns.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter') || 'all';
      cards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('is-hidden-category');
        } else {
          card.classList.add('is-hidden-category');
        }
      });
    });
  });
}

function initGalleryLightbox() {
  const modal = document.getElementById('gallery-lightbox');
  const backdrop = document.getElementById('lightbox-backdrop');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const imgEl = document.getElementById('lightbox-img');
  const tagEl = document.getElementById('lightbox-tag');
  const priceEl = document.getElementById('lightbox-price');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');
  const addCartBtn = document.getElementById('lightbox-add-cart');
  const orderWaBtn = document.getElementById('lightbox-order-wa');

  if (!modal) return;

  let currentProductId = null;

  const openLightbox = (data) => {
    currentProductId = data.id || null;
    if (imgEl) {
      imgEl.src = data.img;
      imgEl.alt = data.title;
    }
    if (tagEl) tagEl.textContent = data.tag || 'PASTRY';
    if (priceEl) priceEl.textContent = data.price || '';
    if (titleEl) titleEl.textContent = data.title || '';
    if (descEl) descEl.textContent = data.desc || '';

    if (orderWaBtn) {
      const msg = `Halo BaNay Kitchen! Saya tertarik dengan ${data.title} (${data.price}). Apakah ready untuk dipesan?`;
      orderWaBtn.href = Utils.buildWhatsAppUrl(msg);
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    closeBtn?.focus();
  };

  const closeLightbox = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('[data-lightbox="true"]').forEach((card) => {
    const handler = (e) => {
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      if (e.type === 'keydown') e.preventDefault();

      openLightbox({
        img: card.getAttribute('data-img'),
        title: card.getAttribute('data-title'),
        tag: card.getAttribute('data-tag'),
        price: card.getAttribute('data-price'),
        desc: card.getAttribute('data-desc'),
        id: card.getAttribute('data-id')
      });
    };

    card.addEventListener('click', handler);
    card.addEventListener('keydown', handler);
  });

  closeBtn?.addEventListener('click', closeLightbox);
  backdrop?.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  addCartBtn?.addEventListener('click', () => {
    if (currentProductId && STORE_CONFIG.products[currentProductId]) {
      cartState[currentProductId] = (cartState[currentProductId] || 0) + 1;
      renderDrawerCart();
      const prodName = STORE_CONFIG.products[currentProductId].name;
      showToast(`✓ ${prodName} (1 box) masuk ke keranjang!`, 'Buka Keranjang', () => {
        closeLightbox();
        window.openBaNayDrawer?.();
      });
      closeLightbox();
    }
  });
}

function initCartAndWhatsApp() {
  renderDrawerCart();
  initMenuCategoryFilter();
  initGalleryLightbox();

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

  // Validasi input angka jika diketik langsung (clamp 1 - 50)
  document.querySelectorAll('.qty-stepper input').forEach((input) => {
    input.removeAttribute('readonly');
    input.addEventListener('change', () => {
      let val = parseInt(input.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 50) val = 50;
      input.value = String(val);
    });
  });

  // Tombol masuk keranjang
  document.querySelectorAll('.add-cart-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const input = document.getElementById(`qty-${id}`);
      const qty = input ? parseInt(input.value, 10) || 1 : 1;
      const prod = STORE_CONFIG.products[id];

      cartState[id] = (cartState[id] || 0) + qty;
      renderDrawerCart();

      const originalText = btn.textContent;
      btn.textContent = '✓ MASUK KERANJANG';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1200);

      const prodName = prod ? prod.name : 'Item';
      showToast(`✓ ${qty}x ${prodName} ditambahkan ke keranjang!`, 'Buka Keranjang', () => {
        window.openBaNayDrawer?.();
      });
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

  // Tombol kosongkan keranjang
  document.getElementById('drawer-clear-cart')?.addEventListener('click', () => {
    Object.keys(cartState).forEach((k) => (cartState[k] = 0));
    renderDrawerCart();
    showToast('Keranjang pesanan telah dikosongkan.');
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
        'Saya mau pesan langsung lewat website:',
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

  // Checkout keranjang via WhatsApp dengan detail Nama, Metode & Catatan
  document.getElementById('drawer-checkout-wa')?.addEventListener('click', () => {
    const { items, grandTotal, hasCustomItem } = Utils.getCartBreakdown();

    if (items.length === 0) {
      Utils.openWhatsApp('');
      return;
    }

    const customerName = document.getElementById('order-customer-name')?.value.trim();
    const deliveryMethod = document.getElementById('order-delivery-method')?.value || 'Ambil Sendiri (Pick Up)';
    const customerNotes = document.getElementById('order-customer-notes')?.value.trim();

    const lines = [
      `Halo Kak Bagas & Naylah (*${STORE_CONFIG.storeName}*)! 👋`,
      'Saya mau pesan menu homemade berikut dari website:'
    ];

    if (customerName) {
      lines.push(`• *Nama Pemesan:* ${customerName}`);
    }
    lines.push(`• *Metode Pengambilan:* ${deliveryMethod}`);
    if (customerNotes) {
      lines.push(`• *Catatan:* ${customerNotes}`);
    }

    lines.push('', '*Rincian Pesanan:*');

    items.forEach(({ prod, qty, subtotal }) => {
      if (prod.isCustomPrice) {
        lines.push(`- *${prod.name}* (${qty}x) = _Harga sesuai request_`);
      } else {
        lines.push(`- *${prod.name}* (${qty} × ${Utils.formatRupiah(prod.price)}) = *${Utils.formatRupiah(subtotal)}*`);
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
