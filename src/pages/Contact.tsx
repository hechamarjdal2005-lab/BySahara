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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16 md:py-20 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-5">
            <div className="h-px w-8 sm:w-10 rounded" style={{ background: '#F8D197' }} />
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: '#CC8F57' }} />
            <div className="h-px w-8 sm:w-10 rounded" style={{ background: '#F8D197' }} />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">
            {t('nav.contact', tr('اتصل بنا', 'Contact Us'))}
          </h1>
          <div className="w-16 sm:w-20 h-0.5 sm:h-1 mx-auto rounded-full mb-4 sm:mb-6" style={{ background: '#F8D197' }} />
          <p className="text-sm sm:text-base md:text-lg max-w-xl mx-auto" style={{ color: '#F7E5CD' }}>
            {tr(
              'يسعدنا سماعك. سواء كان لديك سؤال عن منتجاتنا أو تعاونياتنا، فريقنا جاهز للمساعدة.',
              "We'd love to hear from you. Whether you have a question about our products or cooperatives, our team is ready to help."
            )}
          </p>
        </div>
      </div>

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-14 grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8">

        {/* LEFT — Contact info ──────────────────────────────── */}
        <div className="md:col-span-2">
          <div className="rounded-3xl overflow-hidden shadow-lg h-full"
            style={{ background: 'linear-gradient(160deg, #455324 0%, #442413 100%)', position: 'relative' }}>

            {/* decorative circles */}
            <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full opacity-10 pointer-events-none"
              style={{ background: '#F8D197' }} />
            <div className="absolute -bottom-10 -start-10 w-32 h-32 rounded-full opacity-10 pointer-events-none"
              style={{ background: '#9FA93D' }} />

            <div className="relative z-10 p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-8">
              {/* logo */}
              <img
                src="https://i.ibb.co/TqY5ZpYR/logo-by-sahara.png"
                alt="By Sahara"
                className="h-7 sm:h-8 md:h-10 object-contain mb-1 sm:mb-2"
                style={{ filter: 'brightness(0) invert(1)' }}
              />

              <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-white">
                {tr('تواصل معنا', 'Get in Touch')}
              </h2>

              {contactItems.map((item) => (
                <div key={item.titleEn} className="flex items-start gap-3">
                  <div className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#F8D197', color: '#455324' }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm mb-0.5 sm:mb-1" style={{ color: '#F8D197' }}>
                      {isRtl ? item.titleAr : item.titleEn}
                    </h3>
                    {item.lines.map((line) => (
                      <p key={line} className="text-xs sm:text-sm" style={{ color: '#F7E5CDbb' }}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* divider */}
              <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              {/* social */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: '#9FA93D' }}>
                  {tr('تابعنا', 'Follow Us')}
                </p>
                <div className="flex gap-1.5">
                  {['f', 'in', 'tw'].map((s) => (
                    <a key={s} href="#"
                      className="w-7 sm:w-8 md:w-9 h-7 sm:h-8 md:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-xs font-bold transition-colors"
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
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm h-full"
            style={{ background: '#fff', border: '1.5px solid #F8D197' }}>

            {/* success state */}
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 sm:py-10">
                <div className="w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-5"
                  style={{ background: '#9FA93D20' }}>
                  <CheckCircle className="w-6 sm:w-8 md:w-10" style={{ color: '#9FA93D' }} />
                </div>
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2" style={{ color: '#455324' }}>
                  {tr('تم الإرسال!', 'Message Sent!')}
                </h3>
                <p className="text-xs sm:text-sm" style={{ color: '#763C19' }}>
                  {tr('سنرد عليك في أقرب وقت ممكن.', "We'll get back to you as soon as possible.")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <div className="w-0.5 sm:w-1 h-5 sm:h-6 rounded-full" style={{ background: '#CC8F57' }} />
                  <h2 className="font-serif text-base sm:text-lg md:text-xl font-bold" style={{ color: '#455324' }}>
                    {tr('أرسل رسالة', 'Send a Message')}
                  </h2>
                </div>

                {/* name + email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
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
                  className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-white transition-opacity hover:opacity-90 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #455324, #617131)',
                    boxShadow: '0 6px 20px #45532435',
                  }}
                >
                  {tr('إرسال الرسالة', 'Send Message')}
                  <Send className={`w-4 sm:w-5 h-4 sm:h-5 ${isRtl ? 'rotate-180' : ''}`} />
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