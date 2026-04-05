// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Truck, ShoppingBag, ArrowLeft, ArrowRight, MessageCircle, Banknote, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchCooperatives } from '../data';
import { supabase } from '../lib/supabase';

const WHATSAPP_NUMBER = '212649026589';

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: '1.5px solid #F8D197', background: '#fff',
  color: '#442413', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s',
};

const InputField = ({ label, type = 'text', placeholder, required, colSpan, value, onChange }) => (
  <div className={colSpan ? 'md:col-span-2' : ''}>
    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#763C19' }}>{label}</label>
    <input required={required} type={type} placeholder={placeholder} value={value} onChange={onChange}
      style={inputStyle}
      onFocus={(e) => (e.target.style.borderColor = '#CC8F57')}
      onBlur={(e) => (e.target.style.borderColor = '#F8D197')} />
  </div>
);

const Checkout = () => {
  const { t } = useTranslation();
  const { cart, total, clearCart } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === 'ar';
  const tr = (ar, en) => (isRtl ? ar : en);
  const lang = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return isRtl ? field.ar : field.en;
  };

  const [cooperatives, setCooperatives] = useState([]);
  const [loadingCoops, setLoadingCoops] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ firstName: '', phone: '', address: '' });

  useEffect(() => {
    fetchCooperatives()
      .then(setCooperatives)
      .catch(console.error)
      .finally(() => setLoadingCoops(false));
  }, []);

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Build items for storage
    const orderItems = cart.map(item => ({
      product_id: item.id,
      name_en: typeof item.name === 'string' ? item.name : item.name?.en,
      name_ar: typeof item.name === 'string' ? item.name : item.name?.ar,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
      image: item.image,
      cooperative_id: item.cooperativeId,
    }))

    // Save order to Supabase
    try {
      await supabase.from('orders').insert({
        customer_name: form.firstName,
        customer_phone: form.phone,
        customer_address: form.address,
        items: orderItems,
        total: total,
        status: 'pending',
        is_seen: false,
      })
    } catch (err) {
      console.error('Order save error:', err)
    }

    // Build WhatsApp message
    const byCooperative = {};
    cart.forEach(item => {
      const coopId = item.cooperativeId ?? 'unknown';
      if (!byCooperative[coopId]) byCooperative[coopId] = [];
      byCooperative[coopId].push(item);
    });

    const itemLines = Object.entries(byCooperative).map(([coopId, items]) => {
      const coop = cooperatives.find(c => c.id === coopId);
      const coopName = coop ? lang(coop.name) : tr('تعاونية', 'Cooperative');
      const productLines = items.map(item =>
        `   • ${lang(item.name)} x${item.quantity} — ${(item.price * item.quantity).toFixed(2)} MAD`
      ).join('\n');
      return `🏪 *${coopName}*\n${productLines}`;
    }).join('\n\n');

    const message = [
      '🛍️ *طلب جديد / New Order — BY SAHARA*',
      '',
      `👤 ${form.firstName}`,
      `📞 ${form.phone}`,
      `📍 ${form.address}`,
      '',
      '─────────────────',
      itemLines,
      '─────────────────',
      `💰 *Total: ${total.toFixed(2)} MAD*`,
      `🚚 ${tr('توصيل مجاني', 'Livraison gratuite')}`,
      `💵 *${tr('الدفع عند الاستلام', 'Paiement à la livraison')}*`,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    clearCart();
    setSubmitting(false);
    window.open(url, '_blank');
    navigate('/');
  };

  if (cart.length === 0) { navigate('/cart'); return null; }

  if (loadingCoops) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFAF5' }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#455324' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" dir={isRtl ? 'rtl' : 'ltr'} style={{ background: '#F7E5CD20' }}>

      {/* Header */}
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

            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">

              {/* Shipping */}
              <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: '#fff', border: '1.5px solid #F8D197' }}>
                <div className="flex items-center gap-3 px-6 py-4" style={{ background: '#F8D197' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ background: '#455324' }}>1</div>
                  <Truck className="w-5 h-5" style={{ color: '#455324' }} />
                  <h2 className="font-serif text-lg font-bold" style={{ color: '#455324' }}>
                    {t('checkout.shipping', tr('معلومات الشحن', 'Shipping Info'))}
                  </h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label={tr('الاسم', 'First Name')} required value={form.firstName} onChange={handleChange('firstName')} />
                  <InputField label={tr('رقم الهاتف', 'Phone')} type="tel" required value={form.phone} onChange={handleChange('phone')} />
                  <InputField label={tr('العنوان', 'Address')} required colSpan value={form.address} onChange={handleChange('address')} />
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: '#fff', border: '1.5px solid #F8D197' }}>
                <div className="flex items-center gap-3 px-6 py-4" style={{ background: '#F8D197' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ background: '#455324' }}>2</div>
                  <Banknote className="w-5 h-5" style={{ color: '#455324' }} />
                  <h2 className="font-serif text-lg font-bold" style={{ color: '#455324' }}>{tr('طريقة الدفع', 'Payment Method')}</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#F7E5CD', border: '2px solid #CC8F57' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#455324' }}>
                      <Banknote className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#455324' }}>{tr('الدفع عند الاستلام', 'Cash on Delivery')}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#763C19' }}>{tr('ادفع نقداً عند استلام طلبك', 'Pay cash when you receive your order')}</p>
                    </div>
                    <div className="ms-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#455324' }}>
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl overflow-hidden shadow-sm sticky top-24" style={{ background: '#fff', border: '1.5px solid #F8D197' }}>
                <div className="flex items-center gap-2 px-5 py-4" style={{ background: '#F8D197' }}>
                  <ShoppingBag className="w-4 h-4" style={{ color: '#455324' }} />
                  <h3 className="font-serif font-bold text-base" style={{ color: '#455324' }}>{tr('ملخص الطلب', 'Order Summary')}</h3>
                </div>

                <div className="px-5 py-3 space-y-4">
                  {(() => {
                    const byCoopUI = {};
                    cart.forEach(item => {
                      const id = item.cooperativeId ?? 'unknown';
                      if (!byCoopUI[id]) byCoopUI[id] = [];
                      byCoopUI[id].push(item);
                    });
                    return Object.entries(byCoopUI).map(([coopId, items]) => {
                      const coop = cooperatives.find(c => c.id === coopId);
                      const coopName = coop ? lang(coop.name) : tr('تعاونية', 'Cooperative');
                      return (
                        <div key={coopId}>
                          <p className="text-xs font-bold uppercase tracking-wide mb-2 pb-1" style={{ color: '#9FA93D', borderBottom: '1px dashed #F8D197' }}>
                            🏪 {coopName}
                          </p>
                          {items.map(item => (
                            <div key={item.id} className="flex items-center gap-3 py-2">
                              <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={lang(item.name)} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="text-xs font-semibold truncate" style={{ color: '#455324' }}>{lang(item.name)}</p>
                                <p className="text-xs" style={{ color: '#BA8944' }}>×{item.quantity}</p>
                              </div>
                              <span className="text-xs font-bold flex-shrink-0" style={{ color: '#455324' }}>{(item.price * item.quantity).toFixed(2)} MAD</span>
                            </div>
                          ))}
                        </div>
                      );
                    });
                  })()}
                </div>

                <div className="px-5 py-4 space-y-2" style={{ borderTop: '1px solid #F8D197' }}>
                  <div className="flex justify-between text-sm" style={{ color: '#763C19' }}>
                    <span>{tr('المجموع الفرعي', 'Subtotal')}</span>
                    <span>{total.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: '#763C19' }}>
                    <span>{tr('الشحن', 'Shipping')}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#9FA93D20', color: '#617131' }}>
                      {tr('مجاني', 'Free')}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2" style={{ color: '#455324', borderTop: '1.5px solid #F8D197' }}>
                    <span>{tr('الإجمالي', 'Total')}</span>
                    <span>{total.toFixed(2)} MAD</span>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button type="submit" disabled={submitting}
                    className="w-full py-4 rounded-xl font-bold text-base text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                    style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', boxShadow: '0 6px 20px #25D36640' }}>
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
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