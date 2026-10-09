export type Prioridad = "baja" | "media" | "alta";

export type Tarea = {
  _id: string;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  prioridad: Prioridad;
  fechaCompletada?: string | null;
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
