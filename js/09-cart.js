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
