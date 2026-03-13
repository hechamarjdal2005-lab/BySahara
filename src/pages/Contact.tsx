import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { fetchContactPage, fetchFooterContact } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { logo, email, phone, location } = useSiteConfig();
  const isRtl = language === 'ar';
  const tr = (ar: string, en: string) => (isRtl ? ar : en);

  const [pageContent, setPageContent] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [pageData, contactData] = await Promise.all([
          fetchContactPage(),
          fetchFooterContact(),
        ]);
        setPageContent(pageData);
        setContactInfo(contactData);
      } catch (err) {
        console.error('Error loading contact page:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getPageSection = (key: string) => pageContent.find(c => c.section_key === key);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await supabase.from('contact_messages').insert({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        is_read: false,
      });
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const getIcon = (key: string | null) => {
    switch (key) {
      case 'mail': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'map-pin': return <MapPin className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1.5px solid #F8D197', background: '#FDFAF5',
    color: '#442413', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '5px',
    color: '#763C19', textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFAF5' }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#455324' }} />
      </div>
    );
  }

  const heroBadge = getPageSection('hero_badge');
  const heroTitle = getPageSection('hero_title');
  const heroSubtitle = getPageSection('hero_subtitle');
  const leftPanelTitle = getPageSection('left_panel_title');
  const formTitle = getPageSection('form_title');
  const formLabelName = getPageSection('form_label_name');
  const formLabelEmail = getPageSection('form_label_email');
  const formLabelSubject = getPageSection('form_label_subject');
  const formLabelMessage = getPageSection('form_label_message');
  const formPlaceholderName = getPageSection('form_placeholder_name');
  const formPlaceholderEmail = getPageSection('form_placeholder_email');
  const formPlaceholderSubject = getPageSection('form_placeholder_subject');
  const formPlaceholderMessage = getPageSection('form_placeholder_message');
  const formButton = getPageSection('form_button');
  const followUsTitle = getPageSection('follow_us_title');

  const contactItems = contactInfo.map((item) => ({
    icon: getIcon(item.icon_key),
    label: isRtl ? item.label_ar : item.label_en,
    value: isRtl ? item.value_ar : item.value_en,
  }));

  return (
    <div className="min-h-screen pb-16" dir={isRtl ? 'rtl' : 'ltr'} style={{ background: '#FDFAF5' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #455324 0%, #617131 100%)' }}>
        <div className="max-w-4xl mx-auto px-5 py-8">
          {heroBadge && <p className="uppercase tracking-widest text-xs font-semibold mb-1" style={{ color: '#9FA93D' }}>{isRtl ? heroBadge.title_ar : heroBadge.title_en}</p>}
          {heroTitle && <h1 className="font-serif text-3xl font-bold text-white mb-2">{isRtl ? heroTitle.title_ar : heroTitle.title_en}</h1>}
          {heroSubtitle && <p className="text-sm max-w-md" style={{ color: '#F7E5CD' }}>{isRtl ? heroSubtitle.subtitle_ar : heroSubtitle.subtitle_en}</p>}
          <div className="flex flex-wrap gap-2 mt-4">
            {contactItems.map((item, i) => (
              <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.15)', color: '#F7E5CD' }}>
                <span style={{ color: '#F8D197' }}>{item.icon}</span>{item.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Left Panel */}
          <div className="md:col-span-2">
            <div className="rounded-2xl overflow-hidden relative h-full" style={{ background: 'linear-gradient(160deg, #455324 0%, #442413 100%)', minHeight: '260px' }}>
              <div className="absolute -top-8 -end-8 w-28 h-28 rounded-full opacity-10 pointer-events-none" style={{ background: '#F8D197' }} />
              <div className="absolute -bottom-6 -start-6 w-20 h-20 rounded-full opacity-10 pointer-events-none" style={{ background: '#9FA93D' }} />
              <div className="relative z-10 p-5 flex flex-col h-full gap-4">
                <img src={logo} alt="By Sahara" className="h-8 object-contain self-start" style={{ filter: 'brightness(0) invert(1)' }} />
                {leftPanelTitle && <h2 className="font-serif text-lg font-bold text-white">{isRtl ? leftPanelTitle.title_ar : leftPanelTitle.title_en}</h2>}
                <div className="space-y-3 flex-1">
                  {contactItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#F8D197', color: '#455324' }}>{item.icon}</div>
                      <div>
                        <h3 className="font-bold text-xs mb-0.5" style={{ color: '#F8D197' }}>{item.label}</h3>
                        <p className="text-xs" style={{ color: '#F7E5CDbb' }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {followUsTitle && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#9FA93D' }}>{isRtl ? followUsTitle.title_ar : followUsTitle.title_en}</p>
                    <div className="flex gap-2">
                      {['f', 'in', 'tw'].map((s) => (
                        <a key={s} href="#" className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(255,255,255,0.12)', color: '#F8D197' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#CC8F57')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}>
                          {s.toUpperCase()}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="md:col-span-3">
            <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1.5px solid #F0E4CC' }}>
              {sent ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: '#9FA93D20' }}>
                    <CheckCircle className="w-8 h-8" style={{ color: '#9FA93D' }} />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-1" style={{ color: '#455324' }}>{tr('تم الإرسال!', 'Message Sent!')}</h3>
                  <p className="text-sm" style={{ color: '#763C19' }}>{tr('سنرد عليك قريباً.', "We'll get back to you soon.")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 rounded-full" style={{ background: '#CC8F57' }} />
                    {formTitle && <h2 className="font-serif text-base font-bold" style={{ color: '#455324' }}>{isRtl ? formTitle.title_ar : formTitle.title_en}</h2>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label style={labelStyle}>{formLabelName ? (isRtl ? formLabelName.label_ar : formLabelName.label_en) : tr('الاسم', 'Name')}</label>
                      <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={formPlaceholderName ? (isRtl ? formPlaceholderName.placeholder_ar : formPlaceholderName.placeholder_en) : tr('اسمك', 'Your name')} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = '#CC8F57')} onBlur={(e) => (e.target.style.borderColor = '#F8D197')} />
                    </div>
                    <div>
                      <label style={labelStyle}>{formLabelEmail ? (isRtl ? formLabelEmail.label_ar : formLabelEmail.label_en) : tr('البريد', 'Email')}</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={formPlaceholderEmail ? (isRtl ? formPlaceholderEmail.placeholder_ar : formPlaceholderEmail.placeholder_en) : 'email@example.com'} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = '#CC8F57')} onBlur={(e) => (e.target.style.borderColor = '#F8D197')} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>{formLabelSubject ? (isRtl ? formLabelSubject.label_ar : formLabelSubject.label_en) : tr('الموضوع', 'Subject')}</label>
                    <input required type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder={formPlaceholderSubject ? (isRtl ? formPlaceholderSubject.placeholder_ar : formPlaceholderSubject.placeholder_en) : tr('كيف نساعدك؟', 'How can we help?')} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = '#CC8F57')} onBlur={(e) => (e.target.style.borderColor = '#F8D197')} />
                  </div>
                  <div>
                    <label style={labelStyle}>{formLabelMessage ? (isRtl ? formLabelMessage.label_ar : formLabelMessage.label_en) : tr('الرسالة', 'Message')}</label>
                    <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={formPlaceholderMessage ? (isRtl ? formPlaceholderMessage.placeholder_ar : formPlaceholderMessage.placeholder_en) : tr('اكتب رسالتك...', 'Write your message...')} style={{ ...inputStyle, resize: 'none' }} onFocus={(e) => (e.target.style.borderColor = '#CC8F57')} onBlur={(e) => (e.target.style.borderColor = '#F8D197')} />
                  </div>
                  <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #455324, #617131)', boxShadow: '0 4px 14px #45532430' }}>
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{formButton ? (isRtl ? formButton.placeholder_ar : formButton.placeholder_en) : tr('إرسال', 'Send Message')}<Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;