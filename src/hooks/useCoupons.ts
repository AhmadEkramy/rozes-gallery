import { useToast } from '@/components/ui/use-toast';
import { db } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  minPurchase?: number;
  isActive: boolean;
  description?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CouponStats {
  total: number;
  active: number;
  expired: number;
  totalUsed: number;
  totalSaved: number;
}

export interface UsageData {
  date: string;
  uses: number;
  savings: number;
}

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<CouponStats>({
    total: 0,
    active: 0,
    expired: 0,
    totalUsed: 0,
    totalSaved: 0
  });
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const couponsRef = collection(db, 'coupons');
    const q = query(couponsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const couponsData: Coupon[] = [];
          let activeCount = 0;
          let expiredCount = 0;
          let totalUsed = 0;
          let totalSaved = 0;
          const today = new Date();

          snapshot.forEach((doc) => {
            const data = doc.data() as Omit<Coupon, 'id'>;
            const coupon = {
              id: doc.id,
              ...data
            } as Coupon;
            
            couponsData.push(coupon);

            // Calculate stats
            const isExpired = new Date(coupon.expiryDate) < today;
            if (isExpired) {
              expiredCount++;
            } else if (coupon.isActive) {
              activeCount++;
            }

            totalUsed += coupon.usedCount;
            totalSaved += coupon.type === 'fixed' 
              ? coupon.value * coupon.usedCount
              : 0; // For percentage types, we need order data to calculate savings
          });

          setCoupons(couponsData);
          setStats({
            total: couponsData.length,
            active: activeCount,
            expired: expiredCount,
            totalUsed,
            totalSaved
          });

          // Generate usage data for the chart (last 30 days)
          const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
          }).reverse();

          const usageStats = last30Days.map(date => ({
            date,
            uses: Math.floor(Math.random() * 10), // TODO: Replace with real usage data from orders
            savings: Math.floor(Math.random() * 1000) // TODO: Replace with real savings data from orders
          }));

          setUsageData(usageStats);
          setError(null);
        } catch (err) {
          console.error('Error processing coupons data:', err);
          setError('Failed to process coupons data');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error fetching coupons:', err);
        setError('Failed to load coupons');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const createCoupon = async (couponData: Omit<Coupon, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCoupon = {
        ...couponData,
        usedCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'coupons'), newCoupon);
      
      toast({
        title: "Success",
        description: "Coupon created successfully"
      });
    } catch (err) {
      console.error('Error creating coupon:', err);
      toast({
        title: "Error",
        description: "Failed to create coupon",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateCoupon = async (couponId: string, couponData: Partial<Omit<Coupon, 'id'>>) => {
    try {
      const couponRef = doc(db, 'coupons', couponId);
      await updateDoc(couponRef, {
        ...couponData,
        updatedAt: serverTimestamp()
      });
      
      toast({
        title: "Success",
        description: "Coupon updated successfully"
      });
    } catch (err) {
      console.error('Error updating coupon:', err);
      toast({
        title: "Error",
        description: "Failed to update coupon",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteCoupon = async (couponId: string) => {
    try {
      await deleteDoc(doc(db, 'coupons', couponId));
      toast({
        title: "Success",
        description: "Coupon deleted successfully"
      });
    } catch (err) {
      console.error('Error deleting coupon:', err);
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive"
      });
      throw err;
    }
  };

  const toggleCouponStatus = async (couponId: string, isActive: boolean) => {
    try {
      await updateCoupon(couponId, { isActive });
    } catch (err) {
      console.error('Error toggling coupon status:', err);
      throw err;
    }
  };

  return {
    coupons,
    stats,
    usageData,
    loading,
    error,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus
  };
}
