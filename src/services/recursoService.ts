import axios from "axios";
import type {
  Recurso,
  RecursoFormulario,
  FiltrosBusqueda,
} from "../types/Recurso";

// Dirección de la API de libros (curso de Node.js). Se puede cambiar con la
// variable VITE_API_URL en un archivo .env (ver .env.example).
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/libros";

// Convierte cualquier error de axios en un Error con un mensaje claro.
// Si la API manda un "message", se usa; si no, el mensaje por defecto.
const lanzarError = (error: unknown, mensajePorDefecto: string): never => {
  if (axios.isAxiosError(error)) {
    const detalle = error.response?.data?.message;
    throw new Error(typeof detalle === "string" ? detalle : mensajePorDefecto);
  }
  throw new Error(mensajePorDefecto);
};

export const obtenerRecursos = async (): Promise<Recurso[]> => {
  try {
    const respuesta = await axios.get(BASE_URL);
    return respuesta.data;
  } catch (error) {
    return lanzarError(error, "No se pudieron cargar los libros");
  }
};

export const crearRecurso = async (
  datos: RecursoFormulario,
): Promise<Recurso> => {
  try {
    const respuesta = await axios.post(BASE_URL, datos);
    return respuesta.data;
  } catch (error) {
    return lanzarError(error, "No se pudo crear el libro");
  }
};

export const actualizarRecurso = async (
  id: string,
  datos: RecursoFormulario,
): Promise<Recurso> => {
  try {
    const respuesta = await axios.put(`${BASE_URL}/${id}`, datos);
    return respuesta.data;
  } catch (error) {
    return lanzarError(error, "No se pudo actualizar el libro");
  }
};

export const eliminarRecurso = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    lanzarError(error, "No se pudo eliminar el libro");
  }
};

// ---- Endpoints de negocio ----

export const prestarRecurso = async (id: string): Promise<Recurso> => {
  try {
    const respuesta = await axios.put(`${BASE_URL}/${id}/prestar`);
    return respuesta.data;
  } catch (error) {
    return lanzarError(error, "No se pudo prestar el libro");
  }
};

export const devolverRecurso = async (id: string): Promise<Recurso> => {
  try {
    const respuesta = await axios.put(`${BASE_URL}/${id}/devolver`);
    return respuesta.data;
  } catch (error) {
    return lanzarError(error, "No se pudo devolver el libro");
  }
};

export const buscarRecursos = async (
  filtros: FiltrosBusqueda,
): Promise<Recurso[]> => {
  try {
    const respuesta = await axios.get(`${BASE_URL}/negocio/busqueda`, {
      params: filtros,
    });
    return respuesta.data;
  } catch (error) {
    // La API responde 404 cuando ningún libro coincide: no es un error real.
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    return lanzarError(error, "No se pudieron cargar los libros");
  }
};
