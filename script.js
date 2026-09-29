const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;

const DARAZ_LINK = "https://www.daraz.lk/products/aroma-lab-fine-fragrances-eau-de-parfum-15ml-5-scents-collection-long-lasting-12-hours-for-men-women-i1772233780-s12967079838.html";
const WHATSAPP_LINK = "https://wa.me/94777804705";
const LOGO_URL = "https://sajithkasp.github.io/aroma-labsl/logo.png";
const ADMIN_EMAIL = "sajith.kasp@gmail.com";

const DEFAULT_HERO = "https://sajithkasp.github.io/aroma-labsl/hero.jpg";
const DEFAULT_LIFESTYLE_1 = "https://sajithkasp.github.io/aroma-labsl/lifestyle.jpg";
const DEFAULT_LIFESTYLE_2 = "https://sajithkasp.github.io/aroma-labsl/lifestyle2.jpg";

const defaultLifestyleDetails = [
  { eyebrow: "MUSE — BLACK TEMPTATION", title: "Dark, mysterious,", titleAccent: "& seductive.", description: "Blackcurrant and pear open with a bright bite, jasmine and orange blossom bloom at the heart, and vanilla, praline, and musk leave a soft, unforgettable trail. Perfect for evenings.", image: DEFAULT_LIFESTYLE_1 },
  { eyebrow: "MUSE — HUNTERS DUSK", title: "Woody, smoky,", titleAccent: "& adventurous.", description: "Bergamot and pine open with a fresh, woody bite, cedarwood and leather deepen the heart, and amber, musk, and vetiver leave a bold, masculine trail. Perfect for the modern man.", image: DEFAULT_LIFESTYLE_2 }
];

const defaultProducts = [
  { id: "goodgirl", name: "Good Girl", for: "FOR LADIES", filter: "Ladies", product_type: "Perfume", price: 1500, selling_price: 1500, tagline: "Sweet, Floral & Sensual", top: "Almond, Coffee", heart: "Jasmine, Tuberose", base: "Cocoa, Vanilla, Tonka Bean", image: "https://sajithkasp.github.io/aroma-labsl/goodgirl.jpg", accent: "#E8A8C0" },
  { id: "black", name: "Black Temptation", for: "FOR LADIES", filter: "Ladies", product_type: "Perfume", price: 1500, selling_price: 1500, tagline: "Dark, Mysterious & Seductive", top: "Blackcurrant, Pear", heart: "Jasmine, Orange Blossom", base: "Vanilla, Praline, Musk", image: "https://sajithkasp.github.io/aroma-labsl/black.jpg", accent: "#2A2A2A" },
  { id: "hunter", name: "Hunters Dusk", for: "FOR MEN", filter: "Men", product_type: "Perfume", price: 1500, selling_price: 1500, tagline: "Woody, Smoky & Adventurous", top: "Bergamot, Pine", heart: "Cedarwood, Leather", base: "Amber, Musk, Vetiver", image: "https://sajithkasp.github.io/aroma-labsl/hunter.jpg", accent: "#4A5A3A" },
  { id: "gold", name: "Million Gold", for: "FOR MEN", filter: "Men", product_type: "Perfume", price: 1500, selling_price: 1500, tagline: "Rich, Luxurious & Powerful", top: "Blood Mandarin, Grapefruit", heart: "Cinnamon, Rose", base: "Amber, Leather, Patchouli", image: "https://sajithkasp.github.io/aroma-labsl/gold.jpg", accent: "#B8963E" },
  { id: "vanilla", name: "Vanilla", for: "FOR UNISEX", filter: "Unisex", product_type: "Perfume", price: 1500, selling_price: 1500, tagline: "Warm, Sweet & Cozy", top: "Vanilla Orchid, Mandarin", heart: "Vanilla, Jasmine", base: "Sandalwood, Musk", image: "https://sajithkasp.github.io/aroma-labsl/vanilla.jpg", accent: "#D4B896" }
];

// ============================================================
// SVG ICONS
// ============================================================

const SearchIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const UserIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const LogoutIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>);
const CartIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>);
const AdminIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>);
const ChevronLeft = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const ChevronRight = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>);
const FacebookIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>);
const WhatsappIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>);
const DarazIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>);
const PhoneIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>);
const MapPinIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>);

// ============================================================
// HELPERS
// ============================================================

