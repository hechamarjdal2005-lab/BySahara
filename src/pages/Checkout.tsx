import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Truck, CreditCard, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1.5px solid #F8D197',
  background: '#fff',
  color: '#442413',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const InputField: React.FC<{
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  colSpan?: boolean;
}> = ({ label, type = 'text', placeholder, required, colSpan }) => (
  <div className={colSpan ? 'md:col-span-2' : ''}>
    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#763C19' }}>
      {label}
    </label>
    <input
      required={required}
      type={type}
      placeholder={placeholder}
      style={inputStyle}
      onFocus={(e) => (e.target.style.borderColor = '#CC8F57')}
      onBlur={(e)  => (e.target.style.borderColor = '#F8D197')}
    />
  </div>
);

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const { cart, total, clearCart } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess,    setIsSuccess]    = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  // ── Success state ──────────────────────────────────────────
  if (isSuccess) {
    return (
      <div
        className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6"
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{ background: '#F7E5CD20' }}
      >
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center mb-8 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #455324, #617131)' }}
        >
          <CheckCircle className="w-14 h-14 text-white" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#9FA93D' }}>
          {tr('تم الطلب بنجاح', 'Order Confirmed')}
        </p>
        <h2 className="font-serif text-4xl font-bold mb-4" style={{ color: '#455324' }}>
          {tr('شكراً لك!', 'Thank You!')}
        </h2>
        <p className="text-base max-w-md mb-8 leading-relaxed" style={{ color: '#763C19' }}>
          {tr(
            'تم تأكيد طلبك بنجاح. سنرسل لك بريداً إلكترونياً للتأكيد قريباً.',
            'Your order has been placed successfully. We will send you a confirmation email shortly.'
          )}
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white transition-opacity hover:opacity-90 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #455324, #617131)' }}
        >
          {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          {tr('العودة للرئيسية', 'Return Home')}
        </button>
      </div>
    );
  }

  if (cart.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="min-h-screen pb-20" dir={isRtl ? 'rtl' : 'ltr'}
      style={{ background: '#F7E5CD20' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #455324 0%, #617131 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
          <p className="uppercase tracking-widest text-xs font-semibold mb-1" style={{ color: '#9FA93D' }}>
            {tr('إتمام الطلب', 'Complete Your Order')}
          </p>
          <h1 className="font-serif text-4xl font-bold text-white">
            {t('checkout.title', tr('الدفع', 'Checkout'))}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── LEFT: forms ──────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* STEP 1 — Shipping */}
              <div className="rounded-2xl overflow-hidden shadow-sm"
                style={{ background: '#fff', border: '1.5px solid #F8D197' }}>
                <div className="flex items-center gap-3 px-6 py-4"
                  style={{ background: '#F8D197' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white"
                    style={{ background: '#455324' }}>1</div>
                  <Truck className="w-5 h-5" style={{ color: '#455324' }} />
                  <h2 className="font-serif text-lg font-bold" style={{ color: '#455324' }}>
                    {t('checkout.shipping', tr('معلومات الشحن', 'Shipping Info'))}
                  </h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label={tr('الاسم الأول', 'First Name')} required />
                  <InputField label={tr('الاسم الأخير', 'Last Name')} required />
                  <InputField label={tr('رقم الهاتف', 'Phone')} type="tel" required />
                  <InputField label={tr('البريد الإلكتروني', 'Email')} type="email" required />
                  <InputField label={tr('العنوان', 'Address')} required colSpan />
                  <InputField label={tr('المدينة', 'City')} required />
                  <InputField label={tr('الرمز البريدي', 'Postal Code')} required />
                </div>
              </div>

              {/* STEP 2 — Payment */}
              <div className="rounded-2xl overflow-hidden shadow-sm"
                style={{ background: '#fff', border: '1.5px solid #F8D197' }}>
                <div className="flex items-center gap-3 px-6 py-4"
                  style={{ background: '#F8D197' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white"
                    style={{ background: '#455324' }}>2</div>
                  <CreditCard className="w-5 h-5" style={{ color: '#455324' }} />
                  <h2 className="font-serif text-lg font-bold" style={{ color: '#455324' }}>
                    {t('checkout.payment', tr('معلومات الدفع', 'Payment Info'))}
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <InputField
                    label={tr('رقم البطاقة', 'Card Number')}
                    placeholder="0000 0000 0000 0000"
                    required colSpan
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label={tr('تاريخ الانتهاء', 'Expiry Date')} placeholder="MM/YY" required />
                    <InputField label="CVC" placeholder="123" required />
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: order summary ──────────────────────── */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl overflow-hidden shadow-sm sticky top-24"
                style={{ background: '#fff', border: '1.5px solid #F8D197' }}>

                {/* header */}
                <div className="flex items-center gap-2 px-5 py-4"
                  style={{ background: '#F8D197' }}>
                  <ShoppingBag className="w-4 h-4" style={{ color: '#455324' }} />
                  <h3 className="font-serif font-bold text-base" style={{ color: '#455324' }}>
                    {tr('ملخص الطلب', 'Order Summary')}
                  </h3>
                </div>

                {/* items */}
                <div className="divide-y px-5" style={{ borderColor: '#F8D19750' }}>
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image}
                          alt={isRtl ? item.name.ar : item.name.en}
                          className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: '#455324' }}>
                          {isRtl ? item.name.ar : item.name.en}
                        </p>
                        <p className="text-xs" style={{ color: '#BA8944' }}>
                          ×{item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color: '#455324' }}>
                        {(item.price * item.quantity).toFixed(2)} MAD
                      </span>
                    </div>
                  ))}
                </div>

                {/* totals */}
                <div className="px-5 py-4 space-y-2">
                  <div className="flex justify-between text-sm" style={{ color: '#763C19' }}>
                    <span>{tr('المجموع الفرعي', 'Subtotal')}</span>
                    <span>{total.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: '#763C19' }}>
                    <span>{tr('الشحن', 'Shipping')}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#9FA93D20', color: '#617131' }}>
                      {tr('مجاني', 'Free')}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2"
                    style={{ color: '#455324', borderTop: '1.5px solid #F8D197' }}>
                    <span>{tr('الإجمالي', 'Total')}</span>
                    <span>{total.toFixed(2)} MAD</span>
                  </div>
                </div>

                {/* submit */}
                <div className="px-5 pb-5">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 rounded-xl font-bold text-base text-white transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{
                      background: isProcessing
                        ? '#617131'
                        : 'linear-gradient(135deg, #455324, #617131)',
                      boxShadow: '0 6px 20px #45532440',
                    }}
                  >
                    {isProcessing
                      ? `⏳ ${tr('جاري المعالجة...', 'Processing...')}`
                      : t('checkout.placeOrder', tr('تأكيد الطلب', 'Place Order'))}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;