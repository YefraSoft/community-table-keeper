
// Tipo para donadores
export interface Donador {
  id: string;
  nombreCompleto: string;
  direccion: string;
  telefono: string;
  correo: string;
  historialDonaciones: Donacion[];
  fechaRegistro: string;
}

// Tipo para donaciones
export interface Donacion {
  id: string;
  donadorId: string;
  nombreDonador?: string; // Campo opcional para mostrar en la UI
  fecha: string;
  tipo: 'economica' | 'especie';
  cantidad: number;
  categoriaProducto?: string; // Solo aplica si es en especie
  metodo: 'efectivo' | 'transferencia' | 'cheque' | 'otro';
  estado: 'pendiente' | 'completada' | 'cancelada';
  descripcion?: string;
}

// Tipo para artículos de inventario
export interface ArticuloInventario {
  id: string;
  nombre: string;
  categoria: string;
  cantidad: number;
  fechaIngreso: string;
  estado: 'nuevo' | 'usado';
  descripcion?: string;
  donacionId?: string;
}

// Tipo para empleados
export interface Empleado {
  id: string;
  nombreCompleto: string;
  puesto: string;
  turnoLaboral: string;
  contactoEmergencia: string;
  salario: number;
  estadoLaboral: 'activo' | 'inactivo' | 'licencia';
  fechaContratacion: string;
}

// Tipo para estadísticas del dashboard
export interface EstadisticasDashboard {
  totalDonadores: number;
  totalDonaciones: number;
  totalEconomicas: number;
  totalEspecie: number;
  totalInventario: number;
  totalEmpleados: number;
  empleadosActivos: number;
}
