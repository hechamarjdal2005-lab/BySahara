import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

// ── Brand Colors ──────────────────────────────────────────────
// #455324 dark green  | #617131 mid green  | #9FA93D light green
// #CC8F57 gold        | #BA8944 dark gold  | #F8D197 cream gold
// #F7E5CD light cream | #763C19 dark brown | #442413 deep brown

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  icon: React.ReactNode;
}

// ── Custom SVG Icons — clean, minimal, single-stroke ─────────
const IconDriedFruits = () => (
  <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <ellipse cx="22" cy="26" rx="8" ry="10" />
    <ellipse cx="34" cy="26" rx="8" ry="10" />
    <path d="M26 18 Q28 14 30 18" />
    <path d="M20 38 Q28 44 36 38" />
    <circle cx="22" cy="24" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="34" cy="24" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="28" cy="30" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);

const IconSpices = () => (
  <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <path d="M18 46 L22 20 Q28 12 34 20 L38 46 Z" />
    <path d="M20 30 L36 30" />
    <path d="M19 38 L37 38" />
    <path d="M28 12 Q30 7 35 9" />
    <circle cx="28" cy="20" r="2" fill="currentColor" stroke="none"/>
  </svg>
);

const IconTea = () => (
  <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <path d="M14 26 Q14 46 28 46 Q42 46 42 26 Z" />
    <path d="M42 32 Q50 32 50 38 Q50 44 42 42" />
    <path d="M14 26 L42 26" />
    <path d="M22 16 Q24 10 28 12 Q32 10 34 16" />
    <path d="M28 12 L28 26" />
  </svg>
);

const IconEssentialOils = () => (
  <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <rect x="20" y="22" width="16" height="24" rx="3" />
    <path d="M23 22 L23 17 L33 17 L33 22" />
    <path d="M26 13 L30 13" />
    <path d="M23 31 Q28 28 33 31" />
    <path d="M23 38 Q28 35 33 38" />
    <circle cx="28" cy="17" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);

const IconHoney = () => (
  <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <path d="M22 18 Q18 26 18 34 Q18 46 28 46 Q38 46 38 34 Q38 26 34 18 Z" />
    <path d="M28 10 L28 18" />
    <path d="M23 12 L33 12" />
    <path d="M24 32 Q28 37 32 32" />
    <circle cx="28" cy="25" r="2" fill="currentColor" stroke="none"/>
  </svg>
);

const IconOils = () => (
  <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <path d="M26 10 Q26 7 28 7 Q30 7 30 10 L32 18 Q37 20 37 28 L37 44 Q37 48 28 48 Q19 48 19 44 L19 28 Q19 20 24 18 Z" />
    <path d="M23 33 Q28 30 33 33" />
    <ellipse cx="28" cy="43" rx="5" ry="1.5" />
    <circle cx="28" cy="24" r="2" fill="currentColor" stroke="none"/>
  </svg>
);

const IconFlour = () => (
  <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <path d="M16 26 Q18 16 28 14 Q38 16 40 26 L38 48 Q38 50 28 50 Q18 50 18 48 Z" />
    <path d="M23 14 L23 9 Q28 7 33 9 L33 14" />
    <path d="M21 32 L35 32" />
    <path d="M21 40 L35 40" />
    <circle cx="28" cy="22" r="2.5" fill="currentColor" stroke="none"/>
  </svg>
);

const IconBeauty = () => (
  <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <circle cx="28" cy="22" r="10" />
    <path d="M21 17 Q25 13 28 15 Q31 13 35 17" />
    <path d="M24 25 Q28 29 32 25" />
    <path d="M19 32 Q13 38 17 46 Q24 51 28 48 Q32 51 39 46 Q43 38 37 32" />
  </svg>
);

