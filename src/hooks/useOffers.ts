import { useToast } from '@/components/ui/use-toast';
import { db } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  products: string[];
  isActive: boolean;
  startDate: string;
  endDate: string;
  image: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export function useOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'offers'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const offersData: Offer[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          offersData.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            discount: data.discount,
            type: data.type,
            products: data.products,
            isActive: data.isActive,
            startDate: data.startDate,
            endDate: data.endDate,
            image: data.image,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });
        setOffers(offersData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching offers:', err);
        setError('Failed to load offers');
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load offers",
          variant: "destructive"
        });
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const createOffer = async (offerData: Omit<Offer, 'id'>) => {
    try {
      await addDoc(collection(db, 'offers'), {
        ...offerData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      toast({
        title: "Success",
        description: "Offer created successfully"
      });
    } catch (err) {
      console.error('Error creating offer:', err);
      toast({
        title: "Error",
        description: "Failed to create offer",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateOffer = async (offerId: string, offerData: Partial<Omit<Offer, 'id'>>) => {
    try {
      const offerRef = doc(db, 'offers', offerId);
      await updateDoc(offerRef, {
        ...offerData,
        updatedAt: serverTimestamp()
      });
      
      toast({
        title: "Success",
        description: "Offer updated successfully"
      });
    } catch (err) {
      console.error('Error updating offer:', err);
      toast({
        title: "Error",
        description: "Failed to update offer",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteOffer = async (offerId: string) => {
    try {
      await deleteDoc(doc(db, 'offers', offerId));
      toast({
        title: "Success",
        description: "Offer deleted successfully"
      });
    } catch (err) {
      console.error('Error deleting offer:', err);
      toast({
        title: "Error",
        description: "Failed to delete offer",
        variant: "destructive"
      });
      throw err;
    }
  };

  const toggleOfferStatus = async (offerId: string, isActive: boolean) => {
    try {
      await updateOffer(offerId, { isActive });
    } catch (err) {
      console.error('Error toggling offer status:', err);
      throw err;
    }
  };

  return {
    offers,
    loading,
    error,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus
  };
}
