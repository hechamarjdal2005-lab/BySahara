import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

interface Category {
  id: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  slug: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  {
    id: "1",
    nameAr: "فواكه جافة",
    nameFr: "Fruits secs",
    nameEn: "Dried Fruits",
    slug: "dried-fruits",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
        <circle cx="32" cy="28" r="14" />
        <path d="M20 44 Q32 56 44 44" />
        <circle cx="26" cy="24" r="3" />
        <circle cx="38" cy="24" r="3" />
        <circle cx="32" cy="34" r="3" />
      </svg>
    ),
  },
  {
    id: "2",
    nameAr: "توابل و بهارات",
    nameFr: "Épices & Aromates",
    nameEn: "Spices & Herbs",
    slug: "spices",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
        <path d="M20 48 L24 20 Q32 12 40 20 L44 48 Z" />
        <path d="M22 32 L42 32" />
        <path d="M21 40 L43 40" />
        <path d="M32 12 Q36 6 40 8" />
      </svg>
    ),
  },
  {
    id: "3",
    nameAr: "شاي و أعشاب",
    nameFr: "Thés & Herbes",
    nameEn: "Teas & Herbs",
    slug: "teas",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
        <path d="M16 28 Q16 48 32 48 Q48 48 48 28 Z" />
        <path d="M48 34 Q56 34 56 40 Q56 46 48 44" />
        <path d="M20 28 L44 28" />
        <path d="M24 16 Q26 10 32 12 Q38 10 40 16" />
        <path d="M32 12 L32 28" />
      </svg>
    ),
  },
  {
    id: "4",
    nameAr: "مستخلصات و زيوت أساسية",
    nameFr: "Huiles Essentielles",
    nameEn: "Essential Oils",
    slug: "essential-oils",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
        <rect x="22" y="24" width="20" height="28" rx="4" />
        <path d="M26 24 L26 18 L38 18 L38 24" />
        <path d="M29 14 L35 14" />
        <path d="M26 34 Q32 30 38 34" />
        <path d="M26 42 Q32 38 38 42" />
      </svg>
    ),
  },
  {
    id: "5",
    nameAr: "عسل وأملو ومربى",
    nameFr: "Miel, Amlou & Confitures",
    nameEn: "Honey, Amlou & Jams",
    slug: "honey",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
        <path d="M24 20 Q20 28 20 36 Q20 48 32 48 Q44 48 44 36 Q44 28 40 20 Z" />
        <path d="M32 12 L32 20" />
        <path d="M26 14 L38 14" />
        <path d="M26 34 Q32 40 38 34" />
      </svg>
    ),
  },
  {
    id: "6",
    nameAr: "زيوت غذائية",
    nameFr: "Huiles Alimentaires",
    nameEn: "Cooking Oils",
    slug: "cooking-oils",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
        <path d="M28 12 Q28 8 32 8 Q36 8 36 12 L38 20 Q44 22 44 30 L44 48 Q44 52 32 52 Q20 52 20 48 L20 30 Q20 22 26 20 Z" />
        <path d="M26 36 Q32 32 38 36" />
        <ellipse cx="32" cy="46" rx="6" ry="2" />
      </svg>
    ),
  },
  {
    id: "7",
    nameAr: "دقيق و سميد",
    nameFr: "Farine & Semoule",
    nameEn: "Flour & Semolina",
    slug: "flour",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
        <path d="M18 28 Q20 18 32 16 Q44 18 46 28 L44 52 Q44 54 32 54 Q20 54 20 52 Z" />
        <path d="M26 16 L26 10 Q32 8 38 10 L38 16" />
        <path d="M24 34 L40 34" />
        <path d="M24 42 L40 42" />
        <circle cx="32" cy="24" r="3" />
      </svg>
    ),
  },
  {
    id: "8",
    nameAr: "صحة و جمال",
    nameFr: "Santé & Beauté",
    nameEn: "Health & Beauty",
    slug: "health-beauty",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
        <circle cx="32" cy="24" r="12" />
        <path d="M24 18 Q28 14 32 16 Q36 14 40 18" />
        <path d="M28 28 Q32 32 36 28" />
        <path d="M22 36 Q16 42 20 50 Q28 56 32 52 Q36 56 44 50 Q48 42 42 36" />
      </svg>
    ),
  },
];

const CategoryCard: React.FC<{ category: Category; language: string }> = ({ category, language }) => {
  const name =
    language === "ar"
      ? category.nameAr
      : language === "fr"
      ? category.nameFr
      : category.nameEn;

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-xl hover:border-amber-300 hover:shadow-md transition-all duration-200 group cursor-pointer bg-white min-h-[130px]"
    >
      <div className="text-gray-700 group-hover:text-amber-600 transition-colors duration-200 mb-3">
        {category.icon}
      </div>
      <span className="text-sm text-center text-gray-700 font-medium leading-snug">
        {name}
      </span>
    </Link>
  );
};

const CategoriesSection: React.FC = () => {
  const { language } = useLanguage();

  const title =
    language === "ar"
      ? "ابحث عن منتوجك حسب الفئات"
      : language === "fr"
      ? "Cherchez par Catégorie"
      : "Browse by Category";

  const description =
    language === "ar"
      ? "إبحث عن المنتوجات المحلية المعتمدة والمُصنَّفة ذات الجودة الاستثنائية"
      : language === "fr"
      ? "Découvrez nos produits locaux certifiés et classifiés d'une qualité exceptionnelle"
      : "Explore our certified local products of exceptional quality";

  const viewAll =
    language === "ar" ? "← عرض الكل" : language === "fr" ? "Voir tout →" : "View all →";

  return (
    <section className="py-16 bg-white" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

          {/* Side 1 */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4">
            {categories.slice(0, 4).map((cat) => (
              <CategoryCard key={cat.id} category={cat} language={language} />
            ))}
          </div>

          {/* Center */}
          <div className="lg:col-span-6 text-center px-4 lg:px-8 order-first lg:order-none">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {title}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {description}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700 transition-colors border-b border-amber-600 pb-0.5"
            >
              {viewAll}
            </Link>
          </div>

          {/* Side 2 */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4">
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