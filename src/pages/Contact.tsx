import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1.5px solid #F8D197',
    background: '#F7E5CD20',
    color: '#442413',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#763C19',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const contactItems = [
    {
      icon: <Mail className="w-5 h-5" />,
      titleAr: 'البريد الإلكتروني',
      titleEn: 'Email',
      lines: ['hello@bysahara.ma', 'support@bysahara.ma'],
    },
    {
      icon: <Phone className="w-5 h-5" />,
      titleAr: 'الهاتف',
      titleEn: 'Phone',
      lines: ['+212 528 870 000', tr('الإثنين-الجمعة، 9ص-6م', 'Mon–Fri, 9am–6pm')],
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      titleAr: 'العنوان',
      titleEn: 'Office',
      lines: [tr('كلميم، المغرب', 'Guelmim, Morocco'), tr('جهة كلميم-واد نون', 'Guelmim-Oued Noun Region')],
    },
  ];

  return (
    <div className="min-h-screen pb-20" dir={isRtl ? 'rtl' : 'ltr'}
      style={{ background: '#F7E5CD20' }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #455324 0%, #617131 100%)' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 rounded" style={{ background: '#F8D197' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: '#CC8F57' }} />
            <div className="h-px w-10 rounded" style={{ background: '#F8D197' }} />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">
            {t('nav.contact', tr('اتصل بنا', 'Contact Us'))}
          </h1>
          <div className="w-20 h-1 mx-auto rounded-full mb-6" style={{ background: '#F8D197' }} />
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#F7E5CD' }}>
            {tr(
              'يسعدنا سماعك. سواء كان لديك سؤال عن منتجاتنا أو تعاونياتنا، فريقنا جاهز للمساعدة.',
              "We'd love to hear from you. Whether you have a question about our products or cooperatives, our team is ready to help."
            )}
          </p>
        </div>
      </div>

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-5 gap-8">

        {/* LEFT — Contact info ──────────────────────────────── */}
        <div className="md:col-span-2">
          <div className="rounded-3xl overflow-hidden shadow-lg h-full"
            style={{ background: 'linear-gradient(160deg, #455324 0%, #442413 100%)', position: 'relative' }}>

            {/* decorative circles */}
            <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full opacity-10 pointer-events-none"
              style={{ background: '#F8D197' }} />
            <div className="absolute -bottom-10 -start-10 w-32 h-32 rounded-full opacity-10 pointer-events-none"
              style={{ background: '#9FA93D' }} />

            <div className="relative z-10 p-8 space-y-8">
              {/* logo */}
              <img
                src="https://i.ibb.co/TqY5ZpYR/logo-by-sahara.png"
                alt="By Sahara"
                className="h-10 object-contain mb-2"
                style={{ filter: 'brightness(0) invert(1)' }}
              />

              <h2 className="font-serif text-2xl font-bold text-white">
                {tr('تواصل معنا', 'Get in Touch')}
              </h2>

              {contactItems.map((item) => (
                <div key={item.titleEn} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#F8D197', color: '#455324' }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: '#F8D197' }}>
                      {isRtl ? item.titleAr : item.titleEn}
                    </h3>
                    {item.lines.map((line) => (
                      <p key={line} className="text-sm" style={{ color: '#F7E5CDbb' }}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* divider */}
              <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              {/* social */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: '#9FA93D' }}>
                  {tr('تابعنا', 'Follow Us')}
                </p>
                <div className="flex gap-2">
                  {['f', 'in', 'tw'].map((s) => (
                    <a key={s} href="#"
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors"
                      style={{ background: 'rgba(255,255,255,0.12)', color: '#F8D197' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#CC8F57')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}>
                      {s.toUpperCase()}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Form ─────────────────────────────────────── */}
        <div className="md:col-span-3">
          <div className="rounded-3xl p-8 shadow-sm h-full"
            style={{ background: '#fff', border: '1.5px solid #F8D197' }}>

            {/* success state */}
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                  style={{ background: '#9FA93D20' }}>
                  <CheckCircle className="w-10 h-10" style={{ color: '#9FA93D' }} />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2" style={{ color: '#455324' }}>
                  {tr('تم الإرسال!', 'Message Sent!')}
                </h3>
                <p className="text-sm" style={{ color: '#763C19' }}>
                  {tr('سنرد عليك في أقرب وقت ممكن.', "We'll get back to you as soon as possible.")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 rounded-full" style={{ background: '#CC8F57' }} />
                  <h2 className="font-serif text-xl font-bold" style={{ color: '#455324' }}>
                    {tr('أرسل رسالة', 'Send a Message')}
                  </h2>
                </div>

                {/* name + email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>{tr('الاسم', 'Name')}</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={tr('اسمك الكامل', 'Your full name')}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = '#CC8F57')}
                      onBlur={(e) => (e.target.style.borderColor = '#F8D197')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>{tr('البريد الإلكتروني', 'Email')}</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@example.com"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = '#CC8F57')}
                      onBlur={(e) => (e.target.style.borderColor = '#F8D197')}
                    />
                  </div>
                </div>

                {/* subject */}
                <div>
                  <label style={labelStyle}>{tr('الموضوع', 'Subject')}</label>
                  <input
                    required
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder={tr('كيف يمكننا مساعدتك؟', 'How can we help?')}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#CC8F57')}
                    onBlur={(e) => (e.target.style.borderColor = '#F8D197')}
                  />
                </div>

                {/* message */}
                <div>
                  <label style={labelStyle}>{tr('الرسالة', 'Message')}</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={tr('اكتب رسالتك هنا...', 'Write your message here...')}
                    style={{ ...inputStyle, resize: 'none' }}
                    onFocus={(e) => (e.target.style.borderColor = '#CC8F57')}
                    onBlur={(e) => (e.target.style.borderColor = '#F8D197')}
                  />
                </div>

                {/* submit */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base text-white transition-opacity hover:opacity-90 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #455324, #617131)',
                    boxShadow: '0 6px 20px #45532435',
                  }}
                >
                  {tr('إرسال الرسالة', 'Send Message')}
                  <Send className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;