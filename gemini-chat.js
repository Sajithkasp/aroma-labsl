/*************************************************************
 * AROMA LAB — AI Chat Bot
 * File: gemini-chat.js
 *************************************************************/

const EDGE_FUNCTION_URL = 'https://vibfavfsutpkqfoxpcyz.supabase.co/functions/v1/gemini-chat';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpYmZhdmZzdXRwa3Fmb3hwY3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzQwNDQsImV4cCI6MjEwNTY1MDA0NH0.kZ3GNZ5r7ZzJXI2doWXQSF5itHAA4JntMWEtvUIlsDM';

var gcIsOpen = false;
var gcLanguage = 'english';
var gcMessages = [];
var gcProducts = [];
var gcBotSettings = null;
var gcIsLoading = false;

async function gcLoadProducts() {
  try {
    var res = await window.supabaseClient.from('products').select('*').order('created_at', { ascending: true });
    if (res.error) return [];
    return res.data || [];
  } catch (e) {
    return [];
  }
}

async function gcLoadBotSettings() {
  try {
    var res = await window.supabaseClient.from('bot_settings').select('*').eq('id', 1).single();
    if (res.error) return { system_prompt: '', welcome_message: "Hi! I'm AROMA Assistant. How can I help you today? 🌸" };
    return res.data || { system_prompt: '', welcome_message: "Hi! I'm AROMA Assistant. How can I help you today? 🌸" };
  } catch (e) {
    return { system_prompt: '', welcome_message: "Hi! I'm AROMA Assistant. How can I help you today? 🌸" };
  }
}

function gcBuildSystemPrompt(products, customPrompt, language) {
  var productsList = '\n=== AROMA LAB PRODUCTS ===\n\n';
  
  if (products && products.length > 0) {
    products.forEach(function(p, i) {
      productsList += (i + 1) + '. ' + (p.name || 'Unknown') + '\n';
      if (p.category) productsList += '   Category: ' + p.category + '\n';
      if (p.description) productsList += '   Tagline: ' + p.description + '\n';
      if (p.top_notes) productsList += '   Top Notes: ' + p.top_notes + '\n';
      if (p.heart_notes) productsList += '   Heart Notes: ' + p.heart_notes + '\n';
      if (p.base_notes) productsList += '   Base Notes: ' + p.base_notes + '\n';
      var price = Number(p.selling_price) || Number(p.price) || 1500;
      productsList += '   Price: Rs. ' + price + '\n\n';
    });
  } else {
    productsList += 'No products available.\n';
  }
  
  var langInstr = '';
  if (language === 'sinhala') langInstr = 'Reply in Sinhala only.';
  else if (language === 'tamil') langInstr = 'Reply in Tamil only.';
  else langInstr = 'Reply in English. Use Singlish if customer does.';
  
  var base = customPrompt || 'You are AROMA Assistant for AROMA LAB Fine Fragrances (Sri Lanka).';
  
  return base + '\n\n=== COMPANY ===\n- Brand: AROMA LAB\n- Location: Colombo, Sri Lanka\n- Products: Premium Eau De Parfum 15ml\n- WhatsApp: 0777 804 705\n' + productsList + '\n=== DELIVERY ===\n- 3+ items: FREE Delivery\n- 1-2 items: Rs. 350\n\n=== ORDER METHODS ===\n1. WhatsApp: https://wa.me/94777804705\n2. Daraz: Cash on Delivery / KOKO\n3. Bank Deposit: Sampath Bank\n\n=== RULES ===\n- ' + langInstr + '\n- Keep replies SHORT (2-3 sentences)\n- Be FRIENDLY, use emojis\n- Push 3+ items for FREE delivery';
}

async function gcCallEdgeFunction(systemPrompt, chatHistory) {
  var response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
    },
    body: JSON.stringify({
      systemPrompt: systemPrompt,
      chatHistory: chatHistory
    })
  });

  if (!response.ok) {
    var errText = await response.text();
    throw new Error('API error ' + response.status + ': ' + errText.substring(0, 100));
  }

  var data = await response.json();
  if (!data.reply) throw new Error('No reply');
  return data.reply;
}

