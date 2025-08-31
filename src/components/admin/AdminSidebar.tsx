import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    Home,
    Package,
    ShoppingCart,
    Tag,
    Ticket,
    TrendingUp,
    User
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const menuItems = [
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Offers", url: "/admin/offers", icon: Tag },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
  { title: "Income", url: "/admin/income", icon: TrendingUp },
  { title: "Coupons", url: "/admin/coupons", icon: Ticket },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-glow-primary" 
      : "hover:bg-accent hover:text-accent-foreground transition-all duration-200";

  return (
    <Sidebar
      className="border-r border-sidebar-border bg-sidebar hidden md:flex"
      collapsible="icon"
    >
      <SidebarContent>
        {/* Admin Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-sidebar-foreground">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Rozes Gallery</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Home button at bottom */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <SidebarMenuButton asChild>
            <NavLink to="/" className="hover:bg-accent hover:text-accent-foreground transition-all duration-200">
              <Home className="w-4 h-4" />
              {!isCollapsed && <span>Home</span>}
            </NavLink>
          </SidebarMenuButton>
        </div>

        {/* Sidebar Toggle */}
        <div className="absolute top-4 right-4">
          <SidebarTrigger className="w-6 h-6" />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}