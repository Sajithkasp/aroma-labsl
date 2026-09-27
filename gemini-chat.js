/*************************************************************
 * AROMA LAB — AI Chat Bot (FIXED)
 * File: gemini-chat.js
 * Pure JavaScript — React නැහැ, Babel නැහැ
 *************************************************************/

// ============================================================
// CONFIG
// ============================================================

var GC_EDGE_URL = 'https://vibfavfsutpkqfoxpcyz.supabase.co/functions/v1/gemini-chat';
var GC_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpYmZhdmZzdXRwa3Fmb3hwY3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzQwNDQsImV4cCI6MjEwNTY1MDA0NH0.kZ3GNZ5r7ZzJXI2doWXQSF5itHAA4JntMWEtvUIlsDM';

var GC_STATE = {
  isOpen: false,
  language: 'english',
  messages: [],
  products: [],
  botSettings: null,
  isLoading: false
};

// ============================================================
// LOAD DATA FROM SUPABASE
// ============================================================

async function gcLoadProducts() {
  try {
    var res = await window.supabaseClient
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    if (res.error) return [];
    return res.data || [];
  } catch (e) {
    return [];
  }
}

async function gcLoadBotSettings() {
  try {
    var res = await window.supabaseClient
      .from('bot_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (res.error) {
      return { system_prompt: '', welcome_message: "Hi! I'm AROMA Assistant. How can I help you today? 🌸" };
    }
    return res.data || { system_prompt: '', welcome_message: "Hi! I'm AROMA Assistant. How can I help you today? 🌸" };
  } catch (e) {
    return { system_prompt: '', welcome_message: "Hi! I'm AROMA Assistant. How can I help you today? 🌸" };
  }
}

// ============================================================
// BUILD SYSTEM PROMPT
// ============================================================

function gcBuildSystemPrompt(products, customPrompt, language) {
  var productsList = '\n=== AROMA LAB PRODUCTS ===\n\n';

  if (products && products.length > 0) {
    products.forEach(function(p, i) {
      productsList += (i + 1) + '. ' + (p.name || 'Unknown') + '\n';
      if (p.category) productsList += '   Category: ' + p.category + '\n';
      if (p.product_type) productsList += '   Type: ' + p.product_type + '\n';
      if (p.description) productsList += '   Tagline: ' + p.description + '\n';
      if (p.top_notes) productsList += '   Top Notes: ' + p.top_notes + '\n';
      if (p.heart_notes) productsList += '   Heart Notes: ' + p.heart_notes + '\n';
      if (p.base_notes) productsList += '   Base Notes: ' + p.base_notes + '\n';
      var price = Number(p.selling_price) || Number(p.price) || 1500;
      productsList += '   Price: Rs. ' + price + '\n\n';
    });
  } else {
    productsList += 'No products available currently.\n';
  }

  var langInstr = '';
  if (language === 'sinhala') {
    langInstr = 'You MUST reply in Sinhala language only. Use friendly Sinhala tone.';
  } else if (language === 'tamil') {
    langInstr = 'You MUST reply in Tamil language only. Use friendly Tamil tone.';
  } else {
    langInstr = 'Reply in English. If customer speaks Sinhala or Singlish, reply in Singlish.';
  }

  var base = customPrompt || 'You are AROMA Assistant, the official AI assistant for AROMA LAB Fine Fragrances (Sri Lanka).';

  return base +
    '\n\n=== COMPANY INFO ===\n' +
    '- Brand: AROMA LAB Fine Fragrances\n' +
    '- Location: Colombo, Sri Lanka\n' +
    '- Products: Premium Eau De Parfum 15ml\n' +
    '- Long lasting: 12+ hours\n' +
    '- WhatsApp: 0777 804 705\n' +
    productsList +
    '\n=== DELIVERY & DISCOUNTS ===\n' +
    '- 3+ items: FREE Delivery 🎉\n' +
    '- 1-2 items: Rs. 350 delivery charge\n' +
    '- FREE delivery applies to ALL order methods\n' +
    '\n=== ORDER METHODS ===\n' +
    '1. WhatsApp (BEST): https://wa.me/94777804705\n' +
    '2. Daraz: Cash on Delivery / KOKO Pay Later\n' +
    '3. Bank Deposit: Sampath Bank\n' +
    '   Account: K.A.S.P. Wijerathne\n' +
    '   No: 100252479872\n' +
    '   Branch: Pettah\n' +
    '\n=== YOUR ROLE ===\n' +
    '- Answer questions about products, smells, prices, delivery, payment\n' +
    '- Describe smells using Top/Heart/Base notes\n' +
    '- Recommend products based on preferences\n' +
    '- PUSH 3+ items (FREE Delivery)\n' +
    '- Guide to order via WhatsApp\n' +
    '- Explain Bank Deposit option\n' +
    '- Be friendly and helpful\n' +
    '\n=== RULES ===\n' +
    '- ' + langInstr + '\n' +
    '- Keep replies SHORT (2-3 sentences max)\n' +
    '- Be FRIENDLY and CASUAL\n' +
    '- Use emojis occasionally (🌸 ✨ 🎉 💬)\n' +
    '- If unsure, say "Please contact us on WhatsApp 0777 804 705"\n' +
    '- NEVER make up products or prices';
}

