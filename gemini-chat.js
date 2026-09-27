/*************************************************************
 * AROMA LAB — AI Chat Bot
 * File: gemini-chat.js
 * 
 * ✅ API Key Supabase Edge Function එකේ — 100% secure
 * ✅ හැම error එකක්ම fix කරලා
 *************************************************************/

const EDGE_FUNCTION_URL = 'https://vibfavfsutpkqfoxpcyz.supabase.co/functions/v1/gemini-chat';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpYmZhdmZzdXRwa3Fmb3hwY3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzQwNDQsImV4cCI6MjEwNTY1MDA0NH0.kZ3GNZ5r7ZzJXI2doWXQSF5itHAA4JntMWEtvUIlsDM';

const GC_LANGUAGES = [
  { code: 'english', label: 'English', flag: '🇬🇧' },
  { code: 'sinhala', label: 'සිංහල', flag: '🇱🇰' },
  { code: 'tamil', label: 'தமிழ்', flag: '🇱🇰' }
];

async function gcLoadProducts() {
  try {
    const { data, error } = await window.supabaseClient
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) return [];
    return data || [];
  } catch (e) {
    console.error('Load products error:', e);
    return [];
  }
}

async function gcLoadBotSettings() {
  try {
    const { data, error } = await window.supabaseClient
      .from('bot_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (error) return { system_prompt: '', welcome_message: "Hi! I'm AROMA Assistant. How can I help you today? 🌸" };
    return data || { system_prompt: '', welcome_message: "Hi! I'm AROMA Assistant. How can I help you today? 🌸" };
  } catch (e) {
    return { system_prompt: '', welcome_message: "Hi! I'm AROMA Assistant. How can I help you today? 🌸" };
  }
}

function gcBuildSystemPrompt(products, customPrompt, language) {
  let productsList = '\n=== AROMA LAB PRODUCTS ===\n\n';
  
  if (products && products.length > 0) {
    products.forEach((p, i) => {
      productsList += (i + 1) + '. ' + (p.name || 'Unknown') + '\n';
      if (p.category) productsList += '   Category: ' + p.category + '\n';
      if (p.product_type) productsList += '   Type: ' + p.product_type + '\n';
      if (p.description) productsList += '   Tagline: ' + p.description + '\n';
      if (p.top_notes) productsList += '   Top Notes: ' + p.top_notes + '\n';
      if (p.heart_notes) productsList += '   Heart Notes: ' + p.heart_notes + '\n';
      if (p.base_notes) productsList += '   Base Notes: ' + p.base_notes + '\n';
      const price = Number(p.selling_price) || Number(p.price) || 1500;
      productsList += '   Price: Rs. ' + price + '\n';
      if (p.stock !== undefined && p.stock !== null) productsList += '   Stock: ' + p.stock + '\n';
      productsList += '\n';
    });
  } else {
    productsList += 'No products available currently.\n';
  }
  
  let languageInstruction = '';
  if (language === 'sinhala') {
    languageInstruction = 'You MUST reply in Sinhala language only. Use friendly Sinhala tone.';
  } else if (language === 'tamil') {
    languageInstruction = 'You MUST reply in Tamil language only. Use friendly Tamil tone.';
  } else {
    languageInstruction = 'Reply in English. If customer speaks Sinhala or Singlish, reply in Singlish.';
  }
  
  const basePrompt = customPrompt || 'You are AROMA Assistant, the official AI assistant for AROMA LAB Fine Fragrances (Sri Lanka).';

  return basePrompt + '\n\n=== COMPANY INFO ===\n- Brand: AROMA LAB Fine Fragrances\n- Location: Colombo, Sri Lanka\n- Products: Premium Eau De Parfum 15ml\n- Long lasting: 12+ hours\n- WhatsApp: 0777 804 705\n' + productsList + '\n=== DELIVERY & DISCOUNTS ===\n- 3+ items → FREE Delivery 🎉\n- 1-2 items → Rs. 350 delivery charge\n- FREE delivery applies to ALL order methods (WhatsApp, Daraz, Bank Deposit, KOKO, Cash)\n\n=== ORDER METHODS ===\n1. WhatsApp (BEST) — https://wa.me/94777804705\n2. Daraz — Cash on Delivery / KOKO Pay Later\n3. Bank Deposit — Sampath Bank\n   - Account Holder: K.A.S.P. Wijerathne\n   - Account No: 100252479872\n   - Branch: Pettah\n\n=== YOUR ROLE ===\n- Answer customer questions about products, smells, prices, delivery, payment\n- When asked about a product smell, describe using Top/Heart/Base notes\n- Recommend products based on customer preferences\n- PUSH customers to buy 3+ items (FREE Delivery)\n- Guide customers to order via WhatsApp (best method)\n- Explain Bank Deposit option\n- Be friendly, warm, and helpful\n\n=== RULES ===\n- ' + languageInstruction + '\n- Keep replies SHORT (2-3 sentences max)\n- Be FRIENDLY and CASUAL\n- Use emojis occasionally (🌸, ✨, 🎉, 💬)\n- If unsure, say "Please contact us on WhatsApp 0777 804 705"\n- NEVER make up products or prices\n- If customer asks about order status, say "Please check WhatsApp 0777 804 705"';
}

async function gcCallEdgeFunction(systemPrompt, chatHistory) {
  const response = await fetch(EDGE_FUNCTION_URL, {
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

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error('API error ' + response.status + ': ' + responseText.substring(0, 100));
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    throw new Error('Invalid response: ' + responseText.substring(0, 100));
  }

  if (!data.reply) {
    throw new Error('No reply from AI');
  }

  return data.reply;
}

// ============================================================
// CHAT COMPONENT
// ============================================================

const gcUseState = React.useState;
const gcUseEffect = React.useEffect;
const gcUseRef = React.useRef;

function AromaChatBot() {
  const [isOpen, setIsOpen] = gcUseState(false);
  const [language, setLanguage] = gcUseState('english');
  const [messages, setMessages] = gcUseState([]);
  const [input, setInput] = gcUseState('');
  const [isLoading, setIsLoading] = gcUseState(false);
  const [products, setProducts] = gcUseState([]);
  const [botSettings, setBotSettings] = gcUseState(null);
  const [isInitialized, setIsInitialized] = gcUseState(false);
  const messagesEndRef = gcUseRef(null);

  gcUseEffect(() => {
    if (!isOpen || isInitialized) return;
    let mounted = true;
    (async () => {
      const prods = await gcLoadProducts();
      const settings = await gcLoadBotSettings();
      if (mounted) {
        setProducts(prods);
        setBotSettings(settings);
        setIsInitialized(true);
      }
    })();
    return () => { mounted = false; };
  }, [isOpen, isInitialized]);

  gcUseEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    gcLoadProducts().then(p => { if (mounted) setProducts(p); });
    return () => { mounted = false; };
  }, [isOpen]);

  gcUseEffect(() => {
    if (isOpen && messages.length === 0 && botSettings) {
      const welcome = botSettings.welcome_message || "Hi! I'm AROMA Assistant. How can I help you today? 🌸";
      setMessages([{ role: 'model', text: welcome }]);
    }
  }, [isOpen, botSettings, messages.length]);

  gcUseEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', text: text };
    const newHistory = messages.concat([userMessage]);
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const systemPrompt = gcBuildSystemPrompt(products, botSettings && botSettings.system_prompt, language);
      const reply = await gcCallEdgeFunction(systemPrompt, newHistory);
      setMessages(newHistory.concat([{ role: 'model', text: reply }]));
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = language === 'sinhala'
        ? "❌ කණගාටුයි, දැන් ප්‍රතිචාර දක්වන්න බැහැ. WhatsApp 0777 804 705 අමතන්න."
        : language === 'tamil'
        ? "❌ மன்னிக்கவும். WhatsApp 0777 804 705 தொடர்பு கொள்ளவும்."
        : "❌ Sorry, I can't respond right now. Please WhatsApp 0777 804 705.";
      setMessages(newHistory.concat([{ role: 'model', text: errorMsg, isError: true }]));
    }
    setIsLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function askQuick(question) {
    setInput(question);
  }

  const quickQuestions = {
    english: [
      '🌸 What perfumes do you have?',
      '✨ Which perfume is best for ladies?',
      '🚚 How much is delivery?',
      '💬 How do I order?'
    ],
    sinhala: [
      '🌸 ඔයාලා ළඟ මොනවද තියෙන්නේ?',
      '✨ Ladies වලට හොඳම එක මොකද්ද?',
      '🚚 Delivery කීයද?',
      '💬 Order කරන්නේ කොහොමද?'
    ],
    tamil: [
      '🌸 உங்களிடம் என்ன வாசனை திரவியங்கள் உள்ளன?',
      '✨ பெண்களுக்கு எது சிறந்தது?',
      '🚚 டெலிவரி கட்டணம் எவ்வளவு?',
      '💬 எப்படி ஆர்டர் செய்வது?'
    ]
  };

  const inputPlaceholder = language === 'sinhala'
    ? 'ඔබේ ප්‍රශ්නය type කරන්න...'
    : language === 'tamil'
    ? 'உங்கள் கேள்வியை தட்டச்சு செய்யவும்...'
    : 'Type your question...';

  const e = React.createElement;

  return e(
    React.Fragment,
    null,
    e('button', {
      className: 'gc-float-btn' + (isOpen ? ' gc-open' : ''),
      onClick: function() { setIsOpen(!isOpen); },
      title: 'Ask AI'
    }, isOpen ? '×' : '✨'),
    
    isOpen && e('div', { className: 'gc-window' },
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
        e('button', { className: 'gc-close-btn', onClick: function() { setIsOpen(false); } }, '×')
      ),
      
      e('div', { className: 'gc-lang-selector' },
        e('span', { className: 'gc-lang-label' }, 'Language:'),
        GC_LANGUAGES.map(function(lang) {
          return e('button', {
            key: lang.code,
            className: 'gc-lang-btn' + (language === lang.code ? ' active' : ''),
            onClick: function() { setLanguage(lang.code); }
          }, lang.flag + ' ' + lang.label);
        })
      ),
      
      e('div', { className: 'gc-messages' },
        messages.length === 0 && e('div', { className: 'gc-welcome' },
          e('div', { className: 'gc-welcome-icon' }, '🌸'),
          e('div', { className: 'gc-welcome-title' }, 'Welcome to AROMA LAB'),
          e('p', { className: 'gc-welcome-desc' }, 'Ask me about our perfumes, prices, delivery, or how to order!'),
          e('div', { className: 'gc-quick-questions' },
            (quickQuestions[language] || quickQuestions.english).map(function(q, i) {
              return e('button', {
                key: i,
                className: 'gc-quick-btn',
                onClick: function() { askQuick(q); }
              }, q);
            })
          )
        ),
        
        messages.map(function(msg, i) {
          return e('div', {
            key: i,
            className: 'gc-msg ' + (msg.role === 'user' ? 'gc-msg-user' : 'gc-msg-bot') + (msg.isError ? ' gc-msg-error' : '')
          }, msg.text);
        }),
        
        isLoading && e('div', { className: 'gc-typing' },
          e('div', { className: 'gc-typing-dot' }),
          e('div', { className: 'gc-typing-dot' }),
          e('div', { className: 'gc-typing-dot' })
        ),
        
        e('div', { ref: messagesEndRef })
      ),
      
      e('div', { className: 'gc-input-area' },
        e('textarea', {
          className: 'gc-input',
          placeholder: inputPlaceholder,
          value: input,
          onChange: function(ev) { setInput(ev.target.value); },
          onKeyDown: handleKeyDown,
          rows: 1,
          disabled: isLoading
        }),
        e('button', {
          className: 'gc-send-btn',
          onClick: handleSend,
          disabled: isLoading || !input.trim()
        }, '➤')
      )
    )
  );
}

