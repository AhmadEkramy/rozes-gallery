import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CouponsSection } from "@/components/admin/CouponsSection";
import { IncomeSection } from "@/components/admin/IncomeSection";
import { MobileNav } from "@/components/admin/MobileNav";
import { OffersSection } from "@/components/admin/OffersSection";
import { OrdersSection } from "@/components/admin/OrdersSection";
import { ProductsSection } from "@/components/admin/ProductsSection";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navigate, Route, Routes } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-auto pb-20 md:pb-6">
          <div className="container mx-auto p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/admin/products" replace />} />
              <Route path="/products" element={<ProductsSection />} />
              <Route path="/offers" element={<OffersSection />} />
              <Route path="/orders" element={<OrdersSection />} />
              <Route path="/income" element={<IncomeSection />} />
              <Route path="/coupons" element={<CouponsSection />} />
            </Routes>
          </div>
        </main>
        <MobileNav />
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;