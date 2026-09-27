console.log('🔥 TEST: gemini-chat.js loaded');

setTimeout(function() {
  console.log('🔥 TEST: 1.5s passed');
  
  var mount = document.createElement('div');
  mount.id = 'aroma-chat-bot-mount';
  document.body.appendChild(mount);
  
  var btn = document.createElement('button');
  btn.innerHTML = '✨';
  btn.style.position = 'fixed';
  btn.style.bottom = '24px';
  btn.style.right = '24px';
  btn.style.width = '60px';
  btn.style.height = '60px';
  btn.style.borderRadius = '50%';
  btn.style.background = '#0A2E1F';
  btn.style.color = '#FFFBF5';
  btn.style.border = '3px solid #B8963E';
  btn.style.fontSize = '24px';
  btn.style.zIndex = '999999';
  btn.style.cursor = 'pointer';
  btn.onclick = function() { alert('Button works!'); };
  
  mount.appendChild(btn);
  console.log('🔥 TEST: Button added!');
}, 1500);
