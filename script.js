const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;

const DARAZ_LINK = "https://www.daraz.lk/products/aroma-lab-fine-fragrances-eau-de-parfum-15ml-5-scents-collection-long-lasting-12-hours-for-men-women-i1772233780-s12967079838.html";
const WHATSAPP_LINK = "https://wa.me/94777804705";
const LOGO_URL = "https://sajithkasp.github.io/aroma-labsl/logo.png";

const defaultProducts = [
  { id: "goodgirl", name: "Good Girl", for: "FOR LADIES", filter: "Ladies", tagline: "Sweet, Floral & Sensual", top: "Almond, Coffee", heart: "Jasmine, Tuberose", base: "Cocoa, Vanilla, Tonka Bean", image: "https://sajithkasp.github.io/aroma-labsl/goodgirl.jpg", accent: "#E8A8C0" },
  { id: "black", name: "Black Temptation", for: "FOR LADIES", filter: "Ladies", tagline: "Dark, Mysterious & Seductive", top: "Blackcurrant, Pear", heart: "Jasmine, Orange Blossom", base: "Vanilla, Praline, Musk", image: "https://sajithkasp.github.io/aroma-labsl/black.jpg", accent: "#2A2A2A" },
  { id: "hunter", name: "Hunters Dusk", for: "FOR MEN", filter: "Men", tagline: "Woody, Smoky & Adventurous", top: "Bergamot, Pine", heart: "Cedarwood, Leather", base: "Amber, Musk, Vetiver", image: "https://sajithkasp.github.io/aroma-labsl/hunter.jpg", accent: "#4A5A3A" },
  { id: "gold", name: "Million Gold", for: "FOR MEN", filter: "Men", tagline: "Rich, Luxurious & Powerful", top: "Blood Mandarin, Grapefruit", heart: "Cinnamon, Rose", base: "Amber, Leather, Patchouli", image: "https://sajithkasp.github.io/aroma-labsl/gold.jpg", accent: "#B8963E" },
  { id: "vanilla", name: "Vanilla", for: "FOR UNISEX", filter: "Unisex", tagline: "Warm, Sweet & Cozy", top: "Vanilla Orchid, Mandarin", heart: "Vanilla, Jasmine", base: "Sandalwood, Musk", image: "https://sajithkasp.github.io/aroma-labsl/vanilla.jpg", accent: "#D4B896" }
];

const HERO_IMAGE = "https://sajithkasp.github.io/aroma-labsl/hero.jpg";
const LIFESTYLE_IMAGE = "https://sajithkasp.github.io/aroma-labsl/lifestyle.jpg";
const LIFESTYLE_IMAGE_2 = "https://sajithkasp.github.io/aroma-labsl/lifestyle2.jpg";

