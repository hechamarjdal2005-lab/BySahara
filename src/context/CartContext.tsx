import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, VolumeOption, Pack } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, volume?: VolumeOption) => void;
  addPackToCart: (pack: Pack) => void;
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const makeKey = (productId: string, volume?: VolumeOption) =>
  volume ? `${productId}__${volume.value}${volume.unit}` : productId;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bysahara_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('bysahara_cart', JSON.stringify(cart));
  }, [cart]);

  // ── addToCart (products) ──────────────────────────────────────
  const addToCart = (product: Product, volume?: VolumeOption) => {
    setCart((prev) => {
      const key = makeKey(product.id, volume);
      const exists = prev.find((i) => i.cartKey === key);
      if (exists) {
        return prev.map((i) =>
          i.cartKey === key ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      const price = volume ? volume.price : product.price;
      return [
        ...prev,
        {
          cartKey: key,
          type: 'product' as const,
          id: product.id,
          name: product.name,
          image: product.image,
          category: product.category,
          price,
          quantity: 1,
          selectedVolume: volume,
          product,
        },
      ];
    });
  };

  // ── addPackToCart (packs) ─────────────────────────────────────
  const addPackToCart = (pack: Pack) => {
    setCart((prev) => {
      const key = `pack__${pack.id}`;
      const exists = prev.find((i) => i.cartKey === key);
      if (exists) {
        return prev.map((i) =>
          i.cartKey === key ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          cartKey: key,
          type: 'pack' as const,
          id: pack.id,
          name: { en: pack.name, ar: pack.name_ar ?? pack.name },
          image: pack.image_url ?? '',
          category: 'pack',
          price: pack.pack_price,
          quantity: 1,
          pack,
        },
      ];
    });
  };

  // ── removeFromCart ────────────────────────────────────────────
  const removeFromCart = (cartKey: string) => {
    setCart((prev) => prev.filter((i) => i.cartKey !== cartKey));
  };

  // ── updateQuantity ────────────────────────────────────────────
  const updateQuantity = (cartKey: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartKey);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.cartKey === cartKey ? { ...i, quantity } : i))
    );
  };

  // ── clearCart ─────────────────────────────────────────────────
  const clearCart = () => setCart([]);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, addPackToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};