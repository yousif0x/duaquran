const fs = require('fs');
const path = require('path');

// 1. UPDATE app.src.js & app.js
let appSrc = fs.readFileSync(path.join(__dirname, 'app.src.js'), 'utf8');

const newLaunchApp = `window.launchApp = function launchApp() {
  const h = document.getElementById('hero');
  const a = document.getElementById('app');
  if (h) h.style.display = 'none';
  if (a) {
    a.classList.remove('hidden');
    a.style.display = 'block';
  }
  window.scrollTo(0, 0);
  try { toast('أهلاً وسهلاً 🌿 بارك الله في يومك'); } catch(e) {}
};`;

appSrc = appSrc.replace(/function launchApp\(\) \{[\s\S]*?\} else if \(a\) \{\s*a\.classList\.remove\('hidden'\);\s*\}\s*\}/, newLaunchApp);

fs.writeFileSync(path.join(__dirname, 'app.src.js'), appSrc, 'utf8');
fs.writeFileSync(path.join(__dirname, 'app.js'), appSrc, 'utf8');

// 2. UPDATE index.html
let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
html = html.replace(
  'onclick="launchApp()"',
  'type="button" onclick="window.launchApp ? window.launchApp() : (document.getElementById(\'hero\').style.display=\'none\', document.getElementById(\'app\').classList.remove(\'hidden\'))"'
);
fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');

// 3. UPDATE style.css to ensure button has z-index and pointer-events
let css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
if (!css.includes('.btn-hero-start { pointer-events: auto')) {
  css = css.replace('.btn-hero-start {', '.btn-hero-start {\n  position: relative; z-index: 100; pointer-events: auto;');
  fs.writeFileSync(path.join(__dirname, 'style.css'), css, 'utf8');
}

console.log('✅ launchApp button fixed successfully!');
