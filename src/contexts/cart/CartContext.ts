import { Product } from '@/hooks/usePublicProducts';
import { createContext } from 'react';

export interface CartItem extends Product {
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  cartCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
