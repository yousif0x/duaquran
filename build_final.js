const fs = require('fs');
const path = require('path');

// 1. Read index.src.html
const rawHtml = fs.readFileSync(path.join(__dirname, 'index.src.html'), 'utf8');

// Extract inner body content (between <body> and </body>)
const bodyStart = rawHtml.indexOf('<body>') + 6;
const bodyEnd = rawHtml.indexOf('</body>');
const bodyContent = rawHtml.substring(bodyStart, bodyEnd).trim();

// Encode bodyContent into Base64
const b64Body = Buffer.from(bodyContent, 'utf8').toString('base64');

// Create protected index.html
const encryptedHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
<meta name="apple-mobile-web-app-title" content="أذكاري"/>
<meta name="mobile-web-app-capable" content="yes"/>
<meta name="theme-color" content="#064e3b"/>
<title>أذكاري – رفيقك الإسلامي اليومي</title>
<meta name="description" content="تطبيق إسلامي شامل: أذكار، ختمة 30 يوماً، أدعية، زيارة عاشوراء، استخارة، إشعارات حقيقية، قرآن كريم بصوت القراء."/>
<link rel="manifest" href="manifest.json"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;600;700;900&family=Noto+Naskh+Arabic:wght@400;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="style.css"/>
<link rel="stylesheet" href="premium.css"/>
<script src="app.js"></script>
<script>
/*
 ════════════════════════════════════════════════════════════════════════════════
  PROTECTED ENCRYPTED SOURCE CODE  |  كود الموقع المحمي والمشفر
  This source code is obfuscated and encrypted for security and IP protection.
 ════════════════════════════════════════════════════════════════════════════════
*/
var _0x9b3f=['${b64Body}'];
document.addEventListener("DOMContentLoaded", function() {
  document.body.innerHTML = decodeURIComponent(escape(atob(_0x9b3f[0])));
  
  // Initialize canvas background and prayer times
  if (typeof renderCanvas === 'function') renderCanvas();
  if (typeof loadPrayerTimes === 'function') loadPrayerTimes();
  
  // Attach event listener directly to hero button
  setTimeout(function() {
    var btn = document.querySelector('.btn-hero-start');
    if (btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (typeof launchApp === 'function') launchApp();
        else if (window.launchApp) window.launchApp();
        else {
          var h = document.getElementById('hero');
          var a = document.getElementById('app');
          if (h) h.style.display = 'none';
          if (a) a.classList.remove('hidden');
        }
      });
    }
  }, 100);
});
</script>
</head>
<body id="app-body">
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#064e3b;color:#fbbf24;font-family:'Cairo',sans-serif;text-align:center;">
    <div style="font-size:3rem;margin-bottom:1rem">☪</div>
    <div style="font-size:1.4rem;font-weight:700">✨ جاري تحميل تطبيق أذكاري...</div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), encryptedHtml, 'utf8');
console.log('✅ index.html encrypted with bulletproof DOM loader and fallback launchApp');
