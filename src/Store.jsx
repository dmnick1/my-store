import React, { useState, useMemo } from "react";
import { Search, ShoppingCart, X, Plus, Minus, ChevronRight, FlaskConical, Beaker, ShieldCheck, Truck, ArrowLeft, Check } from "lucide-react";

// ---------------------------------------------------------------------------
// Catalog (placeholder data — swap in your real products/pricing/copy)
// ---------------------------------------------------------------------------
const CATEGORIES = ["Peptides", "Aminos", "Blends", "Supplements", "Supplies"];

const PRODUCTS = [
  { id: "p1", name: "BPC-157", category: "Peptides", batch: "BP-1157", purity: "99.1%", size: "5mg", price: 42, stock: 34, rating: 4.9, blurb: "Stabilized lyophilized vial, cold-chain shipped." },
  { id: "p2", name: "TB-500", category: "Peptides", batch: "BP-2500", purity: "98.7%", size: "5mg", price: 48, stock: 21, rating: 4.8, blurb: "Fragment-form synthetic peptide, sealed under argon." },
  { id: "p3", name: "GHK-Cu", category: "Peptides", batch: "BP-3064", purity: "99.4%", size: "50mg", price: 36, stock: 40, rating: 4.7, blurb: "Copper-complexed tripeptide, third-party assayed." },
  { id: "p4", name: "Ipamorelin", category: "Peptides", batch: "BP-4212", purity: "99.0%", size: "5mg", price: 39, stock: 18, rating: 4.9, blurb: "Pentapeptide, single-source synthesis." },
  { id: "p5", name: "Epithalon", category: "Peptides", batch: "BP-5309", purity: "98.9%", size: "10mg", price: 45, stock: 12, rating: 4.6, blurb: "Tetrapeptide, HPLC-verified per batch." },
  { id: "p6", name: "Selank", category: "Peptides", batch: "BP-6180", purity: "99.2%", size: "5mg", price: 41, stock: 27, rating: 4.8, blurb: "Heptapeptide, nasal-grade solvent compatible." },
  { id: "a1", name: "L-Carnitine Tartrate", category: "Aminos", batch: "AM-1044", purity: "99.6%", size: "100g", price: 22, stock: 55, rating: 4.7, blurb: "Micronized powder, third-party tested." },
  { id: "a2", name: "Taurine", category: "Aminos", batch: "AM-2091", purity: "99.8%", size: "200g", price: 18, stock: 60, rating: 4.6, blurb: "USP-grade free-form amino acid." },
  { id: "a3", name: "Glycine", category: "Aminos", batch: "AM-3187", purity: "99.7%", size: "250g", price: 16, stock: 48, rating: 4.8, blurb: "Fine crystalline powder, lab-sealed pouch." },
  { id: "b1", name: "Recovery Stack Blend", category: "Blends", batch: "BL-1290", purity: "N/A", size: "10ml", price: 78, stock: 15, rating: 4.9, blurb: "Multi-compound blend, single-vial convenience." },
  { id: "b2", name: "Focus Complex Blend", category: "Blends", batch: "BL-2354", purity: "N/A", size: "10ml", price: 74, stock: 10, rating: 4.5, blurb: "Nootropic-adjacent blend, cold-shipped." },
  { id: "s1", name: "NAD+ Packets", category: "Supplements", batch: "SP-1002", purity: "N/A", size: "1000mg x10", price: 20, stock: 70, rating: 4.7, blurb: "Single-serving sachets, shelf-stable." },
  { id: "s2", name: "Shilajit Honey Sticks", category: "Supplements", batch: "SP-2110", purity: "N/A", size: "x10 sticks", price: 20, stock: 65, rating: 4.6, blurb: "Resin-infused honey, individually packed." },
  { id: "u1", name: "Bacteriostatic Water", category: "Supplies", batch: "SU-1077", purity: "USP", size: "30ml", price: 12, stock: 90, rating: 4.9, blurb: "Sterile-filtered, multi-use vial." },
  { id: "u2", name: "Insulin Syringes (100ct)", category: "Supplies", batch: "SU-2098", purity: "N/A", size: "1ml", price: 15, stock: 80, rating: 4.8, blurb: "Fine-gauge, individually wrapped." },
  { id: "u3", name: "Alcohol Prep Pads (200ct)", category: "Supplies", batch: "SU-3145", purity: "N/A", size: "200ct", price: 9, stock: 100, rating: 4.9, blurb: "Sterile 70% isopropyl swabs." },
];

