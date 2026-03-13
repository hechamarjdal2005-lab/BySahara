// src/pages/PackDetails.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShoppingCart, Tag, Gift, Package2, Users, Truck, ShieldCheck, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { getAllActivePacks } from "../data/packsData";
import { Pack } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

export default function PackDetails() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { addPackToCart } = useCart();
  const isRtl = language === "ar";
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  const [pack, setPack] = useState<Pack | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  useEffect(() => {
    getAllActivePacks().then((packs) => {
      setPack(packs.find((p) => p.id === id));
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: "#FDFAF5" }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#455324" }} />
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6" dir={isRtl ? "rtl" : "ltr"}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#F8D197" }}>
          <Package2 className="w-7 h-7" style={{ color: "#455324" }} />
        </div>
        <h2 className="font-serif text-xl font-bold mb-3" style={{ color: "#455324" }}>
          {tr("الباقة غير موجودة", "Pack not found")}
        </h2>
        <Link to="/shop" className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-white text-sm" style={{ background: "#455324" }}>
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {tr("العودة للمتجر", "Back to Shop")}
        </Link>
      </div>
    );
  }

  const displayName = isRtl && pack.name_ar ? pack.name_ar : pack.name;
  const displayDesc = isRtl && pack.description_ar ? pack.description_ar : pack.description;
  const displayBadge = isRtl && pack.badge_ar ? pack.badge_ar : pack.badge;
  const discountPct = Math.round((pack.savings / pack.total_original_price) * 100);

  const BADGE_STYLES: Record<string, { background: string; color: string }> = {
    "Best Value": { background: "#CC8F57", color: "#fff" },
    "Limited":    { background: "#c0392b", color: "#fff" },
    "New":        { background: "#455324", color: "#fff" },
  };
  const badgeStyle = pack.badge ? BADGE_STYLES[pack.badge] ?? { background: "#617131", color: "#fff" } : null;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addPackToCart(pack);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const visibleItems = showAllItems ? pack.items : pack.items.slice(0, 4);

  return (
    <div className="min-h-screen pb-20" dir={isRtl ? "rtl" : "ltr"} style={{ background: "#FDFAF5" }}>

      {/* Back */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
        <Link to="/shop#packs" className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: "#BA8944" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#455324")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#BA8944")}>
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {tr("العودة للباقات", "Back to Packs")}
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT — Image */}
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-md" style={{ height: "360px" }}>
              <img src={pack.image_url ?? "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80"} alt={displayName} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 50%)" }} />
              <div className="absolute top-4 start-4 flex gap-2 flex-wrap">
                {badgeStyle && displayBadge && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={badgeStyle}>{displayBadge}</span>
                )}
                <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1" style={{ background: "#455324", color: "#fff" }}>
                  <Tag size={10} />-{discountPct}%
                </span>
              </div>
              {pack.cooperative_name && (
                <div className="absolute bottom-4 start-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(248,209,151,0.90)", color: "#455324" }}>
                    🤝 {pack.cooperative_name}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: <ShieldCheck className="w-4 h-4" />, label: tr("جودة مضمونة", "Quality Guaranteed") },
                { icon: <Truck className="w-4 h-4" />, label: tr("توصيل سريع", "Fast Delivery") },
                { icon: <Users className="w-4 h-4" />, label: tr("منتج تعاوني", "Cooperative Made") },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center" style={{ background: "#fff", border: "1px solid #F0E4CC" }}>
                  <span style={{ color: "#CC8F57" }}>{item.icon}</span>
                  <span className="text-xs font-medium" style={{ color: "#455324" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Details */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#9FA93D" }}>
                {tr("باقة برومو", "Promo Pack")}
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#455324" }}>{displayName}</h1>
              {displayDesc && <p className="text-sm leading-relaxed" style={{ color: "#763C19" }}>{displayDesc}</p>}
            </div>

            {/* Items */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #F0E4CC" }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#FDF6EC", borderBottom: "1px solid #F0E4CC" }}>
                <Package2 size={15} style={{ color: "#CC8F57" }} />
                <span className="text-sm font-bold" style={{ color: "#455324" }}>{tr("محتويات الباقة", "What's included")}</span>
                <span className="ms-auto text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#F8D197", color: "#763C19" }}>
                  {pack.items.length} {tr("منتجات", "items")}
                </span>
              </div>
              <div className="px-4 py-3 flex flex-col gap-3">
                {visibleItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: item.is_free ? "#9FA93D20" : "#F8D19740" }}>
                        {item.is_free ? <Gift size={14} style={{ color: "#617131" }} /> : <span style={{ fontSize: "1rem" }}>🫙</span>}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: item.is_free ? "#455324" : "#442413" }}>
                          {isRtl && item.product_name_ar ? item.product_name_ar : item.product_name}
                          {item.is_free && <span className="ms-2 text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#9FA93D", color: "#fff" }}>FREE</span>}
                        </p>
                        {item.unit && <p className="text-xs" style={{ color: "#BA8944" }}>{item.unit}{item.quantity > 1 && ` × ${item.quantity}`}</p>}
                      </div>
                    </div>
                    <div className="text-end">
                      {item.is_free
                        ? <p className="text-xs line-through" style={{ color: "#BA8944" }}>{item.original_price} MAD</p>
                        : <p className="text-sm font-semibold" style={{ color: "#455324" }}>{item.pack_price} MAD</p>
                      }
                    </div>
                  </div>
                ))}
                {pack.items.length > 4 && (
                  <button onClick={() => setShowAllItems(v => !v)} className="inline-flex items-center gap-1 text-xs font-semibold mt-1" style={{ color: "#CC8F57" }}>
                    {showAllItems ? tr("عرض أقل", "Show less") : tr(`عرض الكل (${pack.items.length})`, `Show all (${pack.items.length})`)}
                    {showAllItems ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                )}
              </div>
            </div>

            {/* Price summary */}
            <div className="rounded-2xl p-4" style={{ background: "#FDF6EC", border: "1px solid #F0E4CC" }}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm" style={{ color: "#763C19" }}>{tr("السعر الأصلي", "Original price")}</span>
                <span className="text-sm line-through" style={{ color: "#BA8944" }}>{pack.total_original_price} MAD</span>
              </div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-semibold" style={{ color: "#617131" }}>{tr("توفير", "You save")}</span>
                <span className="text-sm font-bold" style={{ color: "#617131" }}>-{pack.savings} MAD</span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-1" style={{ borderTop: "1px dashed #F0E4CC" }}>
                <span className="font-bold text-base" style={{ color: "#455324" }}>{tr("سعر الباقة", "Pack price")}</span>
                <div>
                  <span className="font-bold text-2xl" style={{ color: "#455324" }}>{pack.pack_price * qty}</span>
                  <span className="text-sm ms-1" style={{ color: "#BA8944" }}>MAD</span>
                </div>
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1.5px solid #F0E4CC", background: "#fff" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-11 flex items-center justify-center text-lg font-bold transition-colors" style={{ color: "#455324" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FDF6EC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>−</button>
                <span className="w-10 text-center text-sm font-bold" style={{ color: "#455324" }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(pack.stock ?? 99, q + 1))} className="w-10 h-11 flex items-center justify-center text-lg font-bold transition-colors" style={{ color: "#455324" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FDF6EC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>+</button>
              </div>

              <button onClick={handleAddToCart} disabled={pack.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
                style={pack.stock === 0 ? { background: "#F0E4CC", color: "#BA8944", cursor: "not-allowed" } : added ? { background: "#617131", color: "#fff" } : { background: "#CC8F57", color: "#fff" }}
                onMouseEnter={(e) => { if (pack.stock !== 0 && !added) (e.currentTarget as HTMLElement).style.background = "#b87d4a" }}
                onMouseLeave={(e) => { if (pack.stock !== 0 && !added) (e.currentTarget as HTMLElement).style.background = "#CC8F57" }}>
                <ShoppingCart size={16} />
                {pack.stock === 0 ? tr("نفذ المخزون", "Sold Out") : added ? tr("✓ تمت الإضافة", "✓ Added!") : tr("أضف الباقة للسلة", "Add Pack to Cart")}
              </button>
            </div>

            {pack.stock !== undefined && pack.stock > 0 && pack.stock <= 5 && (
              <p className="text-xs font-semibold" style={{ color: "#c0392b" }}>
                ⚠️ {isRtl ? `${pack.stock} قطع فقط متبقية!` : `Only ${pack.stock} left in stock!`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}