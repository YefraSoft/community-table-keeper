
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  Gift, 
  Package, 
  UserCog, 
  Settings, 
  Menu
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { 
    title: "Dashboard", 
    icon: Home, 
    to: "/dashboard" 
  },
  { 
    title: "Donadores", 
    icon: Users, 
    to: "/donadores" 
  },
  { 
    title: "Donaciones", 
    icon: Gift, 
    to: "/donaciones" 
  },
  { 
    title: "Inventario", 
    icon: Package, 
    to: "/inventario" 
  },
  { 
    title: "Empleados", 
    icon: UserCog, 
    to: "/empleados" 
  }
];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader className="flex p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="bg-community-600 text-white p-2 rounded-md">
              <Gift size={20} />
            </div>
            <span className="font-semibold text-lg">Comedor Comunitario</span>
          </div>
          <SidebarTrigger className="lg:hidden">
            <Menu size={20} />
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild
                className={cn(
                  "w-full justify-start gap-2",
                  location.pathname === item.to && "bg-secondary text-secondary-foreground"
                )}
              >
                <Link to={item.to}>
                  <item.icon size={18} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2">
          <Settings size={16} />
          <span>Configuración</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
