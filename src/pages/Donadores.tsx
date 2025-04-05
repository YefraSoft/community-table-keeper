
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Donador } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const Donadores = () => {
  const { donadores, agregarDonador, actualizarDonador, eliminarDonador } = useAppContext();
  const { toast } = useToast();
  const [busqueda, setBusqueda] = useState("");
  const [editandoDonador, setEditandoDonador] = useState<Donador | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    direccion: "",
    telefono: "",
    correo: "",
  });

  const resetForm = () => {
    setFormData({
      nombreCompleto: "",
      direccion: "",
      telefono: "",
      correo: "",
    });
    setEditandoDonador(null);
  };

  const donadoresFiltrados = donadores.filter(donador => 
    donador.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
    donador.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEdit = (donador: Donador) => {
    setEditandoDonador(donador);
    setFormData({
      nombreCompleto: donador.nombreCompleto,
      direccion: donador.direccion,
      telefono: donador.telefono,
      correo: donador.correo,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este donador? Esta acción no se puede deshacer.")) {
      eliminarDonador(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombreCompleto || !formData.correo) {
      toast({
        title: "Error",
        description: "Los campos de nombre y correo son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    if (editandoDonador) {
      actualizarDonador({
        ...editandoDonador,
        ...formData
      });
    } else {
      agregarDonador(formData);
    }

    setDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donadores</h1>
          <p className="text-muted-foreground">
            Gestiona el registro de donadores del comedor
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Donador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editandoDonador ? "Editar Donador" : "Registrar Nuevo Donador"}
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
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  required
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
                  {editandoDonador ? "Actualizar" : "Guardar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar donador..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Donadores</CardTitle>
        </CardHeader>
        <CardContent>
          {donadores.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay donadores registrados.</p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Registrar el primer donador
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donadoresFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-16 text-center">
                        No se encontraron resultados para "{busqueda}"
                      </TableCell>
                    </TableRow>
                  ) : (
                    donadoresFiltrados.map((donador) => (
                      <TableRow key={donador.id}>
                        <TableCell>{donador.nombreCompleto}</TableCell>
                        <TableCell>{donador.correo}</TableCell>
                        <TableCell>{donador.telefono}</TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(donador)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(donador.id)}>
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

export default Donadores;
