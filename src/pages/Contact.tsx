import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent! We will get back to you soon.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-sahara-blue mb-6">
          {t('nav.contact')}
        </h1>
        <p className="text-xl text-sahara-blue/70 max-w-2xl mx-auto">
          We'd love to hear from you. Whether you have a question about our products, cooperatives, or shipping, our team is ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="bg-sahara-blue text-sahara-sand p-10 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-sahara-terracotta rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-sahara-gold rounded-full opacity-20 blur-3xl"></div>
          
          <div className="relative z-10 space-y-8">
            <h2 className="font-serif text-3xl font-bold mb-8">Get in Touch</h2>
            
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-3 rounded-full">
                <Mail className="w-6 h-6 text-sahara-gold" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email</h3>
                <p className="opacity-80">hello@bysahara.com</p>
                <p className="opacity-80">support@bysahara.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-3 rounded-full">
                <Phone className="w-6 h-6 text-sahara-gold" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Phone</h3>
                <p className="opacity-80">+212 524 000 000</p>
                <p className="opacity-80">Mon-Fri from 9am to 6pm</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-sahara-gold" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Office</h3>
                <p className="opacity-80">123 Palm Avenue, Marrakech</p>
                <p className="opacity-80">Morocco, 40000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-sahara-terracotta/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-sahara-blue/70 mb-2">Name</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sahara-terracotta focus:ring-1 focus:ring-sahara-terracotta outline-none transition-colors bg-gray-50 focus:bg-white" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-sahara-blue/70 mb-2">Email</label>
                <input required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sahara-terracotta focus:ring-1 focus:ring-sahara-terracotta outline-none transition-colors bg-gray-50 focus:bg-white" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-sahara-blue/70 mb-2">Subject</label>
              <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sahara-terracotta focus:ring-1 focus:ring-sahara-terracotta outline-none transition-colors bg-gray-50 focus:bg-white" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-sahara-blue/70 mb-2">Message</label>
              <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sahara-terracotta focus:ring-1 focus:ring-sahara-terracotta outline-none transition-colors bg-gray-50 focus:bg-white" placeholder="Your message..."></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-sahara-terracotta text-white py-4 rounded-xl font-bold text-lg hover:bg-sahara-blue transition-colors shadow-lg shadow-sahara-terracotta/20 flex items-center justify-center gap-2"
            >
              <span>Send Message</span>
              <Send className="w-5 h-5 rtl:rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
