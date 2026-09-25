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

const defaultLifestyleDetails = [
  { eyebrow: "MUSE — BLACK TEMPTATION", title: "Dark, mysterious,", titleAccent: "& seductive.", description: "Blackcurrant and pear open with a bright bite, jasmine and orange blossom bloom at the heart, and vanilla, praline, and musk leave a soft, unforgettable trail. Perfect for evenings.", image: DEFAULT_LIFESTYLE_1 },
  { eyebrow: "MUSE — HUNTERS DUSK", title: "Woody, smoky,", titleAccent: "& adventurous.", description: "Bergamot and pine open with a fresh, woody bite, cedarwood and leather deepen the heart, and amber, musk, and vetiver leave a bold, masculine trail. Perfect for the modern man.", image: DEFAULT_LIFESTYLE_2 }
];

// === SVG ICONS ===
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);
const AdminIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);
const ChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const WhatsappIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
);
const DarazIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

// === CART MODAL ===
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

// === REVIEW SECTION ===
function ReviewSection({ 
  isLoggedIn, reviewName, setReviewName, reviewEmail, setReviewEmail, 
  reviewRating, setReviewRating, reviewComment, setReviewComment,
  handleReviewSubmit, reviews, currentReviewIndex, setCurrentReviewIndex
}) {
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
        <div className="review-login-message">
          <p>Please sign in with Google to write a review.</p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="reviews-slider">
          <button className="reviews-nav reviews-nav-prev" onClick={() => setCurrentReviewIndex(prev => (prev - 1 + reviews.length) % reviews.length)}>
            <ChevronLeft />
          </button>
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
          <button className="reviews-nav reviews-nav-next" onClick={() => setCurrentReviewIndex(prev => (prev + 1) % reviews.length)}>
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}

