
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Dashboard from '@/pages/Dashboard';
import Donadores from '@/pages/Donadores';
import Donaciones from '@/pages/Donaciones';
import Inventario from '@/pages/Inventario';
import Empleados from '@/pages/Empleados';
import { LogOut } from "lucide-react";

interface AppLayoutProps {
  onLogout: () => void;
}

export function AppLayout({ onLogout }: AppLayoutProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="h-full flex items-center justify-between px-4 sm:px-6">
              <div className="flex items-center">
                <SidebarTrigger>
                  <span className="sr-only">Toggle sidebar</span>
                </SidebarTrigger>
                <div className="ml-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList>
                      <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                      <TabsTrigger value="donadores">Donadores</TabsTrigger>
                      <TabsTrigger value="donaciones">Donaciones</TabsTrigger>
                      <TabsTrigger value="inventario">Inventario</TabsTrigger>
                      <TabsTrigger value="empleados">Empleados</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              <Button variant="ghost" onClick={onLogout} className="flex gap-2">
                <LogOut size={16} />
                Cerrar sesión
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "donadores" && <Donadores />}
            {activeTab === "donaciones" && <Donaciones />}
            {activeTab === "inventario" && <Inventario />}
            {activeTab === "empleados" && <Empleados />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