// ============================================================
// CALL EDGE FUNCTION (FIXED)
// ============================================================

async function gcCallEdge(systemPrompt, chatHistory) {
  // 👇 History එකේ අන්තිම messages 10 විතරක් යවන්න (token limit නිසා)
  var recentHistory = chatHistory.slice(-10);

  var response = await fetch(GC_EDGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + GC_ANON_KEY
    },
    body: JSON.stringify({
      systemPrompt: systemPrompt,
      chatHistory: recentHistory
    })
  });

  if (!response.ok) {
    var errText = await response.text();
    console.error('❌ Edge function error:', response.status, errText);
    throw new Error('API error ' + response.status + ': ' + errText.substring(0, 200));
  }

  var data = await response.json();
  if (!data.reply) throw new Error('No reply from AI');
  return data.reply;
}

// ============================================================
// LANGUAGE DATA
// ============================================================

var GC_LANGS = [
  { code: 'english', label: 'English', flag: '🇬🇧' },
  { code: 'sinhala', label: 'සිංහල', flag: '🇱🇰' },
  { code: 'tamil', label: 'தமிழ்', flag: '🇱🇰' }
];

var GC_QUICK_Q = {
  english: [
    '🌸 What perfumes do you have?',
    '✨ Best for ladies?',
    '🚚 Delivery cost?',
    '💬 How to order?'
  ],
  sinhala: [
    '🌸 මොනවද තියෙන්නේ?',
    '✨ Ladies වලට හොඳම?',
    '🚚 Delivery කීයද?',
    '💬 Order කරන්නේ කොහොමද?'
  ],
  tamil: [
    '🌸 என்ன உள்ளது?',
    'பெண்களுக்கு எது சிறந்தது?',
    '🚚 டெலிவரி?',
    'எப்படி ஆர்டர்?'
  ]
};

// ============================================================
// RENDER CHAT BOT
// ============================================================

