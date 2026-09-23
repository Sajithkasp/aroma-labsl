const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;

const DARAZ_LINK = "https://www.daraz.lk/products/aroma-lab-fine-fragrances-eau-de-parfum-15ml-5-scents-collection-long-lasting-12-hours-for-men-women-i1772233780-s12967079838.html";
const WHATSAPP_LINK = "https://wa.me/94777804705";
const LOGO_URL = "https://sajithkasp.github.io/aroma-labsl/logo.png";
const ADMIN_EMAIL = "sajith.kasp@gmail.com";

const defaultProducts = [
  { id: "goodgirl", name: "Good Girl", for: "FOR LADIES", filter: "Ladies", tagline: "Sweet, Floral & Sensual", top: "Almond, Coffee", heart: "Jasmine, Tuberose", base: "Cocoa, Vanilla, Tonka Bean", image: "https://sajithkasp.github.io/aroma-labsl/goodgirl.jpg", accent: "#E8A8C0" },
  { id: "black", name: "Black Temptation", for: "FOR LADIES", filter: "Ladies", tagline: "Dark, Mysterious & Seductive", top: "Blackcurrant, Pear", heart: "Jasmine, Orange Blossom", base: "Vanilla, Praline, Musk", image: "https://sajithkasp.github.io/aroma-labsl/black.jpg", accent: "#2A2A2A" },
  { id: "hunter", name: "Hunters Dusk", for: "FOR MEN", filter: "Men", tagline: "Woody, Smoky & Adventurous", top: "Bergamot, Pine", heart: "Cedarwood, Leather", base: "Amber, Musk, Vetiver", image: "https://sajithkasp.github.io/aroma-labsl/hunter.jpg", accent: "#4A5A3A" },
  { id: "gold", name: "Million Gold", for: "FOR MEN", filter: "Men", tagline: "Rich, Luxurious & Powerful", top: "Blood Mandarin, Grapefruit", heart: "Cinnamon, Rose", base: "Amber, Leather, Patchouli", image: "https://sajithkasp.github.io/aroma-labsl/gold.jpg", accent: "#B8963E" },
  { id: "vanilla", name: "Vanilla", for: "FOR UNISEX", filter: "Unisex", tagline: "Warm, Sweet & Cozy", top: "Vanilla Orchid, Mandarin", heart: "Vanilla, Jasmine", base: "Sandalwood, Musk", image: "https://sajithkasp.github.io/aroma-labsl/vanilla.jpg", accent: "#D4B896" }
];

const DEFAULT_HERO = "https://sajithkasp.github.io/aroma-labsl/hero.jpg";
const DEFAULT_LIFESTYLE_1 = "https://sajithkasp.github.io/aroma-labsl/lifestyle.jpg";
const DEFAULT_LIFESTYLE_2 = "https://sajithkasp.github.io/aroma-labsl/lifestyle2.jpg";

// === CART MODAL COMPONENT ===
function CartModal({ 
  isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, 
  getSubtotal, getDeliveryCharge, getTotal, getCartCount,
  customerName, setCustomerName, customerPhone, setCustomerPhone,
  customerAddress, setCustomerAddress, customerDistrict, setCustomerDistrict,
  districts, isLoggedIn, sendWhatsAppOrder, sendBankDepositOrder, DARAZ_LINK
}) {
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
                  <div className="cart-item-price">Rs. 1,500 each</div>
                </div>
                <div className="cart-qty-controls">
                  <button className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span className="cart-qty-num">{item.quantity}</span>
                  <button className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item-total">Rs. {(1500 * item.quantity).toLocaleString()}</div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            ))}
          </div>
        )}

        <div className="cart-totals">
          <div className="cart-total-row"><span>Subtotal</span><span>Rs. {getSubtotal().toLocaleString()}</span></div>
          <div className="cart-total-row"><span>Delivery</span><span>{getDeliveryCharge() === 0 ? 'FREE 🎉' : `Rs. ${getDeliveryCharge()}`}</span></div>
          {getDeliveryCharge() > 0 && (
            <p className="cart-delivery-hint">Add {3 - getCartCount()} more item(s) for FREE delivery!</p>
          )}
          <div className="cart-total-row cart-total-final"><span>Total</span><span>Rs. {getTotal().toLocaleString()}</span></div>
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
          <div className="cart-login-warning">
            <p>Please sign in with Google to place an order.</p>
          </div>
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

          {isLoggedIn && (
            <button onClick={sendWhatsAppOrder} className="cart-btn cart-btn-whatsapp">💬 Order via WhatsApp</button>
          )}
        </div>
      </div>
    </div>
  );
}