const fmt = (n) => `$${n.toFixed(2)}`;

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
function LabTag({ children }) {
  return (
    <span style={{
      fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.04em",
      color: "#3E6B85", background: "#E7EEF1", padding: "3px 8px", borderRadius: 3,
    }}>{children}</span>
  );
}

function ProductCard({ product, onOpen, onAdd }) {
  return (
    <div
      onClick={() => onOpen(product)}
      style={{
        cursor: "pointer", position: "relative", background: "#FFFFFF",
        border: "1px solid #E3DFD5", borderRadius: 2, padding: "20px 18px 16px",
        display: "flex", flexDirection: "column", gap: 10, transition: "box-shadow .2s, transform .2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(27,36,48,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* registration mark */}
      <div style={{ position: "absolute", top: 8, right: 8, width: 10, height: 10, borderTop: "2px solid #C9C3B4", borderRight: "2px solid #C9C3B4" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#9A9484" }}>BATCH {product.batch}</div>
        {product.stock < 15 && <LabTag>LOW STOCK</LabTag>}
      </div>
      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: "#1B2430", margin: 0 }}>{product.name}</h3>
      <p style={{ fontSize: 13, color: "#6B6656", margin: 0, lineHeight: 1.4 }}>{product.blurb}</p>
      <div style={{ display: "flex", gap: 14, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#3E6B85", borderTop: "1px dashed #E3DFD5", paddingTop: 10, marginTop: 4 }}>
        <span>PURITY {product.purity}</span>
        <span>SIZE {product.size}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "#1B2430" }}>{fmt(product.price)}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          style={{
            background: "#1B2430", color: "#F5F3EE", border: "none", borderRadius: 2,
            padding: "8px 14px", fontSize: 12, letterSpacing: "0.04em", cursor: "pointer",
            fontFamily: "'Inter', sans-serif", fontWeight: 600,
          }}
        >ADD TO CART</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main store
// ---------------------------------------------------------------------------
export default function Store() {
  const [view, setView] = useState("home"); // home | shop | product | cart | checkout | confirmed
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState({}); // id -> qty
  const [cartOpen, setCartOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p =>
      (activeCategory === "All" || p.category === activeCategory) &&
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [activeCategory, query]);

  const cartItems = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => ({ ...PRODUCTS.find(p => p.id === id), qty }));
  }, [cart]);

  const cartCount = cartItems.reduce((n, i) => n + i.qty, 0);
  const cartTotal = cartItems.reduce((n, i) => n + i.qty * i.price, 0);

  const addToCart = (product, qty = 1) => {
    setCart(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + qty }));
  };
  const setQty = (id, qty) => {
    setCart(prev => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  const goShop = (cat) => { setActiveCategory(cat || "All"); setView("shop"); window.scrollTo?.(0, 0); };
  const openProduct = (p) => { setSelectedProduct(p); setView("product"); window.scrollTo?.(0, 0); };

  const placeOrder = () => {
    setOrderNumber("SJ-" + Math.floor(100000 + Math.random() * 900000));
    setCart({});
    setView("confirmed");
    window.scrollTo?.(0, 0);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F5F3EE", minHeight: "100%", color: "#1B2430" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        button:focus-visible, input:focus-visible { outline: 2px solid #3E6B85; outline-offset: 2px; }
      `}</style>

      {/* ---------------- Header ---------------- */}
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "#F5F3EE", borderBottom: "1px solid #E3DFD5" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div onClick={() => setView("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <FlaskConical size={22} color="#3E6B85" />
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 20, letterSpacing: "-0.01em" }}>Meridian Labs Supply</span>
          </div>
          <nav style={{ display: "flex", gap: 22, fontSize: 14, fontWeight: 500 }}>
            {CATEGORIES.map(cat => (
              <span key={cat} onClick={() => goShop(cat)} style={{ cursor: "pointer", color: "#454038" }}>{cat}</span>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", background: "#FFFFFF", border: "1px solid #E3DFD5", borderRadius: 2, padding: "6px 10px", gap: 6 }}>
              <Search size={14} color="#9A9484" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); if (view !== "shop") setView("shop"); }}
                placeholder="Search catalog"
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, width: 120 }}
              />
            </div>
            <button
              onClick={() => setCartOpen(true)}
              style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 6 }}
              aria-label="Open cart"
            >
              <ShoppingCart size={20} color="#1B2430" />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -2, right: -2, background: "#B5652E", color: "#fff",
                  borderRadius: "50%", width: 16, height: 16, fontSize: 10, display: "flex",
                  alignItems: "center", justifyContent: "center", fontWeight: 700,
                }}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- HOME ---------------- */}
      {view === "home" && (
        <>
          <section style={{ background: "#1B2430", color: "#F5F3EE", padding: "80px 24px 90px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 40, alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#8FB2C6", letterSpacing: "0.08em", marginBottom: 18 }}>
                  EVERY VIAL TRACES BACK TO A BATCH RECORD
                </div>
                <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 48, lineHeight: 1.08, fontWeight: 600, margin: "0 0 22px" }}>
                  Research compounds,<br />documented from source to shelf.
                </h1>
                <p style={{ fontSize: 16, color: "#C7CBD1", maxWidth: 460, lineHeight: 1.6, marginBottom: 28 }}>
                  Peptides, aminos, and supplies for laboratory and analytical use, each batch accompanied by its own purity data. Not for human consumption.
                </p>
                <button
                  onClick={() => goShop("All")}
                  style={{ background: "#F5F3EE", color: "#1B2430", border: "none", padding: "14px 26px", fontSize: 14, fontWeight: 700, letterSpacing: "0.03em", cursor: "pointer", borderRadius: 2 }}
                >BROWSE CATALOG</button>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <svg width="220" height="280" viewBox="0 0 220 280" fill="none">
                  <rect x="70" y="20" width="80" height="200" rx="8" stroke="#3E6B85" strokeWidth="2" fill="#232C38" />
                  <rect x="80" y="120" width="60" height="90" fill="#3E6B85" opacity="0.5" />
                  <rect x="60" y="10" width="100" height="16" rx="3" fill="#8FB2C6" />
                  <line x1="82" y1="150" x2="138" y2="150" stroke="#F5F3EE" strokeWidth="1" opacity="0.4" />
                  <line x1="82" y1="165" x2="138" y2="165" stroke="#F5F3EE" strokeWidth="1" opacity="0.4" />
                  <line x1="82" y1="180" x2="120" y2="180" stroke="#F5F3EE" strokeWidth="1" opacity="0.4" />
                  <circle cx="110" cy="240" r="4" fill="#B5652E" />
                  <text x="55" y="260" fill="#8FB2C6" fontSize="10" fontFamily="IBM Plex Mono">BATCH BP-1157</text>
                </svg>
              </div>
            </div>
          </section>

          <section style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: Truck, title: "Same-day dispatch", body: "In-stock orders placed before 2pm ET ship same business day." },
              { icon: Beaker, title: "Batch-level purity data", body: "Each listing carries its own batch number and assay result." },
              { icon: ShieldCheck, title: "Sealed cold-chain packing", body: "Insulated shipping on temperature-sensitive compounds." },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <f.icon size={22} color="#3E6B85" />
                <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 17, margin: 0, fontWeight: 600 }}>{f.title}</h4>
                <p style={{ fontSize: 13.5, color: "#6B6656", margin: 0, lineHeight: 1.5 }}>{f.body}</p>
              </div>
            ))}
          </section>

          <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 80px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22 }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, margin: 0 }}>Frequently sourced</h2>
              <span onClick={() => goShop("All")} style={{ cursor: "pointer", fontSize: 13, color: "#3E6B85", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                View all <ChevronRight size={14} />
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 18 }}>
              {PRODUCTS.slice(0, 8).map(p => (
                <ProductCard key={p.id} product={p} onOpen={openProduct} onAdd={addToCart} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ---------------- SHOP ---------------- */}
      {view === "shop" && (
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 600, margin: "0 0 6px" }}>
            {activeCategory === "All" ? "Full catalog" : activeCategory}
          </h2>
          <p style={{ fontSize: 13, color: "#9A9484", marginBottom: 24, fontFamily: "'IBM Plex Mono', monospace" }}>{filtered.length} ITEMS</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 30 }}>
            {["All", ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                  border: cat === activeCategory ? "1px solid #1B2430" : "1px solid #E3DFD5",
                  background: cat === activeCategory ? "#1B2430" : "#FFFFFF",
                  color: cat === activeCategory ? "#F5F3EE" : "#454038", fontWeight: 500,
                }}
              >{cat}</button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p style={{ color: "#9A9484" }}>No items match that search.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 18 }}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onOpen={openProduct} onAdd={addToCart} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ---------------- PRODUCT DETAIL ---------------- */}
      {view === "product" && selectedProduct && (
        <ProductDetail product={selectedProduct} onBack={() => setView("shop")} onAdd={addToCart} />
      )}

      {/* ---------------- CHECKOUT ---------------- */}
      {view === "checkout" && (
        <Checkout items={cartItems} total={cartTotal} onBack={() => setView("shop")} onPlace={placeOrder} />
      )}

      {/* ---------------- CONFIRMATION ---------------- */}
      {view === "confirmed" && (
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "100px 24px", textAlign: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#7C9885", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Check color="#fff" size={26} />
          </div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, marginBottom: 8 }}>Order placed</h2>
          <p style={{ color: "#6B6656", marginBottom: 4 }}>Confirmation number</p>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, marginBottom: 28 }}>{orderNumber}</p>
          <button onClick={() => setView("home")} style={{ background: "#1B2430", color: "#F5F3EE", border: "none", padding: "12px 22px", borderRadius: 2, cursor: "pointer", fontWeight: 600 }}>
            Continue browsing
          </button>
        </div>
      )}

      {/* ---------------- Footer ---------------- */}
      <footer style={{ background: "#1B2430", color: "#C7CBD1", padding: "40px 24px 26px", marginTop: 0 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 11.5, lineHeight: 1.7, color: "#8B90A0", maxWidth: 900 }}>
            FDA Disclaimer: statements on this site have not been evaluated by the U.S. Food and Drug Administration.
            These products are not intended to diagnose, treat, cure, or prevent any disease and are sold strictly for
            laboratory, research, and analytical use — not for human or animal consumption. Meridian Labs Supply is not
            a compounding pharmacy or outsourcing facility under sections 503A/503B of the FD&C Act.
          </p>
          <p style={{ fontSize: 12, marginTop: 18, color: "#6E7386" }}>© Meridian Labs Supply. Placeholder storefront for demonstration purposes.</p>
        </div>
      </footer>

      {/* ---------------- Cart drawer ---------------- */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 30, display: "flex", justifyContent: "flex-end" }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(27,36,48,0.4)" }} />
          <div style={{ position: "relative", width: 380, maxWidth: "92vw", background: "#F5F3EE", height: "100%", padding: 24, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, margin: 0 }}>Your cart</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            {cartItems.length === 0 ? (
              <p style={{ color: "#9A9484", fontSize: 14 }}>Your cart is empty.</p>
            ) : (
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, borderBottom: "1px solid #E3DFD5", paddingBottom: 12 }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{item.name}</p>
                      <p style={{ margin: "2px 0 8px", fontSize: 12, color: "#9A9484" }}>{fmt(item.price)} each</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={() => setQty(item.id, item.qty - 1)} style={{ border: "1px solid #E3DFD5", background: "#fff", cursor: "pointer", borderRadius: 2, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={12} /></button>
                        <span style={{ fontSize: 13, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => setQty(item.id, item.qty + 1)} style={{ border: "1px solid #E3DFD5", background: "#fff", cursor: "pointer", borderRadius: 2, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={12} /></button>
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{fmt(item.price * item.qty)}</div>
                  </div>
                ))}
              </div>
            )}
            {cartItems.length > 0 && (
              <div style={{ paddingTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 15, fontWeight: 700 }}>
                  <span>Subtotal</span><span>{fmt(cartTotal)}</span>
                </div>
                <button
                  onClick={() => { setCartOpen(false); setView("checkout"); }}
                  style={{ width: "100%", background: "#1B2430", color: "#F5F3EE", border: "none", padding: "13px", borderRadius: 2, fontWeight: 700, cursor: "pointer" }}
                >CHECKOUT</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
function ProductDetail({ product, onBack, onAdd }) {
  const [qty, setQty] = useState(1);
  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px 80px" }}>
      <span onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#3E6B85", cursor: "pointer", marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back to catalog
      </span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E3DFD5", borderRadius: 2, height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FlaskConical size={64} color="#C9C3B4" />
        </div>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#9A9484", marginBottom: 8 }}>BATCH {product.batch}</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 600, margin: "0 0 10px" }}>{product.name}</h1>
          <p style={{ color: "#6B6656", fontSize: 14.5, lineHeight: 1.6, marginBottom: 18 }}>{product.blurb}</p>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <LabTag>PURITY {product.purity}</LabTag>
            <LabTag>SIZE {product.size}</LabTag>
            <LabTag>{product.stock} IN STOCK</LabTag>
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 600, marginBottom: 20 }}>{fmt(product.price)}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #E3DFD5", borderRadius: 2 }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ border: "none", background: "none", padding: "8px 12px", cursor: "pointer" }}><Minus size={14} /></button>
              <span style={{ padding: "0 14px", fontSize: 14 }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ border: "none", background: "none", padding: "8px 12px", cursor: "pointer" }}><Plus size={14} /></button>
            </div>
            <button
              onClick={() => onAdd(product, qty)}
              style={{ flex: 1, background: "#1B2430", color: "#F5F3EE", border: "none", padding: "14px", borderRadius: 2, fontWeight: 700, cursor: "pointer" }}
            >ADD TO CART</button>
          </div>
          <p style={{ fontSize: 11.5, color: "#9A9484", lineHeight: 1.6 }}>
            Sold for laboratory, research, and analytical use only. Not for human or animal consumption.
          </p>
        </div>
      </div>
    </section>
  );
}

function Checkout({ items, total, onBack, onPlace }) {
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "", card: "" });
  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const inputStyle = { width: "100%", padding: "11px 12px", border: "1px solid #E3DFD5", borderRadius: 2, fontSize: 14, marginBottom: 14, fontFamily: "'Inter', sans-serif" };
  const canSubmit = form.name && form.email && form.address && form.city && form.zip && form.card && items.length > 0;

  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px 80px" }}>
      <span onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#3E6B85", cursor: "pointer", marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back to catalog
      </span>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, marginBottom: 24 }}>Checkout</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 40 }}>
        <div>
          <h4 style={{ fontSize: 13, letterSpacing: "0.05em", color: "#9A9484", marginBottom: 10 }}>SHIPPING</h4>
          <input placeholder="Full name" style={inputStyle} value={form.name} onChange={update("name")} />
          <input placeholder="Email" style={inputStyle} value={form.email} onChange={update("email")} />
          <input placeholder="Address" style={inputStyle} value={form.address} onChange={update("address")} />
          <div style={{ display: "flex", gap: 12 }}>
            <input placeholder="City" style={inputStyle} value={form.city} onChange={update("city")} />
            <input placeholder="ZIP" style={inputStyle} value={form.zip} onChange={update("zip")} />
          </div>
          <h4 style={{ fontSize: 13, letterSpacing: "0.05em", color: "#9A9484", margin: "10px 0" }}>PAYMENT</h4>
          <input placeholder="Card number (demo only)" style={inputStyle} value={form.card} onChange={update("card")} />
        </div>
        <div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E3DFD5", borderRadius: 2, padding: 20 }}>
            {items.map(i => (
              <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 10 }}>
                <span>{i.name} × {i.qty}</span>
                <span>{fmt(i.price * i.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #E3DFD5", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <span>Total</span><span>{fmt(total)}</span>
            </div>
          </div>
          <button
            disabled={!canSubmit}
            onClick={onPlace}
            style={{
              width: "100%", marginTop: 16, padding: "14px", borderRadius: 2, border: "none",
              background: canSubmit ? "#1B2430" : "#C9C3B4", color: "#F5F3EE", fontWeight: 700,
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >PLACE ORDER</button>
        </div>
      </div>
    </section>
  );
}
