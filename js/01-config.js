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