function gcRender() {
  var mount = document.getElementById('aroma-chat-bot-mount');
  if (!mount) return;

  mount.innerHTML = '';

  // ---- FLOATING BUTTON ----
  var btn = document.createElement('button');
  btn.className = 'gc-float-btn' + (GC_STATE.isOpen ? ' gc-open' : '');
  btn.title = 'Ask AI';
  btn.innerHTML = GC_STATE.isOpen ? '×' : '✨';
  btn.onclick = function() {
    GC_STATE.isOpen = !GC_STATE.isOpen;
    if (GC_STATE.isOpen && GC_STATE.messages.length === 0 && GC_STATE.botSettings) {
      GC_STATE.messages = [{ role: 'model', text: GC_STATE.botSettings.welcome_message }];
    }
    gcRender();
  };
  mount.appendChild(btn);

  if (!GC_STATE.isOpen) return;

  // ---- CHAT WINDOW ----
  var win = document.createElement('div');
  win.className = 'gc-window';

  // HEADER
  var header = document.createElement('div');
  header.className = 'gc-header';

  var headerInfo = document.createElement('div');
  headerInfo.className = 'gc-header-info';

  var avatar = document.createElement('div');
  avatar.className = 'gc-header-avatar';
  avatar.textContent = '🌸';

  var headerText = document.createElement('div');
  headerText.className = 'gc-header-text';

  var hTitle = document.createElement('h3');
  hTitle.className = 'gc-header-title';
  hTitle.textContent = 'AROMA Assistant';

  var hSub = document.createElement('p');
  hSub.className = 'gc-header-subtitle';
  hSub.innerHTML = '<span class="gc-status-dot"></span>Online';

  headerText.appendChild(hTitle);
  headerText.appendChild(hSub);
  headerInfo.appendChild(avatar);
  headerInfo.appendChild(headerText);

  var closeBtn = document.createElement('button');
  closeBtn.className = 'gc-close-btn';
  closeBtn.textContent = '×';
  closeBtn.onclick = function() {
    GC_STATE.isOpen = false;
    gcRender();
  };

  header.appendChild(headerInfo);
  header.appendChild(closeBtn);
  win.appendChild(header);

  // LANGUAGE SELECTOR
  var langSel = document.createElement('div');
  langSel.className = 'gc-lang-selector';

  var langLabel = document.createElement('span');
  langLabel.className = 'gc-lang-label';
  langLabel.textContent = 'Language:';
  langSel.appendChild(langLabel);

  GC_LANGS.forEach(function(lang) {
    var lb = document.createElement('button');
    lb.className = 'gc-lang-btn' + (GC_STATE.language === lang.code ? ' active' : '');
    lb.textContent = lang.flag + ' ' + lang.label;
    lb.onclick = function() {
      GC_STATE.language = lang.code;
      gcRender();
    };
    langSel.appendChild(lb);
  });

  win.appendChild(langSel);

  // MESSAGES
  var msgsArea = document.createElement('div');
  msgsArea.className = 'gc-messages';

  if (GC_STATE.messages.length === 0) {
    var welcome = document.createElement('div');
    welcome.className = 'gc-welcome';

    var wIcon = document.createElement('div');
    wIcon.className = 'gc-welcome-icon';
    wIcon.textContent = '🌸';

    var wTitle = document.createElement('div');
    wTitle.className = 'gc-welcome-title';
    wTitle.textContent = 'Welcome to AROMA LAB';

    var wDesc = document.createElement('p');
    wDesc.className = 'gc-welcome-desc';
    wDesc.textContent = 'Ask me about our perfumes, prices, delivery, or how to order!';

    var quickWrap = document.createElement('div');
    quickWrap.className = 'gc-quick-questions';

    var qs = GC_QUICK_Q[GC_STATE.language] || GC_QUICK_Q.english;
    qs.forEach(function(q) {
      var qb = document.createElement('button');
      qb.className = 'gc-quick-btn';
      qb.textContent = q;
      qb.onclick = function() {
        gcSendMessage(q);
      };
      quickWrap.appendChild(qb);
    });

    welcome.appendChild(wIcon);
    welcome.appendChild(wTitle);
    welcome.appendChild(wDesc);
    welcome.appendChild(quickWrap);
    msgsArea.appendChild(welcome);
  }

  GC_STATE.messages.forEach(function(msg) {
    var m = document.createElement('div');
    m.className = 'gc-msg ' + (msg.role === 'user' ? 'gc-msg-user' : 'gc-msg-bot') + (msg.isError ? ' gc-msg-error' : '');
    m.textContent = msg.text;
    msgsArea.appendChild(m);
  });

  if (GC_STATE.isLoading) {
    var typing = document.createElement('div');
    typing.className = 'gc-typing';
    typing.innerHTML = '<div class="gc-typing-dot"></div><div class="gc-typing-dot"></div><div class="gc-typing-dot"></div>';
    msgsArea.appendChild(typing);
  }

  win.appendChild(msgsArea);

  // INPUT AREA
  var inputArea = document.createElement('div');
  inputArea.className = 'gc-input-area';

  var input = document.createElement('textarea');
  input.className = 'gc-input';
  input.rows = 1;
  input.placeholder = GC_STATE.language === 'sinhala'
    ? 'ඔබේ ප්‍රශ්නය type කරන්න...'
    : GC_STATE.language === 'tamil'
    ? 'உங்கள் கேள்வியை தட்டச்சு செய்யவும்...'
    : 'Type your question...';
  input.disabled = GC_STATE.isLoading;
  input.onkeydown = function(ev) {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      var val = input.value.trim();
      if (val && !GC_STATE.isLoading) {
        gcSendMessage(val);
      }
    }
  };

  var sendBtn = document.createElement('button');
  sendBtn.className = 'gc-send-btn';
  sendBtn.innerHTML = '➤';
  sendBtn.disabled = GC_STATE.isLoading;
  sendBtn.onclick = function() {
    var val = input.value.trim();
    if (val && !GC_STATE.isLoading) {
      gcSendMessage(val);
    }
  };

  inputArea.appendChild(input);
  inputArea.appendChild(sendBtn);
  win.appendChild(inputArea);

  mount.appendChild(win);

  setTimeout(function() {
    msgsArea.scrollTop = msgsArea.scrollHeight;
  }, 50);
}