function gcRender() {
  var mount = document.getElementById('aroma-chat-bot-mount');
  if (!mount) return;
  
  var e = React.createElement;
  var content = [];
  
  // Floating button
  content.push(e('button', {
    key: 'btn',
    className: 'gc-float-btn' + (gcIsOpen ? ' gc-open' : ''),
    onClick: function() {
      gcIsOpen = !gcIsOpen;
      if (gcIsOpen && gcMessages.length === 0 && gcBotSettings) {
        gcMessages = [{ role: 'model', text: gcBotSettings.welcome_message }];
      }
      gcRender();
    }
  }, gcIsOpen ? '×' : '✨'));
  
  // Chat window
  if (gcIsOpen) {
    var quickQs = {
      english: ['🌸 What perfumes do you have?', '✨ Best for ladies?', '🚚 Delivery cost?', '💬 How to order?'],
      sinhala: ['🌸 මොනවද තියෙන්නේ?', '✨ Ladies වලට හොඳම?', '🚚 Delivery කීයද?', '💬 Order කරන්නේ?'],
      tamil: ['🌸 என்ன உள்ளது?', '✨ பெண்களுக்கு சிறந்தது?', '🚚 டெலிவரி?', '💬 ஆர்டர்?']
    };
    
    var msgsEls = gcMessages.map(function(msg, i) {
      return e('div', {
        key: 'm' + i,
        className: 'gc-msg ' + (msg.role === 'user' ? 'gc-msg-user' : 'gc-msg-bot') + (msg.isError ? ' gc-msg-error' : '')
      }, msg.text);
    });
    
    if (gcIsLoading) {
      msgsEls.push(e('div', { key: 'loading', className: 'gc-typing' },
        e('div', { className: 'gc-typing-dot' }),
        e('div', { className: 'gc-typing-dot' }),
        e('div', { className: 'gc-typing-dot' })
      ));
    }
    
    content.push(e('div', { key: 'win', className: 'gc-window' },
      // Header
      e('div', { className: 'gc-header' },
        e('div', { className: 'gc-header-info' },
          e('div', { className: 'gc-header-avatar' }, '🌸'),
          e('div', { className: 'gc-header-text' },
            e('h3', { className: 'gc-header-title' }, 'AROMA Assistant'),
            e('p', { className: 'gc-header-subtitle' },
              e('span', { className: 'gc-status-dot' }),
              'Online'
            )
          )
        ),
        e('button', { className: 'gc-close-btn', onClick: function() { gcIsOpen = false; gcRender(); } }, '×')
      ),
      // Language selector
      e('div', { className: 'gc-lang-selector' },
        e('span', { className: 'gc-lang-label' }, 'Language:'),
        [
          { code: 'english', label: 'English', flag: '🇬🇧' },
          { code: 'sinhala', label: 'සිංහල', flag: '🇱🇰' },
          { code: 'tamil', label: 'தமிழ்', flag: '🇱🇰' }
        ].map(function(lang) {
          return e('button', {
            key: lang.code,
            className: 'gc-lang-btn' + (gcLanguage === lang.code ? ' active' : ''),
            onClick: function() { gcLanguage = lang.code; gcRender(); }
          }, lang.flag + ' ' + lang.label);
        })
      ),
      // Messages
      e('div', { className: 'gc-messages' },
        gcMessages.length === 0 && e('div', { className: 'gc-welcome' },
          e('div', { className: 'gc-welcome-icon' }, '🌸'),
          e('div', { className: 'gc-welcome-title' }, 'Welcome to AROMA LAB'),
          e('p', { className: 'gc-welcome-desc' }, 'Ask me about our perfumes, prices, delivery, or how to order!'),
          e('div', { className: 'gc-quick-questions' },
            (quickQs[gcLanguage] || quickQs.english).map(function(q, i) {
              return e('button', {
                key: i,
                className: 'gc-quick-btn',
                onClick: function() {
                  gcMessages.push({ role: 'user', text: q });
                  gcHandleSend(q);
                }
              }, q);
            })
          )
        ),
        msgsEls
      ),
      // Input
      e('div', { className: 'gc-input-area' },
        e('textarea', {
          className: 'gc-input',
          placeholder: gcLanguage === 'sinhala' ? 'ප්‍රශ්නය type කරන්න...' : gcLanguage === 'tamil' ? 'கேள்வி...' : 'Type your question...',
          value: '',
          onKeyDown: function(ev) {
            if (ev.key === 'Enter' && !ev.shiftKey) {
              ev.preventDefault();
              var val = ev.target.value.trim();
              if (val) {
                ev.target.value = '';
                gcMessages.push({ role: 'user', text: val });
                gcHandleSend(val);
              }
            }
          },
          rows: 1,
          disabled: gcIsLoading
        }),
        e('button', {
          className: 'gc-send-btn',
          onClick: function(ev) {
            var input = ev.target.parentElement.querySelector('.gc-input');
            var val = input.value.trim();
            if (val && !gcIsLoading) {
              input.value = '';
              gcMessages.push({ role: 'user', text: val });
              gcHandleSend(val);
            }
          },
          disabled: gcIsLoading
        }, '➤')
      )
    ));
  }
  
  var root = ReactDOM.createRoot(mount);
  root.render(e(React.Fragment, null, content));
}

async function gcHandleSend(text) {
  gcIsLoading = true;
  gcRender();
  
  try {
    var systemPrompt = gcBuildSystemPrompt(gcProducts, gcBotSettings && gcBotSettings.system_prompt, gcLanguage);
    var reply = await gcCallEdgeFunction(systemPrompt, gcMessages);
    gcMessages.push({ role: 'model', text: reply });
  } catch (err) {
    console.error('Chat error:', err);
    var errMsg = gcLanguage === 'sinhala'
      ? "❌ කණගාටුයි. WhatsApp 0777 804 705 අමතන්න."
      : gcLanguage === 'tamil'
      ? "❌ மன்னிக்கவும். WhatsApp 0777 804 705."
      : "❌ Sorry, please WhatsApp 0777 804 705.";
    gcMessages.push({ role: 'model', text: errMsg, isError: true });
  }
  
  gcIsLoading = false;
  gcRender();
}

async function gcInit() {
  gcProducts = await gcLoadProducts();
  gcBotSettings = await gcLoadBotSettings();
  
  var mount = document.createElement('div');
  mount.id = 'aroma-chat-bot-mount';
  document.body.appendChild(mount);
  
  gcRender();
  console.log('✅ AROMA LAB Chat Bot loaded');
}

setTimeout(gcInit, 1500);
