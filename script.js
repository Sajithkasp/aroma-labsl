const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;
const { BrowserRouter, Switch, Route, Link, useHistory, useLocation } = ReactRouterDOM;
const useNavigate = () => {
  const history = useHistory();
  return (path) => history.push(path);
};

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
const ChevronLeft = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const ChevronRight = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>);
const FacebookIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>);
const WhatsappIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>);
const DarazIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>);
const PhoneIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>);
const MapPinIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>);
const MenuIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const CloseIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

// ============================================================
// HELPERS
// ============================================================
function fmtRs(num) {
  const n = Number(num) || 0;
  return 'Rs. ' + n.toLocaleString('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// ============================================================
// DATABASE — Supabase
// ============================================================
async function dbGetCategories() {
  const { data, error } = await window.supabaseClient.from('categories').select('*').order('display_order', { ascending: true });
  if (error) return [];
  return data || [];
}
async function dbGetProductTypes() {
  const { data, error } = await window.supabaseClient.from('product_types').select('*').order('display_order', { ascending: true });
  if (error) return [];
  return data || [];
}
async function dbGetProducts() {
  const { data, error } = await window.supabaseClient.from('products').select('*').order('created_at', { ascending: true });
  if (error) return [];
  return data || [];
}
async function dbGetDeliverySettings() {
  const { data, error } = await window.supabaseClient.from('delivery_settings').select('*').eq('id', 1).single();
  if (error) return { base_charge: 350, free_delivery_threshold: 3 };
  return data || { base_charge: 350, free_delivery_threshold: 3 };
}

// ============================================================
// ORDER SAVE — UNCHANGED
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
// MENU DRAWER
// ============================================================
function MenuDrawer({ isOpen, onClose, categories, productTypes, onFilter }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNavClick = (path) => {
    onClose();
    navigate(path);
  };

  const handleCategoryClick = (catName) => {
    onClose();
    navigate('/');
    setTimeout(() => {
      if (onFilter) onFilter(catName);
      const el = document.getElementById('collection');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  return (
    <>
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <aside className={`menu-drawer ${isOpen ? 'open' : ''}`}>
        <div className="menu-drawer-header">
          <div className="menu-drawer-logo">
            <img src={LOGO_URL} alt="Aroma Lab" />
            <div>
              <div className="menu-drawer-title">AROMA LAB</div>
              <div className="menu-drawer-subtitle">FINE FRAGRANCES</div>
            </div>
          </div>
          <button className="menu-drawer-close" onClick={onClose} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        <div className="menu-drawer-body">
          <div className="menu-section">
            <div className="menu-section-label">MENU</div>
            <nav className="menu-nav">
              <button className={`menu-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => handleNavClick('/')}>
                <span className="menu-link-icon">🏠</span>
                <span>Home</span>
              </button>
              <button className="menu-link" onClick={() => { onClose(); setTimeout(() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }), 200); }}>
                <span className="menu-link-icon">🛍️</span>
                <span>Shop</span>
              </button>
              <button className={`menu-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={() => handleNavClick('/about')}>
                <span className="menu-link-icon">ℹ️</span>
                <span>About Us</span>
              </button>
              <button className={`menu-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={() => handleNavClick('/contact')}>
                <span className="menu-link-icon">📞</span>
                <span>Contact</span>
              </button>
            </nav>
          </div>

          {categories.length > 0 && (
            <div className="menu-section">
              <div className="menu-section-label">SHOP BY CATEGORY</div>
              <nav className="menu-nav">
                {categories.map(cat => (
                  <button key={cat.id} className="menu-link menu-link-category" onClick={() => handleCategoryClick(cat.name)}>
                    <span className="menu-bullet"></span>
                    <span>{cat.name}</span>
                    <span className="menu-arrow">→</span>
                  </button>
                ))}
              </nav>
            </div>
          )}

          {productTypes.length > 0 && (
            <div className="menu-section">
              <div className="menu-section-label">PRODUCT TYPES</div>
              <nav className="menu-nav">
                {productTypes.map(type => (
                  <button key={type.id} className="menu-link menu-link-category" onClick={() => handleCategoryClick(type.name)}>
                    <span className="menu-bullet"></span>
                    <span>{type.name}</span>
                    <span className="menu-arrow">→</span>
                  </button>
                ))}
              </nav>
            </div>
          )}

          <div className="menu-section">
            <div className="menu-section-label">GET IN TOUCH</div>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className="menu-cta menu-cta-whatsapp">
              <WhatsappIcon />
              <span>Order via WhatsApp</span>
            </a>
            <a href={DARAZ_LINK} target="_blank" rel="noopener" className="menu-cta menu-cta-daraz">
              <DarazIcon />
              <span>Order on Daraz</span>
            </a>
          </div>
        </div>

        <div className="menu-drawer-footer">
          <span>© {new Date().getFullYear()} AROMA LAB</span>
        </div>
      </aside>
    </>
  );
}

// ============================================================
// DYNAMIC PAGE
// ============================================================
function DynamicPage({ slug }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPage() {
      setLoading(true);
      try {
        const { data, error } = await window.supabaseClient
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) setPage(data);
        else setPage(null);
      } catch (e) {
        console.error('Page load error:', e);
        setPage(null);
      }
      setLoading(false);
    }
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="page-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="page-not-found">
        <h1>Page Not Found</h1>
        <p>The page you are looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="page-back-btn">← Back to Home</button>
      </div>
    );
  }

  return (
    <div className="dynamic-page">
      <div className="dynamic-page-header">
        <button onClick={() => navigate('/')} className="page-back-btn">← Back to Home</button>
        <div className="dynamic-page-eyebrow">AROMA LAB</div>
        <h1 className="dynamic-page-title">{page.title}</h1>
        <div className="dynamic-page-divider"></div>
      </div>
      <div className="dynamic-page-content">
        <p>{page.content}</p>
      </div>
    </div>
  );
}

// ============================================================
// CART PAGE
// ============================================================
function CartPage({ cartItems, removeFromCart, updateQuantity, getSubtotal, getDeliveryCharge, getTotal, customerName, setCustomerName, customerPhone, setCustomerPhone, customerAddress, setCustomerAddress, customerDistrict, setCustomerDistrict, districts, isLoggedIn, sendWhatsAppOrder, sendBankDepositOrder }) {
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page-header">
          <button onClick={() => navigate('/')} className="page-back-btn">← Back to Home</button>
          <h1 className="cart-page-title">Your Cart</h1>
        </div>
        <div className="cart-page-empty">
          <div className="cart-page-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some fragrances to get started!</p>
          <button onClick={() => navigate('/')} className="hero-btn">SHOP NOW →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <button onClick={() => navigate('/')} className="page-back-btn">← Back to Home</button>
        <h1 className="cart-page-title">Your Cart</h1>
      </div>

      <div className="cart-daraz-banner">
        <p className="cart-daraz-title">🏆 Best Option: Order on Daraz</p>
        <p className="cart-daraz-desc">Cash on Delivery & KOKO Pay Later available • Safe returns</p>
      </div>

      <div className="cart-page-items">
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
  );
}

// ============================================================
// REVIEW SECTION — UNCHANGED
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
// HOME PAGE
// ============================================================
function HomePage({ products, categories, activeFilter, heroImages, currentHeroIndex, setCurrentHeroIndex, lifestyleDetails, currentLifestyleIndex, setCurrentLifestyleIndex, collectionRef, handleFilter, addToCart, deliverySettings, isLoggedIn, reviews, reviewName, setReviewName, reviewEmail, setReviewEmail, reviewRating, setReviewRating, reviewComment, setReviewComment, handleReviewSubmit, currentReviewIndex, setCurrentReviewIndex }) {
  const filteredProducts = activeFilter === "All"
    ? products
    : products.filter(p => p.filter === activeFilter || p.category === activeFilter || p.product_type === activeFilter);

  const filterLabels = ['All', ...categories.map(c => c.name)];

  return (
    <>
      <section className="hero-section">
        <img key={currentHeroIndex} src={heroImages[currentHeroIndex]} alt="Aroma Lab" className="hero-img" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-content-inner">
            <div className="hero-text">
              <div className="hero-eyebrow">PREMIUM EAU DE PARFUM</div>
              <h2 className="hero-title">AROMA LAB - Fine Fragrances<br /><span className="accent">Crafted for Every Mood & Moment</span></h2>
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

      <ReviewSection
        isLoggedIn={isLoggedIn}
        reviewName={reviewName} setReviewName={setReviewName}
        reviewEmail={reviewEmail} setReviewEmail={setReviewEmail}
        reviewRating={reviewRating} setReviewRating={setReviewRating}
        reviewComment={reviewComment} setReviewComment={setReviewComment}
        handleReviewSubmit={handleReviewSubmit}
        reviews={reviews}
        currentReviewIndex={currentReviewIndex}
        setCurrentReviewIndex={setCurrentReviewIndex}
      />
    </>
  );
}

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [deliverySettings, setDeliverySettings] = useState({ base_charge: 350, free_delivery_threshold: 3 });
  const [activeFilter, setActiveFilter] = useState("All");
  const collectionRef = useRef(null);
  const [heroImages, setHeroImages] = useState([DEFAULT_HERO]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [lifestyleDetails, setLifestyleDetails] = useState(defaultLifestyleDetails);
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerDistrict, setCustomerDistrict] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showAddedPopup, setShowAddedPopup] = useState(false);
  const [currentLifestyleIndex, setCurrentLifestyleIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        const delivery = await dbGetDeliverySettings();
        setDeliverySettings(delivery);
        const { data: siteData } = await window.supabaseClient.from('site_settings').select('*').limit(1).single();
        if (siteData) {
          if (siteData.hero_images && siteData.hero_images.length > 0) setHeroImages(siteData.hero_images);
          if (siteData.lifestyle_details && siteData.lifestyle_details.length > 0) setLifestyleDetails(siteData.lifestyle_details);
        }
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
    const { data: authListener } = window.supabaseClient.auth.onAuthStateChange((event, session) => {
      setTimeout(() => { loadReviews(); }, 100);
    });
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') loadReviews();
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      if (authListener && authListener.subscription) authListener.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
    // Admin moved to separate subdomain
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setTimeout(() => { collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  };

  return (
    <BrowserRouter>
      <div className="app-root">
        <MenuDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          categories={categories}
          productTypes={productTypes}
          onFilter={handleFilter}
        />

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
            <button className="header-menu-btn" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </button>

            <Link to="/" className="header-logo">
              <img src={LOGO_URL} alt="Aroma Lab" />
              <div className="header-logo-text">
                <div className="title">AROMA LAB</div>
                <div className="subtitle">FINE FRAGRANCES</div>
              </div>
            </Link>

            <nav className="header-nav">
              <Link to="/">Home</Link>
              <a href="#collection">Shop</a>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
            </nav>

            <div className="header-icons">
              <button className="icon-btn" title="Search"><SearchIcon /></button>
              <button id="google-login-btn" onClick={() => window.googleLogin()} className="icon-btn" title="Sign in"><UserIcon /></button>
              <button id="google-logout-btn" onClick={() => window.googleLogout()} style={{ display: 'none' }} className="icon-btn" title="Logout"><LogoutIcon /></button>
              <Link to="/cart" className="icon-btn" title="Cart">
                <CartIcon />
                {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
              </Link>
            </div>
          </div>
        </header>

        <Switch>
          <Route exact path="/" render={() => (
            <HomePage
              products={products}
              categories={categories}
              activeFilter={activeFilter}
              heroImages={heroImages}
              currentHeroIndex={currentHeroIndex}
              setCurrentHeroIndex={setCurrentHeroIndex}
              lifestyleDetails={lifestyleDetails}
              currentLifestyleIndex={currentLifestyleIndex}
              setCurrentLifestyleIndex={setCurrentLifestyleIndex}
              collectionRef={collectionRef}
              handleFilter={handleFilter}
              addToCart={addToCart}
              deliverySettings={deliverySettings}
              isLoggedIn={isLoggedIn}
              reviews={reviews}
              reviewName={reviewName} setReviewName={setReviewName}
              reviewEmail={reviewEmail} setReviewEmail={setReviewEmail}
              reviewRating={reviewRating} setReviewRating={setReviewRating}
              reviewComment={reviewComment} setReviewComment={setReviewComment}
              handleReviewSubmit={handleReviewSubmit}
              currentReviewIndex={currentReviewIndex}
              setCurrentReviewIndex={setCurrentReviewIndex}
            />
          )} />
          <Route path="/about" render={() => <DynamicPage slug="about" />} />
          <Route path="/contact" render={() => <DynamicPage slug="contact" />} />
          <Route path="/privacy" render={() => <DynamicPage slug="privacy" />} />
          <Route path="/terms" render={() => <DynamicPage slug="terms" />} />
          <Route path="/return-policy" render={() => <DynamicPage slug="return-policy" />} />
          <Route path="/cart" render={() => (
            <CartPage
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              getSubtotal={getSubtotal}
              getDeliveryCharge={getDeliveryCharge}
              getTotal={getTotal}
              customerName={customerName} setCustomerName={setCustomerName}
              customerPhone={customerPhone} setCustomerPhone={setCustomerPhone}
              customerAddress={customerAddress} setCustomerAddress={setCustomerAddress}
              customerDistrict={customerDistrict} setCustomerDistrict={setCustomerDistrict}
              districts={districts}
              isLoggedIn={isLoggedIn}
              sendWhatsAppOrder={sendWhatsAppOrder}
              sendBankDepositOrder={sendBankDepositOrder}
            />
          )} />
        </Switch>

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
                <Link to="/">Home</Link>
                <a href="#collection">Shop</a>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
              </div>
              <div className="footer-heading" style={{ marginTop: '24px' }}>LEGAL</div>
              <div className="footer-links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms & Conditions</Link>
                <Link to="/return-policy">Return Policy</Link>
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
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
