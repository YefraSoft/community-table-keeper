
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
import { Donacion } from "@/types";
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
  pendiente: "outline",
  completada: "default",
  cancelada: "destructive",
};

const Donaciones = () => {
  const { donaciones, donadores, agregarDonacion, actualizarDonacion, eliminarDonacion } = useAppContext();
  const { toast } = useToast();
  const [busqueda, setBusqueda] = useState("");
  const [editandoDonacion, setEditandoDonacion] = useState<Donacion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  
  // Form states
  const [formData, setFormData] = useState({
    donadorId: "",
    fecha: new Date().toISOString().split('T')[0],
    tipo: "economica",
    cantidad: 0,
    categoriaProducto: "",
    metodo: "efectivo",
    estado: "pendiente",
    descripcion: "",
  });

  const resetForm = () => {
    setFormData({
      donadorId: "",
      fecha: new Date().toISOString().split('T')[0],
      tipo: "economica",
      cantidad: 0,
      categoriaProducto: "",
      metodo: "efectivo",
      estado: "pendiente",
      descripcion: "",
    });
    setEditandoDonacion(null);
  };

  const donacionesFiltradas = donaciones.filter(donacion => {
    const matchBusqueda = 
      donadores.find(d => d.id === donacion.donadorId)?.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
      (donacion.descripcion && donacion.descripcion.toLowerCase().includes(busqueda.toLowerCase()));
    
    if (filtroEstado !== "todos") {
      return matchBusqueda && donacion.estado === filtroEstado;
    }
    
    return matchBusqueda;
  });

  const handleEdit = (donacion: Donacion) => {
    setEditandoDonacion(donacion);
    setFormData({
      donadorId: donacion.donadorId,
      fecha: new Date(donacion.fecha).toISOString().split('T')[0],
      tipo: donacion.tipo,
      cantidad: donacion.cantidad,
      categoriaProducto: donacion.categoriaProducto || "",
      metodo: donacion.metodo,
      estado: donacion.estado,
      descripcion: donacion.descripcion || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro que deseas eliminar esta donación? Esta acción no se puede deshacer.")) {
      eliminarDonacion(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.donadorId || !formData.fecha) {
      toast({
        title: "Error",
        description: "Los campos de donador y fecha son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    if (formData.tipo === "especie" && !formData.categoriaProducto) {
      toast({
        title: "Error",
        description: "Para donaciones en especie, la categoría del producto es obligatoria.",
        variant: "destructive",
      });
      return;
    }

    if (editandoDonacion) {
      actualizarDonacion({
        ...editandoDonacion,
        ...formData,
        cantidad: Number(formData.cantidad),
      });
    } else {
      agregarDonacion({
        ...formData,
        cantidad: Number(formData.cantidad),
      });
    }

    setDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donaciones</h1>
          <p className="text-muted-foreground">
            Registro y seguimiento de donaciones
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Donación
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editandoDonacion ? "Editar Donación" : "Registrar Nueva Donación"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="donadorId">Donador</Label>
                <Select
                  value={formData.donadorId}
                  onValueChange={(value) => setFormData({...formData, donadorId: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un donador" />
                  </SelectTrigger>
                  <SelectContent>
                    {donadores.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No hay donadores registrados
                      </SelectItem>
                    ) : (
                      donadores.map((donador) => (
                        <SelectItem key={donador.id} value={donador.id}>
                          {donador.nombreCompleto}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="fecha">Fecha</Label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="date"
                    id="fecha"
                    value={formData.fecha}
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    required
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Calendar className="h-4 w-4" />
                    <span className="sr-only">Seleccionar fecha</span>
                  </Button>
                </div>
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="tipo">Tipo de donación</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value: "economica" | "especie") => 
                    setFormData({...formData, tipo: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economica">Económica</SelectItem>
                    <SelectItem value="especie">En especie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="0"
                  step={formData.tipo === "economica" ? "0.01" : "1"}
                  value={formData.cantidad}
                  onChange={(e) => setFormData({...formData, cantidad: parseFloat(e.target.value)})}
                  required
                />
              </div>
              
              {formData.tipo === "especie" && (
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="categoriaProducto">Categoría del producto</Label>
                  <Select
                    value={formData.categoriaProducto}
                    onValueChange={(value) => setFormData({...formData, categoriaProducto: value})}
                    required={formData.tipo === "especie"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alimentos">Alimentos</SelectItem>
                      <SelectItem value="ropa">Ropa</SelectItem>
                      <SelectItem value="medicamentos">Medicamentos</SelectItem>
                      <SelectItem value="utiles">Útiles</SelectItem>
                      <SelectItem value="electrodomesticos">Electrodomésticos</SelectItem>
                      <SelectItem value="muebles">Muebles</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {formData.tipo === "economica" && (
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="metodo">Método de pago</Label>
                  <Select
                    value={formData.metodo}
                    onValueChange={(value: "efectivo" | "transferencia" | "cheque" | "otro") => 
                      setFormData({...formData, metodo: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value: "pendiente" | "completada" | "cancelada") => 
                    setFormData({...formData, estado: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                />
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
                  {editandoDonacion ? "Actualizar" : "Guardar"}
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
            placeholder="Buscar donación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        
        <Tabs value={filtroEstado} onValueChange={setFiltroEstado}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="pendiente">Pendiente</TabsTrigger>
            <TabsTrigger value="completada">Completada</TabsTrigger>
            <TabsTrigger value="cancelada">Cancelada</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Donaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {donaciones.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay donaciones registradas.</p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Registrar la primera donación
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donador</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad/Items</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donacionesFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-16 text-center">
                        No se encontraron resultados para su búsqueda
                      </TableCell>
                    </TableRow>
                  ) : (
                    donacionesFiltradas.map((donacion) => {
                      const donador = donadores.find(d => d.id === donacion.donadorId);
                      return (
                        <TableRow key={donacion.id}>
                          <TableCell>{donador?.nombreCompleto || "Desconocido"}</TableCell>
                          <TableCell>{new Date(donacion.fecha).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {donacion.tipo === "economica" ? "Económica" : "En especie"}
                            {donacion.tipo === "especie" && donacion.categoriaProducto && (
                              <span className="block text-xs text-muted-foreground">
                                {donacion.categoriaProducto}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {donacion.tipo === "economica" 
                              ? formatCurrency(donacion.cantidad)
                              : `${donacion.cantidad} unidades`
                            }
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={estadoBadgeVariant[donacion.estado] as any}
                            >
                              {donacion.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(donacion)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(donacion.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
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

export default Donaciones;
