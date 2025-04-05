
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
import { ArticuloInventario } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const Inventario = () => {
  const { inventario, agregarArticuloInventario, actualizarArticuloInventario, eliminarArticuloInventario } = useAppContext();
  const { toast } = useToast();
  const [busqueda, setBusqueda] = useState("");
  const [editandoArticulo, setEditandoArticulo] = useState<ArticuloInventario | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("");
  
  // Form states
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    cantidad: 1,
    fechaIngreso: new Date().toISOString().split('T')[0],
    estado: "nuevo",
    descripcion: "",
  });

  const resetForm = () => {
    setFormData({
      nombre: "",
      categoria: "",
      cantidad: 1,
      fechaIngreso: new Date().toISOString().split('T')[0],
      estado: "nuevo",
      descripcion: "",
    });
    setEditandoArticulo(null);
  };

  // Obtener lista única de categorías para el filtro
  const categorias = [...new Set(inventario.map(item => item.categoria))];

  const articulosFiltrados = inventario.filter(articulo => {
    const matchBusqueda = 
      articulo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      articulo.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
      (articulo.descripcion && articulo.descripcion.toLowerCase().includes(busqueda.toLowerCase()));
    
    if (filtroCategoria) {
      return matchBusqueda && articulo.categoria === filtroCategoria;
    }
    
    return matchBusqueda;
  });

  const handleEdit = (articulo: ArticuloInventario) => {
    setEditandoArticulo(articulo);
    setFormData({
      nombre: articulo.nombre,
      categoria: articulo.categoria,
      cantidad: articulo.cantidad,
      fechaIngreso: new Date(articulo.fechaIngreso).toISOString().split('T')[0],
      estado: articulo.estado,
      descripcion: articulo.descripcion || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este artículo del inventario? Esta acción no se puede deshacer.")) {
      eliminarArticuloInventario(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.categoria) {
      toast({
        title: "Error",
        description: "Los campos de nombre y categoría son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    if (editandoArticulo) {
      actualizarArticuloInventario({
        ...editandoArticulo,
        ...formData,
        cantidad: Number(formData.cantidad),
      });
    } else {
      agregarArticuloInventario({
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
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">
            Gestión de artículos en inventario
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Artículo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editandoArticulo ? "Editar Artículo" : "Registrar Nuevo Artículo"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({...formData, categoria: value})}
                  required
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
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="0"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({...formData, cantidad: parseInt(e.target.value)})}
                  required
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="date"
                    id="fechaIngreso"
                    value={formData.fechaIngreso}
                    onChange={(e) => setFormData({...formData, fechaIngreso: e.target.value})}
                    required
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Calendar className="h-4 w-4" />
                    <span className="sr-only">Seleccionar fecha</span>
                  </Button>
                </div>
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value: "nuevo" | "usado") => 
                    setFormData({...formData, estado: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuevo">Nuevo</SelectItem>
                    <SelectItem value="usado">Usado</SelectItem>
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
                  {editandoArticulo ? "Actualizar" : "Guardar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 max-w-xs flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar en inventario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="filtroCategoria">Filtrar por categoría:</Label>
          <Select
            value={filtroCategoria}
            onValueChange={setFiltroCategoria}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventario de Artículos</CardTitle>
        </CardHeader>
        <CardContent>
          {inventario.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay artículos en el inventario.</p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar primer artículo
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Fecha Ingreso</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articulosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-16 text-center">
                        No se encontraron resultados para su búsqueda
                      </TableCell>
                    </TableRow>
                  ) : (
                    articulosFiltrados.map((articulo) => (
                      <TableRow key={articulo.id}>
                        <TableCell>{articulo.nombre}</TableCell>
                        <TableCell>{articulo.categoria}</TableCell>
                        <TableCell>{articulo.cantidad}</TableCell>
                        <TableCell>{new Date(articulo.fechaIngreso).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={articulo.estado === "nuevo" ? "default" : "outline"}
                          >
                            {articulo.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(articulo)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(articulo.id)}>
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

export default Inventario;
