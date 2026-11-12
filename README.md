# 🥐 BaNay Kitchen — Official Website & Developer Guide

Selamat datang di repositori resmi **BaNay Kitchen** (*Homemade Pastry & Dessert Buatan Ibu*).
Website ini dibangun dengan arsitektur **Modular Component Architecture** menggunakan teknologi web modern murni (*Vanilla HTML5, CSS3 Variables, dan Vanilla JavaScript ES6+*) tanpa ketergantungan framework pihak ketiga yang berat.

---

## ⚡ Quick Start (Zero Dependencies!)

Project ini 100% siap dijalankan langsung di browser tanpa perlu menjalankan `npm install`:

```bash
# 1. Jalankan live local server
npm start          # Membuka http://localhost:3000

# 2. Build ulang semua file (Selesai dalam ~15-20 milidetik)
npm run build      # Menjalankan build.js

# 3. Mode Watch (Otomatis compile saat file di sections/, css/, atau js/ disimpan)
npm run watch      # Atau: node build.js --watch
```

---

## 🎨 Konsep Desain & Fitur Utama

- **Cartoon Pop & Warm Editorial**: Menggabungkan palet warna cokelat dapur (*Deep Chocolate, Warm Mocha, Golden Crust, Soft Cream*) dengan estetika kartun pop yang ceria dan ramah.
- **60FPS High-Performance Animations**:
  - *Bidirectional Scroll Scrubbing*: Transisi elemen halus yang sinkron dengan kecepatan scroll pengunjung.
  - *Interactive 3D Perspective Tilt*: Kartu menu bergerak dinamis mengikuti posisi kursor mouse secara *smooth*.
  - *Tactile Touchscreen Feedback*: Respons sentuhan pegas instan (*spring bounce*) yang optimal untuk layar HP dan tablet.
  - *Particle Bursts*: Efek letupan partikel emoji pastry saat tombol pesanan ditekan.
- **Universal Mobile & Desktop Responsive**:
  - Kompatibel penuh untuk berbagai ukuran layar: smartphone (*iPhone Mini, Pro Max, Samsung Galaxy, Foldables*), tablet, hingga monitor ultrawide.
  - FAB (*Floating Action Button*) khusus mobile yang ergonomis dan ramah ibu jari.
- **Alur Order WhatsApp Cepat**:
  - Sistem keranjang dinamis client-side yang langsung merangkum total harga dan meneruskannya ke WhatsApp admin toko tanpa memerlukan database backend yang rumit.

---

## 📁 Struktur File & Arsitektur Modular

Untuk menjaga kode tetap bersih, mudah dirawat, dan cepat dimuat, source code dipecah menjadi modul-modul kecil:

### 1. Komponen HTML (`sections/` & `src/`)
Setiap bagian halaman dibuat sebagai komponen independen:
| File | Deskripsi |
| :--- | :--- |
| [`src/template.html`](src/template.html) | Master shell HTML, konfigurasi `<head>`, SEO meta tags, dan favicon |
| [`sections/01-preloader.html`](sections/01-preloader.html) | Animasi pembuka preloader |
| [`sections/02-navbar.html`](sections/02-navbar.html) | Floating cartoon navbar & indikator jumlah keranjang |
| [`sections/03-drawer.html`](sections/03-drawer.html) | Slide-out side drawer untuk navigasi & ringkasan keranjang |
| [`sections/04-hero.html`](sections/04-hero.html) | Hero headline, storytelling keluarga, dan showcase produk utama |
| [`sections/05-ribbon.html`](sections/05-ribbon.html) | Infinite running marquee pita pastry |
| [`sections/06-story.html`](sections/06-story.html) | Cerita asal-usul nama BaNay (Bagas & Naylah) dalam layout bento grid |
| [`sections/07-menu.html`](sections/07-menu.html) | Katalog menu signature (Strudel, Crispy, QQ Ball, Beng Roll, All Pastry) |
| [`sections/08-gallery.html`](sections/08-gallery.html) | Galeri foto polaroid interaktif dan infinite filmstrip |
| [`sections/09-location.html`](sections/09-location.html) | Informasi titik dapur (Google Maps) dan preview Instagram |
| [`sections/10-footer.html`](sections/10-footer.html) | Footer informasi kontak, jam operasional, dan brand wordmark |
| [`sections/11-floating-wa.html`](sections/11-floating-wa.html) | Tombol floating WhatsApp interaktif di pojok layar |

