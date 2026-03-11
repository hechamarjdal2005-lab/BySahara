// src/components/PackCard.tsx
import React from "react";
import { Pack } from "../types";
import { ShoppingCart, Tag, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const tr = (ar: string | undefined, en: string | undefined, fallback = "") =>
    isRtl ? (ar ?? fallback) : (en ?? fallback);

  const displayName  = tr(pack.name_ar,  pack.name,  pack.name);
  const displayBadge = tr(pack.badge_ar, pack.badge, "");
  const badgeStyle   = pack.badge ? BADGE_STYLES[pack.badge] ?? { background: "#617131", color: "#fff" } : null;
  const discountPct  = Math.round((pack.savings / pack.total_original_price) * 100);
  const fallbackImg  = pack.image_url ?? "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // mashi navigate — ghir add to cart
    console.log("Add pack to cart:", pack.id);
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      onClick={() => navigate(`/packs/${pack.id}`)}
      className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      style={{ background: "#fff", border: "1px solid #F0E4CC" }}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden" style={{ height: compact ? "120px" : "140px" }}>
        <img
          src={fallbackImg}
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.0) 55%)" }}
        />

        {/* Badges */}
        <div className="absolute top-2.5 start-2.5 flex gap-1.5 flex-wrap">
          {badgeStyle && displayBadge && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={badgeStyle}>
              {displayBadge}
            </span>
          )}
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ background: "#455324", color: "#fff" }}
          >
            <Tag size={9} />
            -{discountPct}%
          </span>
        </div>

        {/* Name on image */}
        <div className="absolute bottom-0 start-0 end-0 px-3 pb-2">
          <h3
            className={`font-serif font-bold text-white leading-tight ${compact ? "text-sm" : "text-base"}`}
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          >
            {displayName}
          </h3>
          {pack.cooperative_name && !compact && (
            <p className="text-xs" style={{ color: "#F8D197" }}>
              {pack.cooperative_name}
            </p>
          )}
        </div>
      </div>

      {/* ── Items ── */}
      <div className="px-4 py-3 flex flex-col gap-1.5 flex-1">
        {pack.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {item.is_free ? (
                <Gift size={11} style={{ color: "#617131", flexShrink: 0 }} />
              ) : (
                <span
                  className="rounded-full flex-shrink-0"
                  style={{ width: 7, height: 7, background: "#CC8F57", display: "inline-block" }}
                />
              )}
              <span
                className="text-xs"
                style={{ color: item.is_free ? "#455324" : "#442413", fontWeight: item.is_free ? 600 : 400 }}
              >
                {item.product_name}
                {item.unit && (
                  <span className="ms-0.5" style={{ color: "#BA8944" }}>({item.unit})</span>
                )}
              </span>
            </div>
            {item.is_free ? (
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "#9FA93D20", color: "#617131" }}
              >
                FREE
              </span>
            ) : (
              <span className="text-xs" style={{ color: "#BA8944" }}>{item.original_price} MAD</span>
            )}
          </div>
        ))}

        {/* Savings */}
        <div className="mt-1.5 pt-2" style={{ borderTop: "1px dashed #F0E4CC" }}>
          <div className="flex justify-between text-xs" style={{ color: "#BA8944" }}>
            <span>{isRtl ? "الأصلي" : "Original"}</span>
            <span className="line-through">{pack.total_original_price} MAD</span>
          </div>
          <div className="flex justify-between text-xs font-semibold" style={{ color: "#617131" }}>
            <span>{isRtl ? "توفير" : "Save"}</span>
            <span>-{pack.savings} MAD</span>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderTop: "1px solid #F0E4CC", background: "#FDFAF5" }}
      >
        <div>
          <span className={`font-bold ${compact ? "text-lg" : "text-xl"}`} style={{ color: "#455324" }}>
            {pack.pack_price}
          </span>
          <span className="text-xs ms-0.5" style={{ color: "#BA8944" }}>MAD</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={pack.stock === 0}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
          style={
            pack.stock === 0
              ? { background: "#F0E4CC", color: "#BA8944", cursor: "not-allowed" }
              : { background: "#CC8F57", color: "#fff" }
          }
          onMouseEnter={(e) => { if (pack.stock !== 0) (e.currentTarget as HTMLElement).style.background = "#b87d4a"; }}
          onMouseLeave={(e) => { if (pack.stock !== 0) (e.currentTarget as HTMLElement).style.background = "#CC8F57"; }}
        >
          <ShoppingCart size={13} />
          {pack.stock === 0
            ? isRtl ? "نفذ" : "Sold Out"
            : isRtl ? "أضف" : "Add Pack"}
        </button>
      </div>

      {/* Stock warning */}
      {pack.stock !== undefined && pack.stock > 0 && pack.stock <= 5 && (
        <div className="px-4 pb-2">
          <p className="text-xs font-semibold" style={{ color: "#c0392b" }}>
            {isRtl ? `${pack.stock} قطع فقط!` : `Only ${pack.stock} left!`}
          </p>
        </div>
      )}
    </div>
  );
}