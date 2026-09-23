const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;

const DARAZ_LINK = "https://www.daraz.lk/products/aroma-lab-fine-fragrances-eau-de-parfum-15ml-5-scents-collection-long-lasting-12-hours-for-men-women-i1772233780-s12967079838.html";
const WHATSAPP_LINK = "https://wa.me/94777804705";
const ADMIN_PASSWORD = "Sajithprasanna";
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

function App() {
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [renderCount, setRenderCount] = useState(0);
  const collectionRef = useRef(null);
  const [adminState, setAdminState] = useState('locked');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  // === CART STATES ===
const [cartItems, setCartItems] = useState([]);
const [isCartOpen, setIsCartOpen] = useState(false);
const [customerName, setCustomerName] = useState('');
const [customerPhone, setCustomerPhone] = useState('');
const [customerAddress, setCustomerAddress] = useState('');
const [customerDistrict, setCustomerDistrict] = useState('');
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [loggedInUser, setLoggedInUser] = useState(null);

// ශ්‍රී ලංකාවේ දිස්ත්‍රික්ක 25
const districts = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];
// === END CART STATES ===

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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAdminState('unlocked'); setAuthError(false); setPasswordInput('');
    } else {
      setAuthError(true); setPasswordInput('');
    }
  };

  const filteredProducts = activeFilter === "All" ? products : products.filter(p => p.filter === activeFilter);

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#0A2E1F] selection:bg-[#B8963E]/20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .admin-btn {
          position: fixed;
          bottom: 100px;
          right: 15px;
          width: 56px;
          height: 56px;
          background: #B8963E;
          color: #0A2E1F;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          z-index: 9999;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0,0,0,0.35);
          border: 3px solid #0A2E1F;
          transition: all 0.3s;
        }
        .admin-btn:hover { transform: scale(1.1); }
      `}</style>
      
      <div className="admin-btn" onClick={() => { if(adminState === 'locked') setAdminState('authenticating'); }} title="Admin Panel">⚙️</div>

      {adminState === 'authenticating' && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl font-body">
            <h2 className="text-xl font-bold mb-4 text-center">Admin Access Required</h2>
            <form onSubmit={handlePasswordSubmit}>
              <input type="password" placeholder="Enter Password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full border border-gray-300 rounded p-3 mb-3 text-center tracking-widest" autoFocus />
              {authError && <p className="text-red-500 text-xs mb-3 text-center">Incorrect Password</p>}
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-[#0A2E1F] text-white py-2 rounded font-semibold">Unlock</button>
                <button type="button" onClick={() => { setAdminState('locked'); setAuthError(false); }} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-semibold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {adminState === 'unlocked' ? (
        <AdminPanel products={products} setProducts={setProducts} onLock={() => setAdminState('locked')} />
      ) : (
        <>
          <div className="bg-[#0A2E1F] text-[#FFFBF5] text-[11px] tracking-[0.18em] font-body uppercase py-[10px] text-center">
            <div className="flex items-center justify-center gap-6 flex-wrap px-4">
              <span className="flex items-center gap-2"><span className="w-[4px] h-[4px] rounded-full bg-[#B8963E] inline-block"></span>Island Wide Delivery Available</span>
              <span className="opacity-40">•</span>
              <span>Long Lasting 12+ Hours</span>
              <span className="opacity-40 hidden sm:inline">•</span>
              <span className="hidden sm:inline">Colombo, Sri Lanka</span>
            </div>
          </div>

{/* Google Login/Logout Buttons */}
<div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px 0 20px' }}>
  <button id="google-login-btn" onClick={() => window.googleLogin()} style={{ padding: '8px 16px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
    Sign in with Google
  </button>
  <button id="google-logout-btn" onClick={() => window.googleLogout()} style={{ display: 'none', padding: '8px 16px', background: '#db4437', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
    Logout
  </button>
</div>
        
          <header className="sticky top-0 z-40 bg-[#FFFBF5]/90 backdrop-blur-[12px] border-b border-[#0A2E1F]/[0.06]">
            <div className="max-w-[1320px] mx-auto px-6 sm:px-8 py-5 sm:py-7 flex flex-col items-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3">
                  <img src={LOGO_URL} alt="Aroma Lab Logo" className="w-12 h-12 rounded-full object-cover border border-[#0A2E1F]/20" />
                  <div className="text-center leading-none">
                    <div className="font-display text-[22px] sm:text-[26px] font-[600] tracking-[0.18em]">AROMA LAB</div>
                    <div className="font-body text-[9px] tracking-[0.35em] mt-1 opacity-70">FINE FRAGRANCES</div>
                  </div>
                </div>
              </div>
              <nav className="mt-5 sm:mt-6 flex items-center gap-1 sm:gap-2 bg-[#0A2E1F]/[0.04] rounded-full p-1">
                {['All', 'Ladies', 'Men', 'Unisex'].map((label) => (
                  <button key={label} onClick={() => handleFilter(label)} className={`px-4 sm:px-6 py-[8px] rounded-full text-[11px] sm:text-[12px] font-body tracking-[0.12em] uppercase transition-all ${activeFilter === label ? 'bg-[#0A2E1F] text-[#FFFBF5] shadow-sm' : 'text-[#0A2E1F]/60 hover:text-[#0A2E1F]'}`}>
                    {label === 'All' ? 'All' : `For ${label}`}
                  </button>
                ))}
              </nav>
            </div>
          </header>

          <section className="relative max-w-[1320px] mx-auto px-4 sm:px-8 mt-4 sm:mt-6">
            <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#0A2E1F]">
              <img src={HERO_IMAGE} alt="Aroma Lab Group" className="w-full h-[520px] sm:h-[640px] object-cover object-top opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2E1F] via-[#0A2E1F]/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A2E1F]/60 via-transparent to-transparent hidden sm:block"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
                <div className="max-w-[560px]">
                  <div className="inline-flex items-center gap-2 bg-[#FFFBF5]/90 backdrop-blur rounded-full px-4 py-2 mb-5">
                    <span className="w-2 h-2 bg-[#B8963E] rounded-full animate-pulse"></span>
                    <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[#0A2E1F] font-medium">Premium Eau De Parfum 15ml</span>
                  </div>
                  <h1 className="font-display text-[#FFFBF5] text-[40px] sm:text-[56px] leading-[0.9] tracking-[-0.02em]">
                    FOR MEN <span className="font-[300] italic opacity-80">|</span><br />
                    FOR LADIES <span className="font-[300] italic opacity-80">|</span><br />
                    <span className="text-[#B8963E]">FOR UNISEX</span>
                  </h1>
                  <p className="font-body text-[#FFFBF5]/70 text-[13px] sm:text-[14px] leading-[1.7] mt-5 max-w-[420px]">
                    Aroma Lab Fine Fragrances. Long lasting, high quality fragrance oils crafted for daily wear and special moments in Colombo.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3 items-center">
                    <div className="bg-[#B8963E] text-[#0A2E1F] rounded-full px-6 py-3 font-body text-[13px] tracking-[0.08em] font-semibold">NOW ONLY Rs. 1,500 Each</div>
                    <button onClick={() => handleFilter("All")} className="bg-[#FFFBF5] text-[#0A2E1F] rounded-full px-6 py-3 font-body text-[12px] tracking-[0.15em] uppercase font-medium hover:bg-white transition">Explore Collection →</button>
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-6 border-t border-[#FFFBF5]/10 pt-6 max-w-[420px]">
                    {[{ k: "12+ Hours", v: "Long Lasting" }, { k: "15ml EDP", v: "Premium Oil" }, { k: "Daily & Special", v: "Perfect For" }].map((item) => (
                      <div key={item.k}>
                        <div className="font-display text-[#FFFBF5] text-[14px]">{item.k}</div>
                        <div className="font-body text-[#FFFBF5]/50 text-[10px] tracking-[0.12em] uppercase mt-1">{item.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-[#FFFBF5] rounded-[16px] px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.18)] hidden sm:flex flex-col items-center">
                <div className="font-body text-[9px] tracking-[0.2em] uppercase opacity-50">EAU DE PARFUM</div>
                <div className="font-display text-[22px] leading-none mt-1">15ml</div>
                <div className="w-full h-[1px] bg-[#0A2E1F]/10 my-2"></div>
                <div className="font-body text-[11px] font-semibold tracking-[0.05em]">Rs. 1,500</div>
              </div>
            </div>
          </section>

          <section ref={collectionRef} id="collection" data-nav-tick={renderCount} className="max-w-[1320px] mx-auto px-6 sm:px-8 mt-16 sm:mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="font-body text-[11px] tracking-[0.25em] uppercase text-[#B8963E] font-semibold">The Collection — 5 Signature Scents</div>
                <h2 className="font-display text-[32px] sm:text-[44px] leading-[0.95] tracking-[-0.02em] mt-3">Crafted for every<br />mood & moment.</h2>
              </div>
              <div className="font-body text-[13px] text-[#0A2E1F]/60 leading-[1.6] max-w-[320px]">Real product posters, real notes. Each 15ml Eau De Parfum is made with high quality fragrance oils.</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-[24px] border border-[#0A2E1F]/[0.06] overflow-hidden shadow-[0_8px_32px_rgba(10,46,31,0.06)] hover:shadow-[0_16px_48px_rgba(10,46,31,0.10)] transition-all duration-500">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#FFFBF5]">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-[900ms]" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#0A2E1F]/20 font-display text-[18px]">{product.name}</div>
                    )}
                    <div className="absolute top-4 left-4 bg-[#FFFBF5]/90 backdrop-blur px-3 py-1.5 rounded-full">
                      <span className="font-body text-[10px] tracking-[0.18em] uppercase font-semibold text-[#0A2E1F]">{product.for}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="bg-[#0A2E1F] text-[#FFFBF5] rounded-full px-3 py-1.5 font-body text-[10px] tracking-[0.1em]">15ml EDP</div>
                      <div className="bg-[#B8963E] text-[#0A2E1F] rounded-full px-3 py-1.5 font-body text-[11px] font-bold">Rs. 1,500</div>
                    </div>
                  </div>
                  <div className="p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-[22px] leading-[1.1]">{product.name}</h3>
                        <div className="font-body text-[12px] text-[#0A2E1F]/60 mt-1 tracking-[0.02em]">{product.tagline}</div>
                      </div>
                      <div className="w-7 h-7 rounded-full border border-[#0A2E1F]/15 flex items-center justify-center shrink-0 mt-1" style={{ background: `${product.accent}20` }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: product.accent }}></div>
                      </div>
                    </div>
                    <div className="mt-5 bg-[#FFFBF5] rounded-[14px] p-4 border border-[#0A2E1F]/[0.04]">
                      <div className="grid grid-cols-3 gap-3">
                        <div><div className="font-body text-[9px] tracking-[0.18em] uppercase text-[#B8963E] font-semibold">Top</div><div className="font-body text-[11px] leading-[1.4] mt-1 text-[#0A2E1F]/80">{product.top}</div></div>
                        <div><div className="font-body text-[9px] tracking-[0.18em] uppercase text-[#B8963E] font-semibold">Heart</div><div className="font-body text-[11px] leading-[1.4] mt-1 text-[#0A2E1F]/80">{product.heart}</div></div>
                        <div><div className="font-body text-[9px] tracking-[0.18em] uppercase text-[#B8963E] font-semibold">Base</div><div className="font-body text-[11px] leading-[1.4] mt-1 text-[#0A2E1F]/80">{product.base}</div></div>
                      </div>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <a href={DARAZ_LINK} target="_blank" rel="noopener" className="flex-1 bg-[#0A2E1F] text-[#FFFBF5] rounded-full py-[13px] font-body text-[12px] tracking-[0.14em] uppercase font-medium text-center hover:bg-[#123a28] transition">Order on Daraz - Rs. 1,500</a>
                      <a href={`${WHATSAPP_LINK}?text=${encodeURIComponent(`Hi Aroma Lab! I want to order ${product.name} (${product.for}) - Rs. 1,500. Please confirm availability.`)}`} target="_blank" rel="noopener" className="w-[46px] h-[44px] rounded-full border border-[#0A2E1F]/15 flex items-center justify-center font-body text-[10px] tracking-[0.05em] uppercase font-semibold hover:bg-[#0A2E1F]/5 transition shrink-0">WA</a>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <a href={`${WHATSAPP_LINK}?text=${encodeURIComponent(`Hi Aroma Lab! I want to order ${product.name} - Rs. 1,500`)}`} target="_blank" rel="noopener" className="flex-1 bg-white border border-[#0A2E1F]/10 text-[#0A2E1F] rounded-full py-[11px] font-body text-[11px] tracking-[0.12em] uppercase font-medium text-center hover:bg-[#FFFBF5] transition">WhatsApp 0777 804 705</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="max-w-[1320px] mx-auto px-4 sm:px-8 mt-16 sm:mt-28">
            <div className="rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#0A2E1F] grid sm:grid-cols-[1.1fr_0.9fr] items-stretch">
              <div className="relative aspect-[4/5] sm:aspect-auto sm:min-h-[560px] order-2 sm:order-1">
                <img src={LIFESTYLE_IMAGE} alt="Black Temptation lifestyle" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2E1F]/60 to-transparent sm:hidden"></div>
              </div>
              <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center order-1 sm:order-2">
                <div className="inline-flex self-start bg-[#FFFBF5]/10 border border-[#FFFBF5]/10 rounded-full px-4 py-2 font-body text-[10px] tracking-[0.2em] uppercase text-[#FFFBF5]/70">Muse — Black Temptation</div>
                <h3 className="font-display text-[#FFFBF5] text-[32px] sm:text-[44px] leading-[0.95] tracking-[-0.02em] mt-6">Dark, mysterious,<br /><span className="italic font-[300] text-[#B8963E]">& seductive.</span></h3>
                <p className="font-body text-[#FFFBF5]/60 text-[14px] leading-[1.7] mt-6 max-w-[380px]">"Blackcurrant and pear open with a bright bite, jasmine and orange blossom bloom at the heart, and vanilla, praline, and musk leave a soft, unforgettable trail. Perfect for evenings."</p>
                <div className="mt-6 flex gap-2">
                  <a href={DARAZ_LINK} target="_blank" rel="noopener" className="flex-1 bg-[#B8963E] text-[#0A2E1F] rounded-full py-3 font-body text-[12px] tracking-[0.12em] uppercase font-semibold text-center hover:bg-[#c9a84a] transition">Buy on Daraz</a>
                  <a href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Hi Aroma Lab! I want to order Black Temptation - Rs. 1,500")}`} target="_blank" rel="noopener" className="flex-1 bg-white text-[#0A2E1F] rounded-full py-3 font-body text-[12px] tracking-[0.12em] uppercase font-medium text-center hover:bg-[#FFFBF5] transition">WhatsApp</a>
                </div>
              </div>
            </div>
          </section>
                <section className="max-w-[1320px] mx-auto px-4 sm:px-8 mt-16 sm:mt-28">
  <div className="rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#0A2E1F] grid sm:grid-cols-[0.9fr_1.1fr] items-stretch">
    <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center order-1 sm:order-1">
      <div className="inline-flex self-start bg-[#FFFBF5]/10 border border-[#FFFBF5]/10 rounded-full px-4 py-2 font-body text-[10px] tracking-[0.2em] uppercase text-[#FFFBF5]/70">Muse — Hunters Dusk</div>
      <h3 className="font-display text-[#FFFBF5] text-[32px] sm:text-[44px] leading-[0.95] tracking-[-0.02em] mt-6">Woody, smoky,<br /><span className="italic font-[300] text-[#B8963E]">& adventurous.</span></h3>
      <p className="font-body text-[#FFFBF5]/60 text-[14px] leading-[1.7] mt-6 max-w-[380px]">"Bergamot and pine open with a fresh, woody bite, cedarwood and leather deepen the heart, and amber, musk, and vetiver leave a bold, masculine trail. Perfect for the modern man."</p>
      <div className="mt-6 flex gap-2">
        <a href={DARAZ_LINK} target="_blank" rel="noopener" className="flex-1 bg-[#B8963E] text-[#0A2E1F] rounded-full py-3 font-body text-[12px] tracking-[0.12em] uppercase font-semibold text-center hover:bg-[#c9a84a] transition">Buy on Daraz</a>
        <a href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Hi Aroma Lab! I want to order Hunters Dusk - Rs. 1,500")}`} target="_blank" rel="noopener" className="flex-1 bg-white text-[#0A2E1F] rounded-full py-3 font-body text-[12px] tracking-[0.12em] uppercase font-medium text-center hover:bg-[#FFFBF5] transition">WhatsApp</a>
      </div>
    </div>
    <div className="relative aspect-[4/5] sm:aspect-auto sm:min-h-[560px] order-2 sm:order-2">
      <img src={LIFESTYLE_IMAGE_2} alt="Hunters Dusk lifestyle" className="w-full h-full object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A2E1F]/60 to-transparent sm:hidden"></div>
    </div>
  </div>
</section>

          <section className="max-w-[1320px] mx-auto px-4 sm:px-8 mt-8 sm:mt-10">
            <div className="rounded-[20px] bg-[#B8963E]/10 border border-[#B8963E]/20 px-6 sm:px-10 py-6 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0A2E1F] text-[#FFFBF5] flex items-center justify-center font-display font-bold text-[14px]">KOKO</div>
                <div>
                  <div className="font-display text-[18px] leading-none">Buy Now, Pay Later</div>
                  <div className="font-body text-[12px] text-[#0A2E1F]/60 mt-1">Pay in 3 installments with any debit / credit card • 0% interest</div>
                </div>
              </div>
              <a href={DARAZ_LINK} target="_blank" rel="noopener" className="font-body text-[11px] tracking-[0.15em] uppercase bg-white border border-[#0A2E1F]/10 rounded-full px-5 py-2.5 hover:bg-[#FFFBF5] transition text-center">Order on Daraz</a>
            </div>
          </section>

          <footer className="mt-16 sm:mt-24 border-t border-[#0A2E1F]/[0.06] bg-white">
            <div className="max-w-[1320px] mx-auto px-6 sm:px-8 py-12 sm:py-16 grid sm:grid-cols-[1.2fr_0.8fr_0.8fr] gap-10">
              <div>
                <div className="flex items-center gap-3">
                  <img src={LOGO_URL} alt="Aroma Lab Logo" className="w-10 h-10 rounded-full object-cover border border-[#0A2E1F]/20" />
                  <div className="font-display text-[18px] tracking-[0.18em] font-semibold">AROMA LAB</div>
                </div>
                <div className="font-body text-[12px] text-[#0A2E1F]/60 leading-[1.7] mt-4 max-w-[340px]">Fine Fragrances based in Colombo, Sri Lanka. Premium Eau De Parfum 15ml with high quality fragrance oils, long lasting 12+ hours.</div>
                <div className="mt-6 inline-flex items-center gap-2 bg-[#FFFBF5] border border-[#0A2E1F]/10 rounded-full px-4 py-2 font-body text-[11px]"><span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>Rs. 1,500 Each • 15ml EDP • Island Wide Delivery</div>
              </div>
              <div>
                <div className="font-body text-[11px] tracking-[0.25em] uppercase font-semibold opacity-60">Contact</div>
                <div className="mt-4 space-y-3 font-body text-[13px]">
                  <a href="tel:+94777804705" className="block hover:text-[#B8963E] transition">0777 804 705</a>
                  <a href="https://wa.me/94777804705" target="_blank" rel="noopener" className="block hover:text-[#B8963E] transition">WhatsApp • wa.me/94777804705</a>
                  <div className="text-[#0A2E1F]/60">Colombo, Sri Lanka</div>
                </div>
              </div>
              <div>
                <div className="font-body text-[11px] tracking-[0.25em] uppercase font-semibold opacity-60">Shop</div>
                <div className="mt-4 space-y-3 font-body text-[13px]">
                  <a href={DARAZ_LINK} target="_blank" rel="noopener" className="block underline underline-offset-4 hover:text-[#B8963E] font-medium">Order on Daraz - Rs. 1,500</a>
                  <div className="text-[#0A2E1F]/60">Buy Now Pay Later with KOKO</div>
                  <div className="text-[#0A2E1F]/60">Island Wide Delivery Available</div>
                </div>
              </div>
            </div>
            <div className="border-t border-[#0A2E1F]/[0.06] py-5 px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-[1320px] mx-auto">
              <div className="font-body text-[11px] tracking-[0.12em] uppercase text-[#0A2E1F]/40">© {new Date().getFullYear()} Aroma Lab Fine Fragrances • All rights reserved</div>
              <div className="font-body text-[11px] text-[#0A2E1F]/40">FOR MEN | FOR LADIES | FOR UNISEX • Sri Lanka</div>
            </div>
          </footer>

{/* Fixed Bottom Bar - Facebook + Daraz + WhatsApp */}
<div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-[12px] border-t border-[#0A2E1F]/10 px-3 py-3 sm:px-6 shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
  <div className="max-w-[1320px] mx-auto flex items-center gap-2 sm:gap-3">

{/* Facebook */}
<a href="https://www.facebook.com/aromalabsl" target="_blank" rel="noopener noreferrer"
   style={{ backgroundColor: '#0866FF' }}
   className="flex-1 flex items-center justify-center gap-1.5 text-[#FFFBF5] rounded-full py-3 px-2 font-body text-[10px] sm:text-[11px] tracking-[0.08em] uppercase font-semibold transition hover:opacity-90">
  <span className="truncate">Facebook</span>
</a>

    {/* Daraz */}
    <a href={DARAZ_LINK} target="_blank" rel="noopener"
       className="flex-1 flex items-center justify-center gap-1.5 bg-[#0A2E1F] text-[#FFFBF5] rounded-full py-3 px-2 font-body text-[10px] sm:text-[11px] tracking-[0.08em] uppercase font-semibold hover:bg-[#123a28] transition">
      <span className="truncate">Daraz</span>
      <span className="hidden sm:inline">→</span>
    </a>

    {/* WhatsApp */}
    <a href={`${WHATSAPP_LINK}?text=Hi%20Aroma%20Lab!%20I%20want%20to%20order%20perfumes.%20Rs.%201,500%20each`}
       target="_blank" rel="noopener"
       className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white rounded-full py-3 px-2 font-body text-[10px] sm:text-[11px] tracking-[0.08em] uppercase font-semibold hover:bg-[#1da851] transition">
      <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[9px] text-[#25D366] shrink-0">✆</span>
      <span className="truncate">WhatsApp</span>
    </a>

  </div>
</div>
<div className="h-[72px]"></div>
        </>
      )}
    </div>
  );
}

