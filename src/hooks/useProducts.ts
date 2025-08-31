import { db } from '@/lib/firebase';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    updateDoc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string; // main image for backwards compatibility
  images: string[]; // array of all images
  status: 'active' | 'inactive' | 'low_stock';
}

import { useAuth } from '@/contexts/AuthContext';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user || !isAdmin) {
      setError('You must be logged in as an admin to access this data');
      setLoading(false);
      return;
    }

    const q = collection(db, 'products');
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const productsData: Product[] = [];
        snapshot.forEach((doc) => {
          productsData.push({
            id: doc.id,
            ...doc.data() as Omit<Product, 'id'>
          });
        });
        setProducts(productsData);
        setLoading(false);
        setError(null); // Clear any previous errors
      },
      (error) => {
        console.error('Error fetching products:', error);
        if (error.code === 'permission-denied') {
          setError('You do not have permission to access this data');
        } else {
          setError('Failed to fetch products');
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isAdmin]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), product);
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error('Failed to add product');
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, updates);
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct
  };
}
