export type Prioridad = "baja" | "media" | "alta";

// Refleja lo que la API manda de verdad:
// - fechaCompletada es null mientras la tarea está pendiente.
// - descripcion y usuario pueden no venir (no son obligatorios en el modelo).
export type Tarea = {
  _id: string;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  prioridad: Prioridad;
  fechaCompletada?: string | null;
  usuario?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

// Lo que maneja el formulario de crear/editar. "completada" y la fecha no
// van acá: las cambian los endpoints de negocio (completar / reabrir).
export type TareaFormulario = {
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
};

// Filtros del listado. Vacío ("") significa "sin filtrar".
// completada es "" | "true" | "false" porque viaja como query string.
export type FiltrosBusqueda = {
  q: string;
  prioridad: string;
  completada: string;
};

// Respuesta de GET /api/tareas/resumen
export type Resumen = {
  total: number;
  completadas: number;
  pendientes: number;
  pendientesAltaPrioridad: number;
  porPrioridad: Record<Prioridad, number>;
};
