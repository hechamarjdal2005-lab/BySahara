import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import DocumentTitle from './components/DocumentTitle';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cooperatives from './pages/Cooperatives';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import CooperativeDetails from './pages/CooperativeDetails';
import PackDetails from './pages/PackDetails';
import ScrollToTop from './components/ScrollToTop';
import AdminApp from './admin/AdminApp';
import './i18n';

function App() {
  return (
    <SiteConfigProvider>
      <LanguageProvider>
        <CartProvider>
          <DocumentTitle />
          <Router>
            <ScrollToTop />
            <Routes>
              {/* ─── Admin (sans Layout du site) ─── */}
              <Route path="/admin/*" element={<AdminApp />} />

              {/* ─── Site public (avec Layout) ─── */}
              <Route path="/*" element={
                <Layout>
                  <Routes>
                    <Route path="/"                   element={<Home />} />
                    <Route path="/shop"               element={<Shop />} />
                    <Route path="/product/:id"        element={<ProductDetails />} />
                    <Route path="/cooperatives"       element={<Cooperatives />} />
                    <Route path="/cooperatives/:id"   element={<CooperativeDetails />} />
                    <Route path="/packs/:id"          element={<PackDetails />} />
                    <Route path="/cart"               element={<Cart />} />
                    <Route path="/checkout"           element={<Checkout />} />
                    <Route path="/about"              element={<About />} />
                    <Route path="/contact"            element={<Contact />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </Router>
        </CartProvider>
      </LanguageProvider>
    </SiteConfigProvider>
  );
}

export default App;