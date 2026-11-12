# BaNay Kitchen 

Website katalog dan pemesanan WhatsApp untuk **BaNay Kitchen** (Homemade Pastry & Dessert Buatan Ibu).

---

## Menu
- **Banana Strudel** (Pastry pisang renyah isi cokelat lumer & taburan keju)
- **Banana Milk Crispy** (Puff pastry mangkuk susu vanila lembut)
- **QQ Ball Dessert** (Bola ubi ungu kenyal & kuah santan creamy)
- **Beng Roll Pastry** (Pastry gulung isi wafer Beng-Beng)
- **All Pastry** (Custom order aneka olahan kulit pastry)

---

## Fitur
- Katalog menu lengkap dengan foto produk
- Keranjang pesanan langsung kirim ke WhatsApp admin
- Desain responsif untuk HP, tablet, dan desktop
- Animasi interaktif (tilt effect, marquee text, particle click)
- Tanpa framework/library berat (pure HTML5, CSS3, Vanilla JS)

---

## Cara Menjalankan

### 1. Jalankan di browser
Buka file `index.html` langsung di browser, atau jalankan local server:
```bash
npm start
# Server berjalan di http://localhost:3000
```

### 2. Build file
Jika ada perubahan di folder `sections/`, `css/`, atau `js/`:
```bash
npm run build
```

Untuk auto-build saat file disimpan:
```bash
npm run watch
```

---

## Struktur Folder

```text
├── assets/         # Foto produk & logo
├── css/            # File CSS modular
├── js/             # Script logika & interaksi
├── sections/       # Komponen potongan HTML
├── src/            # Template master HTML
├── public/         # Output build (untuk hosting)
├── index.html      # File utama
├── styles.css      # Hasil compile CSS
├── script.js       # Hasil compile JS
└── build.js        # Script build sederhana
```