// === ADMIN AUTH ===
function AdminAuth({ onSuccess, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: authError } = await window.supabaseClient.auth.signInWithPassword({
        email: 'sajith.kasp@gmail.com',
        password: password
      });
      if (authError) throw authError;
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
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input admin-input-full"
            autoFocus
            required
          />
          {error && <p className="admin-auth-error">{error}</p>}
          <button type="submit" className="admin-btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Checking...' : 'Unlock Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}

// === ADMIN PANEL MODAL ===
function AdminPanelModal({ 
  isAdminOpen, setIsAdminOpen, products, setProducts, 
  heroImages, setHeroImages, lifestyleImages, setLifestyleImages, 
  lifestyleDetails, setLifestyleDetails, pages, setPages 
}) {
  const [activeTab, setActiveTab] = useState('products');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Ladies', tagline: '', top: '', heart: '', base: '', image: '' });
  const [newHeroUploading, setNewHeroUploading] = useState(false);
  const [newLifestyleUploading, setNewLifestyleUploading] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', content: '' });
  const [editingPageId, setEditingPageId] = useState(null);

  if (!isAdminOpen) return null;

  const handleImageUpload = async (file, callback) => {
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const { error } = await window.supabaseClient.storage.from('product-images').upload(fileName, file);
      if (error) throw error;
      const { data: urlData } = window.supabaseClient.storage.from('product-images').getPublicUrl(fileName);
      callback(urlData.publicUrl);
      setMessage('✅ Image uploaded!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Upload error: ' + err.message);
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
      setMessage('✅ Saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
  };

  const handleAddHeroImage = async (file) => {
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
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
    setNewHeroUploading(false);
  };

  const handleDeleteHeroImage = async (index) => {
    if (!window.confirm('Delete this Hero Image?')) return;
    const updated = heroImages.filter((_, i) => i !== index);
    setHeroImages(updated);
    await saveSiteSettings(updated, lifestyleImages, lifestyleDetails);
  };

  const handleAddLifestyleImage = async (file) => {
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
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
    setNewLifestyleUploading(false);
  };

  const handleDeleteLifestyleImage = async (index) => {
    if (!window.confirm('Delete this Lifestyle Image?')) return;
    const updated = lifestyleImages.filter((_, i) => i !== index);
    const updatedDetails = lifestyleDetails.filter((_, i) => i !== index);
    setLifestyleImages(updated);
    setLifestyleDetails(updatedDetails);
    await saveSiteSettings(heroImages, updated, updatedDetails);
  };

  const handleUpdateLifestyleDetail = (index, field, value) => {
    const updated = lifestyleDetails.map((d, i) => i === index ? { ...d, [field]: value } : d);
    setLifestyleDetails(updated);
  };

  const handleSaveLifestyleDetails = async () => {
    await saveSiteSettings(heroImages, lifestyleImages, lifestyleDetails);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.image) {
      setMessage('❌ Product name and image are required.');
      return;
    }
    try {
      const { error } = await window.supabaseClient.from('products').insert([{
        name: newProduct.name, price: 'Rs. 1,500', category: newProduct.category,
        description: newProduct.tagline, top_notes: newProduct.top, heart_notes: newProduct.heart,
        base_notes: newProduct.base, image_url: newProduct.image
      }]);
      if (error) throw error;
      const fresh = await window.supabaseClient.from('products').select('*').order('created_at', { ascending: true });
      if (fresh.data) {
        setProducts(fresh.data.map(p => ({
          id: p.id, name: p.name,
          for: p.category === 'Ladies' ? 'FOR LADIES' : p.category === 'Men' ? 'FOR MEN' : 'FOR UNISEX',
          filter: p.category, tagline: p.description || '', top: p.top_notes || '', heart: p.heart_notes || '', base: p.base_notes || '',
          image: p.image_url || '', accent: '#B8963E'
        })));
      }
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
      if (fresh.data) {
        setProducts(fresh.data.map(p => ({
          id: p.id, name: p.name,
          for: p.category === 'Ladies' ? 'FOR LADIES' : p.category === 'Men' ? 'FOR MEN' : 'FOR UNISEX',
          filter: p.category, tagline: p.description || '', top: p.top_notes || '', heart: p.heart_notes || '', base: p.base_notes || '',
          image: p.image_url || '', accent: '#B8963E'
        })));
      }
      setMessage('✅ Product deleted.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
  };

  const handleAddPage = async () => {
    if (!newPage.title) { setMessage('❌ Title is required.'); return; }
    try {
      if (editingPageId) {
        const { error } = await window.supabaseClient.from('pages').update({ title: newPage.title, content: newPage.content }).eq('id', editingPageId);
        if (error) throw error;
        setMessage('✅ Page updated!');
      } else {
        const { error } = await window.supabaseClient.from('pages').insert([{ title: newPage.title, content: newPage.content }]);
        if (error) throw error;
        setMessage('✅ Page added!');
      }
      const fresh = await window.supabaseClient.from('pages').select('*').order('created_at', { ascending: true });
      setPages(fresh.data || []);
      setNewPage({ title: '', content: '' });
      setEditingPageId(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
  };

  const handleDeletePage = async (id) => {
    if (!window.confirm('Delete this page?')) return;
    try {
      const { error } = await window.supabaseClient.from('pages').delete().eq('id', id);
      if (error) throw error;
      const fresh = await window.supabaseClient.from('pages').select('*').order('created_at', { ascending: true });
      setPages(fresh.data || []);
      setMessage('✅ Page deleted.');
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
          <button className={`admin-tab ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>Hero</button>
          <button className={`admin-tab ${activeTab === 'lifestyle' ? 'active' : ''}`} onClick={() => setActiveTab('lifestyle')}>Lifestyle</button>
          <button className={`admin-tab ${activeTab === 'pages' ? 'active' : ''}`} onClick={() => setActiveTab('pages')}>Pages</button>
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
              <input type="text" placeholder="Tagline" value={newProduct.tagline} onChange={(e) => setNewProduct({ ...newProduct, tagline: e.target.value })} className="admin-input" />
              <input type="text" placeholder="Top Notes" value={newProduct.top} onChange={(e) => setNewProduct({ ...newProduct, top: e.target.value })} className="admin-input" />
              <input type="text" placeholder="Heart Notes" value={newProduct.heart} onChange={(e) => setNewProduct({ ...newProduct, heart: e.target.value })} className="admin-input" />
              <input type="text" placeholder="Base Notes" value={newProduct.base} onChange={(e) => setNewProduct({ ...newProduct, base: e.target.value })} className="admin-input" />
            </div>
            <div className="admin-upload-section">
              <label className="admin-upload-label">
                {uploading ? 'Uploading...' : '📤 Upload Product Image *'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e.target.files[0], (url) => setNewProduct({ ...newProduct, image: url }))} />
              </label>
              {newProduct.image && <img src={newProduct.image} alt="Preview" className="admin-preview-img" />}
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
                  <button onClick={() => handleDeleteHeroImage(i)} className="admin-btn-delete" style={{ marginTop: '8px', display: 'block', width: '100%' }}>Delete</button>
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
                <button onClick={() => handleDeleteLifestyleImage(i)} className="admin-btn-delete" style={{ marginTop: '8px' }}>Delete Image</button>
              </div>
            ))}
            <button onClick={handleSaveLifestyleDetails} className="admin-btn-primary" style={{ marginTop: '20px' }}>Save Lifestyle Details</button>
          </div>
        )}

        {activeTab === 'pages' && (
          <div>
            <h3 className="admin-subtitle">{editingPageId ? 'Edit Page' : 'Add New Page'}</h3>
            <div className="admin-form-grid">
              <input type="text" placeholder="Page Title *" value={newPage.title} onChange={(e) => setNewPage({ ...newPage, title: e.target.value })} className="admin-input admin-input-full" />
              <textarea placeholder="Page Content" value={newPage.content} onChange={(e) => setNewPage({ ...newPage, content: e.target.value })} className="admin-input admin-input-full" style={{ minHeight: '120px' }}></textarea>
            </div>
            <button onClick={handleAddPage} className="admin-btn-primary">{editingPageId ? 'Update Page' : '+ Add Page'}</button>
            {editingPageId && <button onClick={() => { setEditingPageId(null); setNewPage({ title: '', content: '' }); }} className="admin-btn-delete" style={{ marginLeft: '10px' }}>Cancel Edit</button>}

            <h3 className="admin-subtitle" style={{ marginTop: '30px' }}>Existing Pages</h3>
            <div className="admin-product-list">
              {pages.map(p => (
                <div key={p.id} className="admin-product-row">
                  <div className="admin-product-info">
                    <div className="admin-product-name">{p.title}</div>
                  </div>
                  <button onClick={() => { setEditingPageId(p.id); setNewPage({ title: p.title, content: p.content || '' }); }} className="admin-btn-primary" style={{ padding: '8px 14px', fontSize: '12px' }}>Edit</button>
                  <button onClick={() => handleDeletePage(p.id)} className="admin-btn-delete">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// === PAGE POPUP ===
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

function App() {
  const [products, setProducts] = useState([]);
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
const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const districts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const { data: prodData, error: prodErr } = await window.supabaseClient.from('products').select('*').order('created_at', { ascending: true });
        if (!prodErr && prodData && prodData.length > 0) {
          setProducts(prodData.map(p => ({
            id: p.id, name: p.name,
            for: p.category === 'Ladies' ? 'FOR LADIES' : p.category === 'Men' ? 'FOR MEN' : 'FOR UNISEX',
            filter: p.category, tagline: p.description || '', top: p.top_notes || '', heart: p.heart_notes || '', base: p.base_notes || '',
            image: p.image_url || '', accent: '#B8963E'
          })));
        } else {
          setProducts(defaultProducts);
        }

        const { data: siteData } = await window.supabaseClient.from('site_settings').select('*').limit(1).single();
        if (siteData) {
          if (siteData.hero_images && siteData.hero_images.length > 0) setHeroImages(siteData.hero_images);
          if (siteData.lifestyle_images && siteData.lifestyle_images.length > 0) setLifestyleImages(siteData.lifestyle_images);
          if (siteData.lifestyle_details && siteData.lifestyle_details.length > 0) setLifestyleDetails(siteData.lifestyle_details);
        }

        const { data: pagesData } = await window.supabaseClient.from('pages').select('*').order('created_at', { ascending: true });
        if (pagesData) setPages(pagesData);

        const { data: reviewsData } = await window.supabaseClient.from('reviews').select('*').order('created_at', { ascending: false });
        if (reviewsData) setReviews(reviewsData);
      } catch (e) {
        console.error(e);
        setProducts(defaultProducts);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages]);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex(prev => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews]);

  // Lifestyle Auto Slide
useEffect(() => {
  if (lifestyleDetails.length <= 1) return;
  const interval = setInterval(() => {
    setCurrentLifestyleIndex(prev => (prev + 1) % lifestyleDetails.length);
  }, 5000);
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

  const getSubtotal = () => cartItems.reduce((sum, item) => sum + (1500 * item.quantity), 0);
  const getDeliveryCharge = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return totalItems >= 3 ? 0 : 350;
  };
  const getTotal = () => getSubtotal() + getDeliveryCharge();
  const getCartCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const sendWhatsAppOrder = () => {
    if (!customerName || !customerPhone || !customerAddress || !customerDistrict) { alert("Please fill all customer details."); return; }
    if (cartItems.length === 0) { alert("Your cart is empty."); return; }
    let message = "Hi Aroma Lab! I want to order:\n\n";
    cartItems.forEach(item => { message += `- ${item.name} x ${item.quantity} = Rs. ${1500 * item.quantity}\n`; });
    message += `\nSubtotal: Rs. ${getSubtotal()}\nDelivery: ${getDeliveryCharge() === 0 ? 'FREE' : 'Rs. ' + getDeliveryCharge()}\nTotal: Rs. ${getTotal()}`;
    message += `\n\nName: ${customerName}\nPhone: ${customerPhone}\nAddress: ${customerAddress}\nDistrict: ${customerDistrict}`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendBankDepositOrder = () => {
    if (!customerName || !customerPhone || !customerAddress || !customerDistrict) { alert("Please fill all customer details."); return; }
    if (cartItems.length === 0) { alert("Your cart is empty."); return; }
    let message = "Hi Aroma Lab! I want to order (Bank Deposit):\n\n";
    cartItems.forEach(item => { message += `- ${item.name} x ${item.quantity} = Rs. ${1500 * item.quantity}\n`; });
    message += `\nSubtotal: Rs. ${getSubtotal()}\nDelivery: ${getDeliveryCharge() === 0 ? 'FREE' : 'Rs. ' + getDeliveryCharge()}\nTotal: Rs. ${getTotal()}`;
    message += `\n\nName: ${customerName}\nPhone: ${customerPhone}\nAddress: ${customerAddress}\nDistrict: ${customerDistrict}`;
    message += `\n\nI will send the bank deposit slip shortly.`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewEmail || !reviewRating || !reviewComment) return;
    try {
      const userImage = loggedInUser?.photoURL || '';
      const { error } = await window.supabaseClient.from('reviews').insert([{
        name: reviewName, email: reviewEmail, rating: parseInt(reviewRating), comment: reviewComment, user_image: userImage
      }]);
      if (error) throw error;
      setReviewName(''); setReviewEmail(''); setReviewRating(''); setReviewComment('');
      const { data: reviewsData } = await window.supabaseClient.from('reviews').select('*').order('created_at', { ascending: false });
      if (reviewsData) setReviews(reviewsData);
      alert('✅ Review submitted successfully!');
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
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

          {adminAuthOpen && (
  <AdminAuth 
    onSuccess={() => { 
      setAdminAuthenticated(true); 
      setAdminAuthOpen(false); 
      setIsAdminOpen(true); 
    }}
    onClose={() => setAdminAuthOpen(false)}
  />
)}

      <AdminPanelModal 
        isAdminOpen={isAdminOpen} setIsAdminOpen={setIsAdminOpen}
        products={products} setProducts={setProducts}
        heroImages={heroImages} setHeroImages={setHeroImages}
        lifestyleImages={lifestyleImages} setLifestyleImages={setLifestyleImages}
        lifestyleDetails={lifestyleDetails} setLifestyleDetails={setLifestyleDetails}
        pages={pages} setPages={setPages}
      />

      <PagePopup page={activePage} onClose={() => setActivePage(null)} />

      {showAddedPopup && <div className="added-popup">✅ Added to Cart!</div>}

      <div className="top-bar">
        <div className="top-bar-inner">
          <span>🚚 FREE DELIVERY ON 3+ ITEMS</span>
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
            {isAdmin && (
  <button onClick={() => setAdminAuthOpen(true)} className="icon-btn admin-btn-highlight" title="Admin Panel"><AdminIcon /></button>
)}
            <button onClick={() => setIsCartOpen(true)} className="icon-btn" title="Cart">
              <CartIcon />
              {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
            </button>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <section className="hero-section">
  <img 
    key={currentHeroIndex} 
    src={heroImages[currentHeroIndex]} 
    alt="Aroma Lab" 
    className="hero-img" 
  />
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
            {heroImages.map((_, i) => (
              <button key={i} className={`hero-dot ${i === currentHeroIndex ? 'active' : ''}`} onClick={() => setCurrentHeroIndex(i)}></button>
            ))}
          </div>
        )}
      </section>

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
                {product.image ? <img src={product.image} alt={product.name} /> : <div className="product-img-placeholder">{product.name}</div>}
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

      {/* Lifestyle Slider */}
<section className="lifestyle-section">
  <div className="lifestyle-slider">
    <button className="lifestyle-nav lifestyle-nav-prev" onClick={() => setCurrentLifestyleIndex(prev => (prev - 1 + lifestyleDetails.length) % lifestyleDetails.length)}>
      <ChevronLeft />
    </button>
    <div className="lifestyle-slider-inner">
      {lifestyleDetails.map((detail, index) => (
        <div key={index} className={`lifestyle-slide ${index === currentLifestyleIndex ? 'active' : ''}`}>
          <div className="lifestyle-slide-img">
            <img src={detail.image} alt={detail.title} />
          </div>
          <div className="lifestyle-slide-content">
            <div className="lifestyle-eyebrow">{detail.eyebrow}</div>
            <h3 className="lifestyle-title">{detail.title}<br /><span className="accent">{detail.titleAccent}</span></h3>
            <p className="lifestyle-desc">"{detail.description}"</p>
            <div className="lifestyle-buttons">
              <a href={DARAZ_LINK} target="_blank" rel="noopener" className="btn-gold">BUY ON DARAZ</a>
              <a href={`${WHATSAPP_LINK}?text=${encodeURIComponent(`Hi Aroma Lab! I want to order ${detail.title} - Rs. 1,500`)}`} target="_blank" rel="noopener" className="btn-white">WHATSAPP</a>
            </div>
          </div>
        </div>
      ))}
    </div>
    <button className="lifestyle-nav lifestyle-nav-next" onClick={() => setCurrentLifestyleIndex(prev => (prev + 1) % lifestyleDetails.length)}>
      <ChevronRight />
    </button>
  </div>
  {lifestyleDetails.length > 1 && (
    <div className="lifestyle-dots">
      {lifestyleDetails.map((_, i) => (
        <button key={i} className={`lifestyle-dot ${i === currentLifestyleIndex ? 'active' : ''}`} onClick={() => setCurrentLifestyleIndex(i)}></button>
      ))}
    </div>
  )}
</section>

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

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-col-1">
            <div className="footer-logo">
              <img src={LOGO_URL} alt="Aroma Lab" />
              <div className="footer-logo-text">
                <div className="title">AROMA LAB</div>
                <div className="subtitle">FINE FRAGRANCES</div>
              </div>
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
              <a href="https://www.facebook.com/aromalabsl" target="_blank" rel="noopener noreferrer" className="footer-social-btn facebook" title="Facebook"><FacebookIcon /></a>
              <a href="https://wa.me/94777804705" target="_blank" rel="noopener" className="footer-social-btn whatsapp" title="WhatsApp"><WhatsappIcon /></a>
              <a href={DARAZ_LINK} target="_blank" rel="noopener" className="footer-social-btn daraz" title="Daraz"><DarazIcon /></a>
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

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} AROMA LAB FINE FRAGRANCES • ALL RIGHTS RESERVED</span>
        </div>
      </footer>

      <div style={{ height: '40px' }}></div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
