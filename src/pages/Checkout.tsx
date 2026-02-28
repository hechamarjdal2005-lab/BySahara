import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Truck, ShoppingBag, ArrowLeft, ArrowRight, MessageCircle, Banknote } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { cooperatives } from '../data';

const WHATSAPP_NUMBER = '212649026589';

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
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, type = 'text', placeholder, required, colSpan, value, onChange }) => (
  <div className={colSpan ? 'md:col-span-2' : ''}>
    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#763C19' }}>
      {label}
    </label>
    <input
      required={required}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={inputStyle}
      onFocus={(e) => (e.target.style.borderColor = '#CC8F57')}
      onBlur={(e) => (e.target.style.borderColor = '#F8D197')}
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

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Group items by cooperative
    const byCooperative: Record<string, typeof cart> = {};
    cart.forEach((item) => {
      const coopId = item.cooperativeId ?? 'unknown';
      if (!byCooperative[coopId]) byCooperative[coopId] = [];
      byCooperative[coopId].push(item);
    });

    // Build grouped item lines
    const itemLines = Object.entries(byCooperative)
      .map(([coopId, items]) => {
        const coop = cooperatives.find((c) => c.id === coopId);
        const coopName = coop
          ? (isRtl ? coop.name.ar : coop.name.en)
          : tr('تعاونية غير محددة', 'Unknown Cooperative');

        const productLines = items
          .map(
            (item) =>
              `   • ${isRtl ? item.name.ar : item.name.en} x${item.quantity} — ${(item.price * item.quantity).toFixed(2)} MAD`
          )
          .join('\n');

        return `🏪 *${coopName}*\n${productLines}`;
      })
      .join('\n\n');

    const message = [
      '🛍️ *طلب جديد / New Order — BY SAHARA*',
      '',
      `👤 ${form.firstName} ${form.lastName}`,
      `📞 ${form.phone}`,
      form.email ? `📧 ${form.email}` : '',
      `📍 ${form.address}, ${form.city}${form.postalCode ? ' ' + form.postalCode : ''}`,
      '',
      '─────────────────',
      itemLines,
      '─────────────────',
      `💰 *Total: ${total.toFixed(2)} MAD*`,
      `🚚 ${tr('توصيل مجاني', 'Livraison gratuite')}`,
      `💵 *${tr('الدفع عند الاستلام', 'Paiement à la livraison')}*`,
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    clearCart();
    window.open(url, '_blank');
    navigate('/');
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div
      className="min-h-screen pb-20"
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{ background: '#F7E5CD20' }}
    >
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

            {/* ── LEFT ──────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* STEP 1 — Shipping */}
              <div
                className="rounded-2xl overflow-hidden shadow-sm"
                style={{ background: '#fff', border: '1.5px solid #F8D197' }}
              >
                <div className="flex items-center gap-3 px-6 py-4" style={{ background: '#F8D197' }}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white"
                    style={{ background: '#455324' }}
                  >
                    1
                  </div>
                  <Truck className="w-5 h-5" style={{ color: '#455324' }} />
                  <h2 className="font-serif text-lg font-bold" style={{ color: '#455324' }}>
                    {t('checkout.shipping', tr('معلومات الشحن', 'Shipping Info'))}
                  </h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label={tr('الاسم الأول', 'First Name')}
                    required
                    value={form.firstName}
                    onChange={handleChange('firstName')}
                  />
                  <InputField
                    label={tr('الاسم الأخير', 'Last Name')}
                    required
                    value={form.lastName}
                    onChange={handleChange('lastName')}
                  />
                  <InputField
                    label={tr('رقم الهاتف', 'Phone')}
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange('phone')}
                  />
                  <InputField
                    label={tr('البريد الإلكتروني', 'Email')}
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                  />
                  <InputField
                    label={tr('العنوان', 'Address')}
                    required
                    colSpan
                    value={form.address}
                    onChange={handleChange('address')}
                  />
                  <InputField
                    label={tr('المدينة', 'City')}
                    required
                    value={form.city}
                    onChange={handleChange('city')}
                  />
                  <InputField
                    label={tr('الرمز البريدي', 'Postal Code')}
                    value={form.postalCode}
                    onChange={handleChange('postalCode')}
                  />
                </div>
              </div>

              {/* STEP 2 — Paiement à la livraison */}
              <div
                className="rounded-2xl overflow-hidden shadow-sm"
                style={{ background: '#fff', border: '1.5px solid #F8D197' }}
              >
                <div className="flex items-center gap-3 px-6 py-4" style={{ background: '#F8D197' }}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white"
                    style={{ background: '#455324' }}
                  >
                    2
                  </div>
                  <Banknote className="w-5 h-5" style={{ color: '#455324' }} />
                  <h2 className="font-serif text-lg font-bold" style={{ color: '#455324' }}>
                    {tr('طريقة الدفع', 'Payment Method')}
                  </h2>
                </div>
                <div className="p-6">
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: '#F7E5CD', border: '2px solid #CC8F57' }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: '#455324' }}
                    >
                      <Banknote className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#455324' }}>
                        {tr('الدفع عند الاستلام', 'Cash on Delivery')}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#763C19' }}>
                        {tr(
                          'ادفع نقداً عند استلام طلبك — لا حاجة لبطاقة بنكية',
                          'Pay cash when you receive your order — no card needed'
                        )}
                      </p>
                    </div>
                    <div
                      className="ms-auto w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: '#455324' }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: order summary ──────────────────────── */}
            <div className="lg:col-span-1">
              <div
                className="rounded-2xl overflow-hidden shadow-sm sticky top-24"
                style={{ background: '#fff', border: '1.5px solid #F8D197' }}
              >
                <div className="flex items-center gap-2 px-5 py-4" style={{ background: '#F8D197' }}>
                  <ShoppingBag className="w-4 h-4" style={{ color: '#455324' }} />
                  <h3 className="font-serif font-bold text-base" style={{ color: '#455324' }}>
                    {tr('ملخص الطلب', 'Order Summary')}
                  </h3>
                </div>

                {/* items grouped by cooperative */}
                <div className="px-5 py-3 space-y-4">
                  {(() => {
                    const byCoopUI: Record<string, typeof cart> = {};
                    cart.forEach((item) => {
                      const id = item.cooperativeId ?? 'unknown';
                      if (!byCoopUI[id]) byCoopUI[id] = [];
                      byCoopUI[id].push(item);
                    });
                    return Object.entries(byCoopUI).map(([coopId, items]) => {
                      const coop = cooperatives.find((c) => c.id === coopId);
                      const coopName = coop
                        ? (isRtl ? coop.name.ar : coop.name.en)
                        : tr('تعاونية', 'Cooperative');
                      return (
                        <div key={coopId}>
                          {/* cooperative label */}
                          <p
                            className="text-xs font-bold uppercase tracking-wide mb-2 pb-1"
                            style={{ color: '#9FA93D', borderBottom: '1px dashed #F8D197' }}
                          >
                            🏪 {coopName}
                          </p>
                          {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 py-2">
                              <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={isRtl ? item.name.ar : item.name.en}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="text-xs font-semibold truncate" style={{ color: '#455324' }}>
                                  {isRtl ? item.name.ar : item.name.en}
                                </p>
                                <p className="text-xs" style={{ color: '#BA8944' }}>×{item.quantity}</p>
                              </div>
                              <span className="text-xs font-bold flex-shrink-0" style={{ color: '#455324' }}>
                                {(item.price * item.quantity).toFixed(2)} MAD
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* totals */}
                <div className="px-5 py-4 space-y-2" style={{ borderTop: '1px solid #F8D197' }}>
                  <div className="flex justify-between text-sm" style={{ color: '#763C19' }}>
                    <span>{tr('المجموع الفرعي', 'Subtotal')}</span>
                    <span>{total.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: '#763C19' }}>
                    <span>{tr('الشحن', 'Shipping')}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#9FA93D20', color: '#617131' }}
                    >
                      {tr('مجاني', 'Free')}
                    </span>
                  </div>
                  <div
                    className="flex justify-between font-bold text-base pt-2"
                    style={{ color: '#455324', borderTop: '1.5px solid #F8D197' }}
                  >
                    <span>{tr('الإجمالي', 'Total')}</span>
                    <span>{total.toFixed(2)} MAD</span>
                  </div>
                </div>

                {/* WhatsApp submit */}
                <div className="px-5 pb-5">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl font-bold text-base text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #25D366, #128C7E)',
                      boxShadow: '0 6px 20px #25D36640',
                    }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    {tr('اطلب عبر واتساب', 'Order via WhatsApp')}
                  </button>
                  <p className="text-center text-xs mt-2" style={{ color: '#BA8944' }}>
                    {tr('سيتم فتح واتساب تلقائياً', 'WhatsApp will open automatically')}
                  </p>
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