import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  inStock: boolean;
}

interface CartData {
  items: CartItem[];
  updatedAt: Date;
}

export function useCart() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const cartRef = doc(db, 'cart', user.uid);
    
    // Subscribe to real-time cart updates
    const unsubscribe = onSnapshot(cartRef, 
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as CartData;
          setCartItems(data.items);
        } else {
          setCartItems([]);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching cart:', err);
        setError('Failed to load cart items');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addToCart = async (item: Omit<CartItem, 'quantity'>, quantityToAdd: number = 1) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to add items to cart",
        variant: "destructive"
      });
      return;
    }

    // Validate item data before adding to cart
    if (!item.id || !item.title || typeof item.price !== 'number' || !item.image) {
      toast({
        title: "Error",
        description: "Invalid product data",
        variant: "destructive"
      });
      return;
    }

    try {
      const cartRef = doc(db, 'cart', user.uid);
      const cartDoc = await getDoc(cartRef);
      let currentItems: CartItem[] = [];
      
      if (cartDoc.exists()) {
        const currentCart = cartDoc.data() as CartData;
        currentItems = currentCart.items || [];
      }

      const existingItemIndex = currentItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex > -1) {
        // Item exists, add quantity
        currentItems[existingItemIndex].quantity += quantityToAdd;
      } else {
        // Add new item with validated data
        const newItem: CartItem = {
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: quantityToAdd,
          inStock: item.inStock ?? true,
          ...(item.originalPrice && { originalPrice: item.originalPrice })
        };
        currentItems.push(newItem);
      }

      await setDoc(cartRef, {
        items: currentItems,
        updatedAt: new Date()
      });

      toast({
        title: "Success",
        description: "Item added to cart",
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!user) return;

    try {
      const cartRef = doc(db, 'cart', user.uid);
      const cartDoc = await getDoc(cartRef);
      
      if (!cartDoc.exists()) return;

      const currentCart = cartDoc.data() as CartData;
      const updatedItems = newQuantity <= 0
        ? currentCart.items.filter(item => item.id !== productId)
        : currentCart.items.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          );

      await updateDoc(cartRef, {
        items: updatedItems,
        updatedAt: new Date()
      });
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      });
    }
  };

  const removeItem = async (productId: string) => {
    if (!user) return;

    try {
      const cartRef = doc(db, 'cart', user.uid);
      const cartDoc = await getDoc(cartRef);
      
      if (!cartDoc.exists()) return;

      const currentCart = cartDoc.data() as CartData;
      const updatedItems = currentCart.items.filter(item => item.id !== productId);

      await updateDoc(cartRef, {
        items: updatedItems,
        updatedAt: new Date()
      });

      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    } catch (err) {
      console.error('Error removing item:', err);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive"
      });
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const cartRef = doc(db, 'cart', user.uid);
      await setDoc(cartRef, {
        items: [],
        updatedAt: new Date()
      });

      toast({
        title: "Success",
        description: "Cart cleared successfully",
      });
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive"
      });
    }
  };

  return {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
  };
}
