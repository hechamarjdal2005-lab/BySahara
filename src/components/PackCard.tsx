// src/components/PackCard.tsx
import React from "react";
import { Pack } from "../types";
import { ShoppingCart, Tag, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface PackCardProps {
  pack: Pack;
  compact?: boolean;
  isRtl?: boolean;
  key?: string | number;
}

const BADGE_STYLES: Record<string, { background: string; color: string }> = {
  "Best Value": { background: "#CC8F57", color: "#fff" },
  "Limited":    { background: "#c0392b", color: "#fff" },
  "New":        { background: "#455324", color: "#fff" },
};

export default function PackCard({ pack, compact = false, isRtl = false }: PackCardProps) {
  const navigate = useNavigate();
  const { addPackToCart } = useCart();

  const tr = (ar: string | undefined, en: string | undefined, fallback = "") =>
    isRtl ? (ar ?? fallback) : (en ?? fallback);

  const displayName  = tr(pack.name_ar, pack.name, pack.name);
  const displayBadge = tr(pack.badge_ar, pack.badge, "");
  const badgeStyle   = pack.badge ? BADGE_STYLES[pack.badge] ?? { background: "#617131", color: "#fff" } : null;
  const discountPct  = pack.total_original_price > 0
    ? Math.round((pack.savings / pack.total_original_price) * 100)
    : 0;
  const fallbackImg  = pack.image_url ?? "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80";
  const isSoldOut    = pack.stock === 0;

  // ✅ max 3 items visible — باش الكارد ماتكبرش
  const visibleItems = pack.items.slice(0, 3);
  const extraItems   = pack.items.length - 3;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addPackToCart(pack);
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      onClick={() => navigate(`/packs/${pack.id}`)}
      className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      style={{
        background: "#FDFAF5",
        border: "1.5px solid #F0E4CC",
        height: "100%",
      }}
    >
      {/* ── Image ── */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ height: compact ? "110px" : "140px" }}  // ✅ تصغير الimage
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #F7F1E8 0%, #EDD9AA25 100%)" }}
        />
        <img
          src={fallbackImg}
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.0) 55%)" }}
        />

        {/* Badges */}
        <div className="absolute top-2 start-2 flex gap-1 flex-wrap">
          {badgeStyle && displayBadge && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={badgeStyle}>
              {displayBadge}
            </span>
          )}
          {discountPct > 0 && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5"
              style={{ background: "#455324", color: "#fff" }}
            >
              <Tag size={8} />-{discountPct}%
            </span>
          )}
        </div>

        {/* Name on image */}
        <div className="absolute bottom-0 start-0 end-0 px-2.5 pb-2">
          <h3
            className="font-serif font-bold text-white leading-tight text-sm"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
          >
            {displayName}
          </h3>
          {pack.cooperative_name && (
            <p className="text-xs" style={{ color: "#F8D197", fontSize: "0.6rem" }}>
              {pack.cooperative_name}
            </p>
          )}
        </div>
      </div>

      {/* ── Items list — max 3 ── */}
      <div className="px-3 pt-2.5 pb-1 flex flex-col gap-1 flex-grow">
        {visibleItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 min-w-0">
              {item.is_free ? (
                <Gift size={10} style={{ color: "#617131", flexShrink: 0 }} />
              ) : (
                <span
                  className="flex-shrink-0 rounded-full"
                  style={{ width: 6, height: 6, background: "#CC8F57", display: "inline-block" }}
                />
              )}
              <span
                className="truncate"
                style={{
                  fontSize: "0.65rem",
                  color: item.is_free ? "#455324" : "#442413",
                  fontWeight: item.is_free ? 600 : 400,
                }}
              >
                {isRtl && item.product_name_ar ? item.product_name_ar : item.product_name}
                {item.unit && <span style={{ color: "#BA8944" }}> ({item.unit})</span>}
              </span>
            </div>
            {item.is_free ? (
              <span
                className="text-xs font-bold px-1 py-0.5 rounded-full flex-shrink-0"
                style={{ background: "#9FA93D20", color: "#617131", fontSize: "0.55rem" }}
              >
                FREE
              </span>
            ) : (
              <span className="flex-shrink-0" style={{ fontSize: "0.6rem", color: "#BA8944" }}>
                {item.original_price} MAD
              </span>
            )}
          </div>
        ))}

        {/* +N more items */}
        {extraItems > 0 && (
          <p style={{ fontSize: "0.6rem", color: "#CC8F57", fontWeight: 600 }}>
            +{extraItems} {isRtl ? "منتجات أخرى..." : "more items..."}
          </p>
        )}

        {/* Price summary */}
        <div className="mt-auto pt-2" style={{ borderTop: "1px dashed #F0E4CC" }}>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-lg" style={{ color: "#455324" }}>
                {pack.pack_price}
              </span>
              <span className="text-xs ms-1" style={{ color: "#BA8944" }}>MAD</span>
            </div>
            {pack.savings > 0 && (
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: "#617131", color: "#fff", fontSize: "0.6rem" }}>
                {isRtl ? `وفر ${pack.savings}` : `Save ${pack.savings}`} MAD
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stock warning */}
      {pack.stock !== undefined && pack.stock > 0 && pack.stock <= 5 && (
        <div className="px-3 pb-1">
          <p className="font-semibold" style={{ fontSize: "0.6rem", color: "#c0392b" }}>
            ⚠️ {isRtl ? `${pack.stock} قطع فقط!` : `Only ${pack.stock} left!`}
          </p>
        </div>
      )}

      {/* ── Add to Cart ── */}
      <div className="px-3 pb-3 pt-1">
        <button
          onClick={handleAddToCart}
          disabled={isSoldOut}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95"
          style={
            isSoldOut
              ? { background: "#F0E4CC", color: "#BA8944", cursor: "not-allowed" }
              : { background: "#CC8F57", color: "#fff" }
          }
          onMouseEnter={(e) => { if (!isSoldOut) (e.currentTarget as HTMLElement).style.background = "#b87d4a"; }}
          onMouseLeave={(e) => { if (!isSoldOut) (e.currentTarget as HTMLElement).style.background = "#CC8F57"; }}
        >
          <ShoppingCart size={13} />
          {isSoldOut
            ? isRtl ? "نفذ المخزون" : "Sold Out"
            : isRtl ? "أضف للسلة" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}