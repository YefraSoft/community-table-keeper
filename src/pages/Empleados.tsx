
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash, Calendar } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Empleado } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

const estadoBadgeVariant = {
  activo: "default",
  inactivo: "outline",
  licencia: "secondary",
};

const Empleados = () => {
  const { empleados, agregarEmpleado, actualizarEmpleado, eliminarEmpleado } = useAppContext();
  const { toast } = useToast();
  const [busqueda, setBusqueda] = useState("");
  const [editandoEmpleado, setEditandoEmpleado] = useState<Empleado | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  
  // Form states
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    puesto: "",
    turnoLaboral: "",
    contactoEmergencia: "",
    salario: 0,
    estadoLaboral: "activo",
    fechaContratacion: new Date().toISOString().split('T')[0],
  });

  const resetForm = () => {
    setFormData({
      nombreCompleto: "",
      puesto: "",
      turnoLaboral: "",
      contactoEmergencia: "",
      salario: 0,
      estadoLaboral: "activo",
      fechaContratacion: new Date().toISOString().split('T')[0],
    });
    setEditandoEmpleado(null);
  };

  const empleadosFiltrados = empleados.filter(empleado => {
    const matchBusqueda = 
      empleado.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
      empleado.puesto.toLowerCase().includes(busqueda.toLowerCase());
    
    if (filtroEstado !== "todos") {
      return matchBusqueda && empleado.estadoLaboral === filtroEstado;
    }
    
    return matchBusqueda;
  });

  const handleEdit = (empleado: Empleado) => {
    setEditandoEmpleado(empleado);
    setFormData({
      nombreCompleto: empleado.nombreCompleto,
      puesto: empleado.puesto,
      turnoLaboral: empleado.turnoLaboral,
      contactoEmergencia: empleado.contactoEmergencia,
      salario: empleado.salario,
      estadoLaboral: empleado.estadoLaboral,
      fechaContratacion: new Date(empleado.fechaContratacion).toISOString().split('T')[0],
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este empleado? Esta acción no se puede deshacer.")) {
      eliminarEmpleado(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombreCompleto || !formData.puesto) {
      toast({
        title: "Error",
        description: "Los campos de nombre y puesto son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    if (editandoEmpleado) {
      actualizarEmpleado({
        ...editandoEmpleado,
        ...formData,
        salario: Number(formData.salario),
      });
    } else {
      agregarEmpleado({
        ...formData,
        salario: Number(formData.salario),
      });
    }

    setDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empleados</h1>
          <p className="text-muted-foreground">
            Gestión del personal del comedor comunitario
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editandoEmpleado ? "Editar Empleado" : "Registrar Nuevo Empleado"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="nombreCompleto">Nombre Completo</Label>
                <Input
                  id="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={(e) => setFormData({...formData, nombreCompleto: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="puesto">Puesto</Label>
                <Input
                  id="puesto"
                  value={formData.puesto}
                  onChange={(e) => setFormData({...formData, puesto: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="turnoLaboral">Turno Laboral</Label>
                <Select
                  value={formData.turnoLaboral}
                  onValueChange={(value) => setFormData({...formData, turnoLaboral: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matutino">Matutino</SelectItem>
                    <SelectItem value="vespertino">Vespertino</SelectItem>
                    <SelectItem value="nocturno">Nocturno</SelectItem>
                    <SelectItem value="completo">Tiempo completo</SelectItem>
                    <SelectItem value="fin_semana">Fin de semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="contactoEmergencia">Contacto de Emergencia</Label>
                <Input
                  id="contactoEmergencia"
                  value={formData.contactoEmergencia}
                  onChange={(e) => setFormData({...formData, contactoEmergencia: e.target.value})}
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="salario">Salario</Label>
                <Input
                  id="salario"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.salario}
                  onChange={(e) => setFormData({...formData, salario: parseFloat(e.target.value)})}
                  required
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="estadoLaboral">Estado Laboral</Label>
                <Select
                  value={formData.estadoLaboral}
                  onValueChange={(value: "activo" | "inactivo" | "licencia") => 
                    setFormData({...formData, estadoLaboral: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="licencia">En licencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="fechaContratacion">Fecha de Contratación</Label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="date"
                    id="fechaContratacion"
                    value={formData.fechaContratacion}
                    onChange={(e) => setFormData({...formData, fechaContratacion: e.target.value})}
                    required
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Calendar className="h-4 w-4" />
                    <span className="sr-only">Seleccionar fecha</span>
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editandoEmpleado ? "Actualizar" : "Guardar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 max-w-xs flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar empleado..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        
        <Tabs value={filtroEstado} onValueChange={setFiltroEstado}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="activo">Activos</TabsTrigger>
            <TabsTrigger value="inactivo">Inactivos</TabsTrigger>
            <TabsTrigger value="licencia">En licencia</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empleados</CardTitle>
        </CardHeader>
        <CardContent>
          {empleados.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay empleados registrados.</p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Registrar el primer empleado
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Puesto</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead>Salario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empleadosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-16 text-center">
                        No se encontraron resultados para su búsqueda
                      </TableCell>
                    </TableRow>
                  ) : (
                    empleadosFiltrados.map((empleado) => (
                      <TableRow key={empleado.id}>
                        <TableCell>
                          <div>
                            {empleado.nombreCompleto}
                            <div className="text-xs text-muted-foreground">
                              Desde: {new Date(empleado.fechaContratacion).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{empleado.puesto}</TableCell>
                        <TableCell>{empleado.turnoLaboral}</TableCell>
                        <TableCell>{formatCurrency(empleado.salario)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={estadoBadgeVariant[empleado.estadoLaboral] as any}
                          >
                            {empleado.estadoLaboral}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(empleado)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(empleado.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Empleados;
