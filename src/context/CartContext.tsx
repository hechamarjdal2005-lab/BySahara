import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, VolumeOption } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, volume?: VolumeOption) => void;
  removeFromCart: (productId: string, volumeKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, volumeKey?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ── Unique key: product + volume (bach nfriqu items f cart) ──────
const makeKey = (productId: string, volume?: VolumeOption) =>
  volume ? `${productId}__${volume.value}${volume.unit}` : productId;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ── addToCart ─────────────────────────────────────────────────
  const addToCart = (product: Product, volume?: VolumeOption) => {
    setCart((prevCart) => {
      const key = makeKey(product.id, volume);
      const existingItem = prevCart.find((item) => item.cartKey === key);

      if (existingItem) {
        return prevCart.map((item) =>
          item.cartKey === key ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      // Prix = volume price ila mwjoud, sinon product.price
      const price = volume ? volume.price : product.price;

      return [
        ...prevCart,
        {
          ...product,
          quantity: 1,
          price,                   // prix overridé selon volume
          cartKey: key,            // unique key bach nidentifiw l'item
          selectedVolume: volume,  // volume mkhtar
        },
      ];
    });
  };

  // ── removeFromCart ────────────────────────────────────────────
  const removeFromCart = (productId: string, volumeKey?: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.cartKey !== (volumeKey ?? productId))
    );
  };

  // ── updateQuantity ────────────────────────────────────────────
  const updateQuantity = (productId: string, quantity: number, volumeKey?: string) => {
    if (quantity < 1) {
      removeFromCart(productId, volumeKey);
      return;
    }
    const key = volumeKey ?? productId;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartKey === key ? { ...item, quantity } : item
      )
    );
  };

  // ── clearCart ─────────────────────────────────────────────────
  const clearCart = () => setCart([]);

  // ── Totals (prix déjà overridé f addToCart) ───────────────────
  const total     = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};