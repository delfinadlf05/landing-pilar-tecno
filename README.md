# Gestor de tareas · Pilar Tecno (frontend en React)

Entregable Final del módulo de React (Pilar Tecno). Frontend completo para **mi API
`integrador-tareas`** (Node.js + Express + MongoDB, construida en el curso de Node.js).
Permite listar, crear, editar y eliminar tareas, completarlas y reabrirlas, filtrarlas y ver un resumen.

Stack: React 19 · TypeScript · Vite · react-bootstrap · axios · React Router · Formik + Yup.

## Cómo se conecta todo

```
Este front (React + Vite)  →  API integrador-tareas (Node + Express)  →  MongoDB Atlas
   localhost:5173               localhost:3000 (o el puerto de tu .env)     base en la nube
```

El front **no habla con la base de datos**: usa `axios` para llamar a la API, siempre desde
[`src/services/tareaService.ts`](src/services/tareaService.ts). Por eso **primero hay que levantar la API**
y después el front.

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
y `fechaCompletada` (`null` mientras está pendiente).

## Cómo correrlo en local

1. **Levantar la API** (repositorio `integrador-tareas`): `npm install` y `npm run dev`.
   Necesita su `.env` con `MONGO_URI` y `TOKEN_SECRETO`. CORS ya permite `http://localhost:5173`.
2. **Configurar el frontend:** copiar `.env.example` como `.env` y completarlo:
   - `VITE_API_TOKEN`: el mismo valor que `TOKEN_SECRETO` de la API.
   - `VITE_API_URL`: solo si la API corre en otro puerto (por ejemplo `http://localhost:3001/api/tareas`).
3. **Levantar el frontend:**

```bash
npm install
npm run dev
```

4. Abrir http://localhost:5173/

### Otros comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en vivo |
| `npm run build` | Chequea tipos con TypeScript y genera `dist/` |
| `npm run lint` | Revisa el código con ESLint |

## Dependencias: qué es cada una

| Paquete | Para qué se usa |
|---|---|
| `react`, `react-dom` | La librería para armar la interfaz con componentes |
| `react-router-dom` | Navegación entre páginas (inicio y tareas) sin recargar |
| `axios` | Pedidos HTTP a la API (GET, POST, PUT, DELETE) |
| `bootstrap`, `react-bootstrap` | Estilos y componentes ya hechos (botones, modales, grilla, formularios) |
| `formik` | Manejo del formulario (valores, envío, errores) |
| `yup` | Reglas de validación del formulario |
| `vite` | Levanta y empaqueta el proyecto |
| `typescript` | JavaScript con tipos, para detectar errores antes de ejecutar |

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
- **Endpoints de negocio:** botones Completar y Reabrir, panel de resumen y filtros de búsqueda con debounce.

### Checklist de los endpoints de negocio

- Todos los endpoints de negocio de la API funcionan desde la interfaz (completar, reabrir y resumen).
- Cada función vive en el service: ningún componente llama a axios directo.
- El type refleja lo que la API manda de verdad, incluido el `null` de `fechaCompletada`.
- Cada acción tiene `try/catch` con un mensaje de error visible (listado, resumen, completar, reabrir, guardar y eliminar).
- La lista se actualiza sin recargar la página (`map` para reemplazar, `filter` para borrar, spread para agregar).
- El botón solo aparece cuando la acción tiene sentido: Completar en pendientes, Reabrir en completadas.
- Un 404 en el listado se trata como lista vacía, y se distingue "no hay tareas" de "ninguna coincide con la búsqueda".

## Errores comunes

- **"No se pudieron cargar las tareas":** la API no está corriendo o no conecta con Atlas. Revisar la consola de la API y su `MONGO_URI`.
- **Responde otra aplicación o no encuentra la API:** si el puerto 3000 está ocupado, cambiar `PORT` en el `.env` de la API y poner la misma dirección en `VITE_API_URL`.
- **"Acceso prohibido: Token inválido" al crear:** `VITE_API_TOKEN` no coincide con `TOKEN_SECRETO` de la API.
- **Atlas rechaza la conexión:** agregar tu IP en *Network Access* del cluster.

No incluye login, Context ni rutas privadas (fuera de esta entrega).
