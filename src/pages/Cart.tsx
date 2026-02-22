import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { language } = useLanguage();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-sahara-sand w-24 h-24 rounded-full flex items-center justify-center mb-6 text-sahara-terracotta">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-sahara-blue mb-4">{t('cart.empty')}</h2>
        <Link
          to="/shop"
          className="inline-flex items-center bg-sahara-terracotta text-white px-8 py-3 rounded-full font-bold hover:bg-sahara-blue transition-colors"
        >
          {t('hero.cta')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl font-bold text-sahara-blue mb-8">{t('cart.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-sahara-terracotta/10"
            >
              <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={language === 'ar' ? item.name.ar : item.name.en}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sahara-blue text-lg">
                      {language === 'ar' ? item.name.ar : item.name.en}
                    </h3>
                    <p className="text-sm text-sahara-blue/60">{item.category}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex items-center border border-sahara-terracotta/20 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-sahara-blue hover:bg-sahara-sand transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-medium text-sahara-blue border-x border-sahara-terracotta/20">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-sahara-blue hover:bg-sahara-sand transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-lg text-sahara-blue">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 underline decoration-dotted"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-sahara-terracotta/10 sticky top-24">
            <h3 className="font-serif text-xl font-bold text-sahara-blue mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sahara-blue/70">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sahara-blue/70">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-sahara-terracotta/10 pt-4 flex justify-between font-bold text-xl text-sahara-blue">
                <span>{t('cart.total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-sahara-terracotta text-white py-4 rounded-xl font-bold text-lg hover:bg-sahara-blue transition-colors shadow-lg shadow-sahara-terracotta/20 flex items-center justify-center gap-2"
            >
              <span>{t('cart.checkout')}</span>
              <ArrowRight className="w-5 h-5 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
