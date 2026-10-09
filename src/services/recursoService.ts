import axios from "axios";
import type { Recurso } from "../types/Recurso";

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
