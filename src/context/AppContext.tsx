
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Donador, Donacion, ArticuloInventario, Empleado, EstadisticasDashboard } from '@/types';
import { toast } from '@/components/ui/sonner';

interface AppContextType {
  donadores: Donador[];
  donaciones: Donacion[];
  inventario: ArticuloInventario[];
  empleados: Empleado[];
  estadisticas: EstadisticasDashboard;
  
  // CRUD Donadores
  agregarDonador: (donador: Omit<Donador, 'id' | 'historialDonaciones' | 'fechaRegistro'>) => void;
  actualizarDonador: (donador: Donador) => void;
  eliminarDonador: (id: string) => void;
  
  // CRUD Donaciones
  agregarDonacion: (donacion: Omit<Donacion, 'id'>) => void;
  actualizarDonacion: (donacion: Donacion) => void;
  eliminarDonacion: (id: string) => void;
  
  // CRUD Inventario
  agregarArticuloInventario: (articulo: Omit<ArticuloInventario, 'id'>) => void;
  actualizarArticuloInventario: (articulo: ArticuloInventario) => void;
  eliminarArticuloInventario: (id: string) => void;
  
  // CRUD Empleados
  agregarEmpleado: (empleado: Omit<Empleado, 'id'>) => void;
  actualizarEmpleado: (empleado: Empleado) => void;
  eliminarEmpleado: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe ser usado dentro de un AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [donadores, setDonadores] = useState<Donador[]>([]);
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [inventario, setInventario] = useState<ArticuloInventario[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  
  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedDonadores = localStorage.getItem('donadores');
    const storedDonaciones = localStorage.getItem('donaciones');
    const storedInventario = localStorage.getItem('inventario');
    const storedEmpleados = localStorage.getItem('empleados');
    
    if (storedDonadores) setDonadores(JSON.parse(storedDonadores));
    if (storedDonaciones) setDonaciones(JSON.parse(storedDonaciones));
    if (storedInventario) setInventario(JSON.parse(storedInventario));
    if (storedEmpleados) setEmpleados(JSON.parse(storedEmpleados));
  }, []);
  
  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('donadores', JSON.stringify(donadores));
  }, [donadores]);
  
  useEffect(() => {
    localStorage.setItem('donaciones', JSON.stringify(donaciones));
  }, [donaciones]);
  
  useEffect(() => {
    localStorage.setItem('inventario', JSON.stringify(inventario));
  }, [inventario]);
  
  useEffect(() => {
    localStorage.setItem('empleados', JSON.stringify(empleados));
  }, [empleados]);
  
  // Calcular estadísticas para el dashboard
  const estadisticas: EstadisticasDashboard = {
    totalDonadores: donadores.length,
    totalDonaciones: donaciones.length,
    totalEconomicas: donaciones.filter(d => d.tipo === 'economica').length,
    totalEspecie: donaciones.filter(d => d.tipo === 'especie').length,
    totalInventario: inventario.reduce((acc, item) => acc + item.cantidad, 0),
    totalEmpleados: empleados.length,
    empleadosActivos: empleados.filter(e => e.estadoLaboral === 'activo').length
  };
  
  // CRUD para Donadores
  const agregarDonador = (donador: Omit<Donador, 'id' | 'historialDonaciones' | 'fechaRegistro'>) => {
    const nuevoDonador: Donador = {
      ...donador,
      id: crypto.randomUUID(),
      historialDonaciones: [],
      fechaRegistro: new Date().toISOString(),
    };
    setDonadores([...donadores, nuevoDonador]);
    toast.success('Donador agregado con éxito');
  };
  
  const actualizarDonador = (donador: Donador) => {
    setDonadores(donadores.map(d => d.id === donador.id ? donador : d));
    toast.success('Donador actualizado con éxito');
  };
  
  const eliminarDonador = (id: string) => {
    setDonadores(donadores.filter(d => d.id !== id));
    toast.success('Donador eliminado con éxito');
  };
  
  // CRUD para Donaciones
  const agregarDonacion = (donacion: Omit<Donacion, 'id'>) => {
    const nuevaDonacion: Donacion = {
      ...donacion,
      id: crypto.randomUUID()
    };
    
    setDonaciones([...donaciones, nuevaDonacion]);
    
    // Si es una donación en especie, agregar al inventario
    if (donacion.tipo === 'especie' && donacion.categoriaProducto) {
      agregarArticuloInventario({
        nombre: donacion.categoriaProducto,
        categoria: donacion.categoriaProducto,
        cantidad: donacion.cantidad,
        fechaIngreso: donacion.fecha,
        estado: 'nuevo',
        descripcion: donacion.descripcion,
        donacionId: nuevaDonacion.id
      });
    }
    
    // Actualizar el historial de donaciones del donador
    const donadorActualizado = donadores.find(d => d.id === donacion.donadorId);
    if (donadorActualizado) {
      donadorActualizado.historialDonaciones = [
        ...donadorActualizado.historialDonaciones,
        nuevaDonacion
      ];
      actualizarDonador(donadorActualizado);
    }
    
    toast.success('Donación registrada con éxito');
  };
  
  const actualizarDonacion = (donacion: Donacion) => {
    setDonaciones(donaciones.map(d => d.id === donacion.id ? donacion : d));
    
    // Actualizar el inventario si es necesario
    if (donacion.tipo === 'especie') {
      const articuloRelacionado = inventario.find(a => a.donacionId === donacion.id);
      if (articuloRelacionado) {
        actualizarArticuloInventario({
          ...articuloRelacionado,
          nombre: donacion.categoriaProducto || articuloRelacionado.nombre,
          categoria: donacion.categoriaProducto || articuloRelacionado.categoria,
          cantidad: donacion.cantidad,
          descripcion: donacion.descripcion || articuloRelacionado.descripcion
        });
      }
    }
    
    // Actualizar el historial de donaciones del donador
    const donadorActualizado = donadores.find(d => d.id === donacion.donadorId);
    if (donadorActualizado) {
      donadorActualizado.historialDonaciones = donadorActualizado.historialDonaciones.map(
        d => d.id === donacion.id ? donacion : d
      );
      actualizarDonador(donadorActualizado);
    }
    
    toast.success('Donación actualizada con éxito');
  };
  
  const eliminarDonacion = (id: string) => {
    const donacion = donaciones.find(d => d.id === id);
    
    if (donacion) {
      // Eliminar del inventario si es necesario
      if (donacion.tipo === 'especie') {
        const articuloRelacionado = inventario.find(a => a.donacionId === id);
        if (articuloRelacionado) {
          eliminarArticuloInventario(articuloRelacionado.id);
        }
      }
      
      // Actualizar el historial de donaciones del donador
      const donadorActualizado = donadores.find(d => d.id === donacion.donadorId);
      if (donadorActualizado) {
        donadorActualizado.historialDonaciones = donadorActualizado.historialDonaciones.filter(
          d => d.id !== id
        );
        actualizarDonador(donadorActualizado);
      }
    }
    
    setDonaciones(donaciones.filter(d => d.id !== id));
    toast.success('Donación eliminada con éxito');
  };
  
  // CRUD para Inventario
  const agregarArticuloInventario = (articulo: Omit<ArticuloInventario, 'id'>) => {
    const nuevoArticulo: ArticuloInventario = {
      ...articulo,
      id: crypto.randomUUID()
    };
    setInventario([...inventario, nuevoArticulo]);
    toast.success('Artículo agregado al inventario');
  };
  
  const actualizarArticuloInventario = (articulo: ArticuloInventario) => {
    setInventario(inventario.map(a => a.id === articulo.id ? articulo : a));
    toast.success('Artículo actualizado en el inventario');
  };
  
  const eliminarArticuloInventario = (id: string) => {
    setInventario(inventario.filter(a => a.id !== id));
    toast.success('Artículo eliminado del inventario');
  };
  
  // CRUD para Empleados
  const agregarEmpleado = (empleado: Omit<Empleado, 'id'>) => {
    const nuevoEmpleado: Empleado = {
      ...empleado,
      id: crypto.randomUUID()
    };
    setEmpleados([...empleados, nuevoEmpleado]);
    toast.success('Empleado agregado con éxito');
  };
  
  const actualizarEmpleado = (empleado: Empleado) => {
    setEmpleados(empleados.map(e => e.id === empleado.id ? empleado : e));
    toast.success('Información del empleado actualizada');
  };
  
  const eliminarEmpleado = (id: string) => {
    setEmpleados(empleados.filter(e => e.id !== id));
    toast.success('Empleado eliminado con éxito');
  };
  
  return (
    <AppContext.Provider value={{
      donadores,
      donaciones,
      inventario,
      empleados,
      estadisticas,
      agregarDonador,
      actualizarDonador,
      eliminarDonador,
      agregarDonacion,
      actualizarDonacion,
      eliminarDonacion,
      agregarArticuloInventario,
      actualizarArticuloInventario,
      eliminarArticuloInventario,
      agregarEmpleado,
      actualizarEmpleado,
      eliminarEmpleado
    }}>
      {children}
    </AppContext.Provider>
  );
};
