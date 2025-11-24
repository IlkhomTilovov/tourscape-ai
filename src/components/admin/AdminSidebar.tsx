import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { LayoutDashboard, MapPin, Package, Plane, Hotel, FileText, Info, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Destinations", url: "/admin/destinations", icon: MapPin },
  { title: "Tours", url: "/admin/tours", icon: Package },
  { title: "Flights", url: "/admin/flights", icon: Plane },
  { title: "Hotels", url: "/admin/hotels", icon: Hotel },
  { title: "Visas", url: "/admin/visas", icon: FileText },
  { title: "Menu", url: "/admin/menu-items", icon: Menu },
  { title: "About", url: "/admin/about", icon: Info },
];

export function AdminSidebar() {
  const { open: isOpen } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon"  className={isOpen ? "w-60" : "w-14"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary text-primary-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