// === ADMIN PANEL MODAL ===
function AdminPanelModal({ isAdminOpen, setIsAdminOpen, products, setProducts, heroImage, setHeroImage, lifestyle1, setLifestyle1, lifestyle2, setLifestyle2 }) {
  const [activeTab, setActiveTab] = useState('products');
  const [message, setMessage] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Ladies', tagline: '', top: '', heart: '', base: '', image: ''
  });

  if (!isAdminOpen) return null;

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.image) {
      setMessage('❌ Product name and image URL are required.');
      return;
    }
    try {
      const { data, error } = await window.supabaseClient.from('products').insert([{
        name: newProduct.name,
        price: 'Rs. 1,500',
        category: newProduct.category,
        description: newProduct.tagline,
        top_notes: newProduct.top,
        heart_notes: newProduct.heart,
        base_notes: newProduct.base,
        image_url: newProduct.image
      }]).select();

      if (error) throw error;

      const fresh = await window.supabaseClient.from('products').select('*').order('created_at', { ascending: true });
      setProducts(fresh.data || []);
      setNewProduct({ name: '', category: 'Ladies', tagline: '', top: '', heart: '', base: '', image: '' });
      setMessage('✅ Product added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const { error } = await window.supabaseClient.from('products').delete().eq('id', id);
      if (error) throw error;
      const fresh = await window.supabaseClient.from('products').select('*').order('created_at', { ascending: true });
      setProducts(fresh.data || []);
      setMessage('✅ Product deleted.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
  };

  const handleSaveSiteSettings = async () => {
    try {
      const { error } = await window.supabaseClient.from('site_settings').update({
        hero_images: [heroImage],
        lifestyle_image_1: lifestyle1,
        lifestyle_image_2: lifestyle2,
        updated_at: new Date().toISOString()
      }).eq('id', 1);
      if (error) throw error;
      setMessage('✅ Site settings saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="admin-overlay">
      <div className="admin-box">
        <button className="admin-close" onClick={() => setIsAdminOpen(false)}>×</button>
        <h2 className="admin-title">Admin Panel</h2>

        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Products</button>
          <button className={`admin-tab ${activeTab === 'images' ? 'active' : ''}`} onClick={() => setActiveTab('images')}>Site Images</button>
        </div>

        {message && <div className="admin-message">{message}</div>}

        {activeTab === 'products' && (
          <div>
            <h3 className="admin-subtitle">Add New Product</h3>
            <div className="admin-form-grid">
              <input type="text" placeholder="Product Name *" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="admin-input" />
              <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="admin-input">
                <option value="Ladies">Ladies</option>
                <option value="Men">Men</option>
                <option value="Unisex">Unisex</option>
              </select>
              <input type="text" placeholder="Tagline (e.g. Sweet, Floral & Sensual)" value={newProduct.tagline} onChange={(e) => setNewProduct({ ...newProduct, tagline: e.target.value })} className="admin-input" />
              <input type="text" placeholder="Top Notes" value={newProduct.top} onChange={(e) => setNewProduct({ ...newProduct, top: e.target.value })} className="admin-input" />
              <input type="text" placeholder="Heart Notes" value={newProduct.heart} onChange={(e) => setNewProduct({ ...newProduct, heart: e.target.value })} className="admin-input" />
              <input type="text" placeholder="Base Notes" value={newProduct.base} onChange={(e) => setNewProduct({ ...newProduct, base: e.target.value })} className="admin-input" />
              <input type="text" placeholder="Image URL *" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} className="admin-input admin-input-full" />
            </div>
            <button onClick={handleAddProduct} className="admin-btn-primary">+ Add Product</button>

            <h3 className="admin-subtitle" style={{ marginTop: '30px' }}>Existing Products</h3>
            <div className="admin-product-list">
              {products.map(p => (
                <div key={p.id} className="admin-product-row">
                  <img src={p.image} alt={p.name} className="admin-product-img" />
                  <div className="admin-product-info">
                    <div className="admin-product-name">{p.name}</div>
                    <div className="admin-product-cat">{p.for}</div>
                  </div>
                  <button onClick={() => handleDeleteProduct(p.id)} className="admin-btn-delete">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div>
            <h3 className="admin-subtitle">Hero Image</h3>
            <input type="text" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} className="admin-input admin-input-full" placeholder="Hero image URL" />

            <h3 className="admin-subtitle" style={{ marginTop: '20px' }}>Lifestyle Image 1</h3>
            <input type="text" value={lifestyle1} onChange={(e) => setLifestyle1(e.target.value)} className="admin-input admin-input-full" placeholder="Lifestyle image 1 URL" />

            <h3 className="admin-subtitle" style={{ marginTop: '20px' }}>Lifestyle Image 2</h3>
            <input type="text" value={lifestyle2} onChange={(e) => setLifestyle2(e.target.value)} className="admin-input admin-input-full" placeholder="Lifestyle image 2 URL" />

            <button onClick={handleSaveSiteSettings} className="admin-btn-primary" style={{ marginTop: '20px' }}>Save Site Settings</button>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [renderCount, setRenderCount] = useState(0);
  const collectionRef = useRef(null);

  // Hero & Lifestyle Images
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO);
  const [lifestyle1, setLifestyle1] = useState(DEFAULT_LIFESTYLE_1);
  const [lifestyle2, setLifestyle2] = useState(DEFAULT_LIFESTYLE_2);

  // Cart States
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerDistrict, setCustomerDistrict] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showAddedPopup, setShowAddedPopup] = useState(false);

  // Admin States
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const districts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
  ];

  // === LOAD FROM SUPABASE ===
  useEffect(() => {
    async function loadData() {
      try {
        // Load Products
        const { data: prodData, error: prodErr } = await window.supabaseClient.from('products').select('*').order('created_at', { ascending: true });
        if (!prodErr && prodData && prodData.length > 0) {
          const mapped = prodData.map(p => ({
            id: p.id,
            name: p.name,
            for: p.category === 'Ladies' ? 'FOR LADIES' : p.category === 'Men' ? 'FOR MEN' : 'FOR UNISEX',
            filter: p.category,
            tagline: p.description || '',
            top: p.top_notes || '',
            heart: p.heart_notes || '',
            base: p.base_notes || '',
            image: p.image_url || '',
            accent: '#B8963E'
          }));
          setProducts(mapped);
        } else {
          setProducts(defaultProducts);
        }

        // Load Site Settings
        const { data: siteData } = await window.supabaseClient.from('site_settings').select('*').limit(1).single();
        if (siteData) {
          if (siteData.hero_images && siteData.hero_images.length > 0) setHeroImage(siteData.hero_images[0]);
          if (siteData.lifestyle_image_1) setLifestyle1(siteData.lifestyle_image_1);
          if (siteData.lifestyle_image_2) setLifestyle2(siteData.lifestyle_image_2);
        }
      } catch (e) {
        console.error(e);
        setProducts(defaultProducts);
      }
    }
    loadData();
  }, []);

  // === CART FUNCTIONS ===
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

  const getSubtotal = () => cartItems.reduce((sum, item) => sum + (1500 * item.quantity), 0);
  const getDeliveryCharge = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return totalItems >= 3 ? 0 : 350;
  };
  const getTotal = () => getSubtotal() + getDeliveryCharge();
  const getCartCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const sendWhatsAppOrder = () => {
    if (!customerName || !customerPhone || !customerAddress || !customerDistrict) {
      alert("Please fill all customer details."); return;
    }
    if (cartItems.length === 0) { alert("Your cart is empty."); return; }
    let message = "Hi Aroma Lab! I want to order:\n\n";
    cartItems.forEach(item => { message += `- ${item.name} x ${item.quantity} = Rs. ${1500 * item.quantity}\n`; });
    message += `\nSubtotal: Rs. ${getSubtotal()}\nDelivery: ${getDeliveryCharge() === 0 ? 'FREE' : 'Rs. ' + getDeliveryCharge()}\nTotal: Rs. ${getTotal()}`;
    message += `\n\nName: ${customerName}\nPhone: ${customerPhone}\nAddress: ${customerAddress}\nDistrict: ${customerDistrict}`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendBankDepositOrder = () => {
    if (!customerName || !customerPhone || !customerAddress || !customerDistrict) {
      alert("Please fill all customer details."); return;
    }
    if (cartItems.length === 0) { alert("Your cart is empty."); return; }
    let message = "Hi Aroma Lab! I want to order (Bank Deposit):\n\n";
    cartItems.forEach(item => { message += `- ${item.name} x ${item.quantity} = Rs. ${1500 * item.quantity}\n`; });
    message += `\nSubtotal: Rs. ${getSubtotal()}\nDelivery: ${getDeliveryCharge() === 0 ? 'FREE' : 'Rs. ' + getDeliveryCharge()}\nTotal: Rs. ${getTotal()}`;
    message += `\n\nName: ${customerName}\nPhone: ${customerPhone}\nAddress: ${customerAddress}\nDistrict: ${customerDistrict}`;
    message += `\n\nI will send the bank deposit slip shortly.`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // === FIREBASE USER CONNECTION ===
  window.setAppUser = function(user) {
    if (user) {
      setIsLoggedIn(true);
      setLoggedInUser(user);
      if (!customerName) setCustomerName(user.displayName || '');
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

  const filteredProducts = activeFilter === "All" ? products : products.filter(p => p.filter === activeFilter);

  return (
    <div className="app-root">
      <CartModal 
        isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}
        cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity}
        getSubtotal={getSubtotal} getDeliveryCharge={getDeliveryCharge} getTotal={getTotal} getCartCount={getCartCount}
        customerName={customerName} setCustomerName={setCustomerName}
        customerPhone={customerPhone} setCustomerPhone={setCustomerPhone}
        customerAddress={customerAddress} setCustomerAddress={setCustomerAddress}
        customerDistrict={customerDistrict} setCustomerDistrict={setCustomerDistrict}
        districts={districts} isLoggedIn={isLoggedIn}
        sendWhatsAppOrder={sendWhatsAppOrder} sendBankDepositOrder={sendBankDepositOrder}
        DARAZ_LINK={DARAZ_LINK}
      />

      <AdminPanelModal 
        isAdminOpen={isAdminOpen} setIsAdminOpen={setIsAdminOpen}
        products={products} setProducts={setProducts}
        heroImage={heroImage} setHeroImage={setHeroImage}
        lifestyle1={lifestyle1} setLifestyle1={setLifestyle1}
        lifestyle2={lifestyle2} setLifestyle2={setLifestyle2}
      />

      {showAddedPopup && (
        <div className="added-popup">✅ Added to Cart!</div>
      )}

      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <span>🚚 FREE DELIVERY ISLANDWIDE</span>
          <span className="divider">|</span>
          <span>🛡️ PREMIUM QUALITY</span>
          <span className="divider">|</span>
          <span>🌿 100% ORIGINAL PRODUCTS</span>
        </div>
      </div>

      {/* Header */}
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
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="header-icons">
            <button className="icon-btn">🔍</button>
            <button id="google-login-btn" onClick={() => window.googleLogin()} className="icon-btn" title="Sign in">👤</button>
            <button id="google-logout-btn" onClick={() => window.googleLogout()} style={{ display: 'none' }} className="icon-btn" title="Logout">🚪</button>

            {isAdmin && (
              <button onClick={() => setIsAdminOpen(true)} className="icon-btn admin-btn-highlight" title="Admin Panel">⚙️</button>
            )}

            <button onClick={() => setIsCartOpen(true)} className="icon-btn">
              🛒
              {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <img src={heroImage} alt="Aroma Lab" className="hero-img" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-content-inner">
            <div className="hero-text">
              <div className="hero-eyebrow">PREMIUM EAU DE PARFUM</div>
              <h1 className="hero-title">
                Crafted for Every<br />
                <span className="accent">Mood & Moment</span>
              </h1>
              <p className="hero-desc">
                From bold and mysterious to fresh and elegant — find your perfect scent.
              </p>
              <button onClick={() => handleFilter("All")} className="hero-btn">SHOP NOW →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-badges">
        <div className="trust-grid">
          {[
            { icon: "🌿", title: "PREMIUM QUALITY", desc: "Finest ingredients, long lasting scents" },
            { icon: "🛡️", title: "TRUSTED BRAND", desc: "Authentic & original products" },
            { icon: "🚚", title: "FAST DELIVERY", desc: "Islandwide delivery" },
            { icon: "⭐", title: "CUSTOMER SATISFACTION", desc: "Your happiness, our priority" }
          ].map((item, i) => (
            <div key={i} className="trust-item">
              <div className="trust-icon">{item.icon}</div>
              <div>
                <div className="trust-title">{item.title}</div>
                <div className="trust-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collection Section */}
      <section ref={collectionRef} id="collection" className="collection-section">
        <div className="collection-header">
          <div className="collection-eyebrow">OUR COLLECTION</div>
          <h2 className="collection-title">Explore Our <span className="accent">Signature Scents</span></h2>
        </div>

        <div className="filter-buttons">
          {['All', 'Ladies', 'Men', 'Unisex'].map((label) => (
            <button key={label} onClick={() => handleFilter(label)} className={`filter-btn ${activeFilter === label ? 'active' : ''}`}>
              {label === 'All' ? 'All' : `For ${label}`}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-img-wrap">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="product-img-placeholder">{product.name}</div>
                )}
                <div className="product-badge-for">{product.for}</div>
                <div className="product-badge-price">Rs. 1,500</div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-tagline">{product.tagline}</div>
                <div className="product-notes">
                  <div><div className="note-label">Top</div><div className="note-value">{product.top}</div></div>
                  <div><div className="note-label">Heart</div><div className="note-value">{product.heart}</div></div>
                  <div><div className="note-label">Base</div><div className="note-value">{product.base}</div></div>
                </div>
                <button onClick={() => addToCart(product)} className="btn-add-cart">ADD TO CART</button>
                <a href={DARAZ_LINK} target="_blank" rel="noopener" className="btn-order-daraz">ORDER ON DARAZ</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lifestyle Section 1 */}
      <section className="lifestyle-section">
        <div className="lifestyle-grid">
          <div className="lifestyle-img">
            <img src={lifestyle1} alt="Black Temptation" />
          </div>
          <div className="lifestyle-content">
            <div className="lifestyle-eyebrow">MUSE — BLACK TEMPTATION</div>
            <h3 className="lifestyle-title">Dark, mysterious,<br /><span className="accent">& seductive.</span></h3>
            <p className="lifestyle-desc">"Blackcurrant and pear open with a bright bite, jasmine and orange blossom bloom at the heart, and vanilla, praline, and musk leave a soft, unforgettable trail. Perfect for evenings."</p>
            <div className="lifestyle-buttons">
              <a href={DARAZ_LINK} target="_blank" rel="noopener" className="btn-gold">BUY ON DARAZ</a>
              <a href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Hi Aroma Lab! I want to order Black Temptation - Rs. 1,500")}`} target="_blank" rel="noopener" className="btn-white">WHATSAPP</a>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Section 2 */}
      <section className="lifestyle-section">
        <div className="lifestyle-grid reverse">
          <div className="lifestyle-content">
            <div className="lifestyle-eyebrow">MUSE — HUNTERS DUSK</div>
            <h3 className="lifestyle-title">Woody, smoky,<br /><span className="accent">& adventurous.</span></h3>
            <p className="lifestyle-desc">"Bergamot and pine open with a fresh, woody bite, cedarwood and leather deepen the heart, and amber, musk, and vetiver leave a bold, masculine trail. Perfect for the modern man."</p>
            <div className="lifestyle-buttons">
              <a href={DARAZ_LINK} target="_blank" rel="noopener" className="btn-gold">BUY ON DARAZ</a>
              <a href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Hi Aroma Lab! I want to order Hunters Dusk - Rs. 1,500")}`} target="_blank" rel="noopener" className="btn-white">WHATSAPP</a>
            </div>
          </div>
          <div className="lifestyle-img">
            <img src={lifestyle2} alt="Hunters Dusk" />
          </div>
        </div>
      </section>

      {/* KOKO Section */}
      <section className="koko-section">
        <div className="koko-box">
          <div className="koko-info">
            <div className="koko-logo">KOKO</div>
            <div>
              <div className="koko-title">Buy Now, Pay Later</div>
              <div className="koko-desc">Pay in 3 installments with any debit / credit card • 0% interest</div>
            </div>
          </div>
          <a href={DARAZ_LINK} target="_blank" rel="noopener" className="btn-koko-order">ORDER ON DARAZ</a>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="site-footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo">
              <img src={LOGO_URL} alt="Aroma Lab" />
              <div className="footer-logo-text">AROMA LAB</div>
            </div>
            <p className="footer-desc">Fine Fragrances based in Colombo, Sri Lanka. Premium Eau De Parfum 15ml with high quality fragrance oils, long lasting 12+ hours.</p>
          </div>
          <div>
            <div className="footer-heading">CONTACT</div>
            <div className="footer-links">
              <a href="tel:+94777804705">0777 804 705</a>
              <a href="https://wa.me/94777804705" target="_blank" rel="noopener">WhatsApp</a>
              <span>Colombo, Sri Lanka</span>
            </div>
          </div>
          <div>
            <div className="footer-heading">SHOP</div>
            <div className="footer-links">
              <a href={DARAZ_LINK} target="_blank" rel="noopener">Order on Daraz</a>
              <span>Buy Now Pay Later with KOKO</span>
              <span>Island Wide Delivery</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} AROMA LAB FINE FRAGRANCES • ALL RIGHTS RESERVED
        </div>
      </footer>

      {/* Fixed Bottom Bar */}
      <div className="bottom-bar">
        <div className="bottom-bar-inner">
          <a href="https://www.facebook.com/aromalabsl" target="_blank" rel="noopener noreferrer" className="bottom-btn facebook">Facebook</a>
          <a href={DARAZ_LINK} target="_blank" rel="noopener" className="bottom-btn daraz">Daraz</a>
          <a href={`${WHATSAPP_LINK}?text=Hi%20Aroma%20Lab!%20I%20want%20to%20order%20perfumes.%20Rs.%201,500%20each`} target="_blank" rel="noopener" className="bottom-btn whatsapp">WhatsApp</a>
        </div>
      </div>
      <div style={{ height: '80px' }}></div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
