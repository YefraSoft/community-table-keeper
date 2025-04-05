import React, { useState, useEffect } from 'react';
import { ArticuloInventario } from '@/types';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from 'sonner';
import { MoreVertical, Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Inventario = () => {
  const { inventario, agregarArticuloInventario, actualizarArticuloInventario, eliminarArticuloInventario } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoArticulo, setNuevoArticulo] = useState<Omit<ArticuloInventario, 'id'>>({
    nombre: '',
    categoria: '',
    cantidad: 0,
    fechaIngreso: new Date().toISOString().split('T')[0],
    estado: 'nuevo',
    descripcion: ''
  });
  const [editingArticulo, setEditingArticulo] = useState<ArticuloInventario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventario, setFilteredInventario] = useState<ArticuloInventario[]>(inventario);

  useEffect(() => {
    setFilteredInventario(
      inventario.filter(articulo =>
        articulo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        articulo.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, inventario]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingArticulo(null);
    setNuevoArticulo({
      nombre: '',
      categoria: '',
      cantidad: 0,
      fechaIngreso: new Date().toISOString().split('T')[0],
      estado: 'nuevo',
      descripcion: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevoArticulo({
      ...nuevoArticulo,
      [name]: value
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingArticulo(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditingArticulo(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSelectChange = (name: string, value: string) => {
    setNuevoArticulo({
      ...nuevoArticulo,
      [name]: value
    });
  };

  const handleEdit = (articulo: ArticuloInventario) => {
    setEditingArticulo(articulo);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    eliminarArticuloInventario(id);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticulo) {
      actualizarArticuloInventario({
        ...editingArticulo,
        cantidad: Number(editingArticulo.cantidad),
        estado: editingArticulo.estado as 'nuevo' | 'usado' // Ensure correct type
      });
      closeModal();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    agregarArticuloInventario({
      nombre: nuevoArticulo.nombre,
      categoria: nuevoArticulo.categoria,
      cantidad: Number(nuevoArticulo.cantidad),
      fechaIngreso: nuevoArticulo.fechaIngreso,
      estado: nuevoArticulo.estado as 'nuevo' | 'usado', // Ensure correct type
      descripcion: nuevoArticulo.descripcion
    });
    closeModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventario</h1>
        <Button onClick={openModal}>Agregar Artículo</Button>
      </div>
      <Input
        type="text"
        placeholder="Buscar artículo..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <Table>
        <TableCaption>Lista de artículos en el inventario.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Acciones</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Fecha de Ingreso</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Descripción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInventario.map((articulo) => (
            <TableRow key={articulo.id}>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEdit(articulo)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(articulo.id)}>
                      <Trash className="mr-2 h-4 w-4" /> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>{articulo.nombre}</TableCell>
              <TableCell>{articulo.categoria}</TableCell>
              <TableCell>{articulo.cantidad}</TableCell>
              <TableCell>{articulo.fechaIngreso}</TableCell>
              <TableCell>
                <Badge variant={articulo.estado === 'nuevo' ? 'default' : 'secondary'}>
                  {articulo.estado}
                </Badge>
              </TableCell>
              <TableCell>{articulo.descripcion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              Total de artículos: {inventario.reduce((acc, item) => acc + item.cantidad, 0)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingArticulo ? 'Editar Artículo' : 'Agregar Artículo'}</DialogTitle>
            <DialogDescription>
              {editingArticulo ? 'Edita la información del artículo.' : 'Agrega un nuevo artículo al inventario.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                type="text"
                id="nombre"
                name="nombre"
                value={editingArticulo ? editingArticulo.nombre : nuevoArticulo.nombre}
                onChange={editingArticulo ? handleEditInputChange : handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria" className="text-right">
                Categoría
              </Label>
              <Input
                type="text"
                id="categoria"
                name="categoria"
                value={editingArticulo ? editingArticulo.categoria : nuevoArticulo.categoria}
                onChange={editingArticulo ? handleEditInputChange : handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cantidad" className="text-right">
                Cantidad
              </Label>
              <Input
                type="number"
                id="cantidad"
                name="cantidad"
                value={editingArticulo ? editingArticulo.cantidad : nuevoArticulo.cantidad}
                onChange={editingArticulo ? handleEditInputChange : handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaIngreso" className="text-right">
                Fecha de Ingreso
              </Label>
              <Input
                type="date"
                id="fechaIngreso"
                name="fechaIngreso"
                value={editingArticulo ? editingArticulo.fechaIngreso : nuevoArticulo.fechaIngreso}
                onChange={editingArticulo ? handleEditInputChange : handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">
                Estado
              </Label>
              <Select onValueChange={(value) => editingArticulo ? handleEditSelectChange('estado', value) : handleSelectChange('estado', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona un estado" defaultValue={editingArticulo ? editingArticulo.estado : nuevoArticulo.estado} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="usado">Usado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">
                Descripción
              </Label>
              <Input
                type="textarea"
                id="descripcion"
                name="descripcion"
                value={editingArticulo ? editingArticulo.descripcion : nuevoArticulo.descripcion}
                onChange={editingArticulo ? handleEditInputChange : handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <Button type="submit" onClick={editingArticulo ? handleEditSubmit : handleFormSubmit}>
            {editingArticulo ? 'Actualizar Artículo' : 'Agregar Artículo'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventario;
