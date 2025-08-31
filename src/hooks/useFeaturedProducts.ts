import { db } from '@/lib/firebase';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface FeaturedProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isOffer: boolean;
  discountPercent?: number;
  inStock: boolean;
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('inStock', '==', true),
          orderBy('price', 'desc'),
          limit(4)
        );
        
        const snapshot = await getDocs(q);
        const productsData: FeaturedProduct[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          productsData.push({
            id: doc.id,
            title: data.title,
            price: data.price,
            originalPrice: data.originalPrice,
            image: data.image,
            category: data.category,
            isOffer: data.isOffer || false,
            discountPercent: data.discountPercent,
            inStock: data.inStock
          });
        });
        
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return { products, loading, error };
}
