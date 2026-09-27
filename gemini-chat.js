/*************************************************************
 * AROMA LAB — AI Chat Bot
 * File: gemini-chat.js
 * 
 * ✅ API Key එක Supabase Edge Function එකේ — 100% secure
 * ✅ Clean code, no debug alerts
 *************************************************************/

// ============================================================
// CONFIG
// ============================================================

const EDGE_FUNCTION_URL = 'https://vibfavfsutpkqfoxpcyz.supabase.co/functions/v1/gemini-chat';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpYmZhdmZzdXRwa3Fmb3hwY3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzQwNDQsImV4cCI6MjEwNTY1MDA0NH0.kZ3GNZ5r7ZzJXI2doWXQSF5itHAA4JntMWEtvUIlsDM';

const LANGUAGES = [
  { code: 'english', label: 'English', flag: '🇬🇧' },
  { code: 'sinhala', label: 'සිංහල', flag: '🇱🇰' },
  { code: 'tamil', label: 'தமிழ்', flag: '🇱🇰' }
];

// ============================================================
// DATABASE HELPERS
// ============================================================

async function gcLoadProducts() {
  try {
    const { data, error } = await window.supabaseClient
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) return [];
    return data || [];
  } catch (e) {
    console.error('Failed to load products:', e);
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

// ============================================================
// BUILD SYSTEM PROMPT
// ============================================================

function gcBuildSystemPrompt(products, customPrompt, language) {
  let productsList = '\n=== AROMA LAB PRODUCTS ===\n\n';
  
  if (products && products.length > 0) {
    products.forEach((p, i) => {
      productsList += `${i + 1}. ${p.name || 'Unknown'}\n`;
      if (p.category) productsList += `   Category: ${p.category}\n`;
      if (p.product_type) productsList += `   Type: ${p.product_type}\n`;
      if (p.description) productsList += `   Tagline: ${p.description}\n`;
      if (p.top_notes) productsList += `   Top Notes: ${p.top_notes}\n`;
      if (p.heart_notes) productsList += `   Heart Notes: ${p.heart_notes}\n`;
      if (p.base_notes) productsList += `   Base Notes: ${p.base_notes}\n`;
      const price = Number(p.selling_price) || Number(p.price) || 1500;
      productsList += `   Price: Rs. ${price}\n`;
      if (p.stock !== undefined && p.stock !== null) productsList += `   Stock: ${p.stock}\n`;
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
    languageInstruction = 'Reply in English. If customer speaks Sinhala or Singlish, you can reply in Singlish.';
  }
  
  const basePrompt = customPrompt || `You are AROMA Assistant, the official AI assistant for AROMA LAB Fine Fragrances (Sri Lanka).`;

  return `${basePrompt}

=== COMPANY INFO ===
- Brand: AROMA LAB Fine Fragrances
- Location: Colombo, Sri Lanka
- Products: Premium Eau De Parfum 15ml
- Long lasting: 12+ hours
- WhatsApp: 0777 804 705

${productsList}

=== DELIVERY & DISCOUNTS ===
- 3+ items → FREE Delivery 🎉
- 1-2 items → Rs. 350 delivery charge
- FREE delivery applies to ALL order methods (WhatsApp, Daraz, Bank Deposit, KOKO, Cash)

=== ORDER METHODS ===
1. WhatsApp (BEST) — https://wa.me/94777804705
2. Daraz — Cash on Delivery / KOKO Pay Later
3. Bank Deposit — Sampath Bank
   - Account Holder: K.A.S.P. Wijerathne
   - Account No: 100252479872
   - Branch: Pettah

=== YOUR ROLE ===
- Answer customer questions about products, smells, prices, delivery, payment
- When asked about a product's smell, describe using Top/Heart/Base notes
- Recommend products based on customer preferences
- PUSH customers to buy 3+ items (FREE Delivery) — mention this often
- Guide customers to order via WhatsApp (best method)
- Explain Bank Deposit option when asked
- Be friendly, warm, and helpful

=== RULES ===
- ${languageInstruction}
- Keep replies SHORT (2-3 sentences max)
- Be FRIENDLY and CASUAL
- Use emojis occasionally (🌸, ✨, 🎉, 💬)
- If unsure, say "Please contact us on WhatsApp 0777 804 705"
- NEVER make up products or prices — only use the data above
- If customer asks about order status, say "Please check WhatsApp 0777 804 705"`;
}

// ============================================================
// CALL SUPABASE EDGE FUNCTION
// ============================================================

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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('API error ' + response.status + ': ' + errorText.substring(0, 100));
  }

  const data = await response.json();
  
  if (!data.reply) {
    throw new Error('No reply from AI');
  }

  return data.reply;
}
// ============================================================
// CHAT COMPONENT
// ============================================================

function AromaChatBot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [language, setLanguage] = React.useState('english');
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [botSettings, setBotSettings] = React.useState(null);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  // Initialize on first open
  React.useEffect(() => {
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

  // Reload products whenever chat opens
  React.useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    gcLoadProducts().then(p => { if (mounted) setProducts(p); });
    return () => { mounted = false; };
  }, [isOpen]);

  // Set welcome message once
  React.useEffect(() => {
    if (isOpen && messages.length === 0 && botSettings) {
      const welcome = botSettings.welcome_message || "Hi! I'm AROMA Assistant. How can I help you today? 🌸";
      setMessages([{ role: 'model', text: welcome }]);
    }
  }, [isOpen, botSettings, messages.length]);

  // Auto-scroll
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', text };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const systemPrompt = gcBuildSystemPrompt(products, botSettings?.system_prompt, language);
      const reply = await gcCallEdgeFunction(systemPrompt, newHistory);
      setMessages([...newHistory, { role: 'model', text: reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = language === 'sinhala'
        ? "❌ කණගාටුයි, දැන් ප්‍රතිචාර දක්වන්න බැහැ. කරුණාකර WhatsApp 0777 804 705 අමතන්න."
        : language === 'tamil'
        ? "❌ மன்னிக்கவும், இப்போது பதிலளிக்க முடியவில்லை. WhatsApp 0777 804 705 தொடர்பு கொள்ளவும்."
        : "❌ Sorry, I can't respond right now. Please contact us on WhatsApp 0777 804 705.";
      setMessages([...newHistory, { role: 'model', text: errorMsg, isError: true }]);
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
    setTimeout(() => {
      const el = document.querySelector('.gc-input');
      if (el) el.focus();
    }, 100);
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

  return React.createElement(
    React.Fragment,
    null,
    // Floating button
    React.createElement(
      'button',
      {
        className: 'gc-float-btn' + (isOpen ? ' gc-open' : ''),
        onClick: () => setIsOpen(!isOpen),
        title: 'Ask AI'
      },
      isOpen ? '×' : '✨'
    ),
    // Chat window
    isOpen && React.createElement(
      'div',
      { className: 'gc-window' },
      // Header
      React.createElement(
        'div',
        { className: 'gc-header' },
        React.createElement(
          'div',
          { className: 'gc-header-info' },
          React.createElement('div', { className: 'gc-header-avatar' }, '🌸'),
          React.createElement(
            'div',
            { className: 'gc-header-text' },
            React.createElement('h3', { className: 'gc-header-title' }, 'AROMA Assistant'),
            React.createElement(
              'p',
              { className: 'gc-header-subtitle' },
              React.createElement('span', { className: 'gc-status-dot' }),
              'Online'
            )
          )
        ),
        React.createElement('button', { className: 'gc-close-btn', onClick: () => setIsOpen(false) }, '×')
      ),
      // Language selector
      React.createElement(
        'div',
        { className: 'gc-lang-selector' },
        React.createElement('span', { className: 'gc-lang-label' }, 'Language:'),
        LANGUAGES.map(lang =>
          React.createElement(
            'button',
            {
              key: lang.code,
              className: 'gc-lang-btn' + (language === lang.code ? ' active' : ''),
              onClick: () => setLanguage(lang.code)
            },
            lang.flag + ' ' + lang.label
          )
        )
      ),
      // Messages
      React.createElement(
        'div',
        { className: 'gc-messages' },
        messages.length === 0 && React.createElement(
          'div',
          { className: 'gc-welcome' },
          React.createElement('div', { className: 'gc-welcome-icon' }, '🌸'),
          React.createElement('div', { className: 'gc-welcome-title' }, 'Welcome to AROMA LAB'),
          React.createElement('p', { className: 'gc-welcome-desc' }, 'Ask me about our perfumes, prices, delivery, or how to order!'),
          React.createElement(
            'div',
            { className: 'gc-quick-questions' },
            (quickQuestions[language] || quickQuestions.english).map((q, i) =>
              React.createElement('button', { key: i, className: 'gc-quick-btn', onClick: () => askQuick(q) }, q)
            )
          )
        ),
        messages.map((msg, i) =>
          React.createElement(
            'div',
            {
              key: i,
              className: 'gc-msg ' + (msg.role === 'user' ? 'gc-msg-user' : 'gc-msg-bot') + (msg.isError ? ' gc-msg-error' : '')
            },
            msg.text
          )
        ),
        isLoading && React.createElement(
          'div',
          { className: 'gc-typing' },
          React.createElement('div', { className: 'gc-typing-dot' }),
          React.createElement('div', { className: 'gc-typing-dot' }),
          React.createElement('div', { className: 'gc-typing-dot' })
        ),
        React.createElement('div', { ref: messagesEndRef })
      ),
      // Input area
      React.createElement(
        'div',
        { className: 'gc-input-area' },
        React.createElement('textarea', {
          className: 'gc-input',
          placeholder: inputPlaceholder,
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: handleKeyDown,
          rows: 1,
          disabled: isLoading
        }),
        React.createElement(
          'button',
          {
            className: 'gc-send-btn',
            onClick: handleSend,
            disabled: isLoading || !input.trim()
          },
          '➤'
        )
      )
    )
  );
}

// ============================================================
// MOUNT
// ============================================================

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
  document.addEventListener('DOMContentLoaded', () => setTimeout(gcMountChatBot, 1500));
} else {
  setTimeout(gcMountChatBot, 1500);
}
