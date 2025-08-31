import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  products: string[];
  isActive: boolean;
  startDate: string;
  endDate: string;
  image?: string;
}

export function useSpecialOffers() {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecialOffers = async () => {
      try {
        const today = new Date().toISOString();
        const q = query(
          collection(db, 'offers'),
          where('isActive', '==', true),
          where('endDate', '>=', today),
          orderBy('endDate', 'asc')
        );
        
        const snapshot = await getDocs(q);
        const offersData: SpecialOffer[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          offersData.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            discount: data.discount,
            type: data.type,
            products: data.products || [],
            isActive: data.isActive,
            startDate: data.startDate,
            endDate: data.endDate,
            image: data.image
          });
        });
        
        setOffers(offersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching special offers:', err);
        setError('Failed to load special offers');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialOffers();
  }, []);

  return { offers, loading, error };
}
