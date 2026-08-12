const fs = require('fs');
const path = require('path');

let code = fs.readFileSync(path.join(__dirname, 'app.src.js'), 'utf8');

// Ensure launchApp is present
if (!code.includes('function launchApp')) {
  const launchAppCode = `
function launchApp() {
  const h = document.getElementById('hero');
  if (h) {
    h.style.opacity = '0';
    h.style.transition = 'opacity .6s';
    setTimeout(() => {
      h.style.display = 'none';
      const a = document.getElementById('app');
      if (a) a.classList.remove('hidden');
      window.scrollTo(0, 0);
      toast('أهلاً وسهلاً 🌿 بارك الله في يومك');
    }, 600);
  }
}
`;
  code = launchAppCode + '\n' + code;
}

// Remove old Object.assign if present
const assignIdx = code.indexOf('Object.assign(window');
if (assignIdx !== -1) {
  code = code.substring(0, assignIdx);
}

// Append window exports
const windowExports = `
Object.assign(window, {
  launchApp, renderCanvas, go, toggleDark, applyDark, chFont, applyFontScale,
  toggleAthan, updateAthanBtn, playAthan, pomoStart, pomoPause, pomoReset, tapDhikr, resetDhikr,
  markDhikrDone, tapWird, resetWird, tapLan, tapSalam, markRead, copyCard, toggleCL, updateTrackerUI,
  updateStreak, renderWeekGrid, updateNavStreak, launchConfetti, newDay, openKhatmahReader, doneKhatmah,
  resetKhatmah, filterSurahs, renderQuranIndex, renderReciterRow, randomReciter, openReader,
  renderReaderContent, changeReaderReciter, pickRandomReaderReciter, readerPrev, readerNext, closeReader,
  openTasbih, closeTasbih, setTasbih, tapTasbih, resetTasbih, toggleStudy, saveIstiNote, clearIstiNote,
  loadIstiNote, openReminder, closeReminder, saveReminders, testNotif, sendAiMessage, sendQuickQ
});
`;

code += '\n' + windowExports;
fs.writeFileSync(path.join(__dirname, 'app.src.js'), code, 'utf8');

// Generate obfuscated app.js using eval instead of new Function
const b64Js = Buffer.from(code, 'utf8').toString('base64');
const obfJs = `(function(){var _0x4f2a=['${b64Js}'];(function(_0x2d8f,_0x4f2a){var _0x3b1c=function(_0x1a2b){while(--_0x1a2b){_0x2d8f['push'](_0x2d8f['shift']());}};_0x3b1c(++_0x4f2a);}(_0x4f2a,0x1f4));var _code=decodeURIComponent(escape(atob(_0x4f2a[0])));eval(_code);})();`;
fs.writeFileSync(path.join(__dirname, 'app.js'), obfJs, 'utf8');

console.log('✅ app.js successfully fixed with eval & window exports!');
