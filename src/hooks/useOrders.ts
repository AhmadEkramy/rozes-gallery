import { db } from '@/lib/firebase';
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  products: {
    id: string;
    title: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  orderDate: string;
  shippingAddress: string;
}

import { useAuth } from '@/contexts/AuthContext';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user || !isAdmin) {
      setError('You must be logged in as an admin to access orders');
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const ordersData: Order[] = [];
        snapshot.forEach((doc) => {
          ordersData.push({
            id: doc.id,
            ...doc.data() as Omit<Order, 'id'>
          });
        });
        setOrders(ordersData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        if (error.code === 'permission-denied') {
          setError('You do not have permission to access orders');
        } else {
          setError('Failed to fetch orders');
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isAdmin]);

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  };

  return {
    orders,
    loading,
    error,
    updateOrderStatus
  };
}
