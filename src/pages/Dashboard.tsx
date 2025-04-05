
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, BarChart } from "recharts";
import { useAppContext } from "@/context/AppContext";
import { Users, Gift, Package, UserCog } from "lucide-react";

const Dashboard = () => {
  const { estadisticas, donaciones } = useAppContext();

  // Procesamiento de datos para los gráficos
  const ultimasSeisDonaciones = [...donaciones]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 6)
    .reverse();

  const datosGrafico = ultimasSeisDonaciones.map(donacion => ({
    fecha: new Date(donacion.fecha).toLocaleDateString(),
    cantidad: donacion.cantidad,
    tipo: donacion.tipo
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vista general del comedor comunitario
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donadores
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalDonadores}</div>
            <p className="text-xs text-muted-foreground">
              Donadores registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donaciones
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalDonaciones}</div>
            <p className="text-xs text-muted-foreground">
              {estadisticas.totalEconomicas} económicas, {estadisticas.totalEspecie} en especie
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Artículos en Inventario
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalInventario}</div>
            <p className="text-xs text-muted-foreground">
              Total de artículos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Empleados
            </CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.empleadosActivos} / {estadisticas.totalEmpleados}</div>
            <p className="text-xs text-muted-foreground">
              Empleados activos / total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Resumen de donaciones</CardTitle>
            <CardDescription>
              Evolución de las últimas donaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] w-full">
              {datosGrafico.length > 0 ? (
                <AreaChart
                  data={datosGrafico}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  {/* Los componentes específicos del gráfico se generarán aquí */}
                </AreaChart>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No hay datos suficientes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Distribución por tipo</CardTitle>
            <CardDescription>
              Distribución de donaciones por tipo
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] w-full">
              {estadisticas.totalDonaciones > 0 ? (
                <BarChart
                  data={[
                    { name: 'Económicas', value: estadisticas.totalEconomicas },
                    { name: 'En especie', value: estadisticas.totalEspecie }
                  ]}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 20,
                  }}
                >
                  {/* Los componentes específicos del gráfico se generarán aquí */}
                </BarChart>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No hay datos suficientes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
