import { db } from '@/lib/firebase';
import {
    collection,
    onSnapshot,
    query,
    where
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  category: string;
  status: 'active' | 'inactive' | 'low_stock';
  isOffer?: boolean;
  discountPercent?: number;
  inStock: boolean;
}

export function usePublicProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'products'),
      where('status', '==', 'active')
    );
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const productsData: Product[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          productsData.push({
            id: doc.id,
            ...data,
            inStock: data.stock > 0,
            isOffer: data.originalPrice ? data.originalPrice > data.price : false,
            discountPercent: data.originalPrice ? Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100) : undefined
          } as Product);
        });
        setProducts(productsData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    products,
    loading,
    error
  };
}