function fmtRs(num) {
  const n = Number(num) || 0;
  return 'Rs. ' + n.toLocaleString('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// ============================================================
// DATABASE
// ============================================================

async function dbGetCategories() {
  const { data, error } = await window.supabaseClient.from('categories').select('*').order('display_order', { ascending: true });
  if (error) return [];
  return data || [];
}
async function dbAddCategory(name) {
  const { data, error } = await window.supabaseClient.from('categories').insert([{ name: name.trim(), display_order: 999 }]).select().single();
  if (error) throw error;
  return data;
}
async function dbDeleteCategory(id) {
  const { error } = await window.supabaseClient.from('categories').delete().eq('id', id);
  if (error) throw error;
  return true;
}

async function dbGetProductTypes() {
  const { data, error } = await window.supabaseClient.from('product_types').select('*').order('display_order', { ascending: true });
  if (error) return [];
  return data || [];
}
async function dbAddProductType(name) {
  const { data, error } = await window.supabaseClient.from('product_types').insert([{ name: name.trim(), display_order: 999 }]).select().single();
  if (error) throw error;
  return data;
}
async function dbDeleteProductType(id) {
  const { error } = await window.supabaseClient.from('product_types').delete().eq('id', id);
  if (error) throw error;
  return true;
}

async function dbGetCostTypes() {
  const { data, error } = await window.supabaseClient.from('cost_types').select('*').order('display_order', { ascending: true });
  if (error) return [];
  return data || [];
}
async function dbAddCostType(name) {
  const { data, error } = await window.supabaseClient.from('cost_types').insert([{ name: name.trim(), display_order: 999 }]).select().single();
  if (error) throw error;
  return data;
}
async function dbDeleteCostType(id) {
  const { error } = await window.supabaseClient.from('cost_types').delete().eq('id', id);
  if (error) throw error;
  return true;
}

async function dbGetPaymentMethods() {
  const { data, error } = await window.supabaseClient.from('payment_methods').select('*').order('display_order', { ascending: true });
  if (error) return [];
  return data || [];
}
async function dbAddPaymentMethod(name) {
  const { data, error } = await window.supabaseClient.from('payment_methods').insert([{ name: name.trim(), display_order: 999 }]).select().single();
  if (error) throw error;
  return data;
}
async function dbDeletePaymentMethod(id) {
  const { error } = await window.supabaseClient.from('payment_methods').delete().eq('id', id);
  if (error) throw error;
  return true;
}

async function dbGetDeliverySettings() {
  const { data, error } = await window.supabaseClient.from('delivery_settings').select('*').eq('id', 1).single();
  if (error) return { base_charge: 350, free_delivery_threshold: 3 };
  return data || { base_charge: 350, free_delivery_threshold: 3 };
}
async function dbUpdateDeliverySettings(baseCharge, threshold) {
  const { data, error } = await window.supabaseClient.from('delivery_settings').update({
    base_charge: Number(baseCharge),
    free_delivery_threshold: Number(threshold),
    updated_at: new Date().toISOString()
  }).eq('id', 1).select().single();
  if (error) throw error;
  return data;
}

async function dbGetProducts() {
  const { data, error } = await window.supabaseClient.from('products').select('*').order('created_at', { ascending: true });
  if (error) return [];
  return data || [];
}
async function dbAddProduct(productData) {
  const { data, error } = await window.supabaseClient.from('products').insert([productData]).select().single();
  if (error) throw error;
  return data;
}
async function dbUpdateProduct(id, updates) {
  const { data, error } = await window.supabaseClient.from('products').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
async function dbDeleteProduct(id) {
  const { error } = await window.supabaseClient.from('products').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ============================================================
// SUPABASE AUTH
// ============================================================

async function signInAdmin(password) {
  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email: 'sajith.kasp@gmail.com',
    password: password
  });
  if (error) throw error;
  return data;
}

// ============================================================
// ORDER SAVE
// ============================================================

async function saveOrderToSupabaseDirect(orderData, cartItems, deliveryCharge) {
  try {
    const sb = window.supabaseClient;
    if (!sb) throw new Error('Supabase client not loaded');

    const { data: idData, error: idErr } = await sb.rpc('generate_order_id');
    if (idErr) throw new Error('generate_order_id failed: ' + idErr.message);
    const orderId = idData;

    let totalAmount = 0;
    let totalCost = 0;
    const itemsSummaryParts = [];

    const { data: products, error: prodErr } = await sb.from('products').select('*');
    if (prodErr) throw new Error('products fetch failed: ' + prodErr.message);
    const productMap = {};
    (products || []).forEach(p => {
      productMap[String(p.name || '').trim().toLowerCase()] = p;
    });

    const itemsToInsert = cartItems.map(item => {
      const qty = Number(item.quantity) || 1;
      const unitPrice = Number(item.price) || Number(item.selling_price) || 1500;
      const product = productMap[String(item.name || '').trim().toLowerCase()];
      const unitCost = product ? (Number(product.total_cost) || Number(product.full_cost) || 0) : 0;
      const totalIncome = unitPrice * qty;
      const totalItemCost = unitCost * qty;

      totalAmount += totalIncome;
      totalCost += totalItemCost;
      itemsSummaryParts.push(item.name + ' x' + qty);

      return {
        order_id: orderId,
        product_name: item.name,
        quantity: qty,
        unit_price: unitPrice,
        unit_cost: unitCost,
        total_income: totalIncome,
        total_cost: totalItemCost,
        profit: totalIncome - totalItemCost
      };
    });

    const { error: orderErr } = await sb.from('orders').insert([{
      order_id: orderId,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      customer_address: orderData.customer_address,
      district: orderData.district,
      order_items: itemsSummaryParts.join(', '),
      total_amount: totalAmount,
      delivery_charge: deliveryCharge,
      discount: 0,
      order_type: '',
      payment_method: '',
      total_cost: totalCost,
      commission: 0,
      other_expenses: 0,
      net_profit: 0,
      profit_margin: 0,
      status: 'Pending',
      platform: orderData.platform || 'WhatsApp'
    }]);
    if (orderErr) throw new Error('orders insert failed: ' + orderErr.message);

    const { error: itemsErr } = await sb.from('order_items').insert(itemsToInsert);
    if (itemsErr) throw new Error('order_items insert failed: ' + itemsErr.message);

    return { success: true, orderId: orderId };
  } catch (err) {
    console.error('❌ Order save failed:', err.message);
    return { success: false, error: err.message };
  }
}

// ============================================================
// CART MODAL
// ============================================================

function CartModal({ isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, getSubtotal, getDeliveryCharge, getTotal, getCartCount, customerName, setCustomerName, customerPhone, setCustomerPhone, customerAddress, setCustomerAddress, customerDistrict, setCustomerDistrict, districts, isLoggedIn, sendWhatsAppOrder, sendBankDepositOrder, DARAZ_LINK }) {
  if (!isCartOpen) return null;
  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal-box">
        <button className="cart-modal-close" onClick={() => setIsCartOpen(false)}>×</button>
        <h2 className="cart-modal-title">Your Cart</h2>
        <div className="cart-daraz-banner">
          <p className="cart-daraz-title">🏆 Best Option: Order on Daraz</p>
          <p className="cart-daraz-desc">Cash on Delivery & KOKO Pay Later available • Safe returns</p>
        </div>
        {cartItems.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <div>
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">{fmtRs(item.price || item.selling_price || 1500)} each</div>
                </div>
                <div className="cart-qty-controls">
                  <button className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span className="cart-qty-num">{item.quantity}</span>
                  <button className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item-total">{fmtRs((item.price || item.selling_price || 1500) * item.quantity)}</div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            ))}
          </div>
        )}
        <div className="cart-totals">
          <div className="cart-total-row"><span>Subtotal</span><span>{fmtRs(getSubtotal())}</span></div>
          <div className="cart-total-row"><span>Delivery</span><span>{getDeliveryCharge() === 0 ? 'FREE 🎉' : fmtRs(getDeliveryCharge())}</span></div>
          <div className="cart-total-row cart-total-final"><span>Total</span><span>{fmtRs(getTotal())}</span></div>
        </div>
        {isLoggedIn ? (
          <div className="cart-customer-form">
            <h3 className="cart-form-title">Customer Details</h3>
            <input type="text" placeholder="Your Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="cart-form-input" />
            <input type="tel" placeholder="Phone Number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="cart-form-input" />
            <textarea placeholder="Address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="cart-form-input cart-form-textarea"></textarea>
            <select value={customerDistrict} onChange={(e) => setCustomerDistrict(e.target.value)} className="cart-form-input">
              <option value="">Select District</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        ) : (
          <div className="cart-login-warning"><p>Please sign in with Google to place an order.</p></div>
        )}
        <div className="cart-payment-options">
          <a href={DARAZ_LINK} target="_blank" rel="noopener" className="cart-btn cart-btn-daraz">🛒 Order on Daraz (COD / KOKO)</a>
          {isLoggedIn && (
            <div className="cart-bank-deposit">
              <p className="cart-bank-title">🏦 Bank Deposit Details:</p>
              <p className="cart-bank-line">Account Holder: <strong>K.A.S.P. Wijerathne</strong></p>
              <p className="cart-bank-line">Bank: <strong>Sampath Bank</strong></p>
              <p className="cart-bank-line">Account No: <strong>100252479872</strong></p>
              <p className="cart-bank-line">Branch: <strong>Pettah</strong></p>
              <button onClick={sendBankDepositOrder} className="cart-btn cart-btn-bank">📤 Send Slip via WhatsApp</button>
            </div>
          )}
          {isLoggedIn && (<button onClick={sendWhatsAppOrder} className="cart-btn cart-btn-whatsapp">💬 Order via WhatsApp</button>)}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// REVIEW SECTION
// ============================================================

function ReviewSection({ isLoggedIn, reviewName, setReviewName, reviewEmail, setReviewEmail, reviewRating, setReviewRating, reviewComment, setReviewComment, handleReviewSubmit, reviews, currentReviewIndex, setCurrentReviewIndex }) {
  return (
    <section className="review-section">
      <div className="review-header">
        <div className="review-eyebrow">WHAT OUR CUSTOMERS SAY</div>
        <h2 className="review-title">Loved by Fragrance Enthusiasts</h2>
      </div>
      {isLoggedIn ? (
        <form className="review-form" onSubmit={handleReviewSubmit}>
          <input type="text" placeholder="Your Name" value={reviewName} onChange={(e) => setReviewName(e.target.value)} required className="review-input" />
          <input type="email" placeholder="Your Email" value={reviewEmail} onChange={(e) => setReviewEmail(e.target.value)} required className="review-input" />
          <select value={reviewRating} onChange={(e) => setReviewRating(e.target.value)} required className="review-input">
            <option value="">Select Rating</option>
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
          </select>
          <textarea placeholder="Write your review..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} required className="review-input review-textarea"></textarea>
          <button type="submit" className="review-submit">Submit Review</button>
        </form>
      ) : (
        <div className="review-login-message"><p>Please sign in with Google to write a review.</p></div>
      )}
      {reviews.length > 0 && (
        <div className="reviews-slider">
          <button className="reviews-nav reviews-nav-prev" onClick={() => setCurrentReviewIndex(prev => (prev - 1 + reviews.length) % reviews.length)}><ChevronLeft /></button>
          <div className="reviews-slider-inner">
            {reviews.map((rev, i) => (
              <div key={rev.id} className={`review-card ${i === currentReviewIndex ? 'active' : ''}`}>
                <div className="review-card-header">
                  {rev.user_image && <img src={rev.user_image} alt={rev.name} className="review-avatar" />}
                  <div>
                    <h4 className="review-name">{rev.name}</h4>
                    <p className="review-stars">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</p>
                  </div>
                </div>
                <p className="review-comment">"{rev.comment}"</p>
                <small className="review-date">{new Date(rev.created_at).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
          <button className="reviews-nav reviews-nav-next" onClick={() => setCurrentReviewIndex(prev => (prev + 1) % reviews.length)}><ChevronRight /></button>
        </div>
      )}
    </section>
  );
}

// ============================================================
// ADMIN AUTH
// ============================================================

function AdminAuth({ onSuccess, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInAdmin(password);
      onSuccess();
    } catch (err) {
      setError('❌ Wrong Password. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="admin-overlay">
      <div className="admin-auth-box">
        <button className="admin-close" onClick={onClose}>×</button>
        <h2 className="admin-title">Admin Access</h2>
        <p className="admin-auth-desc">Enter your admin password to access the panel.</p>
        <form onSubmit={handleLogin}>
          <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} className="admin-input admin-input-full" autoFocus required />
          {error && <p className="admin-auth-error">{error}</p>}
          <button type="submit" className="admin-btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Checking...' : 'Unlock Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN PANEL MODAL
// ============================================================

function AdminPanelModal({ isAdminOpen, setIsAdminOpen, products, setProducts, heroImages, setHeroImages, lifestyleImages, setLifestyleImages, lifestyleDetails, setLifestyleDetails, pages, setPages, categories, setCategories, productTypes, setProductTypes, costTypes, setCostTypes, paymentMethods, setPaymentMethods, deliverySettings, setDeliverySettings, onCloseAndSignOut }) {
  const [activeTab, setActiveTab] = useState('products');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', product_type: 'Perfume', tagline: '', top: '', heart: '', base: '', image: '', price: 1500, selling_price: 1500, stock: 0 });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newProductType, setNewProductType] = useState('');
  const [newCostType, setNewCostType] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [newHeroUploading, setNewHeroUploading] = useState(false);
  const [newLifestyleUploading, setNewLifestyleUploading] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', content: '' });
  const [editingPageId, setEditingPageId] = useState(null);
  const [botSystemPrompt, setBotSystemPrompt] = useState('');
  const [botWelcomeMessage, setBotWelcomeMessage] = useState('');

  useEffect(() => {
    async function loadBotSettings() {
      try {
        const { data, error } = await window.supabaseClient.from('bot_settings').select('*').eq('id', 1).single();
        if (!error && data) {
          setBotSystemPrompt(data.system_prompt || '');
          setBotWelcomeMessage(data.welcome_message || '');
        }
      } catch (e) { console.error(e); }
    }
    if (isAdminOpen) loadBotSettings();
  }, [isAdminOpen]);

  if (!isAdminOpen) return null;

  function showMsg(text) {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  }

  const handleImageUpload = async (file, callback) => {
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const { error } = await window.supabaseClient.storage.from('product-images').upload(fileName, file);
      if (error) throw error;
      const { data: urlData } = window.supabaseClient.storage.from('product-images').getPublicUrl(fileName);
      callback(urlData.publicUrl);
      showMsg('✅ Image uploaded!');
    } catch (err) {
      showMsg('❌ Upload error: ' + err.message);
    }
    setUploading(false);
  };

  const saveSiteSettings = async (newHeroImages, newLifestyleImages, newLifestyleDetails) => {
    try {
      const { error } = await window.supabaseClient.from('site_settings').update({
        hero_images: newHeroImages,
        lifestyle_images: newLifestyleImages,
        lifestyle_details: newLifestyleDetails,
        updated_at: new Date().toISOString()
      }).eq('id', 1);
      if (error) throw error;
      showMsg('✅ Saved successfully!');
    } catch (err) {
      showMsg('❌ Error: ' + err.message);
    }
  };

  async function handleAddOrUpdateProduct() {
    if (!newProduct.name || !newProduct.image) {
      showMsg('❌ Name and image required');
      return;
    }
    try {
      const productData = {
        name: newProduct.name,
        category: newProduct.category || (categories[0]?.name || 'Ladies'),
        product_type: newProduct.product_type || 'Perfume',
        description: newProduct.tagline,
        top_notes: newProduct.top,
        heart_notes: newProduct.heart,
        base_notes: newProduct.base,
        image_url: newProduct.image,
        price: String(newProduct.selling_price || newProduct.price || 1500),
        selling_price: Number(newProduct.selling_price || newProduct.price || 1500),
        stock: Number(newProduct.stock) || 0
      };
      if (editingProduct) {
        await dbUpdateProduct(editingProduct.id, productData);
        showMsg('✅ Product updated!');
      } else {
        await dbAddProduct(productData);
        showMsg('✅ Product added!');
      }
      const fresh = await dbGetProducts();
      setProducts(fresh.map(mapProduct));
      setNewProduct({ name: '', category: '', product_type: 'Perfume', tagline: '', top: '', heart: '', base: '', image: '', price: 1500, selling_price: 1500, stock: 0 });
      setEditingProduct(null);
      setShowProductForm(false);
    } catch (err) {
      showMsg('❌ Error: ' + err.message);
    }
  }

  function editProduct(p) {
    setNewProduct({
      name: p.name, category: p.category || '', product_type: p.product_type || 'Perfume',
      tagline: p.description || '', top: p.top_notes || '', heart: p.heart_notes || '', base: p.base_notes || '',
      image: p.image_url || '', price: p.selling_price || 1500, selling_price: p.selling_price || 1500, stock: p.stock || 0
    });
    setEditingProduct(p);
    setShowProductForm(true);
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await dbDeleteProduct(id);
      const fresh = await dbGetProducts();
      setProducts(fresh.map(mapProduct));
      showMsg('✅ Product deleted');
    } catch (err) {
      showMsg('❌ Error: ' + err.message);
    }
  }

  function mapProduct(p) {
    return {
      id: p.id, name: p.name,
      for: p.category ? 'FOR ' + p.category.toUpperCase() : '',
      filter: p.category, category: p.category, product_type: p.product_type || 'Perfume',
      tagline: p.description || '', top: p.top_notes || '', heart: p.heart_notes || '', base: p.base_notes || '',
      image: p.image_url || '',
      price: Number(p.selling_price) || Number(p.price) || 1500,
      selling_price: Number(p.selling_price) || Number(p.price) || 1500,
      stock: p.stock || 0, accent: '#B8963E'
    };
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    try {
      await dbAddCategory(newCategory);
      const fresh = await dbGetCategories();
      setCategories(fresh);
      setNewCategory('');
      showMsg('✅ Category added');
    } catch (err) { showMsg('❌ Error: ' + err.message); }
  }

  async function handleDeleteCategory(id) {
    if (!window.confirm('Delete this category?')) return;
    try {
      await dbDeleteCategory(id);
      const fresh = await dbGetCategories();
      setCategories(fresh);
      showMsg('✅ Category deleted');
    } catch (err) { showMsg('❌ Error: ' + err.message); }
  }

  async function handleAddProductType() {
    if (!newProductType.trim()) return;
    try {
      await dbAddProductType(newProductType);
      const fresh = await dbGetProductTypes();
      setProductTypes(fresh);
      setNewProductType('');
      showMsg('✅ Product Type added');
    } catch (err) { showMsg('❌ Error: ' + err.message); }
  }

  async function handleDeleteProductType(id) {
    if (!window.confirm('Delete this product type?')) return;
    try {
      await dbDeleteProductType(id);
      const fresh = await dbGetProductTypes();
      setProductTypes(fresh);
      showMsg('✅ Product Type deleted');
    } catch (err) { showMsg('❌ Error: ' + err.message); }
  }

  async function handleAddCostType() {
    if (!newCostType.trim()) return;
    try {
      await dbAddCostType(newCostType);
      const fresh = await dbGetCostTypes();
      setCostTypes(fresh);
      setNewCostType('');
      showMsg('✅ Cost Type added');
    } catch (err) { showMsg('❌ Error: ' + err.message); }
  }

  async function handleDeleteCostType(id) {
    if (!window.confirm('Delete this cost type?')) return;
    try {
      await dbDeleteCostType(id);
      const fresh = await dbGetCostTypes();
      setCostTypes(fresh);
      showMsg('✅ Cost Type deleted');
    } catch (err) { showMsg('❌ Error: ' + err.message); }
  }

  async function handleAddPaymentMethod() {
    if (!newPaymentMethod.trim()) return;
    try {
      await dbAddPaymentMethod(newPaymentMethod);
      const fresh = await dbGetPaymentMethods();
      setPaymentMethods(fresh);
      setNewPaymentMethod('');
      showMsg('✅ Payment Method added');
    } catch (err) { showMsg('❌ Error: ' + err.message); }
  }

  async function handleDeletePaymentMethod(id) {
    if (!window.confirm('Delete this payment method?')) return;
    try {
      await dbDeletePaymentMethod(id);
      const fresh = await dbGetPaymentMethods();
      setPaymentMethods(fresh);
      showMsg('✅ Payment Method deleted');
    } catch (err) { showMsg('❌ Error: ' + err.message); }
  }

  async function handleSaveDelivery() {
    try {
      await dbUpdateDeliverySettings(deliverySettings.base_charge, deliverySettings.free_delivery_threshold);
      const fresh = await dbGetDeliverySettings();
      setDeliverySettings(fresh);
      showMsg('✅ Delivery settings updated');
    } catch (err) { showMsg('❌ Error: ' + err.message); }
  }

  async function handleAddHeroImage(file) {
    if (!file) return;
    setNewHeroUploading(true);
    try {
      const fileName = `hero-${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const { error } = await window.supabaseClient.storage.from('product-images').upload(fileName, file);
      if (error) throw error;
      const { data: urlData } = window.supabaseClient.storage.from('product-images').getPublicUrl(fileName);
      const updated = [...heroImages, urlData.publicUrl];
      setHeroImages(updated);
      await saveSiteSettings(updated, lifestyleImages, lifestyleDetails);
    } catch (err) { showMsg('❌ Error: ' + err.message); }
    setNewHeroUploading(false);
  }

  async function handleDeleteHeroImage(index) {
    if (!window.confirm('Delete this Hero Image?')) return;
    const updated = heroImages.filter((_, i) => i !== index);
    setHeroImages(updated);
    await saveSiteSettings(updated, lifestyleImages, lifestyleDetails);
  }

  async function handleAddLifestyleImage(file) {
    if (!file) return;
    setNewLifestyleUploading(true);
    try {
      const fileName = `lifestyle-${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const { error } = await window.supabaseClient.storage.from('product-images').upload(fileName, file);
      if (error) throw error;
      const { data: urlData } = window.supabaseClient.storage.from('product-images').getPublicUrl(fileName);
      const updated = [...lifestyleImages, urlData.publicUrl];
      const newDetail = { eyebrow: "NEW COLLECTION", title: "New Fragrance,", titleAccent: "& elegant.", description: "Discover our latest addition.", image: urlData.publicUrl };
      const updatedDetails = [...lifestyleDetails, newDetail];
      setLifestyleImages(updated);
      setLifestyleDetails(updatedDetails);
      await saveSiteSettings(heroImages, updated, updatedDetails);
    } catch (err) { showMsg('❌ Error: ' + err.message); }
    setNewLifestyleUploading(false);
  }

  async function handleDeleteLifestyleImage(index) {
    if (!window.confirm('Delete this Lifestyle Image?')) return;
    const updated = lifestyleImages.filter((_, i) => i !== index);
    const updatedDetails = lifestyleDetails.filter((_, i) => i !== index);
    setLifestyleImages(updated);
    setLifestyleDetails(updatedDetails);
    await saveSiteSettings(heroImages, updated, updatedDetails);
  }

  const handleUpdateLifestyleDetail = (index, field, value) => {
    const updated = lifestyleDetails.map((d, i) => i === index ? { ...d, [field]: value } : d);
    setLifestyleDetails(updated);
  };

  const handleSaveLifestyleDetails = async () => {
    await saveSiteSettings(heroImages, lifestyleImages, lifestyleDetails);
  };

  async function handleAddPage() {
    if (!newPage.title) { showMsg('❌ Title is required.'); return; }
    try {
      if (editingPageId) {
        const { error } = await window.supabaseClient.from('pages').update({ title: newPage.title, content: newPage.content }).eq('id', editingPageId);
        if (error) throw error;
        showMsg('✅ Page updated!');
      } else {
        const { error } = await window.supabaseClient.from('pages').insert([{ title: newPage.title, content: newPage.content }]);
        if (error) throw error;
        showMsg('✅ Page added!');
      }
      const fresh = await window.supabaseClient.from('pages').select('*').order('created_at', { ascending: true });
      setPages(fresh.data || []);
      setNewPage({ title: '', content: '' });
      setEditingPageId(null);
    } catch (err) { showMsg('❌ Error: ' + err.message); }
  }

  async function handleDeletePage(id) {
    if (!window.confirm('Delete this page?')) return;
    try {
      const { error } = await window.supabaseClient.from('pages').delete().eq('id', id);
      if (error) throw error;
      const fresh = await window.supabaseClient.from('pages').select('*').order('created_at', { ascending: true });
      setPages(fresh.data || []);
      showMsg('✅ Page deleted.');
    } catch (err) { showMsg('❌ Error: ' + err.message); }
  }

  async function handleSaveBotSettings() {
    try {
      const { error } = await window.supabaseClient.from('bot_settings').update({
        system_prompt: botSystemPrompt,
        welcome_message: botWelcomeMessage,
        updated_at: new Date().toISOString()
      }).eq('id', 1);
      if (error) throw error;
      showMsg('✅ Chat Bot settings saved');
    } catch (err) { showMsg('❌ Error: ' + err.message); }
  }

  return (
    <div className="admin-overlay">
      <div className="admin-box">
        <button className="admin-close" onClick={onCloseAndSignOut}>×</button>
        <h2 className="admin-title">Admin Panel</h2>
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>📦 Products</button>
          <button className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>🏷️ Categories</button>
          <button className={`admin-tab ${activeTab === 'types' ? 'active' : ''}`} onClick={() => setActiveTab('types')}>🎁 Types</button>
          <button className={`admin-tab ${activeTab === 'costs' ? 'active' : ''}`} onClick={() => setActiveTab('costs')}>💰 Costs</button>
          <button className={`admin-tab ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>💳 Payments</button>
          <button className={`admin-tab ${activeTab === 'delivery' ? 'active' : ''}`} onClick={() => setActiveTab('delivery')}>🚚 Delivery</button>
          <button className={`admin-tab ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>🎨 Hero</button>
          <button className={`admin-tab ${activeTab === 'lifestyle' ? 'active' : ''}`} onClick={() => setActiveTab('lifestyle')}>📸 Lifestyle</button>
          <button className={`admin-tab ${activeTab === 'pages' ? 'active' : ''}`} onClick={() => setActiveTab('pages')}>📄 Pages</button>
          <button className={`admin-tab ${activeTab === 'bot' ? 'active' : ''}`} onClick={() => setActiveTab('bot')}>🤖 Chat Bot</button>
        </div>

        {message && <div className="admin-message">{message}</div>}

        {activeTab === 'products' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
              <h3 className="admin-subtitle" style={{margin: 0}}>Products ({products.length})</h3>
              <button className="admin-btn-primary" onClick={() => { setShowProductForm(!showProductForm); setEditingProduct(null); setNewProduct({ name: '', category: categories[0]?.name || '', product_type: 'Perfume', tagline: '', top: '', heart: '', base: '', image: '', price: 1500, selling_price: 1500, stock: 0 }); }}>
                {showProductForm ? '✕ Cancel' : '+ Add Product'}
              </button>
            </div>
            {showProductForm && (
              <div style={{background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px'}}>
                <h4 style={{marginBottom: '15px'}}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h4>
                <div className="admin-form-grid">
                  <input type="text" placeholder="Product Name *" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="admin-input" />
                  <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="admin-input">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <select value={newProduct.product_type} onChange={(e) => setNewProduct({ ...newProduct, product_type: e.target.value })} className="admin-input">
                    {productTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                  <input type="number" placeholder="Price (Rs.)" value={newProduct.selling_price} onChange={(e) => setNewProduct({ ...newProduct, selling_price: e.target.value })} className="admin-input" />
                  <input type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="admin-input" />
                  <input type="text" placeholder="Tagline" value={newProduct.tagline} onChange={(e) => setNewProduct({ ...newProduct, tagline: e.target.value })} className="admin-input admin-input-full" />
                  {newProduct.product_type === 'Perfume' && (
                    <>
                      <input type="text" placeholder="Top Notes" value={newProduct.top} onChange={(e) => setNewProduct({ ...newProduct, top: e.target.value })} className="admin-input" />
                      <input type="text" placeholder="Heart Notes" value={newProduct.heart} onChange={(e) => setNewProduct({ ...newProduct, heart: e.target.value })} className="admin-input" />
                      <input type="text" placeholder="Base Notes" value={newProduct.base} onChange={(e) => setNewProduct({ ...newProduct, base: e.target.value })} className="admin-input admin-input-full" />
                    </>
                  )}
                </div>
                <div className="admin-upload-section">
                  <label className="admin-upload-label">
                    {uploading ? 'Uploading...' : '📤 Upload Product Image *'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e.target.files[0], (url) => setNewProduct({ ...newProduct, image: url }))} />
                  </label>
                  {newProduct.image && <img src={newProduct.image} alt="Preview" className="admin-preview-img" />}
                </div>
                <button onClick={handleAddOrUpdateProduct} className="admin-btn-primary">{editingProduct ? '💾 Update Product' : '+ Add Product'}</button>
              </div>
            )}
            <div className="admin-product-list">
              {products.map(p => (
                <div key={p.id} className="admin-product-row">
                  <img src={p.image} alt={p.name} className="admin-product-img" />
                  <div className="admin-product-info">
                    <div className="admin-product-name">{p.name}</div>
                    <div className="admin-product-cat">{p.for} • {fmtRs(p.price)}</div>
                  </div>
                  <button onClick={() => editProduct({...p, image_url: p.image})} className="admin-btn-primary" style={{padding: '8px 14px', fontSize: '12px', marginRight: '5px'}}>✏️ Edit</button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="admin-btn-delete">🗑️ Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <h3 className="admin-subtitle">Categories ({categories.length})</h3>
            <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
              <input type="text" placeholder="New category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="admin-input" style={{flex: 1}} />
              <button onClick={handleAddCategory} className="admin-btn-primary">+ Add</button>
            </div>
            <div className="admin-product-list">
              {categories.map(c => (
                <div key={c.id} className="admin-product-row">
                  <div className="admin-product-info"><div className="admin-product-name">{c.name}</div></div>
                  <button onClick={() => handleDeleteCategory(c.id)} className="admin-btn-delete">🗑️ Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'types' && (
          <div>
            <h3 className="admin-subtitle">Product Types ({productTypes.length})</h3>
            <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
              <input type="text" placeholder="New product type" value={newProductType} onChange={(e) => setNewProductType(e.target.value)} className="admin-input" style={{flex: 1}} />
              <button onClick={handleAddProductType} className="admin-btn-primary">+ Add</button>
            </div>
            <div className="admin-product-list">
              {productTypes.map(t => (
                <div key={t.id} className="admin-product-row">
                  <div className="admin-product-info"><div className="admin-product-name">{t.name}</div></div>
                  <button onClick={() => handleDeleteProductType(t.id)} className="admin-btn-delete">🗑️ Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'costs' && (
          <div>
            <h3 className="admin-subtitle">Cost Types ({costTypes.length})</h3>
            <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
              <input type="text" placeholder="New cost type" value={newCostType} onChange={(e) => setNewCostType(e.target.value)} className="admin-input" style={{flex: 1}} />
              <button onClick={handleAddCostType} className="admin-btn-primary">+ Add</button>
            </div>
            <div className="admin-product-list">
              {costTypes.map(t => (
                <div key={t.id} className="admin-product-row">
                  <div className="admin-product-info"><div className="admin-product-name">{t.name}</div></div>
                  <button onClick={() => handleDeleteCostType(t.id)} className="admin-btn-delete">🗑️ Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <h3 className="admin-subtitle">Payment Methods ({paymentMethods.length})</h3>
            <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
              <input type="text" placeholder="New payment method" value={newPaymentMethod} onChange={(e) => setNewPaymentMethod(e.target.value)} className="admin-input" style={{flex: 1}} />
              <button onClick={handleAddPaymentMethod} className="admin-btn-primary">+ Add</button>
            </div>
            <div className="admin-product-list">
              {paymentMethods.map(p => (
                <div key={p.id} className="admin-product-row">
                  <div className="admin-product-info"><div className="admin-product-name">{p.name}</div></div>
                  <button onClick={() => handleDeletePaymentMethod(p.id)} className="admin-btn-delete">🗑️ Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div>
            <h3 className="admin-subtitle">🚚 Delivery Settings</h3>
            <div className="admin-form-grid">
              <div className="admin-input-group">
                <label>Base Delivery Charge (Rs.)</label>
                <input type="number" value={deliverySettings.base_charge} onChange={(e) => setDeliverySettings({...deliverySettings, base_charge: e.target.value})} className="admin-input" />
              </div>
              <div className="admin-input-group">
                <label>Free Delivery Threshold (items)</label>
                <input type="number" value={deliverySettings.free_delivery_threshold} onChange={(e) => setDeliverySettings({...deliverySettings, free_delivery_threshold: e.target.value})} className="admin-input" />
              </div>
            </div>
            <p style={{fontSize: '12px', color: '#666', marginBottom: '15px'}}>⚠️ {deliverySettings.free_delivery_threshold}+ items ගත්තොත් delivery FREE.</p>
            <button onClick={handleSaveDelivery} className="admin-btn-primary">💾 Save Delivery Settings</button>
          </div>
        )}

        {activeTab === 'hero' && (
          <div>
            <h3 className="admin-subtitle">Hero Images (Auto Slide)</h3>
            <div className="admin-upload-section">
              <label className="admin-upload-label">
                {newHeroUploading ? 'Uploading...' : '📤 Add Hero Image'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleAddHeroImage(e.target.files[0])} />
              </label>
            </div>
            <div className="admin-image-grid">
              {heroImages.map((img, i) => (
                <div key={i} className="admin-image-item">
                  <img src={img} alt={`Hero ${i + 1}`} className="admin-preview-img" />
                  <button onClick={() => handleDeleteHeroImage(i)} className="admin-btn-delete" style={{ marginTop: '8px', display: 'block', width: '100%' }}>🗑️ Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'lifestyle' && (
          <div>
            <h3 className="admin-subtitle">Lifestyle Images & Details</h3>
            <div className="admin-upload-section">
              <label className="admin-upload-label">
                {newLifestyleUploading ? 'Uploading...' : '📤 Add Lifestyle Image'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleAddLifestyleImage(e.target.files[0])} />
              </label>
            </div>
            {lifestyleDetails.map((detail, i) => (
              <div key={i} className="admin-lifestyle-item">
                <img src={detail.image} alt={`Lifestyle ${i + 1}`} className="admin-preview-img" />
                <div className="admin-form-grid" style={{ marginTop: '10px' }}>
                  <input type="text" placeholder="Eyebrow" value={detail.eyebrow} onChange={(e) => handleUpdateLifestyleDetail(i, 'eyebrow', e.target.value)} className="admin-input admin-input-full" />
                  <input type="text" placeholder="Title" value={detail.title} onChange={(e) => handleUpdateLifestyleDetail(i, 'title', e.target.value)} className="admin-input" />
                  <input type="text" placeholder="Title Accent" value={detail.titleAccent} onChange={(e) => handleUpdateLifestyleDetail(i, 'titleAccent', e.target.value)} className="admin-input" />
                  <textarea placeholder="Description" value={detail.description} onChange={(e) => handleUpdateLifestyleDetail(i, 'description', e.target.value)} className="admin-input admin-input-full" style={{ minHeight: '60px' }}></textarea>
                </div>
                <button onClick={() => handleDeleteLifestyleImage(i)} className="admin-btn-delete" style={{ marginTop: '8px' }}>🗑️ Delete Image</button>
              </div>
            ))}
            <button onClick={handleSaveLifestyleDetails} className="admin-btn-primary" style={{ marginTop: '20px' }}>💾 Save Lifestyle Details</button>
          </div>
        )}

        {activeTab === 'pages' && (
          <div>
            <h3 className="admin-subtitle">{editingPageId ? 'Edit Page' : 'Add New Page'}</h3>
            <div className="admin-form-grid">
              <input type="text" placeholder="Page Title *" value={newPage.title} onChange={(e) => setNewPage({ ...newPage, title: e.target.value })} className="admin-input admin-input-full" />
              <textarea placeholder="Page Content" value={newPage.content} onChange={(e) => setNewPage({ ...newPage, content: e.target.value })} className="admin-input admin-input-full" style={{ minHeight: '120px' }}></textarea>
            </div>
            <button onClick={handleAddPage} className="admin-btn-primary">{editingPageId ? '💾 Update Page' : '+ Add Page'}</button>
            {editingPageId && <button onClick={() => { setEditingPageId(null); setNewPage({ title: '', content: '' }); }} className="admin-btn-delete" style={{ marginLeft: '10px' }}>Cancel Edit</button>}
            <h3 className="admin-subtitle" style={{ marginTop: '30px' }}>Existing Pages</h3>
            <div className="admin-product-list">
              {pages.map(p => (
                <div key={p.id} className="admin-product-row">
                  <div className="admin-product-info"><div className="admin-product-name">{p.title}</div></div>
                  <button onClick={() => { setEditingPageId(p.id); setNewPage({ title: p.title, content: p.content || '' }); }} className="admin-btn-primary" style={{ padding: '8px 14px', fontSize: '12px', marginRight: '5px' }}>✏️ Edit</button>
                  <button onClick={() => handleDeletePage(p.id)} className="admin-btn-delete">🗑️ Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bot' && (
          <div>
            <h3 className="admin-subtitle">🤖 Chat Bot Settings</h3>
            <div style={{marginBottom: '20px'}}>
              <label style={{fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px'}}>Welcome Message</label>
              <input type="text" value={botWelcomeMessage} onChange={(e) => setBotWelcomeMessage(e.target.value)} className="admin-input" placeholder="Hi! How can I help you today?" />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label style={{fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px'}}>System Prompt</label>
              <textarea value={botSystemPrompt} onChange={(e) => setBotSystemPrompt(e.target.value)} className="admin-input" style={{minHeight: '250px', fontFamily: 'monospace', fontSize: '12px'}} placeholder="You are AROMA Assistant..." />
            </div>
            <button onClick={handleSaveBotSettings} className="admin-btn-primary">💾 Save Chat Bot Settings</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// PAGE POPUP
// ============================================================

function PagePopup({ page, onClose }) {
  if (!page) return null;
  return (
    <div className="page-popup-overlay" onClick={onClose}>
      <div className="page-popup-box" onClick={(e) => e.stopPropagation()}>
        <button className="page-popup-close" onClick={onClose}>×</button>
        <h2 className="page-popup-title">{page.title}</h2>
        <p className="page-popup-content">{page.content}</p>
      </div>
    </div>
  );
}

// ============================================================
// APP
// ============================================================

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [costTypes, setCostTypes] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [deliverySettings, setDeliverySettings] = useState({ base_charge: 350, free_delivery_threshold: 3 });
  const [activeFilter, setActiveFilter] = useState("All");
  const [renderCount, setRenderCount] = useState(0);
  const collectionRef = useRef(null);
  const [heroImages, setHeroImages] = useState([DEFAULT_HERO]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [lifestyleImages, setLifestyleImages] = useState([DEFAULT_LIFESTYLE_1, DEFAULT_LIFESTYLE_2]);
  const [lifestyleDetails, setLifestyleDetails] = useState(defaultLifestyleDetails);
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerDistrict, setCustomerDistrict] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showAddedPopup, setShowAddedPopup] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentLifestyleIndex, setCurrentLifestyleIndex] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminAuthOpen, setAdminAuthOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const districts = ["Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"];

  useEffect(() => {
    async function loadData() {
      try {
        const prodData = await dbGetProducts();
        if (prodData && prodData.length > 0) setProducts(prodData.map(mapProductForSite));
        else setProducts(defaultProducts);
        const cats = await dbGetCategories();
        setCategories(cats);
        const types = await dbGetProductTypes();
        setProductTypes(types);
        const costs = await dbGetCostTypes();
        setCostTypes(costs);
        const payments = await dbGetPaymentMethods();
        setPaymentMethods(payments);
        const delivery = await dbGetDeliverySettings();
        setDeliverySettings(delivery);
        const { data: siteData } = await window.supabaseClient.from('site_settings').select('*').limit(1).single();
        if (siteData) {
          if (siteData.hero_images && siteData.hero_images.length > 0) setHeroImages(siteData.hero_images);
          if (siteData.lifestyle_images && siteData.lifestyle_images.length > 0) setLifestyleImages(siteData.lifestyle_images);
          if (siteData.lifestyle_details && siteData.lifestyle_details.length > 0) setLifestyleDetails(siteData.lifestyle_details);
        }
        const { data: pagesData } = await window.supabaseClient.from('pages').select('*').order('created_at', { ascending: true });
        if (pagesData) setPages(pagesData);
      } catch (e) {
        console.error('Load data error:', e);
        setProducts(defaultProducts);
      }
    }
    loadData();
  }, []);

  function mapProductForSite(p) {
    return {
      id: p.id, name: p.name,
      for: p.category ? 'FOR ' + p.category.toUpperCase() : '',
      filter: p.category, category: p.category, product_type: p.product_type || 'Perfume',
      tagline: p.description || '', top: p.top_notes || '', heart: p.heart_notes || '', base: p.base_notes || '',
      image: p.image_url || '',
      price: Number(p.selling_price) || Number(p.price) || 1500,
      selling_price: Number(p.selling_price) || Number(p.price) || 1500,
      stock: p.stock || 0, accent: '#B8963E'
    };
  }

  useEffect(() => {
    async function loadReviews() {
      try {
        const { data: reviewsData } = await window.supabaseClient.from('reviews').select('*').order('created_at', { ascending: false });
        if (reviewsData) setReviews(reviewsData);
      } catch (e) { console.error(e); }
    }
    loadReviews();
    window.__setReviews = setReviews;
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => { setCurrentHeroIndex(prev => (prev + 1) % heroImages.length); }, 5000);
    return () => clearInterval(interval);
  }, [heroImages]);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => { setCurrentReviewIndex(prev => (prev + 1) % reviews.length); }, 5000);
    return () => clearInterval(interval);
  }, [reviews]);

  useEffect(() => {
    if (lifestyleDetails.length <= 1) return;
    const interval = setInterval(() => { setCurrentLifestyleIndex(prev => (prev + 1) % lifestyleDetails.length); }, 5000);
    return () => clearInterval(interval);
  }, [lifestyleDetails]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowAddedPopup(true);
    setTimeout(() => setShowAddedPopup(false), 2000);
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(item => item.id !== id));
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const getSubtotal = () => cartItems.reduce((sum, item) => sum + ((item.price || item.selling_price || 1500) * item.quantity), 0);
  const getDeliveryCharge = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const threshold = Number(deliverySettings.free_delivery_threshold) || 3;
    const base = Number(deliverySettings.base_charge) || 350;
    return totalItems >= threshold ? 0 : base;
  };
  const getTotal = () => getSubtotal() + getDeliveryCharge();
  const getCartCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const sendWhatsAppOrder = async () => {
    if (!customerName || !customerPhone || !customerAddress || !customerDistrict) { alert("Please fill all customer details."); return; }
    if (cartItems.length === 0) { alert("Your cart is empty."); return; }
    try {
      await saveOrderToSupabaseDirect({ customer_name: customerName, customer_phone: customerPhone, customer_address: customerAddress, district: customerDistrict, platform: 'WhatsApp' }, cartItems, getDeliveryCharge());
    } catch (err) { console.error('Order save error:', err); }
    let message = "Hi Aroma Lab! I want to order:\n\n";
    cartItems.forEach(item => { const price = item.price || item.selling_price || 1500; message += `- ${item.name} x ${item.quantity} = Rs. ${price * item.quantity}\n`; });
    message += `\nSubtotal: Rs. ${getSubtotal()}\nDelivery: ${getDeliveryCharge() === 0 ? 'FREE' : 'Rs. ' + getDeliveryCharge()}\nTotal: Rs. ${getTotal()}`;
    message += `\n\nName: ${customerName}\nPhone: ${customerPhone}\nAddress: ${customerAddress}\nDistrict: ${customerDistrict}`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendBankDepositOrder = async () => {
    if (!customerName || !customerPhone || !customerAddress || !customerDistrict) { alert("Please fill all customer details."); return; }
    if (cartItems.length === 0) { alert("Your cart is empty."); return; }
    try {
      await saveOrderToSupabaseDirect({ customer_name: customerName, customer_phone: customerPhone, customer_address: customerAddress, district: customerDistrict, platform: 'Bank Deposit' }, cartItems, getDeliveryCharge());
    } catch (err) { console.error('Order save error:', err); }
    let message = "Hi Aroma Lab! I want to order (Bank Deposit):\n\n";
    cartItems.forEach(item => { const price = item.price || item.selling_price || 1500; message += `- ${item.name} x ${item.quantity} = Rs. ${price * item.quantity}\n`; });
    message += `\nSubtotal: Rs. ${getSubtotal()}\nDelivery: ${getDeliveryCharge() === 0 ? 'FREE' : 'Rs. ' + getDeliveryCharge()}\nTotal: Rs. ${getTotal()}`;
    message += `\n\nName: ${customerName}\nPhone: ${customerPhone}\nAddress: ${customerAddress}\nDistrict: ${customerDistrict}\n\nI will send the bank deposit slip shortly.`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewEmail || !reviewRating || !reviewComment) return;
    try {
      const userImage = loggedInUser?.photoURL || '';
      const { error } = await window.supabaseClient.from('reviews').insert([{ name: reviewName, email: reviewEmail, rating: parseInt(reviewRating), comment: reviewComment, user_image: userImage }]);
      if (error) throw error;
      setReviewName(''); setReviewEmail(''); setReviewRating(''); setReviewComment('');
      const { data: reviewsData } = await window.supabaseClient.from('reviews').select('*').order('created_at', { ascending: false });
      if (reviewsData) setReviews(reviewsData);
      alert('✅ Review submitted successfully!');
    } catch (err) { alert('❌ Error: ' + err.message); }
  };

  const handleCloseAdminAndSignOut = async () => {
    try {
      await window.supabaseClient.auth.signOut();
    } catch (err) { console.error('Supabase signout error:', err); }
    setIsAdminOpen(false);
    try {
      const { data: reviewsData } = await window.supabaseClient.from('reviews').select('*').order('created_at', { ascending: false });
      if (reviewsData) setReviews(reviewsData);
    } catch (err) { console.error('Reviews reload error:', err); }
  };

  window.setAppUser = function(user) {
    if (user) {
      setIsLoggedIn(true);
      setLoggedInUser(user);
      if (!customerName) setCustomerName(user.displayName || '');
      setReviewName(user.displayName || '');
      setReviewEmail(user.email || '');
    } else {
      setIsLoggedIn(false);
      setLoggedInUser(null);
    }
  };

  window.checkAdmin = function(email) {
    if (email === ADMIN_EMAIL) setIsAdmin(true);
    else setIsAdmin(false);
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setRenderCount(c => c + 1);
    setTimeout(() => { collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  };

  const filteredProducts = activeFilter === "All" ? products : products.filter(p => p.filter === activeFilter || p.category === activeFilter);
  const filterLabels = ['All', ...categories.map(c => c.name)];

  return (
    <div className="app-root">
      <CartModal isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} getSubtotal={getSubtotal} getDeliveryCharge={getDeliveryCharge} getTotal={getTotal} getCartCount={getCartCount} customerName={customerName} setCustomerName={setCustomerName} customerPhone={customerPhone} setCustomerPhone={setCustomerPhone} customerAddress={customerAddress} setCustomerAddress={setCustomerAddress} customerDistrict={customerDistrict} setCustomerDistrict={setCustomerDistrict} districts={districts} isLoggedIn={isLoggedIn} sendWhatsAppOrder={sendWhatsAppOrder} sendBankDepositOrder={sendBankDepositOrder} DARAZ_LINK={DARAZ_LINK} />

      {adminAuthOpen && (<AdminAuth onSuccess={() => { setAdminAuthOpen(false); setIsAdminOpen(true); }} onClose={() => setAdminAuthOpen(false)} />)}

      <AdminPanelModal isAdminOpen={isAdminOpen} setIsAdminOpen={setIsAdminOpen} products={products} setProducts={setProducts} heroImages={heroImages} setHeroImages={setHeroImages} lifestyleImages={lifestyleImages} setLifestyleImages={setLifestyleImages} lifestyleDetails={lifestyleDetails} setLifestyleDetails={setLifestyleDetails} pages={pages} setPages={setPages} categories={categories} setCategories={setCategories} productTypes={productTypes} setProductTypes={setProductTypes} costTypes={costTypes} setCostTypes={setCostTypes} paymentMethods={paymentMethods} setPaymentMethods={setPaymentMethods} deliverySettings={deliverySettings} setDeliverySettings={setDeliverySettings} onCloseAndSignOut={handleCloseAdminAndSignOut} />

      <PagePopup page={activePage} onClose={() => setActivePage(null)} />

      {showAddedPopup && <div className="added-popup">✅ Added to Cart!</div>}

      <div className="top-bar">
        <div className="top-bar-inner">
          <span>🚚 FREE DELIVERY ON {deliverySettings.free_delivery_threshold}+ ITEMS</span>
          <span className="divider">|</span>
          <span>🛡️ PREMIUM QUALITY</span>
          <span className="divider">|</span>
          <span>🌿 100% ORIGINAL PRODUCTS</span>
        </div>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <div className="header-logo">
            <img src={LOGO_URL} alt="Aroma Lab" />
            <div className="header-logo-text">
              <div className="title">AROMA LAB</div>
              <div className="subtitle">FINE FRAGRANCES</div>
            </div>
          </div>
          <nav className="header-nav">
            <a href="#" className="active">Home</a>
            <a href="#collection">Shop</a>
            <a href="#" onClick={(e) => { e.preventDefault(); const aboutPage = pages.find(p => p.title.toLowerCase().includes('about')); if (aboutPage) setActivePage(aboutPage); }}>About Us</a>
            <a href="#" onClick={(e) => { e.preventDefault(); const contactPage = pages.find(p => p.title.toLowerCase().includes('contact')); if (contactPage) setActivePage(contactPage); }}>Contact</a>
          </nav>
          <div className="header-icons">
            <button className="icon-btn" title="Search"><SearchIcon /></button>
            <button id="google-login-btn" onClick={() => window.googleLogin()} className="icon-btn" title="Sign in"><UserIcon /></button>
            <button id="google-logout-btn" onClick={() => window.googleLogout()} style={{ display: 'none' }} className="icon-btn" title="Logout"><LogoutIcon /></button>
            {/* Admin button moved to admin.aromalabsl.lk */}
            <button onClick={() => setIsCartOpen(true)} className="icon-btn" title="Cart">
              <CartIcon />
              {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
            </button>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <img key={currentHeroIndex} src={heroImages[currentHeroIndex]} alt="Aroma Lab" className="hero-img" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-content-inner">
            <div className="hero-text">
              <div className="hero-eyebrow">PREMIUM EAU DE PARFUM</div>
              <h1 className="hero-title">Crafted for Every<br /><span className="accent">Mood & Moment</span></h1>
              <p className="hero-desc">From bold and mysterious to fresh and elegant — find your perfect scent.</p>
              <button onClick={() => handleFilter("All")} className="hero-btn">SHOP NOW →</button>
            </div>
          </div>
        </div>
        {heroImages.length > 1 && (
          <div className="hero-dots">
            {heroImages.map((_, i) => (<button key={i} className={`hero-dot ${i === currentHeroIndex ? 'active' : ''}`} onClick={() => setCurrentHeroIndex(i)}></button>))}
          </div>
        )}
      </section>

      <section className="trust-badges">
        <div className="trust-grid">
          {[{ icon: "🌿", title: "PREMIUM QUALITY", desc: "Finest ingredients, long lasting scents" }, { icon: "🛡️", title: "TRUSTED BRAND", desc: "Authentic & original products" }, { icon: "🚚", title: "FAST DELIVERY", desc: "Islandwide delivery" }, { icon: "⭐", title: "CUSTOMER SATISFACTION", desc: "Your happiness, our priority" }].map((item, i) => (
            <div key={i} className="trust-item">
              <div className="trust-icon">{item.icon}</div>
              <div><div className="trust-title">{item.title}</div><div className="trust-desc">{item.desc}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section ref={collectionRef} id="collection" className="collection-section">
        <div className="collection-header">
          <div className="collection-eyebrow">OUR COLLECTION</div>
          <h2 className="collection-title">Explore Our <span className="accent">Signature Scents</span></h2>
        </div>
        <div className="filter-buttons">
          {filterLabels.map((label) => (<button key={label} onClick={() => handleFilter(label)} className={`filter-btn ${activeFilter === label ? 'active' : ''}`}>{label === 'All' ? 'All' : label}</button>))}
        </div>
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-img-wrap">
                {product.image ? <img src={product.image} alt={product.name} /> : <div className="product-img-placeholder">{product.name}</div>}
                <div className="product-badge-for">{product.for}</div>
                <div className="product-badge-price">{fmtRs(product.price)}</div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-tagline">{product.tagline}</div>
                {product.product_type === 'Perfume' && (product.top || product.heart || product.base) && (
                  <div className="product-notes">
                    {product.top && <div><div className="note-label">Top</div><div className="note-value">{product.top}</div></div>}
                    {product.heart && <div><div className="note-label">Heart</div><div className="note-value">{product.heart}</div></div>}
                    {product.base && <div><div className="note-label">Base</div><div className="note-value">{product.base}</div></div>}
                  </div>
                )}
                <button onClick={() => addToCart(product)} className="btn-add-cart">ADD TO CART</button>
                <a href={DARAZ_LINK} target="_blank" rel="noopener" className="btn-order-daraz">ORDER ON DARAZ</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lifestyle-section">
        <div className="lifestyle-slider">
          <button className="lifestyle-nav lifestyle-nav-prev" onClick={() => setCurrentLifestyleIndex(prev => (prev - 1 + lifestyleDetails.length) % lifestyleDetails.length)}><ChevronLeft /></button>
          <div className="lifestyle-slider-inner">
            {lifestyleDetails.map((detail, index) => (
              <div key={index} className={`lifestyle-slide ${index === currentLifestyleIndex ? 'active' : ''}`}>
                <div className="lifestyle-slide-img"><img src={detail.image} alt={detail.title} /></div>
                <div className="lifestyle-slide-content">
                  <div className="lifestyle-eyebrow">{detail.eyebrow}</div>
                  <h3 className="lifestyle-title">{detail.title}<br /><span className="accent">{detail.titleAccent}</span></h3>
                  <p className="lifestyle-desc">"{detail.description}"</p>
                  <div className="lifestyle-buttons">
                    <a href={DARAZ_LINK} target="_blank" rel="noopener" className="btn-gold">BUY ON DARAZ</a>
                    <a href={`${WHATSAPP_LINK}?text=${encodeURIComponent(`Hi Aroma Lab! I want to order ${detail.title}`)}`} target="_blank" rel="noopener" className="btn-white">WHATSAPP</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="lifestyle-nav lifestyle-nav-next" onClick={() => setCurrentLifestyleIndex(prev => (prev + 1) % lifestyleDetails.length)}><ChevronRight /></button>
        </div>
        {lifestyleDetails.length > 1 && (
          <div className="lifestyle-dots">
            {lifestyleDetails.map((_, i) => (<button key={i} className={`lifestyle-dot ${i === currentLifestyleIndex ? 'active' : ''}`} onClick={() => setCurrentLifestyleIndex(i)}></button>))}
          </div>
        )}
      </section>

      <section className="koko-section">
        <div className="koko-box">
          <div className="koko-info">
            <div className="koko-logo">KOKO</div>
            <div><div className="koko-title">Buy Now, Pay Later</div><div className="koko-desc">Pay in 3 installments with any debit / credit card • 0% interest</div></div>
          </div>
          <a href={DARAZ_LINK} target="_blank" rel="noopener" className="btn-koko-order">ORDER ON DARAZ</a>
        </div>
      </section>

      <ReviewSection isLoggedIn={isLoggedIn} reviewName={reviewName} setReviewName={setReviewName} reviewEmail={reviewEmail} setReviewEmail={setReviewEmail} reviewRating={reviewRating} setReviewRating={setReviewRating} reviewComment={reviewComment} setReviewComment={setReviewComment} handleReviewSubmit={handleReviewSubmit} reviews={reviews} currentReviewIndex={currentReviewIndex} setCurrentReviewIndex={setCurrentReviewIndex} />

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-col-1">
            <div className="footer-logo">
              <img src={LOGO_URL} alt="Aroma Lab" />
              <div className="footer-logo-text"><div className="title">AROMA LAB</div><div className="subtitle">FINE FRAGRANCES</div></div>
            </div>
            <p className="footer-desc">Fine Fragrances based in Colombo, Sri Lanka. Premium Eau De Parfum 15ml with high quality fragrance oils, long lasting 12+ hours.</p>
          </div>
          <div className="footer-col-2">
            <div className="footer-heading">QUICK LINKS</div>
            <div className="footer-links">
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
              <a href="#collection">Shop</a>
              <a href="#" onClick={(e) => { e.preventDefault(); const p = pages.find(p => p.title.toLowerCase().includes('about')); if (p) setActivePage(p); }}>About Us</a>
              <a href="#" onClick={(e) => { e.preventDefault(); const p = pages.find(p => p.title.toLowerCase().includes('contact')); if (p) setActivePage(p); }}>Contact</a>
            </div>
            <div className="footer-heading" style={{ marginTop: '24px' }}>LEGAL</div>
            <div className="footer-links">
              <a href="#" onClick={(e) => { e.preventDefault(); const p = pages.find(p => p.title.toLowerCase().includes('privacy')); if (p) setActivePage(p); }}>Privacy Policy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); const p = pages.find(p => p.title.toLowerCase().includes('terms')); if (p) setActivePage(p); }}>Terms & Conditions</a>
              <a href="#" onClick={(e) => { e.preventDefault(); const p = pages.find(p => p.title.toLowerCase().includes('return')); if (p) setActivePage(p); }}>Return Policy</a>
            </div>
          </div>
          <div className="footer-col-3">
            <div className="footer-heading">CONNECT WITH US</div>
            <div className="footer-socials">
              <a href="https://www.facebook.com/aromalabsl" target="_blank" rel="noopener noreferrer" className="footer-social-btn facebook"><FacebookIcon /></a>
              <a href="https://wa.me/94777804705" target="_blank" rel="noopener" className="footer-social-btn whatsapp"><WhatsappIcon /></a>
              <a href={DARAZ_LINK} target="_blank" rel="noopener" className="footer-social-btn daraz"><DarazIcon /></a>
            </div>
          </div>
          <div className="footer-col-4">
            <div className="footer-heading">CONTACT US</div>
            <div className="footer-links footer-contact">
              <a href="tel:+94777804705" className="footer-contact-item"><PhoneIcon /> 0777 804 705</a>
              <span className="footer-contact-item"><MapPinIcon /> Colombo, Sri Lanka</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} AROMA LAB FINE FRAGRANCES • ALL RIGHTS RESERVED</span></div>
      </footer>
      <div style={{ height: '40px' }}></div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
