export type Recurso = {
  _id: string;
  titulo: string;
  autor: string;
  categoria: string;
  estado: "Disponible" | "Prestado" | "Vencido";
  fechaPrestamo?: string | null;
  fechaDevolucion?: string | null;
};

// Lo que maneja el formulario de crear/editar: sin _id ni fechas,
// porque esos campos los generan MongoDB y los endpoints de prestar/devolver.
export type RecursoFormulario = Pick<
  Recurso,
  "titulo" | "autor" | "categoria" | "estado"
>;

// Filtros del endpoint de búsqueda. Vacío ("") significa "sin filtrar".
export type FiltrosBusqueda = {
  autor: string;
  categoria: string;
  estado: string;
};
