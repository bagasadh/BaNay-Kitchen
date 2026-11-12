// Build script untuk menggabungkan modul HTML, CSS, dan JS ke index.html, styles.css, dan script.js

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const TEMPLATE_PATH = path.join(ROOT_DIR, 'src', 'template.html');
const SECTIONS_DIR = path.join(ROOT_DIR, 'sections');
const CSS_DIR = path.join(ROOT_DIR, 'css');
const JS_DIR = path.join(ROOT_DIR, 'js');
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');

// Root outputs
const OUT_HTML = path.join(ROOT_DIR, 'index.html');
const OUT_CSS = path.join(ROOT_DIR, 'styles.css');
const OUT_JS = path.join(ROOT_DIR, 'script.js');

// Public outputs
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PUB_HTML = path.join(PUBLIC_DIR, 'index.html');
const PUB_CSS = path.join(PUBLIC_DIR, 'styles.css');
const PUB_JS = path.join(PUBLIC_DIR, 'script.js');
const PUB_ASSETS = path.join(PUBLIC_DIR, 'assets');

function ensurePublicDir() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
}

function buildHtml() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('Template not found:', TEMPLATE_PATH);
    return;
  }

  let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const includeRegex = /<!--\s*@include:\s*([^\s]+)\s*-->/g;

  template = template.replace(includeRegex, (match, relPath) => {
    const fullPath = path.join(ROOT_DIR, relPath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8').trim();
    } else {
      console.warn(`Include file not found: ${relPath}`);
      return match;
    }
  });

  fs.writeFileSync(OUT_HTML, template, 'utf8');
  fs.writeFileSync(PUB_HTML, template, 'utf8');
}

function buildCss() {
  if (!fs.existsSync(CSS_DIR)) return;
  const files = fs.readdirSync(CSS_DIR).filter((f) => f.endsWith('.css')).sort();

  const header = `/* BaNay Kitchen - styles.css */\n\n`;

  const contents = files.map((f) => {
    return fs.readFileSync(path.join(CSS_DIR, f), 'utf8').trim();
  });

  const fullCss = header + contents.join('\n\n') + '\n';
  fs.writeFileSync(OUT_CSS, fullCss, 'utf8');
  fs.writeFileSync(PUB_CSS, fullCss, 'utf8');
}

function buildJs() {
  if (!fs.existsSync(JS_DIR)) return;
  const files = fs.readdirSync(JS_DIR).filter((f) => f.endsWith('.js')).sort();

  const header = `/* BaNay Kitchen - script.js */\n\n`;

  const contents = files.map((f) => {
    return fs.readFileSync(path.join(JS_DIR, f), 'utf8').trim();
  });

  const fullJs = header + contents.join('\n\n') + '\n';
  fs.writeFileSync(OUT_JS, fullJs, 'utf8');
  fs.writeFileSync(PUB_JS, fullJs, 'utf8');
}

function syncAssets() {
  if (fs.existsSync(ASSETS_DIR)) {
    fs.cpSync(ASSETS_DIR, PUB_ASSETS, { recursive: true });
  }
  const icoPath = path.join(ROOT_DIR, 'favicon.ico');
  if (fs.existsSync(icoPath)) {
    fs.copyFileSync(icoPath, path.join(PUBLIC_DIR, 'favicon.ico'));
  }
}

function runBuild() {
  const start = performance.now();
  ensurePublicDir();
  buildHtml();
  buildCss();
  buildJs();
  syncAssets();
  const duration = (performance.now() - start).toFixed(2);
  console.log(`Build complete in ${duration}ms`);
}

// Watcher mode
if (process.argv.includes('--watch')) {
  runBuild();
  console.log('Watching for changes... (Ctrl+C to stop)');

  const watchDirs = [SECTIONS_DIR, CSS_DIR, JS_DIR, path.join(ROOT_DIR, 'src')];
  let debounceTimeout = null;

  watchDirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (filename && !filename.startsWith('.')) {
          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => {
            console.log(`Rebuilding: ${filename}`);
            runBuild();
          }, 40);
        }
      });
    }
  });
} else {
  runBuild();
}
