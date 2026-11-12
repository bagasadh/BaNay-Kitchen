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