function gcMountChatBot() {
  const mountId = 'aroma-chat-bot-mount';
  if (document.getElementById(mountId)) return;

  const mount = document.createElement('div');
  mount.id = mountId;
  document.body.appendChild(mount);

  const root = ReactDOM.createRoot(mount);
  root.render(React.createElement(AromaChatBot));

  console.log('✅ AROMA LAB Chat Bot loaded');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(gcMountChatBot, 1500);
  });
} else {
  setTimeout(gcMountChatBot, 1500);
}
// ============================================================
// SIMPLE TEST — Button එක විතරක්
// ============================================================

console.log('🔥 gemini-chat.js loaded!');

function gcMountChatBot() {
  console.log('🔥 gcMountChatBot called');
  
  const mountId = 'aroma-chat-bot-mount';
  if (document.getElementById(mountId)) {
    console.log('🔥 Mount already exists');
    return;
  }

  const mount = document.createElement('div');
  mount.id = mountId;
  document.body.appendChild(mount);

  const root = ReactDOM.createRoot(mount);
  root.render(
    React.createElement('button', {
      className: 'gc-float-btn',
      onClick: function() { alert('Button clicked!'); },
      style: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: '#0A2E1F',
        color: '#FFFBF5',
        border: '3px solid #B8963E',
        fontSize: '24px',
        zIndex: 999999,
        cursor: 'pointer'
      }
    }, '✨')
  );
  
  console.log('🔥 Button mounted!');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(gcMountChatBot, 1500);
  });
} else {
  setTimeout(gcMountChatBot, 1500);
}