### 2. Modul Styling (`css/`)
Styling menggunakan CSS modern berbasis komponen terpisah:
| File | Deskripsi |
| :--- | :--- |
| [`css/01-variables.css`](css/01-variables.css) | Sistem warna, variabel tipografi, dan bayangan kartun |
| [`css/02-base.css`](css/02-base.css) | Global reset, container, dan dasar layout |
| [`css/03-preloader.css`](css/03-preloader.css) | Gaya tampilan preloader dan spinning seal |
| [`css/04-navbar.css`](css/04-navbar.css) | Navbar pill melayang dan tombol cartoon |
| [`css/05-drawer.css`](css/05-drawer.css) | Tampilan drawer slide-out dan daftar pesanan |
| [`css/06-badges.css`](css/06-badges.css) | Stiker miring, pill badges, dan tipografi editorial |
| [`css/07-hero.css`](css/07-hero.css) | Grid hero, arch frame produk, dan kartu pendamping |
| [`css/08-ribbon.css`](css/08-ribbon.css) | Animasi marquee ribbon 2 warna |
| [`css/09-story.css`](css/09-story.css) | Kartu bento, rotating logo halo, dan pilar keunggulan |
| [`css/10-menu.css`](css/10-menu.css) | Kartu menu arch, quantity stepper, dan tag harga |
| [`css/11-gallery.css`](css/11-gallery.css) | Pembatas cokelat bergelombang dan polaroid tilt |
| [`css/12-location.css`](css/12-location.css) | Iframe Google Maps terintegrasi dan kartu profil Instagram |
| [`css/13-footer.css`](css/13-footer.css) | Footer signature typography dan floating button |
| [`css/14-animations.css`](css/14-animations.css) | Engine transisi masuk, split text, dan tactile active state |
| [`css/15-responsive.css`](css/15-responsive.css) | Breakpoints adaptif untuk HP, tablet, dan desktop |
| [`css/16-reduced-motion.css`](css/16-reduced-motion.css) | Aksesibilitas preferensi pengguna (*reduced motion*) |

### 3. Modul Logika (`js/`)
JavaScript ditulis secara modular tanpa bundling tools eksternal:
| File | Deskripsi |
| :--- | :--- |
| [`js/01-config.js`](js/01-config.js) | Data konfigurasi toko (kontak, daftar produk, dan status harga) |
| [`js/02-utils.js`](js/02-utils.js) | Helper matematika (clamp, lerp), format Rupiah, dan URL generator |
| [`js/03-preloader.js`](js/03-preloader.js) | Manajemen progress loading dan transisi preloader |
| [`js/04-animations.js`](js/04-animations.js) | Utilitas pemecah baris teks untuk entrance typography |
| [`js/05-scroll-engine.js`](js/05-scroll-engine.js) | Engine scrubbing scroll 60FPS dengan optimasi requestAnimationFrame |
| [`js/06-tilt.js`](js/06-tilt.js) | Lerp matematika untuk 3D card tilt dan magnetic cursor tracking |
| [`js/07-burst.js`](js/07-burst.js) | Generator efek partikel emoji interaktif |
| [`js/08-drawer.js`](js/08-drawer.js) | Event handling buka/tutup laci keranjang |
| [`js/09-cart.js`](js/09-cart.js) | Manajemen state keranjang belanja dan checkout WhatsApp |
| [`js/10-main.js`](js/10-main.js) | Entry point inisialisasi aplikasi saat DOM siap |

---

## 🛠️ Build Script (`build.js`)

Skrip build bawaan Node.js tanpa dependensi eksternal:
- Menggabungkan `sections/` ke dalam `src/template.html` menghasilkan `index.html`.
- Menggabungkan file `css/*.css` menjadi satu file optimal `styles.css`.
- Menggabungkan file `js/*.js` menjadi `script.js`.
- Menyinkronkan seluruh output ke direktori `public/` untuk deployment statis di platform hosting seperti Vercel.

---

## 📄 Lisensi

Hak Cipta © 2026 **BaNay Kitchen**. Seluruh hak cipta dilindungi undang-undang.
