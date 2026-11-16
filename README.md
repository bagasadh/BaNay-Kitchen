# BaNay Kitchen

Menu catalog and WhatsApp ordering site for **BaNay Kitchen** (homemade pastries and desserts).

## Features
- Full product catalog with photos
- Shopping cart that sends orders directly to the admin's WhatsApp
- Responsive layout for phone, tablet, and desktop
- Interactive effects (card tilt, marquee text, click particles)
- Plain HTML5, CSS3, and Vanilla JavaScript without heavy frameworks

## Running Locally

### 1. Open in Browser
Open `index.html` directly, or start the local server:
```bash
npm start
# Runs at http://localhost:3000
```

### 2. Build Assets
Run after editing files in `sections/`, `css/`, or `js/`:
```bash
npm run build
```

Watch for changes and rebuild automatically:
```bash
npm run watch
```

## Folder Structure

```text
├── assets/         # Product photos & logo
├── css/            # Modular CSS files
├── js/             # Logic & interaction scripts
├── sections/       # HTML section partials
├── src/            # Master HTML template
├── public/         # Build output for hosting
├── index.html      # Entry HTML
├── styles.css      # Compiled CSS
├── script.js       # Compiled JS
└── build.js        # Simple build script
```
