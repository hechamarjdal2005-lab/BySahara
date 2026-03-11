// src/components/PacksSection.tsx
import { useState } from "react";
import { Pack } from "../types";
import PackCard from "./PackCard";
import { Package2, ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PacksSectionProps {
  packs: Pack[];
  variant?: "home" | "shop" | "cooperative";
  title?: string;
  isRtl?: boolean;
}

export default function PacksSection({
  packs,
  variant = "home",
  title,
  isRtl = false,
}: PacksSectionProps) {
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  const cooperatives = Array.from(
    new Set(packs.map((p) => p.cooperative_name).filter(Boolean))
  ) as string[];

  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered =
    variant === "shop" && activeFilter !== "All"
      ? packs.filter((p) => p.cooperative_name === activeFilter)
      : packs;

  const displayed = variant === "home" ? filtered.slice(0, 4) : filtered;

  if (!packs.length) return null;

  return (
    <section
      id="packs"
      dir={isRtl ? "rtl" : "ltr"}
      style={{
        background: variant === "home" ? "#FDF6EC" : "transparent",
        borderTop: variant === "home" ? "1px solid #F0E4CC" : "none",
        borderBottom: variant === "home" ? "1px solid #F0E4CC" : "none",
      }}
      className={
        variant === "home" ? "py-10" : variant === "shop" ? "py-6" : "py-4"
      }
    >
      <div
        className={`mx-auto px-4 sm:px-8 ${
          variant === "cooperative" ? "max-w-5xl" : "max-w-7xl"
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-6">
          <div>
            {variant === "home" && (
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-0.5"
                style={{ color: "#9FA93D" }}
              >
                {tr("عروض حصرية", "Exclusive Deals")}
              </p>
            )}
            <h2
              className="font-serif text-2xl md:text-3xl font-bold flex items-center gap-2"
              style={{ color: "#455324" }}
            >
              <Package2 size={24} style={{ color: "#CC8F57" }} />
              {title ?? tr("باقات برومو", "Promo Packs")}
            </h2>
            <p className="text-xs mt-1" style={{ color: "#BA8944" }}>
              {variant === "cooperative"
                ? tr(
                    "باقات مميزة من هذه التعاونية",
                    "Curated bundles from this cooperative"
                  )
                : tr(
                    "مجموعات بمنتجات مجانية — كميات محدودة",
                    "Bundles with FREE products — limited stock"
                  )}
            </p>
          </div>

          {variant === "home" && (
            <Link
              to="/shop#packs"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold transition-colors"
              style={{ color: "#CC8F57" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#455324")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#CC8F57")
              }
            >
              {tr("عرض الكل", "View All")}
              {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </Link>
          )}
        </div>

        {/* ── Filter tabs (shop only) ── */}
        {variant === "shop" && cooperatives.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {[tr("الكل", "All"), ...cooperatives].map((coop, i) => {
              const key = i === 0 ? "All" : coop;
              const active = activeFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: active ? "#455324" : "#fff",
                    color: active ? "#fff" : "#455324",
                    border: active ? "1.5px solid #455324" : "1.5px solid #EDD9AA",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#CC8F57";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#EDD9AA";
                  }}
                >
                  {coop}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Cards — mobile: horizontal scroll / desktop: grid ── */}
        <div className="sm:hidden">
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayed.map((pack) => (
              <div key={pack.id} className="flex-shrink-0" style={{ width: '200px' }}>
                <PackCard pack={pack} compact isRtl={isRtl} />
              </div>
            ))}
          </div>
        </div>

        <div
          className={`hidden sm:grid gap-4 ${
            variant === "cooperative"
              ? "grid-cols-2"
              : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {displayed.map((pack) => (
            <PackCard
              key={pack.id}
              pack={pack}
              compact={variant === "cooperative"}
              isRtl={isRtl}
            />
          ))}
        </div>

        {/* ── Mobile View All (home) ── */}
        {variant === "home" && packs.length > 4 && (
          <div className="mt-6 text-center sm:hidden">
            <Link
              to="/shop#packs"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold"
              style={{ background: "#CC8F57", color: "#fff" }}
            >
              {tr("عرض الكل", "View All Packs")}
              {isRtl ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}