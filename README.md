# Gestor de tareas · Pilar Tecno (frontend en React)

Entregable Final del módulo de React (Pilar Tecno). Frontend completo para **mi API
`integrador-tareas`** (Node.js + Express + MongoDB, construida en el curso de Node.js).
Permite listar, crear, editar y eliminar tareas, completarlas y reabrirlas, filtrarlas y ver un resumen.

Stack: React 19 · TypeScript · Vite · react-bootstrap · axios · React Router · Formik + Yup.

## API que consume

Por defecto: `http://localhost:3000/api/tareas`

| Acción en la interfaz | Método y ruta |
|---|---|
| Listar y filtrar | `GET /api/tareas?prioridad=&completada=&q=` |
| Crear tarea | `POST /api/tareas` (con el token en el header `Authorization`) |
| Editar tarea | `PUT /api/tareas/:id` |
| Eliminar tarea | `DELETE /api/tareas/:id` |
| Completar (endpoint de negocio) | `PUT /api/tareas/:id/completar` |
| Reabrir (endpoint de negocio) | `PUT /api/tareas/:id/reabrir` |
| Panel de resumen (endpoint de negocio) | `GET /api/tareas/resumen` |

Una tarea tiene: `_id`, `titulo`, `descripcion`, `completada`, `prioridad` (`baja` | `media` | `alta`)
y `fechaCompletada`.

## Cómo correrlo en local

1. **Levantar la API** (repositorio `integrador-tareas`): `npm install` y `npm run dev`.
   Necesita su `.env` con `MONGO_URI` y `TOKEN_SECRETO`. CORS ya permite `http://localhost:5173`.
2. **Configurar el frontend:** copiar `.env.example` como `.env` y poner en `VITE_API_TOKEN`
   el mismo valor que `TOKEN_SECRETO` de la API.
3. **Levantar el frontend:**

```bash
npm install
npm run dev
```

4. Abrir http://localhost:5173/

## Estructura

```
src/
├── components/
│   ├── BarraNavegacion/        Navbar con Link (react-router)
│   ├── BotonColor/             Modal de react-bootstrap para elegir el color del título
│   ├── ListaTareas/            Estado y lógica del ABM, filtros y acciones de negocio
│   ├── TareaCard/              Tarjeta de una tarea (prioridad, estado, botones)
│   ├── FiltrosTareas/          Búsqueda por título, prioridad y estado
│   ├── PanelResumen/           Totales que vienen del endpoint /resumen
│   ├── ModalTarea/             Formulario con Formik y Yup (crear y editar)
│   └── ModalConfirmarEliminar/ Confirmación antes de borrar
├── pages/                      PaginaInicio, PaginaTareas, PaginaNoEncontrada
├── services/tareaService.ts    Todas las llamadas a la API (único lugar con axios)
├── types/Tarea.ts              Tarea, TareaFormulario, FiltrosBusqueda, Resumen
├── utils/mensajeError.ts
├── App.tsx                     Routes y Route
└── main.tsx                    BrowserRouter
```

## Checklist de la consigna

- **Conexión con la API:** axios en `services/`, tipos en `types/`, funciones `async/await` con manejo de errores; ningún componente usa axios.
- **React Router:** `BrowserRouter` en `main.tsx`, rutas en `App.tsx`, páginas en `pages/`, navegación con `Link`.
- **ABM:** alta con Formik + Yup, listado con estados cargando / error / datos, edición reutilizando el mismo modal, baja siempre con modal de confirmación. La pantalla se actualiza sin recargar.
- **Endpoints de negocio:** botones Completar y Reabrir (con las reglas de la API: no se puede completar dos veces, ni reabrir una pendiente), panel de resumen y filtros de búsqueda con debounce.

No incluye login, Context ni rutas privadas (fuera de esta entrega).
