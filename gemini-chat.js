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