function AdminPanel({ products, setProducts, onLock }) {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(products, null, 2));
  const [message, setMessage] = useState('');

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

  const handleDownload = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error("Data must be an array");
      const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage('⬇️ products.json downloaded! Upload to GitHub.');
      setTimeout(() => setMessage(''), 5000);
    } catch (e) {
      setMessage('❌ Cannot download. Invalid JSON.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset to default products?')) {
      localStorage.removeItem('aromaLabProducts');
      window.location.reload();
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white min-h-screen font-body">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold font-display">Admin Panel</h1>
        <button onClick={onLock} className="bg-[#0A2E1F] text-white px-4 py-2 rounded text-sm font-semibold">Lock Admin</button>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded mb-6 text-sm">
        <p className="font-bold mb-1">📌 How to use:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Edit JSON below to modify products.</li>
          <li><strong>Preview:</strong> Click "Save & Apply" to see changes instantly.</li>
          <li><strong>Permanent:</strong> Click "Download products.json" and upload to GitHub.</li>
          <li><strong>Image:</strong> Paste image URL in the "image" field of each product.</li>
        </ul>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Product Data (JSON):</label>
        <textarea className="w-full h-96 p-4 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2E1F]" value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} spellCheck="false" />
      </div>
      <div className="flex flex-wrap gap-4">
        <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700">Save & Apply</button>
        <button onClick={handleDownload} className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700">⬇️ Download products.json</button>
        <button onClick={handleReset} className="bg-red-500 text-white px-6 py-2 rounded font-semibold hover:bg-red-600">Reset to Default</button>
      </div>
      {message && (
        <div className={`mt-4 p-3 rounded text-sm font-medium ${message.includes('✅') || message.includes('⬇️') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
