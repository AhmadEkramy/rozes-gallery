import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface Order {
  id: string;
  total: number;
  orderDate: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  products: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
    category?: string;
  }>;
  customerName: string;
  email: string;
  shippingAddress: string;
}

interface IncomeStats {
  today: number;
  weekly: number;
  monthly: number;
  total: number;
  growth: {
    today: number;
    weekly: number;
    monthly: number;
    total: number;
  };
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface WeeklyData {
  day: string;
  income: number;
  orders: number;
}

interface MonthlyData {
  month: string;
  income: number;
}

const CATEGORY_COLORS = {
  "Rose Bouquets": "#E91E63",
  "Wedding Collections": "#9C27B0",
  "Garden Mix": "#FF5722",
  "Special Offers": "#FF9800",
  "Other": "#607D8B"
} as const;

export const useIncome = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [incomeStats, setIncomeStats] = useState<IncomeStats>({
    today: 0,
    weekly: 0,
    monthly: 0,
    total: 0,
    growth: {
      today: 0,
      weekly: 0,
      monthly: 0,
      total: 0
    }
  });
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    averageOrderValue: 0,
    ordersToday: 0,
    conversionRate: 0,
    returnCustomers: 0,
    ordersDiff: 0,
    conversionDiff: 0,
    returnDiff: 0
  });

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        setLoading(true);
        const ordersRef = collection(db, 'orders');
        
        // Get date ranges
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const yesterdayStr = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
        const weekAgoStr = new Date(now.setDate(now.getDate() - 6)).toISOString().split('T')[0];
        const monthAgoStr = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];

        // Fetch orders within different time ranges
        const todayOrders = await getDocs(
          query(
            ordersRef,
            where('status', '==', 'completed'),
            where('orderDate', '>=', todayStr),
            orderBy('orderDate', 'desc')
          )
        );

        const yesterdayOrders = await getDocs(
          query(
            ordersRef,
            where('status', '==', 'completed'),
            where('orderDate', '>=', yesterdayStr),
            where('orderDate', '<', todayStr),
            orderBy('orderDate', 'desc')
          )
        );

        const weeklyOrders = await getDocs(
          query(
            ordersRef,
            where('status', '==', 'completed'),
            where('orderDate', '>=', weekAgoStr),
            orderBy('orderDate', 'desc')
          )
        );

        const monthlyOrders = await getDocs(
          query(
            ordersRef,
            where('status', '==', 'completed'),
            where('orderDate', '>=', monthAgoStr),
            orderBy('orderDate', 'desc')
          )
        );

        // Process orders data
        const todayIncome = todayOrders.docs.reduce((sum, doc) => sum + doc.data().total, 0);
        const yesterdayIncome = yesterdayOrders.docs.reduce((sum, doc) => sum + doc.data().total, 0);
        const weeklyIncome = weeklyOrders.docs.reduce((sum, doc) => sum + doc.data().total, 0);
        const monthlyIncome = monthlyOrders.docs.reduce((sum, doc) => sum + doc.data().total, 0);

        // Calculate growth rates
        const todayGrowth = yesterdayIncome ? ((todayIncome - yesterdayIncome) / yesterdayIncome) * 100 : 0;
        const weeklyGrowth = 0; // TODO: Calculate based on previous week
        const monthlyGrowth = 0; // TODO: Calculate based on previous month
        const totalGrowth = 0; // TODO: Calculate based on previous year

        // Process weekly data
        const weeklyStats: { [key: string]: { income: number; orders: number } } = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        weeklyOrders.docs.forEach(doc => {
          const data = doc.data() as Order;
          const orderDate = new Date(data.orderDate);
          const day = days[orderDate.getDay()];
          if (!weeklyStats[day]) {
            weeklyStats[day] = { income: 0, orders: 0 };
          }
          weeklyStats[day].income += data.total;
          weeklyStats[day].orders += 1;
        });

        const processedWeeklyData = days.map(day => ({
          day,
          income: weeklyStats[day]?.income || 0,
          orders: weeklyStats[day]?.orders || 0
        }));

        // Process monthly data
        const monthlyStats: { [key: string]: number } = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        monthlyOrders.docs.forEach(doc => {
          const data = doc.data() as Order;
          const orderDate = new Date(data.orderDate);
          const month = months[orderDate.getMonth()];
          monthlyStats[month] = (monthlyStats[month] || 0) + data.total;
        });

        const processedMonthlyData = months.map(month => ({
          month,
          income: monthlyStats[month] || 0
        }));

        // Process category data
        const categoryStats: { [key: string]: number } = {};
        let totalOrders = 0;

        monthlyOrders.docs.forEach(doc => {
          const data = doc.data() as Order;
          totalOrders++;
          
          data.products.forEach(product => {
            const category = product.category || 'Other';
            categoryStats[category] = (categoryStats[category] || 0) + (product.price * product.quantity);
          });
        });

        const totalIncome = Object.values(categoryStats).reduce((sum, value) => sum + value, 0);
        const processedCategoryData = Object.entries(categoryStats).map(([name, value]) => ({
          name,
          value: Math.round((value / totalIncome) * 100),
          color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other
        }));

        // Calculate performance metrics
        const averageOrderValue = totalIncome / totalOrders;
        const ordersToday = todayOrders.docs.length;
        const ordersYesterday = yesterdayOrders.docs.length;
        const ordersDiff = ordersToday - ordersYesterday;

        // Update state
        setIncomeStats({
          today: todayIncome,
          weekly: weeklyIncome,
          monthly: monthlyIncome,
          total: totalIncome,
          growth: {
            today: todayGrowth,
            weekly: weeklyGrowth,
            monthly: monthlyGrowth,
            total: totalGrowth
          }
        });
        setWeeklyData(processedWeeklyData);
        setMonthlyData(processedMonthlyData);
        setCategoryData(processedCategoryData);
        setPerformanceMetrics({
          averageOrderValue,
          ordersToday,
          conversionRate: 3.2, // TODO: Calculate based on visits/orders
          returnCustomers: 68, // TODO: Calculate based on customer data
          ordersDiff,
          conversionDiff: 0.5, // TODO: Calculate difference
          returnDiff: 2.1 // TODO: Calculate difference
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching income data:', err);
        setError('Failed to load income data');
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
  }, []);

  return {
    loading,
    error,
    incomeStats,
    weeklyData,
    monthlyData,
    categoryData,
    performanceMetrics
  };
};
