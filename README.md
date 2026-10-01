# landing-pilar-tecno

Entregable 1 del curso de **React · Pilar Tecno** (Módulos 1 y 2). Landing page hecha con
React + TypeScript + Vite y react-bootstrap.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrir la URL que muestra la terminal (por defecto http://localhost:5173/).

## Qué incluye (consigna del Entregable 1)

| Requisito | Dónde está |
|---|---|
| Corre con `npm run dev` | Proyecto Vite + React + TS |
| react-bootstrap + Navbar que colapsa | `components/BarraNavegacion` |
| Layout con Container, Row y Col | `pages/HomePage.tsx` |
| 2+ componentes con props tipadas | `CursoItem`, `CursoCard`, `Header`, `BotonColor`, `ModalConfirmar` |
| Estado controlado con `useState` | Buscador de `Footer`, contador de `Header`, toggle de `Saludo` |
| Modal con patrón `show` / `onHide` | `BotonColor` (react-bootstrap) y `ModalConfirmar` (casero) |
| Git con ramas feature mergeadas a `main` | Ver `git log --oneline --graph` |

## Conceptos aplicados por clase

- **Clase 2**: estructura de carpetas, JSX, Fragment, un componente por carpeta.
- **Clase 3**: `.map()` con `key`, ternario (`Saludo`), `&&`, `onClick`, `onChange`.
- **Clase 4**: `useState`, input controlado + `.filter()`, toggle con `prev => !prev`.
- **Clase 5**: `useEffect` (título de la pestaña en `Header`, conteo de resultados en `Footer`).
- **Clase 6**: props tipadas, callbacks (`onElegirColor`, `onCancelar`, `onConfirmar`), modal casero.
- **Clase 7**: react-bootstrap (Navbar, Container/Row/Col, Modal, Card), Git con ramas y commits `feat/fix/chore`.

## Estructura

```
src/
├── components/
│   ├── BarraNavegacion/
│   ├── BotonColor/
│   ├── CursoCard/
│   ├── CursoItem/
│   ├── Footer/
│   ├── Header/
│   ├── ModalConfirmar/
│   └── Saludo/
├── pages/HomePage.tsx
├── types/ (Curso.ts, Tarea.ts)
├── routes/ services/ hooks/ utils/ assets/   (reservadas para próximos módulos)
├── App.tsx
└── main.tsx
```
