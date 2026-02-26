import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2, ArrowRight, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  // ── Empty State ────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
        style={{ background: '#F7E5CD20' }}
      >
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center mb-8 shadow-lg"
          style={{ background: '#F8D197' }}
        >
          <ShoppingBag className="w-12 h-12" style={{ color: '#455324' }} />
        </div>
        <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: '#455324' }}>
          {t('cart.empty', 'Your cart is empty')}
        </h2>
        <p className="mb-8 text-sm" style={{ color: '#763C19' }}>
          {t('cart.emptyDesc', 'Discover authentic products from our cooperatives')}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #455324, #617131)' }}
        >
          {t('hero.cta', 'Shop Now')}
          <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    );
  }

  // ── Filled Cart ────────────────────────────────────────────────
  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen"
      style={{ background: '#F7E5CD20' }}
    >
      {/* header band */}
      <div style={{ background: 'linear-gradient(135deg, #455324 0%, #617131 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <p className="uppercase tracking-widest text-xs font-semibold mb-1" style={{ color: '#9FA93D' }}>
            {t('cart.eyebrow', 'Review your order')}
          </p>
          <h1 className="font-serif text-4xl font-bold text-white">
            {t('cart.title', 'Shopping Cart')}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Cart Items ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 rounded-2xl shadow-sm transition-shadow hover:shadow-md"
              style={{ background: '#fff', border: '1px solid #F8D197' }}
            >
              <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                <img
                  src={item.image}
                  alt={isRtl ? item.name.ar : item.name.en}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base leading-tight mb-1" style={{ color: '#455324' }}>
                      {isRtl ? item.name.ar : item.name.en}
                    </h3>
                    <span
                      className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: '#F8D197', color: '#763C19' }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                    style={{ color: '#BA8944' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#BA8944')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div
                    className="flex items-center rounded-xl overflow-hidden"
                    style={{ border: '1.5px solid #F8D197' }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center transition-colors disabled:opacity-30"
                      style={{ color: '#455324' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#F8D197')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span
                      className="w-8 h-8 flex items-center justify-center text-sm font-bold"
                      style={{ color: '#455324', borderLeft: '1px solid #F8D197', borderRight: '1px solid #F8D197' }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center transition-colors"
                      style={{ color: '#455324' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#F8D197')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-bold text-lg" style={{ color: '#455324' }}>
                    {(item.price * item.quantity).toFixed(2)}
                    <span className="text-xs font-normal ms-1" style={{ color: '#CC8F57' }}>MAD</span>
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* clear cart */}
          <div className="text-end pt-1">
            <button
              onClick={clearCart}
              className="text-xs underline decoration-dotted transition-colors"
              style={{ color: '#BA8944' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#BA8944')}
            >
              {t('cart.clear', 'Clear cart')}
            </button>
          </div>
        </div>

        {/* ── Order Summary ───────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div
            className="rounded-2xl p-6 sticky top-24 shadow-sm"
            style={{ background: '#fff', border: '1px solid #F8D197' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 rounded-full" style={{ background: '#CC8F57' }} />
              <h3 className="font-serif text-xl font-bold" style={{ color: '#455324' }}>
                {t('cart.summary', 'Order Summary')}
              </h3>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm" style={{ color: '#763C19' }}>
                <span>{t('cart.subtotal', 'Subtotal')}</span>
                <span>{total.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: '#763C19' }}>
                <span>{t('cart.shipping', 'Shipping')}</span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: '#9FA93D20', color: '#617131' }}
                >
                  {t('cart.free', 'Free')}
                </span>
              </div>
              <div className="border-t pt-3" style={{ borderColor: '#F8D197' }}>
                <div className="flex justify-between font-bold text-lg" style={{ color: '#455324' }}>
                  <span>{t('cart.total', 'Total')}</span>
                  <span>{total.toFixed(2)} MAD</span>
                </div>
              </div>
            </div>

            <div
              className="text-center text-xs py-2 rounded-lg mb-5 font-medium"
              style={{ background: '#F7E5CD', color: '#763C19' }}
            >
              {cart.length} {t('cart.items', 'items in your order')}
            </div>

            {/* ✅ Cash on delivery badge — NOUVEAU */}
            <div
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl mb-4"
              style={{ background: '#9FA93D15', border: '1px dashed #617131' }}
            >
              <span className="text-base">💵</span>
              <span className="text-xs font-semibold" style={{ color: '#455324' }}>
                {tr('الدفع عند الاستلام', 'Cash on Delivery')}
              </span>
            </div>

            {/* checkout button */}
            <Link
              to="/checkout"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-base transition-opacity hover:opacity-90 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #455324 0%, #617131 100%)',
                boxShadow: '0 8px 24px #45532440',
              }}
            >
              <span>{t('cart.checkout', 'Proceed to Checkout')}</span>
              <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>

            <Link
              to="/shop"
              className="w-full flex items-center justify-center gap-1 mt-3 py-2 text-sm font-medium transition-colors rounded-xl hover:bg-amber-50"
              style={{ color: '#CC8F57' }}
            >
              {t('cart.continueShopping', 'Continue Shopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;