import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Menu, X, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { itemCount } = useCart();
  const { language, changeLanguage, dir } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.shop'), path: '/shop' },
    { name: t('nav.cooperatives'), path: '/cooperatives' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <nav className="bg-sahara-sand sticky top-0 z-50 shadow-sm border-b border-sahara-terracotta/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-serif text-2xl font-bold text-sahara-terracotta">
              BySahara
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center rtl:space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sahara-blue hover:text-sahara-terracotta px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Switcher */}
            <button
              onClick={() => changeLanguage(language === 'en' ? 'ar' : 'en')}
              className="text-sahara-blue hover:text-sahara-terracotta p-2 rounded-full focus:outline-none flex items-center gap-1"
            >
              <Globe className="h-5 w-5" />
              <span className="text-xs font-bold uppercase">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-sahara-blue hover:text-sahara-terracotta">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-sahara-terracotta rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="text-sahara-blue hover:text-sahara-terracotta p-2 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-sahara-sand border-t border-sahara-terracotta/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sahara-blue hover:text-sahara-terracotta block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-sahara-terracotta/20 my-2 pt-2 flex items-center justify-between px-3">
              <button
                onClick={() => {
                   changeLanguage(language === 'en' ? 'ar' : 'en');
                   setIsOpen(false);
                }}
                className="text-sahara-blue hover:text-sahara-terracotta flex items-center gap-2"
              >
                <Globe className="h-5 w-5" />
                <span>{language === 'en' ? 'Switch to Arabic' : 'Switch to English'}</span>
              </button>
               <Link to="/cart" className="relative p-2 text-sahara-blue hover:text-sahara-terracotta" onClick={() => setIsOpen(false)}>
                  <ShoppingCart className="h-6 w-6" />
                  {itemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-sahara-terracotta rounded-full">
                      {itemCount}
                    </span>
                  )}
                </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
