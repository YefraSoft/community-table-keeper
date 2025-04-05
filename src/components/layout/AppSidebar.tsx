
import React from "react";
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
    value: "dashboard" 
  },
  { 
    title: "Donadores", 
    icon: Users, 
    value: "donadores" 
  },
  { 
    title: "Donaciones", 
    icon: Gift, 
    value: "donaciones" 
  },
  { 
    title: "Inventario", 
    icon: Package, 
    value: "inventario" 
  },
  { 
    title: "Empleados", 
    icon: UserCog, 
    value: "empleados" 
  }
];

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
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
                  activeTab === item.value && "bg-secondary text-secondary-foreground"
                )}
                onClick={() => setActiveTab(item.value)}
              >
                <div className="flex items-center px-2 py-1.5 cursor-pointer">
                  <item.icon size={18} />
                  <span>{item.title}</span>
                </div>
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
