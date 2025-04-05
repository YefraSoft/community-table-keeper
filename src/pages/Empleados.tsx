import React, { useState, useEffect } from 'react';
import { Empleado } from '@/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

const Empleados = () => {
  const { empleados, agregarEmpleado, actualizarEmpleado, eliminarEmpleado } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombreCompleto: '',
    puesto: '',
    turnoLaboral: '',
    contactoEmergencia: '',
    salario: 0,
    estadoLaboral: 'activo',
    fechaContratacion: new Date(),
  });
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmpleado(null);
  };

  const handleEdit = (empleado: Empleado) => {
    setEditingEmpleado(empleado);
    setNuevoEmpleado({
      nombreCompleto: empleado.nombreCompleto,
      puesto: empleado.puesto,
      turnoLaboral: empleado.turnoLaboral,
      contactoEmergencia: empleado.contactoEmergencia,
      salario: empleado.salario,
      estadoLaboral: empleado.estadoLaboral,
      fechaContratacion: new Date(empleado.fechaContratacion),
    });
    setDate(new Date(empleado.fechaContratacion));
    openModal();
  };

  const handleDelete = (id: string) => {
    eliminarEmpleado(id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoEmpleado(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmpleado) {
      actualizarEmpleado({
        ...editingEmpleado,
        salario: Number(nuevoEmpleado.salario),
        estadoLaboral: nuevoEmpleado.estadoLaboral as 'activo' | 'inactivo' | 'licencia' // Ensure correct type
      });
      closeModal();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    agregarEmpleado({
      nombreCompleto: nuevoEmpleado.nombreCompleto,
      puesto: nuevoEmpleado.puesto,
      turnoLaboral: nuevoEmpleado.turnoLaboral,
      contactoEmergencia: nuevoEmpleado.contactoEmergencia,
      salario: Number(nuevoEmpleado.salario),
      estadoLaboral: nuevoEmpleado.estadoLaboral as 'activo' | 'inactivo' | 'licencia', // Ensure correct type
      fechaContratacion: date?.toISOString() || new Date().toISOString()
    });
    closeModal();
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">Empleados</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Agregar Empleado</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar Empleado</DialogTitle>
              <DialogDescription>
                Añade un nuevo empleado a la base de datos.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombreCompleto">Nombre Completo</Label>
                <Input type="text" id="nombreCompleto" name="nombreCompleto" value={nuevoEmpleado.nombreCompleto} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="puesto">Puesto</Label>
                <Input type="text" id="puesto" name="puesto" value={nuevoEmpleado.puesto} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="turnoLaboral">Turno Laboral</Label>
                <Input type="text" id="turnoLaboral" name="turnoLaboral" value={nuevoEmpleado.turnoLaboral} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactoEmergencia">Contacto de Emergencia</Label>
                <Input type="text" id="contactoEmergencia" name="contactoEmergencia" value={nuevoEmpleado.contactoEmergencia} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="salario">Salario</Label>
                <Input type="number" id="salario" name="salario" value={nuevoEmpleado.salario} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estadoLaboral">Estado Laboral</Label>
                <Select value={nuevoEmpleado.estadoLaboral} onValueChange={(value) => setNuevoEmpleado(prevState => ({ ...prevState, estadoLaboral: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="licencia">Licencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Fecha de Contratación</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit">Guardar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>Lista de empleados de la organización.</TableCaption>
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
          {empleados.map((empleado) => (
            <TableRow key={empleado.id}>
              <TableCell>{empleado.nombreCompleto}</TableCell>
              <TableCell>{empleado.puesto}</TableCell>
              <TableCell>{empleado.turnoLaboral}</TableCell>
              <TableCell>{empleado.salario}</TableCell>
              <TableCell>{empleado.estadoLaboral}</TableCell>
              <TableCell className="text-right font-medium">
                <Button variant="secondary" size="sm" onClick={() => handleEdit(empleado)}>Editar</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(empleado.id)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      <Dialog open={editingEmpleado !== null} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Empleado</DialogTitle>
            <DialogDescription>
              Edita la información del empleado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombreCompleto">Nombre Completo</Label>
              <Input type="text" id="nombreCompleto" name="nombreCompleto" value={nuevoEmpleado.nombreCompleto} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="puesto">Puesto</Label>
              <Input type="text" id="puesto" name="puesto" value={nuevoEmpleado.puesto} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="turnoLaboral">Turno Laboral</Label>
              <Input type="text" id="turnoLaboral" name="turnoLaboral" value={nuevoEmpleado.turnoLaboral} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactoEmergencia">Contacto de Emergencia</Label>
              <Input type="text" id="contactoEmergencia" name="contactoEmergencia" value={nuevoEmpleado.contactoEmergencia} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="salario">Salario</Label>
              <Input type="number" id="salario" name="salario" value={nuevoEmpleado.salario} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estadoLaboral">Estado Laboral</Label>
              <Select value={nuevoEmpleado.estadoLaboral} onValueChange={(value) => setNuevoEmpleado(prevState => ({ ...prevState, estadoLaboral: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="licencia">Licencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Fecha de Contratación</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date > new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit">Guardar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Empleados;