// === CART MODAL COMPONENT (App එකෙන් එළියේ) ===
function CartModal({ 
  isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, 
  getSubtotal, getDeliveryCharge, getTotal, getCartCount,
  customerName, setCustomerName, customerPhone, setCustomerPhone,
  customerAddress, setCustomerAddress, customerDistrict, setCustomerDistrict,
  districts, isLoggedIn, sendWhatsAppOrder, sendBankDepositOrder, DARAZ_LINK
}) {
  if (!isCartOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#FFFBF5',
        borderRadius: '20px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '30px'
      }}>
        <button 
          onClick={() => setIsCartOpen(false)}
          style={{
            position: 'absolute',
            top: '15px', right: '15px',
            background: '#0A2E1F',
            color: '#FFFBF5',
            border: 'none',
            borderRadius: '50%',
            width: '35px', height: '35px',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >×</button>

        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', marginBottom: '20px', color: '#0A2E1F' }}>
          Your Cart
        </h2>

        <div style={{
          background: '#0A2E1F',
          color: '#FFFBF5',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
            🏆 Best Option: Order on Daraz
          </p>
          <p style={{ margin: '5px 0 0', fontSize: '12px', opacity: 0.8 }}>
            Cash on Delivery & KOKO Pay Later available • Safe returns
          </p>
        </div>

        {cartItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>Your cart is empty.</p>
        ) : (
          <div>
            {cartItems.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#fff',
                borderRadius: '10px',
                marginBottom: '10px',
                border: '1px solid #eee'
              }}>
                <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Rs. 1,500 each</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>-</button>
                  <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>+</button>
                </div>
                <div style={{ fontWeight: 'bold', minWidth: '70px', textAlign: 'right' }}>Rs. {(1500 * item.quantity).toLocaleString()}</div>
                <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '16px' }}>✕</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '20px', padding: '15px', background: '#fff', borderRadius: '10px', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Subtotal</span>
            <span>Rs. {getSubtotal().toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Delivery</span>
            <span>{getDeliveryCharge() === 0 ? 'FREE 🎉' : `Rs. ${getDeliveryCharge()}`}</span>
          </div>
          {getDeliveryCharge() > 0 && (
            <p style={{ fontSize: '11px', color: '#B8963E', margin: '5px 0' }}>
              Add {3 - getCartCount()} more item(s) for FREE delivery!
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px' }}>
            <span>Total</span>
            <span>Rs. {getTotal().toLocaleString()}</span>
          </div>
        </div>

        {isLoggedIn ? (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Customer Details</h3>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              value={customerPhone} 
              onChange={(e) => setCustomerPhone(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <textarea 
              placeholder="Address" 
              value={customerAddress} 
              onChange={(e) => setCustomerAddress(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc', minHeight: '60px' }}
            />
            <select 
              value={customerDistrict} 
              onChange={(e) => setCustomerDistrict(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc' }}
            >
              <option value="">Select District</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        ) : (
          <div style={{ marginTop: '20px', padding: '15px', background: '#FFF3CD', borderRadius: '10px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
              Please sign in with Google to place an order.
            </p>
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a 
            href={DARAZ_LINK} 
            target="_blank" 
            rel="noopener"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '15px',
              background: '#0A2E1F',
              color: '#FFFBF5',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            🛒 Order on Daraz (COD / KOKO)
          </a>

          {isLoggedIn && (
            <div style={{ padding: '15px', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>🏦 Bank Deposit Details:</p>
              <p style={{ margin: '3px 0', fontSize: '13px' }}>Account Holder: <strong>K.A.S.P. Wijerathne</strong></p>
              <p style={{ margin: '3px 0', fontSize: '13px' }}>Bank: <strong>Sampath Bank</strong></p>
              <p style={{ margin: '3px 0', fontSize: '13px' }}>Account No: <strong>100252479872</strong></p>
              <p style={{ margin: '3px 0', fontSize: '13px' }}>Branch: <strong>Pettah</strong></p>
              <button 
                onClick={sendBankDepositOrder}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '12px',
                  background: '#B8963E',
                  color: '#0A2E1F',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                📤 Send Slip via WhatsApp
              </button>
            </div>
          )}

          {isLoggedIn && (
            <button 
              onClick={sendWhatsAppOrder}
              style={{
                padding: '15px',
                background: '#25D366',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              💬 Order via WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
// === END CART MODAL COMPONENT ===

// === ADMIN PANEL MODAL ===
function AdminPanelModal({ isAdminOpen, setIsAdminOpen, products, setProducts }) {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(products, null, 2));
  const [message, setMessage] = useState('');

  useEffect(() => {
    setJsonInput(JSON.stringify(products, null, 2));
  }, [products]);

  if (!isAdminOpen) return null;

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error("Data must be an array");
      setProducts(parsed);
      localStorage.setItem('aromaLabProducts', JSON.stringify(parsed));
      setMessage('✅ Products saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      setMessage('❌ Invalid JSON format.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '30px'
      }}>
        <button 
          onClick={() => setIsAdminOpen(false)}
          style={{
            position: 'absolute',
            top: '15px', right: '15px',
            background: '#0A2E1F',
            color: '#FFFBF5',
            border: 'none',
            borderRadius: '50%',
            width: '35px', height: '35px',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >×</button>

        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', marginBottom: '20px', color: '#0A2E1F' }}>
          Admin Panel
        </h2>

        <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', padding: '15px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', color: '#92400E' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>📌 දැනට මේකෙන් Products විතරයි edit කරන්න පුළුවන්. අපි ඊළඟට Supabase එකට connect කරමු.</p>
        </div>

        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Products (JSON):</label>
        <textarea 
          style={{ width: '100%', height: '400px', padding: '15px', border: '1px solid #ccc', borderRadius: '10px', fontFamily: 'monospace', fontSize: '13px' }}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          spellCheck="false"
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button onClick={handleSave} style={{ padding: '12px 24px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Save & Apply</button>
        </div>

        {message && (
          <div style={{ marginTop: '15px', padding: '10px', borderRadius: '8px', background: message.includes('✅') ? '#DCFCE7' : '#FEE2E2', color: message.includes('✅') ? '#166534' : '#991B1B', fontSize: '13px' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
// === END ADMIN PANEL MODAL ===

function App() {
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [renderCount, setRenderCount] = useState(0);
  const collectionRef = useRef(null);

  // === CART STATES ===
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerDistrict, setCustomerDistrict] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showAddedPopup, setShowAddedPopup] = useState(false);
  // === END CART STATES ===

  // === ADMIN STATES ===
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const ADMIN_EMAIL = 'sajith.kasp@gmail.com';
  // === END ADMIN STATES ===

  const districts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
  ];

  // === CART FUNCTIONS ===
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowAddedPopup(true);
    setTimeout(() => setShowAddedPopup(false), 2000);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (1500 * item.quantity), 0);
  };

  const getDeliveryCharge = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return totalItems >= 3 ? 0 : 350;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryCharge();
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const sendWhatsAppOrder = () => {
    if (!customerName || !customerPhone || !customerAddress || !customerDistrict) {
      alert("Please fill all customer details (Name, Phone, Address, District).");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    
    let message = "Hi Aroma Lab! I want to order:\n\n";
    cartItems.forEach(item => {
      message += `- ${item.name} x ${item.quantity} = Rs. ${1500 * item.quantity}\n`;
    });
    message += `\nSubtotal: Rs. ${getSubtotal()}`;
    message += `\nDelivery: ${getDeliveryCharge() === 0 ? 'FREE' : 'Rs. ' + getDeliveryCharge()}`;
    message += `\nTotal: Rs. ${getTotal()}`;
    message += `\n\nName: ${customerName}`;
    message += `\nPhone: ${customerPhone}`;
    message += `\nAddress: ${customerAddress}`;
    message += `\nDistrict: ${customerDistrict}`;
    
    const url = `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const sendBankDepositOrder = () => {
    if (!customerName || !customerPhone || !customerAddress || !customerDistrict) {
      alert("Please fill all customer details (Name, Phone, Address, District).");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    
    let message = "Hi Aroma Lab! I want to order (Bank Deposit):\n\n";
    cartItems.forEach(item => {
      message += `- ${item.name} x ${item.quantity} = Rs. ${1500 * item.quantity}\n`;
    });
    message += `\nSubtotal: Rs. ${getSubtotal()}`;
    message += `\nDelivery: ${getDeliveryCharge() === 0 ? 'FREE' : 'Rs. ' + getDeliveryCharge()}`;
    message += `\nTotal: Rs. ${getTotal()}`;
    message += `\n\nName: ${customerName}`;
    message += `\nPhone: ${customerPhone}`;
    message += `\nAddress: ${customerAddress}`;
    message += `\nDistrict: ${customerDistrict}`;
    message += `\n\nI will send the bank deposit slip shortly.`;
    
    const url = `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };
  // === END CART FUNCTIONS ===

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
  // === END FIREBASE USER CONNECTION ===

  // === ADMIN FUNCTION ===
  window.checkAdmin = function(email) {
    if (email === ADMIN_EMAIL) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };
  // === END ADMIN FUNCTION ===

  useEffect(() => {
    const saved = localStorage.getItem('aromaLabProducts');
    if (saved) {
      try { setProducts(JSON.parse(saved)); } catch (e) { setProducts(defaultProducts); }
    } else { setProducts(defaultProducts); }
  }, []);

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setRenderCount(c => c + 1);
    setTimeout(() => { collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  };

  const filteredProducts = activeFilter === "All" ? products : products.filter(p => p.filter === activeFilter);

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#0A2E1F] selection:bg-[#B8963E]/20">
      {/* Cart Modal */}
      <CartModal 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        getSubtotal={getSubtotal}
        getDeliveryCharge={getDeliveryCharge}
        getTotal={getTotal}
        getCartCount={getCartCount}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        customerAddress={customerAddress}
        setCustomerAddress={setCustomerAddress}
        customerDistrict={customerDistrict}
        setCustomerDistrict={setCustomerDistrict}
        districts={districts}
        isLoggedIn={isLoggedIn}
        sendWhatsAppOrder={sendWhatsAppOrder}
        sendBankDepositOrder={sendBankDepositOrder}
        DARAZ_LINK={DARAZ_LINK}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal 
        isAdminOpen={isAdminOpen}
        setIsAdminOpen={setIsAdminOpen}
        products={products}
        setProducts={setProducts}
      />

      {/* Added to Cart Popup */}
      {showAddedPopup && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0A2E1F',
          color: '#FFFBF5',
          padding: '12px 24px',
          borderRadius: '50px',
          fontWeight: 'bold',
          fontSize: '14px',
          zIndex: 99999,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        }}>
          ✅ Added to Cart!
        </div>
      )}

      <style>{`
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Top Bar */}
      <div className="bg-[#0A2E1F] text-[#FFFBF5] text-[11px] tracking-[0.15em] font-body uppercase py-3">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-center gap-8 flex-wrap">
          <span>🚚 FREE DELIVERY ISLANDWIDE</span>
          <span className="opacity-40">|</span>
          <span>🛡️ PREMIUM QUALITY</span>
          <span className="opacity-40">|</span>
          <span>🌿 100% ORIGINAL PRODUCTS</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-[#FFFBF5] border-b border-[#0A2E1F]/10 sticky top-0 z-40 backdrop-blur-[12px]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Aroma Lab" className="w-14 h-14 rounded-full object-cover" />
            <div>
              <div className="font-display text-[22px] tracking-[0.15em] font-semibold leading-none">AROMA LAB</div>
              <div className="font-body text-[9px] tracking-[0.35em] mt-1 opacity-60">FINE FRAGRANCES</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-8 font-body text-[14px]">
            <a href="#" className="border-b-2 border-[#B8963E] pb-1 font-medium">Home</a>
            <a href="#collection" className="hover:text-[#B8963E] transition">Shop</a>
            <a href="#about" className="hover:text-[#B8963E] transition">About Us</a>
            <a href="#contact" className="hover:text-[#B8963E] transition">Contact</a>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full hover:bg-[#0A2E1F]/5 flex items-center justify-center text-[18px]">🔍</button>
            <button id="google-login-btn" onClick={() => window.googleLogin()} className="w-10 h-10 rounded-full hover:bg-[#0A2E1F]/5 flex items-center justify-center text-[18px]" title="Sign in">👤</button>
            <button id="google-logout-btn" onClick={() => window.googleLogout()} style={{ display: 'none' }} className="w-10 h-10 rounded-full hover:bg-[#0A2E1F]/5 flex items-center justify-center text-[18px]" title="Logout">🚪</button>
            
            {isAdmin && (
              <button 
                onClick={() => setIsAdminOpen(true)}
                className="w-10 h-10 rounded-full bg-[#B8963E] text-[#0A2E1F] flex items-center justify-center text-[18px] font-bold"
                title="Admin Panel"
              >⚙️</button>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 rounded-full hover:bg-[#0A2E1F]/5 flex items-center justify-center text-[18px]"
            >
              🛒
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B8963E] text-[#0A2E1F] rounded-full w-5 h-5 text-[11px] font-bold flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[500px] sm:h-[600px] overflow-hidden">
          <img src={HERO_IMAGE} alt="Aroma Lab" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2E1F]/80 via-[#0A2E1F]/40 to-transparent"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 w-full">
              <div className="max-w-[600px]">
                <div className="font-body text-[12px] tracking-[0.4em] uppercase text-[#B8963E] mb-4">
                  PREMIUM EAU DE PARFUM
                </div>
                <h1 className="font-display text-[#FFFBF5] text-[42px] sm:text-[64px] leading-[1.05] mb-6">
                  Crafted for Every<br />
                  <span className="text-[#B8963E] italic">Mood & Moment</span>
                </h1>
                <p className="font-body text-[#FFFBF5]/70 text-[14px] sm:text-[15px] leading-[1.7] mb-8 max-w-[480px]">
                  From bold and mysterious to fresh and elegant — find your perfect scent.
                </p>
                <button 
                  onClick={() => handleFilter("All")}
                  className="bg-[#B8963E] text-[#0A2E1F] px-8 py-3 font-body text-[13px] tracking-[0.15em] uppercase font-semibold hover:bg-[#c9a84a] transition rounded-sm"
                >
                  SHOP NOW →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-[#0A2E1F] text-[#FFFBF5] py-8">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🌿", title: "PREMIUM QUALITY", desc: "Finest ingredients, long lasting scents" },
            { icon: "🛡️", title: "TRUSTED BRAND", desc: "Authentic & original products" },
            { icon: "🚚", title: "FAST DELIVERY", desc: "Islandwide delivery" },
            { icon: "⭐", title: "CUSTOMER SATISFACTION", desc: "Your happiness, our priority" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-[#B8963E] flex items-center justify-center text-[24px] shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="font-body text-[12px] tracking-[0.1em] font-semibold">{item.title}</div>
                <div className="font-body text-[11px] opacity-60 mt-1">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collection Section */}
      <section ref={collectionRef} id="collection" className="max-w-[1400px] mx-auto px-6 sm:px-12 py-16 sm:py-24">
        <div className="text-center mb-12">
          <div className="font-body text-[11px] tracking-[0.4em] uppercase text-[#B8963E] mb-3">OUR COLLECTION</div>
          <h2 className="font-display text-[36px] sm:text-[52px] leading-[1.1]">
            Explore Our <span className="italic text-[#B8963E]">Signature Scents</span>
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {['All', 'Ladies', 'Men', 'Unisex'].map((label) => (
            <button 
              key={label} 
              onClick={() => handleFilter(label)} 
              className={`px-6 py-2 rounded-full font-body text-[12px] tracking-[0.15em] uppercase transition-all ${activeFilter === label ? 'bg-[#0A2E1F] text-[#FFFBF5]' : 'bg-[#0A2E1F]/5 text-[#0A2E1F]/60 hover:bg-[#0A2E1F]/10'}`}
            >
              {label === 'All' ? 'All' : `For ${label}`}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-lg border border-[#0A2E1F]/[0.06] overflow-hidden shadow-[0_4px_20px_rgba(10,46,31,0.04)] hover:shadow-[0_12px_40px_rgba(10,46,31,0.10)] transition-all duration-500">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#FFFBF5]">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#0A2E1F]/20 font-display text-[18px]">{product.name}</div>
                )}
                <div className="absolute top-4 left-4 bg-[#FFFBF5]/95 backdrop-blur px-3 py-1.5 rounded-full">
                  <span className="font-body text-[10px] tracking-[0.15em] uppercase font-semibold text-[#0A2E1F]">{product.for}</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-[#B8963E] text-[#0A2E1F] rounded-full px-4 py-1.5 font-body text-[12px] font-bold">
                  Rs. 1,500
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-[24px] leading-[1.1] text-center mb-2">{product.name}</h3>
                <div className="font-body text-[12px] text-[#0A2E1F]/60 text-center mb-4">{product.tagline}</div>
                
                <div className="bg-[#FFFBF5] rounded-md p-4 mb-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="font-body text-[9px] tracking-[0.15em] uppercase text-[#B8963E] font-semibold">Top</div>
                      <div className="font-body text-[10px] leading-[1.4] mt-1 text-[#0A2E1F]/80">{product.top}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-body text-[9px] tracking-[0.15em] uppercase text-[#B8963E] font-semibold">Heart</div>
                      <div className="font-body text-[10px] leading-[1.4] mt-1 text-[#0A2E1F]/80">{product.heart}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-body text-[9px] tracking-[0.15em] uppercase text-[#B8963E] font-semibold">Base</div>
                      <div className="font-body text-[10px] leading-[1.4] mt-1 text-[#0A2E1F]/80">{product.base}</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => addToCart(product)}
                  className="w-full py-3 bg-[#0A2E1F] text-[#FFFBF5] rounded-sm font-body text-[12px] tracking-[0.15em] uppercase font-semibold hover:bg-[#123a28] transition mb-3"
                >
                  ADD TO CART
                </button>
                <a 
                  href={DARAZ_LINK} 
                  target="_blank" 
                  rel="noopener" 
                  className="w-full py-3 border border-[#0A2E1F]/20 text-[#0A2E1F] rounded-sm font-body text-[12px] tracking-[0.15em] uppercase font-medium hover:bg-[#0A2E1F]/5 transition text-center block"
                >
                  ORDER ON DARAZ
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lifestyle Section 1 */}
      <section className="max-w-[1400px] mx-auto px-6 sm:px-12 py-12">
        <div className="grid lg:grid-cols-2 gap-0 overflow-hidden rounded-lg bg-[#0A2E1F]">
          <div className="relative min-h-[400px] lg:min-h-[500px]">
            <img src={LIFESTYLE_IMAGE} alt="Black Temptation" className="w-full h-full object-cover object-top" />
          </div>
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <div className="font-body text-[11px] tracking-[0.3em] uppercase text-[#B8963E] mb-4">MUSE — BLACK TEMPTATION</div>
            <h3 className="font-display text-[#FFFBF5] text-[36px] sm:text-[48px] leading-[1.1] mb-6">
              Dark, mysterious,<br />
              <span className="italic text-[#B8963E]">& seductive.</span>
            </h3>
            <p className="font-body text-[#FFFBF5]/60 text-[14px] leading-[1.8] mb-8">
              "Blackcurrant and pear open with a bright bite, jasmine and orange blossom bloom at the heart, and vanilla, praline, and musk leave a soft, unforgettable trail. Perfect for evenings."
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href={DARAZ_LINK} target="_blank" rel="noopener" className="bg-[#B8963E] text-[#0A2E1F] px-6 py-3 font-body text-[12px] tracking-[0.15em] uppercase font-semibold hover:bg-[#c9a84a] transition">
                BUY ON DARAZ
              </a>
              <a href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Hi Aroma Lab! I want to order Black Temptation - Rs. 1,500")}`} target="_blank" rel="noopener" className="bg-white text-[#0A2E1F] px-6 py-3 font-body text-[12px] tracking-[0.15em] uppercase font-medium hover:bg-[#FFFBF5] transition">
                WHATSAPP
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Section 2 */}
      <section className="max-w-[1400px] mx-auto px-6 sm:px-12 py-12">
        <div className="grid lg:grid-cols-2 gap-0 overflow-hidden rounded-lg bg-[#0A2E1F]">
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
            <div className="font-body text-[11px] tracking-[0.3em] uppercase text-[#B8963E] mb-4">MUSE — HUNTERS DUSK</div>
            <h3 className="font-display text-[#FFFBF5] text-[36px] sm:text-[48px] leading-[1.1] mb-6">
              Woody, smoky,<br />
              <span className="italic text-[#B8963E]">& adventurous.</span>
            </h3>
            <p className="font-body text-[#FFFBF5]/60 text-[14px] leading-[1.8] mb-8">
              "Bergamot and pine open with a fresh, woody bite, cedarwood and leather deepen the heart, and amber, musk, and vetiver leave a bold, masculine trail. Perfect for the modern man."
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href={DARAZ_LINK} target="_blank" rel="noopener" className="bg-[#B8963E] text-[#0A2E1F] px-6 py-3 font-body text-[12px] tracking-[0.15em] uppercase font-semibold hover:bg-[#c9a84a] transition">
                BUY ON DARAZ
              </a>
              <a href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Hi Aroma Lab! I want to order Hunters Dusk - Rs. 1,500")}`} target="_blank" rel="noopener" className="bg-white text-[#0A2E1F] px-6 py-3 font-body text-[12px] tracking-[0.15em] uppercase font-medium hover:bg-[#FFFBF5] transition">
                WHATSAPP
              </a>
            </div>
          </div>
          <div className="relative min-h-[400px] lg:min-h-[500px] order-1 lg:order-2">
            <img src={LIFESTYLE_IMAGE_2} alt="Hunters Dusk" className="w-full h-full object-cover object-top" />
          </div>
        </div>
      </section>

      {/* KOKO Section */}
      <section className="max-w-[1400px] mx-auto px-6 sm:px-12 py-12">
        <div className="rounded-lg bg-[#B8963E]/10 border border-[#B8963E]/20 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#0A2E1F] text-[#FFFBF5] flex items-center justify-center font-display font-bold text-[16px]">KOKO</div>
            <div>
              <div className="font-display text-[22px] leading-none">Buy Now, Pay Later</div>
              <div className="font-body text-[13px] text-[#0A2E1F]/60 mt-2">Pay in 3 installments with any debit / credit card • 0% interest</div>
            </div>
          </div>
          <a href={DARAZ_LINK} target="_blank" rel="noopener" className="font-body text-[12px] tracking-[0.15em] uppercase bg-white border border-[#0A2E1F]/10 rounded-full px-6 py-3 hover:bg-[#FFFBF5] transition">
            ORDER ON DARAZ
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="mt-16 border-t border-[#0A2E1F]/10 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-16 grid sm:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={LOGO_URL} alt="Aroma Lab" className="w-12 h-12 rounded-full object-cover" />
              <div className="font-display text-[20px] tracking-[0.15em] font-semibold">AROMA LAB</div>
            </div>
            <p className="font-body text-[13px] text-[#0A2E1F]/60 leading-[1.8] max-w-[340px]">
              Fine Fragrances based in Colombo, Sri Lanka. Premium Eau De Parfum 15ml with high quality fragrance oils, long lasting 12+ hours.
            </p>
          </div>
          <div>
            <div className="font-body text-[11px] tracking-[0.25em] uppercase font-semibold opacity-60 mb-4">CONTACT</div>
            <div className="space-y-3 font-body text-[14px]">
              <a href="tel:+94777804705" className="block hover:text-[#B8963E] transition">0777 804 705</a>
              <a href="https://wa.me/94777804705" target="_blank" rel="noopener" className="block hover:text-[#B8963E] transition">WhatsApp</a>
              <div className="text-[#0A2E1F]/60">Colombo, Sri Lanka</div>
            </div>
          </div>
          <div>
            <div className="font-body text-[11px] tracking-[0.25em] uppercase font-semibold opacity-60 mb-4">SHOP</div>
            <div className="space-y-3 font-body text-[14px]">
              <a href={DARAZ_LINK} target="_blank" rel="noopener" className="block hover:text-[#B8963E] transition">Order on Daraz</a>
              <div className="text-[#0A2E1F]/60">Buy Now Pay Later with KOKO</div>
              <div className="text-[#0A2E1F]/60">Island Wide Delivery</div>
            </div>
          </div>
        </div>
        <div className="border-t border-[#0A2E1F]/10 py-6 px-6 text-center">
          <div className="font-body text-[11px] tracking-[0.15em] uppercase text-[#0A2E1F]/40">
            © {new Date().getFullYear()} AROMA LAB FINE FRAGRANCES • ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-[12px] border-t border-[#0A2E1F]/10 px-4 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
        <div className="max-w-[1400px] mx-auto flex items-center gap-3">
          <a href="https://www.facebook.com/aromalabsl" target="_blank" rel="noopener noreferrer"
             className="flex-1 flex items-center justify-center gap-2 text-white rounded-sm py-3 font-body text-[11px] tracking-[0.15em] uppercase font-semibold transition"
             style={{ backgroundColor: '#0866FF' }}>
            Facebook
          </a>
          <a href={DARAZ_LINK} target="_blank" rel="noopener"
             className="flex-1 flex items-center justify-center gap-2 bg-[#0A2E1F] text-[#FFFBF5] rounded-sm py-3 font-body text-[11px] tracking-[0.15em] uppercase font-semibold hover:bg-[#123a28] transition">
            Daraz
          </a>
          <a href={`${WHATSAPP_LINK}?text=Hi%20Aroma%20Lab!%20I%20want%20to%20order%20perfumes.%20Rs.%201,500%20each`}
             target="_blank" rel="noopener"
             className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-sm py-3 font-body text-[11px] tracking-[0.15em] uppercase font-semibold hover:bg-[#1da851] transition">
            WhatsApp
          </a>
        </div>
      </div>
      <div className="h-[80px]"></div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
