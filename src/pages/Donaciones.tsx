
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Donacion, Donador } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash } from "lucide-react";

const Donaciones = () => {
  const { donaciones, donadores, agregarDonacion, actualizarDonacion, eliminarDonacion } = useAppContext();
  const [busqueda, setBusqueda] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDonacion, setEditingDonacion] = useState<Donacion | null>(null);
  
  const [formData, setFormData] = useState<Omit<Donacion, 'id'>>({
    donadorId: '',
    nombreDonador: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'economica',
    cantidad: 0,
    categoriaProducto: '',
    metodo: 'efectivo',
    estado: 'pendiente',
    descripcion: ''
  });

  const resetForm = () => {
    setFormData({
      donadorId: '',
      nombreDonador: '',
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'economica',
      cantidad: 0,
      categoriaProducto: '',
      metodo: 'efectivo',
      estado: 'pendiente',
      descripcion: ''
    });
    setEditingDonacion(null);
  };

  const donacionesFiltradas = donaciones.filter(donacion => 
    donacion.nombreDonador?.toLowerCase().includes(busqueda.toLowerCase()) ||
    donacion.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleTipoChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      tipo: value as "economica" | "especie"
    }));
  };

  const handleMetodoChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      metodo: value as "efectivo" | "transferencia" | "cheque" | "otro"
    }));
  };

  const handleEstadoChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      estado: value as "pendiente" | "completada" | "cancelada"
    }));
  };

  const handleDonadorChange = (value: string) => {
    const donador = donadores.find(d => d.id === value);
    setFormData(prev => ({
      ...prev,
      donadorId: value,
      nombreDonador: donador?.nombreCompleto || ''
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    if (editingDonacion) {
      actualizarDonacion({
        ...editingDonacion,
        ...formData
      });
    } else {
      agregarDonacion(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (donacion: Donacion) => {
    setEditingDonacion(donacion);
    setFormData({
      donadorId: donacion.donadorId,
      nombreDonador: donacion.nombreDonador,
      fecha: donacion.fecha,
      tipo: donacion.tipo,
      cantidad: donacion.cantidad,
      categoriaProducto: donacion.categoriaProducto,
      metodo: donacion.metodo,
      estado: donacion.estado,
      descripcion: donacion.descripcion
    });
    setIsModalOpen(true);
  };

  const handleEditTipoChange = (value: string) => {
    setEditingDonacion(prev => prev ? {
      ...prev,
      tipo: value as "economica" | "especie"
    } : null);
  };

  const handleEditMetodoChange = (value: string) => {
    setEditingDonacion(prev => prev ? {
      ...prev,
      metodo: value as "efectivo" | "transferencia" | "cheque" | "otro"
    } : null);
  };

  const handleEditEstadoChange = (value: string) => {
    setEditingDonacion(prev => prev ? {
      ...prev,
      estado: value as "pendiente" | "completada" | "cancelada"
    } : null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro que deseas eliminar esta donación?")) {
      eliminarDonacion(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donaciones</h1>
          <p className="text-muted-foreground">
            Registro de donaciones recibidas
          </p>
        </div>

        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Donación
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar donación..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Donaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donador</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donacionesFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-16 text-center">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                ) : (
                  donacionesFiltradas.map((donacion) => (
                    <TableRow key={donacion.id}>
                      <TableCell>{donacion.nombreDonador}</TableCell>
                      <TableCell>{donacion.fecha}</TableCell>
                      <TableCell>
                        <Badge variant={donacion.tipo === 'economica' ? 'default' : 'secondary'}>
                          {donacion.tipo === 'economica' ? 'Económica' : 'En Especie'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {donacion.tipo === 'economica' 
                          ? `$${donacion.cantidad.toFixed(2)}` 
                          : `${donacion.cantidad} ${donacion.categoriaProducto}`}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            donacion.estado === 'completada' ? 'default' : 
                            donacion.estado === 'pendiente' ? 'outline' : 
                            'destructive'
                          }
                        >
                          {donacion.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(donacion)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(donacion.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingDonacion ? "Editar Donación" : "Registrar Nueva Donación"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="donador" className="text-right">Donador</Label>
              <div className="col-span-3">
                <Select 
                  value={formData.donadorId} 
                  onValueChange={handleDonadorChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar donador" />
                  </SelectTrigger>
                  <SelectContent>
                    {donadores.map((donador) => (
                      <SelectItem key={donador.id} value={donador.id}>
                        {donador.nombreCompleto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fecha" className="text-right">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo" className="text-right">Tipo</Label>
              <div className="col-span-3">
                <Select 
                  value={formData.tipo} 
                  onValueChange={handleTipoChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de donación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economica">Económica</SelectItem>
                    <SelectItem value="especie">En Especie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cantidad" className="text-right">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {formData.tipo === 'especie' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoriaProducto" className="text-right">Categoría</Label>
                <Input
                  id="categoriaProducto"
                  name="categoriaProducto"
                  value={formData.categoriaProducto}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Ej. Alimentos, Ropa, etc."
                />
              </div>
            )}

            {formData.tipo === 'economica' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="metodo" className="text-right">Método</Label>
                <div className="col-span-3">
                  <Select 
                    value={formData.metodo} 
                    onValueChange={handleMetodoChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">Estado</Label>
              <div className="col-span-3">
                <Select 
                  value={formData.estado} 
                  onValueChange={handleEstadoChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">Descripción</Label>
              <Input
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              {editingDonacion ? "Actualizar" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Donaciones;