const categories: Category[] = [
  { id: "1", nameAr: "فواكه جافة",          nameEn: "Dried Fruits",      slug: "dried-fruits",   icon: <IconDriedFruits /> },
  { id: "2", nameAr: "توابل و بهارات",       nameEn: "Spices & Herbs",    slug: "spices",          icon: <IconSpices /> },
  { id: "3", nameAr: "شاي و أعشاب",          nameEn: "Teas & Herbs",      slug: "tea",             icon: <IconTea /> },
  { id: "4", nameAr: "مستخلصات وزيوت عطرية", nameEn: "Essential Oils",    slug: "distilled-water", icon: <IconEssentialOils /> },
  { id: "5", nameAr: "عسل وأملو ومربى",      nameEn: "Honey, Amlou & Jams", slug: "honey",        icon: <IconHoney /> },
  { id: "6", nameAr: "زيوت غذائية",          nameEn: "Cooking Oils",      slug: "oils",            icon: <IconOils /> },
  { id: "7", nameAr: "دقيق و سميد",          nameEn: "Flour & Semolina",  slug: "flour",           icon: <IconFlour /> },
  { id: "8", nameAr: "صحة و جمال",           nameEn: "Health & Beauty",   slug: "beauty",          icon: <IconBeauty /> },
];

// ── Single Category Card ──────────────────────────────────────
const CategoryCard: React.FC<{ category: Category; language: string }> = ({ category, language }) => {
  const name = language === "ar" ? category.nameAr : category.nameEn;

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-300 group cursor-pointer"
      style={{
        background: '#fff',
        border: '1.5px solid #F8D197',
        minHeight: '120px',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = '#F8D197';
        (e.currentTarget as HTMLElement).style.borderColor = '#CC8F57';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px #CC8F5730';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = '#fff';
        (e.currentTarget as HTMLElement).style.borderColor = '#F8D197';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* icon circle */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300"
        style={{ background: '#F7E5CD', color: '#455324' }}
      >
        {category.icon}
      </div>

      {/* name */}
      <span
        className="text-xs text-center font-semibold leading-snug"
        style={{ color: '#455324' }}
      >
        {name}
      </span>
    </Link>
  );
};

// ── Section ───────────────────────────────────────────────────
const CategoriesSection: React.FC = () => {
  const { language } = useLanguage();
  const isRtl = language === "ar";

  const title       = isRtl ? "تصفح حسب الفئة" : "Browse by Category";
  const description = isRtl
    ? "اكتشف منتجاتنا المحلية الأصيلة المعتمدة من تعاونيات كلميم-واد نون"
    : "Discover authentic certified local products from Guelmim-Oued Noun cooperatives";
  const viewAll     = isRtl ? "عرض الكل" : "View all";

  return (
    <section
      className="py-20"
      dir={isRtl ? "rtl" : "ltr"}
      style={{ background: '#fff' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* ── Left 4 cards ──────────────────────────────── */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            {categories.slice(0, 4).map((cat) => (
              <CategoryCard key={cat.id} category={cat} language={language} />
            ))}
          </div>

          {/* ── Center text ───────────────────────────────── */}
          <div className="lg:col-span-4 text-center px-2 order-first lg:order-none">
            {/* decorative top line */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-10 rounded" style={{ background: '#F8D197' }} />
              <div className="w-2 h-2 rounded-full" style={{ background: '#CC8F57' }} />
              <div className="h-px w-10 rounded" style={{ background: '#F8D197' }} />
            </div>

            {/* logo image */}
            <div className="flex justify-center mb-5">
              <img
                src="https://i.ibb.co/TqY5ZpYR/logo-by-sahara.png"
                alt="By Sahara"
                className="h-16 object-contain"
              />
            </div>

            <h2
              className="text-2xl lg:text-3xl font-bold leading-tight mb-3"
              style={{ color: '#455324' }}
            >
              {title}
            </h2>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: '#763C19' }}
            >
              {description}
            </p>

            {/* View all CTA */}
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #455324, #617131)' }}
            >
              {viewAll}
              <span style={{ color: '#F8D197' }}>{isRtl ? '←' : '→'}</span>
            </Link>

            {/* bottom decoration */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-10 rounded" style={{ background: '#F8D197' }} />
              <div className="w-2 h-2 rounded-full" style={{ background: '#CC8F57' }} />
              <div className="h-px w-10 rounded" style={{ background: '#F8D197' }} />
            </div>
          </div>

          {/* ── Right 4 cards ─────────────────────────────── */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            {categories.slice(4, 8).map((cat) => (
              <CategoryCard key={cat.id} category={cat} language={language} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;