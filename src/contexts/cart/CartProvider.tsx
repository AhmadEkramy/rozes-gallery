import { Product } from '@/hooks/usePublicProducts';
import React, { useState } from 'react';
import { CartContext, CartContextType, CartItem } from './CartContext';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = (product: Product, quantity: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevItems, { ...product, quantity }];
      });
    } catch (err) {
      setError('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
    } catch (err) {
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      if (quantity < 1) {
        removeFromCart(productId);
        return;
      }
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      setError('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value: CartContextType = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
