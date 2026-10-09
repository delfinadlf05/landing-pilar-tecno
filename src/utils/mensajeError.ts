// Devuelve el mensaje de un error, o uno por defecto si no es un Error común.
export const mensajeError = (error: unknown, mensajePorDefecto: string): string =>
  error instanceof Error ? error.message : mensajePorDefecto;
