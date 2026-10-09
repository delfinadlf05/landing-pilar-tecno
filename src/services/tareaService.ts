import axios from "axios";
import type { Tarea, TareaFormulario, FiltrosBusqueda } from "../types/Tarea";

// Dirección de la API de tareas (curso de Node.js). Se puede cambiar con la
// variable VITE_API_URL en un archivo .env (ver .env.example).
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/tareas";

// La API pide un token en el header Authorization para CREAR tareas.
// Se lee de VITE_API_TOKEN (archivo .env, que no se sube a GitHub).
const TOKEN = import.meta.env.VITE_API_TOKEN;

// Convierte cualquier error de axios en un Error con un mensaje claro.
// La API responde { error: "..." } (o { mensaje: "..." } desde el middleware de token).
const lanzarError = (error: unknown, mensajePorDefecto: string): never => {
  if (axios.isAxiosError(error)) {
    const datos = error.response?.data;
    const detalle = datos?.error ?? datos?.mensaje ?? datos?.message;
    throw new Error(typeof detalle === "string" ? detalle : mensajePorDefecto);
  }
  throw new Error(mensajePorDefecto);
};

export const obtenerTareas = async (
  filtros: FiltrosBusqueda,
): Promise<Tarea[]> => {
  try {
    const respuesta = await axios.get(BASE_URL, { params: filtros });
    return respuesta.data;
  } catch (error) {
    return lanzarError(error, "No se pudieron cargar las tareas");
  }
};

export const crearTarea = async (datos: TareaFormulario): Promise<Tarea> => {
  try {
    const respuesta = await axios.post(BASE_URL, datos, {
      headers: TOKEN ? { Authorization: TOKEN } : {},
    });
    return respuesta.data;
  } catch (error) {
    return lanzarError(error, "No se pudo crear la tarea");
  }
};

export const actualizarTarea = async (
  id: string,
  datos: TareaFormulario,
): Promise<Tarea> => {
  try {
    const respuesta = await axios.put(`${BASE_URL}/${id}`, datos);
    return respuesta.data;
  } catch (error) {
    return lanzarError(error, "No se pudo actualizar la tarea");
  }
};

export const eliminarTarea = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    lanzarError(error, "No se pudo eliminar la tarea");
  }
};
