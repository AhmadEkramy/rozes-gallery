import { Home, Package, ShoppingCart, Tag, Ticket, TrendingUp } from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Offers", url: "/admin/offers", icon: Tag },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
  { title: "Income", url: "/admin/income", icon: TrendingUp },
  { title: "Coupons", url: "/admin/coupons", icon: Ticket },
  { title: "Home", url: "/", icon: Home },
];

export function MobileNav() {
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center flex-1 py-2 ${
      isActive
        ? "text-primary"
        : "text-muted-foreground hover:text-primary"
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden">
      <nav className="flex items-center justify-around px-4">
        {menuItems.map((item) => (
          <NavLink key={item.title} to={item.url} end className={getNavCls}>
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
