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
