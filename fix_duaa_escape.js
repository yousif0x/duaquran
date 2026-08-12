const fs = require('fs');
const path = require('path');

let appSrc = fs.readFileSync(path.join(__dirname, 'app.src.js'), 'utf8');

const newRenderDuaaList = `function getCkKey(id) {
  if (id === 'morning' || id === 'istigfar') return 'ck-morning';
  if (id === 'evening') return 'ck-evening';
  if (id === 'rizq') return 'ck-rizq';
  if (id === 'study') return 'ck-study';
  if (id === 'exam') return 'ck-exam';
  return '';
}

function renderDuaaList() {
  const c = document.getElementById('duaa-list');
  if (!c) return;
  c.innerHTML = '';
  DUAAS.forEach(d => {
    const done = !!S.done['duaa-' + d.id];
    const el = document.createElement('div');
    el.className = 'duaa-card';
    el.innerHTML = \`<div class="duaa-category"><span>\${d.icon}</span> \${d.cat}</div>
      <div class="duaa-title">\${d.title}</div>
      <div class="duaa-text">\${d.text.replace(/\\n/g, '<br>')}</div>
      <div class="card-actions">
        <button class="btn btn-ghost" onclick="copyCard(this)">📋 نسخ</button>
        <button class="btn btn-primary \${done ? 'done' : ''}" onclick="markRead(this, 'duaa-\${d.id}', '\${getCkKey(d.id)}')">✅ تمت القراءة</button>
      </div>\`;
    c.appendChild(el);
  });
}`;

appSrc = appSrc.replace(/function renderDuaaList\(\) \{[\s\S]*?\n\}/, newRenderDuaaList);

fs.writeFileSync(path.join(__dirname, 'app.src.js'), appSrc, 'utf8');
fs.writeFileSync(path.join(__dirname, 'app.js'), appSrc, 'utf8');

try {
  new Function(appSrc);
  console.log('🎉 PERFECT! app.js HAS 0 SYNTAX ERRORS!');
} catch (e) {
  console.error('Syntax error:', e);
}
