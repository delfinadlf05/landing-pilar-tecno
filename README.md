# Biblioteca · Pilar Tecno (frontend en React)

Entregable Final del módulo de React (Pilar Tecno). Frontend completo para la **API de libros**
construida en el curso de Node.js (Express + MongoDB). Permite listar, crear, editar y eliminar libros,
prestarlos, devolverlos y buscarlos con filtros.

Stack: React 19 · TypeScript · Vite · react-bootstrap · axios · React Router · Formik + Yup.

## API que consume

Por defecto: `http://localhost:3000/libros`

| Acción en la interfaz | Método y ruta |
|---|---|
| Listar / buscar con filtros | `GET /libros/negocio/busqueda?autor=&categoria=&estado=` (sin filtros devuelve todos; 404 = sin resultados) |
| Crear libro | `POST /libros` |
| Editar libro | `PUT /libros/:id` |
| Eliminar libro | `DELETE /libros/:id` |
| Prestar (endpoint de negocio) | `PUT /libros/:id/prestar` |
| Devolver (endpoint de negocio) | `PUT /libros/:id/devolver` |

Un libro tiene: `_id`, `titulo`, `autor`, `categoria`, `estado` (`Disponible` | `Prestado` | `Vencido`),
`fechaPrestamo` y `fechaDevolucion`.

## Cómo correrlo en local

1. **Levantar la API** (repositorio de la API de libros) en el puerto 3000, conectada a MongoDB.
   La API tiene que permitir CORS para `http://localhost:5173` (paquete `cors`).
2. **Levantar este frontend:**

```bash
npm install
npm run dev
```

3. Abrir http://localhost:5173/

Si tu API corre en otra dirección, copiá `.env.example` como `.env` y cambiá `VITE_API_URL`.

## Estructura

```
src/
├── components/
│   ├── BarraNavegacion/        Navbar con Link (react-router)
│   ├── BotonColor/             Modal de react-bootstrap para elegir el color del título
│   ├── ListaLibros/            Estado y lógica del ABM, filtros y acciones de negocio
│   ├── LibroCard/              Tarjeta de un libro (estado, fechas, botones)
│   ├── FiltrosLibros/          Inputs de búsqueda por autor, categoría y estado
│   ├── ModalLibro/             Formulario con Formik y Yup (crear y editar)
│   └── ModalConfirmarEliminar/ Confirmación antes de borrar
├── pages/                      PaginaInicio, PaginaLibros, PaginaNoEncontrada
├── services/recursoService.ts  Todas las llamadas a la API (único lugar con axios)
├── types/Recurso.ts            Recurso, RecursoFormulario, FiltrosBusqueda
├── utils/mensajeError.ts
├── App.tsx                     Routes y Route
└── main.tsx                    BrowserRouter
```

## Checklist de la consigna

- **Conexión con la API:** axios en `services/`, tipos en `types/`, funciones `async/await` con manejo de errores, ningún componente usa axios.
- **React Router:** `BrowserRouter` en `main.tsx`, rutas en `App.tsx`, páginas en `pages/`, navegación con `Link` / `as={Link}`.
- **ABM:** alta con Formik + Yup, listado con estados cargando / error / datos, edición reutilizando el mismo modal, baja siempre con modal de confirmación. La pantalla se actualiza sin recargar.
- **Endpoints de negocio:** botones Prestar y Devolver (según el estado del libro) y filtros de búsqueda con debounce.

No incluye login, Context ni rutas privadas (fuera de esta entrega).
