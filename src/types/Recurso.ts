export type Recurso = {
  _id: string;
  titulo: string;
  autor: string;
  categoria: string;
  estado: "Disponible" | "Prestado" | "Vencido";
  fechaPrestamo?: string;
  fechaDevolucion?: string;
};

// Lo que maneja el formulario de crear/editar: sin _id ni fechas,
// porque esos campos los generan MongoDB y los endpoints de prestar/devolver.
export type RecursoFormulario = Pick<
  Recurso,
  "titulo" | "autor" | "categoria" | "estado"
>;
