import React, { useState, useEffect } from 'react';
import { Donacion } from '@/types';
import { useAppContext } from '@/context/AppContext';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Donaciones: React.FC = () => {
  const { donaciones, agregarDonacion, actualizarDonacion, eliminarDonacion } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevaDonacion, setNuevaDonacion] = useState<Omit<Donacion, 'id'>>({
    donadorId: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'economica',
    cantidad: 0,
    categoriaProducto: '',
    metodo: 'efectivo',
    estado: 'pendiente',
    descripcion: ''
  });
  const [editingDonacion, setEditingDonacion] = useState<Donacion | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openEditModal = (donacion: Donacion) => {
    setEditingDonacion(donacion);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingDonacion(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevaDonacion(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (editingDonacion) {
      const { name, value } = e.target;
      setEditingDonacion(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setNuevaDonacion(prev => ({ ...prev, fecha: date.toISOString().split('T')[0] }));
    }
  };

  const handleEditDateChange = (date: Date | undefined) => {
    setDate(date);
    if (editingDonacion && date) {
      setEditingDonacion(prev => ({ ...prev, fecha: date.toISOString().split('T')[0] }));
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDonacion) {
      actualizarDonacion({
        ...editingDonacion,
        cantidad: Number(editingDonacion.cantidad),
        tipo: editingDonacion.tipo as 'economica' | 'especie', // Ensure correct type
        metodo: editingDonacion.metodo as 'efectivo' | 'transferencia' | 'cheque' | 'otro',
        estado: editingDonacion.estado as 'pendiente' | 'completada' | 'cancelada'
      });
      closeModal();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    agregarDonacion({
      donadorId: nuevaDonacion.donadorId,
      fecha: nuevaDonacion.fecha,
      tipo: nuevaDonacion.tipo as 'economica' | 'especie', // Ensure correct type
      cantidad: Number(nuevaDonacion.cantidad),
      categoriaProducto: nuevaDonacion.categoriaProducto,
      metodo: nuevaDonacion.metodo as 'efectivo' | 'transferencia' | 'cheque' | 'otro',
      estado: nuevaDonacion.estado as 'pendiente' | 'completada' | 'cancelada',
      descripcion: nuevaDonacion.descripcion
    });
    
    setNuevaDonacion({
      donadorId: '',
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'economica',
      cantidad: 0,
      categoriaProducto: '',
      metodo: 'efectivo',
      estado: 'pendiente',
      descripcion: ''
    });
    closeModal();
  };

  const handleDelete = (id: string) => {
    eliminarDonacion(id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Donaciones</h1>
        <Button onClick={openModal}><Plus className="mr-2 h-4 w-4" /> Agregar Donación</Button>
      </div>

      <Table>
        <TableCaption>Lista de todas las donaciones realizadas.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donaciones.map((donacion) => (
            <TableRow key={donacion.id}>
              <TableCell>{donacion.fecha}</TableCell>
              <TableCell>{donacion.tipo}</TableCell>
              <TableCell>{donacion.cantidad}</TableCell>
              <TableCell>{donacion.metodo}</TableCell>
              <TableCell>{donacion.estado}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => openEditModal(donacion)}>
                  <Pencil className="mr-2 h-4 w-4" /> Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(donacion.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total donaciones: {donaciones.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar Donación</DialogTitle>
            <DialogDescription>
              Ingrese la información de la donación.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="donadorId">Donador ID</Label>
              <Input type="text" id="donadorId" name="donadorId" value={nuevaDonacion.donadorId} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label>Fecha de Donación</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={
                      "w-[280px] justify-start text-left font-normal" +
                      (date ? " text-foreground" : " text-muted-foreground")
                    }
                  >
                    {date ? format(date, "PPP", { locale: es }) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    disabled={(date) =>
                      date > new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo de Donación</Label>
              <Select name="tipo" value={nuevaDonacion.tipo} onValueChange={(value) => setNuevaDonacion(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Seleccione el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economica">Económica</SelectItem>
                  <SelectItem value="especie">Especie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input type="number" id="cantidad" name="cantidad" value={nuevaDonacion.cantidad} onChange={handleInputChange} />
            </div>
            {nuevaDonacion.tipo === 'especie' && (
              <div className="grid gap-2">
                <Label htmlFor="categoriaProducto">Categoría del Producto</Label>
                <Input type="text" id="categoriaProducto" name="categoriaProducto" value={nuevaDonacion.categoriaProducto} onChange={handleInputChange} />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="metodo">Método de Pago</Label>
              <Select name="metodo" value={nuevaDonacion.metodo} onValueChange={(value) => setNuevaDonacion(prev => ({ ...prev, metodo: value }))}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Seleccione el método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estado">Estado</Label>
              <Select name="estado" value={nuevaDonacion.estado} onValueChange={(value) => setNuevaDonacion(prev => ({ ...prev, estado: value }))}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Seleccione el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input type="textarea" id="descripcion" name="descripcion" value={nuevaDonacion.descripcion} onChange={handleInputChange} />
            </div>
            <DialogFooter>
              <Button type="submit">Agregar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Donación</DialogTitle>
            <DialogDescription>
              Edite la información de la donación.
            </DialogDescription>
          </DialogHeader>
          {editingDonacion && (
            <form onSubmit={handleEditSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="donadorId">Donador ID</Label>
                <Input type="text" id="donadorId" name="donadorId" value={editingDonacion.donadorId} onChange={handleEditInputChange} />
              </div>
              <div className="grid gap-2">
                <Label>Fecha de Donación</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={
                        "w-[280px] justify-start text-left font-normal" +
                        (date ? " text-foreground" : " text-muted-foreground")
                      }
                    >
                      {date ? format(date, "PPP", { locale: es }) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleEditDateChange}
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo de Donación</Label>
                <Select name="tipo" value={editingDonacion.tipo} onValueChange={(value) => setEditingDonacion(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economica">Económica</SelectItem>
                    <SelectItem value="especie">Especie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input type="number" id="cantidad" name="cantidad" value={editingDonacion.cantidad} onChange={handleEditInputChange} />
              </div>
              {editingDonacion.tipo === 'especie' && (
                <div className="grid gap-2">
                  <Label htmlFor="categoriaProducto">Categoría del Producto</Label>
                  <Input type="text" id="categoriaProducto" name="categoriaProducto" value={editingDonacion.categoriaProducto || ''} onChange={handleEditInputChange} />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="metodo">Método de Pago</Label>
                <Select name="metodo" value={editingDonacion.metodo} onValueChange={(value) => setEditingDonacion(prev => ({ ...prev, metodo: value }))}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Seleccione el método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Select name="estado" value={editingDonacion.estado} onValueChange={(value) => setEditingDonacion(prev => ({ ...prev, estado: value }))}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input type="textarea" id="descripcion" name="descripcion" value={editingDonacion.descripcion} onChange={handleEditInputChange} />
              </div>
              <DialogFooter>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Donaciones;
