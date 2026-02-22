import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in-up">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-green-600">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-sahara-blue mb-4">Thank You!</h2>
        <p className="text-xl text-sahara-blue/70 mb-8 max-w-md">
          Your order has been placed successfully. We will send you a confirmation email shortly.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-sahara-terracotta text-white px-8 py-3 rounded-full font-bold hover:bg-sahara-blue transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl font-bold text-sahara-blue mb-8">{t('checkout.title')}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Shipping Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sahara-terracotta/10">
          <h2 className="font-serif text-xl font-bold text-sahara-blue mb-6 flex items-center gap-2">
            <span className="bg-sahara-terracotta text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            {t('checkout.shipping')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-sahara-blue/70 mb-1">First Name</label>
              <input required type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-sahara-terracotta focus:ring-1 focus:ring-sahara-terracotta outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-sahara-blue/70 mb-1">Last Name</label>
              <input required type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-sahara-terracotta focus:ring-1 focus:ring-sahara-terracotta outline-none transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-sahara-blue/70 mb-1">Address</label>
              <input required type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-sahara-terracotta focus:ring-1 focus:ring-sahara-terracotta outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-sahara-blue/70 mb-1">City</label>
              <input required type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-sahara-terracotta focus:ring-1 focus:ring-sahara-terracotta outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-sahara-blue/70 mb-1">Postal Code</label>
              <input required type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-sahara-terracotta focus:ring-1 focus:ring-sahara-terracotta outline-none transition-colors" />
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sahara-terracotta/10">
          <h2 className="font-serif text-xl font-bold text-sahara-blue mb-6 flex items-center gap-2">
            <span className="bg-sahara-terracotta text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            {t('checkout.payment')}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sahara-blue/70 mb-1">Card Number</label>
              <input required type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-sahara-terracotta focus:ring-1 focus:ring-sahara-terracotta outline-none transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-sahara-blue/70 mb-1">Expiry Date</label>
                <input required type="text" placeholder="MM/YY" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-sahara-terracotta focus:ring-1 focus:ring-sahara-terracotta outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-sahara-blue/70 mb-1">CVC</label>
                <input required type="text" placeholder="123" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-sahara-terracotta focus:ring-1 focus:ring-sahara-terracotta outline-none transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Total & Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-sahara-terracotta/20">
          <div className="text-2xl font-bold text-sahara-blue">
            Total: ${total.toFixed(2)}
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className={`bg-sahara-terracotta text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-sahara-blue transition-colors shadow-lg shadow-sahara-terracotta/20 ${
              isProcessing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? 'Processing...' : t('checkout.placeOrder')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