// ============================================================
// SEND MESSAGE (FIXED with better error logging)
// ============================================================

async function gcSendMessage(text) {
  if (GC_STATE.isLoading) return;

  GC_STATE.messages.push({ role: 'user', text: text });
  GC_STATE.isLoading = true;
  gcRender();

  try {
    var systemPrompt = gcBuildSystemPrompt(
      GC_STATE.products,
      GC_STATE.botSettings && GC_STATE.botSettings.system_prompt,
      GC_STATE.language
    );
    var reply = await gcCallEdge(systemPrompt, GC_STATE.messages);
    GC_STATE.messages.push({ role: 'model', text: reply });
  } catch (err) {
    console.error('❌ Chat error:', err);
    console.error('❌ Error message:', err.message);
    var errMsg = GC_STATE.language === 'sinhala'
      ? "❌ කණගාටුයි, දැන් ප්‍රතිචාර දක්වන්න බැහැ. කරුණාකර WhatsApp 0777 804 705 අමතන්න."
      : GC_STATE.language === 'tamil'
      ? "❌ மன்னிக்கவும், இப்போது பதிலளிக்க முடியவில்லை. WhatsApp 0777 804 705."
      : "❌ Sorry, I couldn't respond right now. Please WhatsApp 0777 804 705.";
    GC_STATE.messages.push({ role: 'model', text: errMsg, isError: true });
  }

  GC_STATE.isLoading = false;
  gcRender();
}

// ============================================================
// INIT
// ============================================================

async function gcInit() {
  try {
    GC_STATE.products = await gcLoadProducts();
    GC_STATE.botSettings = await gcLoadBotSettings();

    var mount = document.getElementById('aroma-chat-bot-mount');
    if (!mount) {
      mount = document.createElement('div');
      mount.id = 'aroma-chat-bot-mount';
      document.body.appendChild(mount);
    }

    gcRender();
    console.log('✅ AROMA LAB Chat Bot loaded');
  } catch (e) {
    console.error('❌ Chat Bot init failed:', e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(gcInit, 1500);
  });
} else {
  setTimeout(gcInit, 1500);
}
