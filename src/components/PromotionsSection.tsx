import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Tag, Sparkles, Clock } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Promotion {
  id: number;
  badge: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  cta_en: string;
  cta_ar: string;
  discount?: string;
  expires_en?: string;
  expires_ar?: string;
  gradient: string;
  accentColor: string;
  image: string; // URL or emoji placeholder
}

// ─── Mock Data — replace images with real URLs ────────────────────────────────
const promotions: Promotion[] = [
  {
    id: 1,
    badge: "🌸 Ramadan Special",
    title_en: "Handwoven Djellabas",
    title_ar: "جلابيات مصنوعة يدوياً",
    subtitle_en: "Exclusive designs by our Guelmim cooperatives — limited stock",
    subtitle_ar: "تصاميم حصرية من تعاونياتنا بكلميم — مخزون محدود",
    cta_en: "Shop the Collection",
    cta_ar: "تسوق المجموعة",
    discount: "20% OFF",
    expires_en: "Ends March 30",
    expires_ar: "ينتهي 30 مارس",
    gradient: "from-[#5c3a1e] via-[#8b5e3c] to-[#c9934a]",
    accentColor: "#f0c060",
    image: "🧕",
  },
  {
    id: 2,
    badge: "✨ New Arrival",
    title_en: "Argan Oil Gift Sets",
    title_ar: "مجموعات هدايا زيت الأرگان",
    subtitle_en: "Pure cold-pressed argan oil — directly from women cooperatives",
    subtitle_ar: "زيت أرگان نقي معصور على البارد — مباشرة من تعاونيات النساء",
    cta_en: "Discover Now",
    cta_ar: "اكتشف الآن",
    discount: "Bundle Deal",
    expires_en: "While stocks last",
    expires_ar: "حتى نفاد الكمية",
    gradient: "from-[#3d5a3e] via-[#5a8a3e] to-[#8ab84a]",
    accentColor: "#d4e86a",
    image: "🌿",
  },
  {
    id: 3,
    badge: "🎨 Artisan Week",
    title_en: "Saharan Pottery",
    title_ar: "فخار صحراوي",
    subtitle_en: "Hand-painted ceramics from the Atlas region — each piece unique",
    subtitle_ar: "سيراميك مرسوم يدوياً من منطقة الأطلس — كل قطعة فريدة",
    cta_en: "Explore Pieces",
    cta_ar: "استكشف القطع",
    discount: "15% OFF",
    expires_en: "This week only",
    expires_ar: "هذا الأسبوع فقط",
    gradient: "from-[#6b3a2a] via-[#a05a3a] to-[#d4844a]",
    accentColor: "#ffd090",
    image: "🏺",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function PromotionsSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [animating, setAnimating] = useState(false);

  // Detect language from <html dir="rtl"> or i18n context
  // For now, check document direction — adjust to your LanguageContext
  const isRTL =
    typeof document !== "undefined" &&
    document.documentElement.dir === "rtl";

  const go = useCallback(
    (next: number, dir: "left" | "right") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(next);
        setAnimating(false);
      }, 350);
    },
    [animating]
  );

  const prev = () =>
    go((current - 1 + promotions.length) % promotions.length, "left");
  const next = () => go((current + 1) % promotions.length, "right");

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => go((current + 1) % promotions.length, "right"), 5000);
    return () => clearInterval(id);
  }, [current, isPaused, go]);

  const promo = promotions[current];

  return (
    <section className="w-full px-4 md:px-8 lg:px-16 py-10">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <Tag size={18} className="text-[#c9934a]" />
        <span
          className="text-sm font-semibold tracking-widest uppercase text-[#c9934a]"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {isRTL ? "العروض الحصرية" : "Exclusive Promotions"}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-[#c9934a33] to-transparent" />
      </div>

      {/* Banner */}
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl cursor-pointer select-none"
        style={{ minHeight: 220 }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Slide */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${promo.gradient} transition-opacity duration-350 ${
            animating ? "opacity-0" : "opacity-100"
          }`}
          style={{ transition: "opacity 0.35s ease" }}
        />

        {/* Geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div
          className={`relative z-10 flex items-center justify-between h-full px-6 md:px-12 py-8 gap-6 transition-all duration-350 ${
            animating
              ? direction === "right"
                ? "-translate-x-8 opacity-0"
                : "translate-x-8 opacity-0"
              : "translate-x-0 opacity-100"
          }`}
          style={{ transition: "all 0.35s ease" }}
        >
          {/* Left: Text */}
          <div className="flex-1 min-w-0">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: promo.accentColor,
                  color: "#2a1a0a",
                }}
              >
                {promo.badge}
              </span>
              {promo.expires_en && (
                <span className="flex items-center gap-1 text-xs text-white/70">
                  <Clock size={11} />
                  {isRTL ? promo.expires_ar : promo.expires_en}
                </span>
              )}
            </div>

            {/* Title */}
            <h2
              className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-2"
              style={{ fontFamily: "'Cinzel', serif", textShadow: "0 2px 12px #0005" }}
            >
              {isRTL ? promo.title_ar : promo.title_en}
            </h2>

            {/* Subtitle */}
            <p className="text-sm md:text-base text-white/80 mb-5 max-w-md leading-relaxed">
              {isRTL ? promo.subtitle_ar : promo.subtitle_en}
            </p>

            {/* CTA Button */}
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              style={{
                backgroundColor: promo.accentColor,
                color: "#2a1a0a",
              }}
            >
              <Sparkles size={16} />
              {isRTL ? promo.cta_ar : promo.cta_en}
            </button>
          </div>

          {/* Right: Discount Badge + Emoji */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            {promo.discount && (
              <div
                className="w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center text-center font-extrabold text-sm md:text-lg leading-tight shadow-2xl border-4 border-white/30"
                style={{
                  backgroundColor: promo.accentColor,
                  color: "#2a1a0a",
                }}
              >
                {promo.discount}
              </div>
            )}
            <span className="text-5xl md:text-7xl drop-shadow-2xl">{promo.image}</span>
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {promotions.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > current ? "right" : "left")}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                backgroundColor: i === current ? promo.accentColor : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
