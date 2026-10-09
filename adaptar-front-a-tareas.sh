#!/usr/bin/env bash
# Frontend landing-pilar-tecno · adaptar el ABM de libros a la API integrador-tareas
# Se ejecuta UNA vez, dentro de la carpeta landing-pilar-tecno (en Git Bash):
#     bash adaptar-front-a-tareas.sh
set -e

[ -f package.json ] && [ -d src/components/ListaLibros ] || { echo "ERROR: ejecutá este script dentro de landing-pilar-tecno (con el ABM de libros ya aplicado)"; exit 1; }
git diff --quiet && git diff --cached --quiet || { echo "ERROR: tenés cambios sin commitear. Hacé commit o git stash y reintentá."; exit 1; }
git checkout -q main
git rev-parse --verify -q feature/api-tareas >/dev/null && { echo "ERROR: ya existe la rama feature/api-tareas."; exit 1; }

w(){ mkdir -p "$(dirname "$1")"; cat > "$1"; }
git checkout -q -b feature/api-tareas

########################################################################
# COMMIT 1 · reemplazar libros por tareas (ABM + filtros)
########################################################################
git rm -q -r src/types/Recurso.ts src/services/recursoService.ts \
  src/components/ListaLibros src/components/LibroCard src/components/FiltrosLibros \
  src/components/ModalLibro src/components/ModalConfirmarEliminar src/pages/PaginaLibros.tsx

w src/types/Tarea.ts <<'EOF'
export type Prioridad = "baja" | "media" | "alta";

export type Tarea = {
  _id: string;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  prioridad: Prioridad;
  fechaCompletada?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

// Lo que maneja el formulario de crear/editar. "completada" y la fecha no
// van acá: las cambian los endpoints de negocio (completar / reabrir).
export type TareaFormulario = {
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
};

// Filtros del listado. Vacío ("") significa "sin filtrar".
// completada es "" | "true" | "false" porque viaja como query string.
export type FiltrosBusqueda = {
  q: string;
  prioridad: string;
  completada: string;
};
EOF
w src/services/tareaService.ts <<'EOF'
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
EOF
w src/components/FiltrosTareas/FiltrosTareas.tsx <<'EOF'
import { Row, Col, Form } from "react-bootstrap";
import type { FiltrosBusqueda } from "../../types/Tarea";

type Props = {
  filtros: FiltrosBusqueda;
  onCambiar: (campo: keyof FiltrosBusqueda, valor: string) => void;
};

const FiltrosTareas = ({ filtros, onCambiar }: Props) => {
  return (
    <Row className="g-2 mb-4">
      <Col md={4}>
        <Form.Control
          placeholder="Buscar por título"
          value={filtros.q}
          onChange={(e) => onCambiar("q", e.target.value)}
        />
      </Col>
      <Col md={4}>
        <Form.Select
          value={filtros.prioridad}
          onChange={(e) => onCambiar("prioridad", e.target.value)}
        >
          <option value="">Todas las prioridades</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </Form.Select>
      </Col>
      <Col md={4}>
        <Form.Select
          value={filtros.completada}
          onChange={(e) => onCambiar("completada", e.target.value)}
        >
          <option value="">Pendientes y completadas</option>
          <option value="false">Solo pendientes</option>
          <option value="true">Solo completadas</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default FiltrosTareas;
EOF
w src/components/TareaCard/TareaCard.tsx <<'EOF'
import { Card, Badge, Button } from "react-bootstrap";
import type { Tarea } from "../../types/Tarea";

const colorPorPrioridad: Record<Tarea["prioridad"], string> = {
  alta: "danger",
  media: "warning",
  baja: "success",
};

type Props = {
  tarea: Tarea;
  onEditar: (tarea: Tarea) => void;
  onEliminar: (tarea: Tarea) => void;
};

const TareaCard = ({ tarea, onEditar, onEliminar }: Props) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>{tarea.titulo}</Card.Title>
        {tarea.descripcion && (
          <Card.Text className="text-secondary">{tarea.descripcion}</Card.Text>
        )}
        <Badge bg={colorPorPrioridad[tarea.prioridad]}>
          Prioridad {tarea.prioridad}
        </Badge>
        <div className="mt-3 d-flex flex-wrap gap-2">
          <Button size="sm" variant="outline-primary" onClick={() => onEditar(tarea)}>
            Editar
          </Button>
          <Button size="sm" variant="outline-danger" onClick={() => onEliminar(tarea)}>
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TareaCard;
EOF
w src/components/ModalTarea/ModalTarea.tsx <<'EOF'
import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Tarea, TareaFormulario } from "../../types/Tarea";
import { mensajeError } from "../../utils/mensajeError";

type Props = {
  mostrar: boolean;
  tarea?: Tarea | null;
  onCerrar: () => void;
  onGuardar: (datos: TareaFormulario) => Promise<void>;
};

const esquema = Yup.object({
  titulo: Yup.string()
    .trim()
    .required("El título es obligatorio")
    .max(100, "El título no puede superar los 100 caracteres"),
  descripcion: Yup.string()
    .trim()
    .max(300, "La descripción no puede superar los 300 caracteres"),
  prioridad: Yup.string()
    .oneOf(["baja", "media", "alta"], "Elegí una prioridad válida")
    .required("La prioridad es obligatoria"),
});

const valoresIniciales: TareaFormulario = {
  titulo: "",
  descripcion: "",
  prioridad: "media",
};

const ModalTarea = ({ mostrar, tarea, onCerrar, onGuardar }: Props) => {
  const formik = useFormik<TareaFormulario>({
    initialValues: tarea
      ? {
          titulo: tarea.titulo,
          descripcion: tarea.descripcion ?? "",
          prioridad: tarea.prioridad,
        }
      : valoresIniciales,
    enableReinitialize: true,
    validationSchema: esquema,
    onSubmit: async (valores, { resetForm, setStatus }) => {
      try {
        await onGuardar(valores);
        resetForm();
      } catch (error) {
        setStatus(mensajeError(error, "No se pudo guardar la tarea"));
      }
    },
  });

  const cerrar = () => {
    formik.resetForm();
    onCerrar();
  };

  return (
    <Modal show={mostrar} onHide={cerrar} centered>
      <Form onSubmit={formik.handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{tarea ? "Editar tarea" : "Agregar tarea"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="titulo">
            <Form.Label>Título</Form.Label>
            <Form.Control
              name="titulo"
              value={formik.values.titulo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.titulo && !!formik.errors.titulo}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.titulo}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="descripcion">
            <Form.Label>Descripción (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.descripcion && !!formik.errors.descripcion}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.descripcion}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="prioridad">
            <Form.Label>Prioridad</Form.Label>
            <Form.Select
              name="prioridad"
              value={formik.values.prioridad}
              onChange={formik.handleChange}
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </Form.Select>
          </Form.Group>

          {formik.status && (
            <p className="text-danger mt-3 mb-0">{formik.status}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={formik.isSubmitting}>
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalTarea;
EOF
w src/components/ModalConfirmarEliminar/ModalConfirmarEliminar.tsx <<'EOF'
import { Modal, Button } from "react-bootstrap";
import type { Tarea } from "../../types/Tarea";

type Props = {
  tarea: Tarea | null;
  error: string | null;
  onCancelar: () => void;
  onConfirmar: () => void;
};

const ModalConfirmarEliminar = ({ tarea, error, onCancelar, onConfirmar }: Props) => {
  return (
    <Modal show={!!tarea} onHide={onCancelar} centered>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar tarea</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Seguro que querés eliminar la tarea "{tarea?.titulo}"?
        {error && <p className="text-danger mt-3 mb-0">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirmar}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirmarEliminar;
EOF
w src/components/ListaTareas/ListaTareas.tsx <<'EOF'
import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import {
  obtenerTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
} from "../../services/tareaService";
import type { Tarea, TareaFormulario, FiltrosBusqueda } from "../../types/Tarea";
import { mensajeError } from "../../utils/mensajeError";
import TareaCard from "../TareaCard/TareaCard";
import FiltrosTareas from "../FiltrosTareas/FiltrosTareas";
import ModalTarea from "../ModalTarea/ModalTarea";
import ModalConfirmarEliminar from "../ModalConfirmarEliminar/ModalConfirmarEliminar";

const ListaTareas = () => {
  const [datos, setDatos] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosBusqueda>({
    q: "",
    prioridad: "",
    completada: "",
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tareaEditada, setTareaEditada] = useState<Tarea | null>(null);
  const [tareaAEliminar, setTareaAEliminar] = useState<Tarea | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  // Carga inicial y búsquedas: sin filtros, la API devuelve todas las tareas.
  // Debounce: espera 400 ms desde la última tecla antes de pedir los datos.
  useEffect(() => {
    let ignorar = false;

    const temporizador = setTimeout(() => {
      setCargando(true);
      setError(null);
      obtenerTareas(filtros)
        .then((resultado) => {
          if (!ignorar) setDatos(resultado);
        })
        .catch((e) => {
          if (!ignorar) setError(mensajeError(e, "No se pudieron cargar las tareas"));
        })
        .finally(() => {
          if (!ignorar) setCargando(false);
        });
    }, 400);

    return () => {
      ignorar = true;
      clearTimeout(temporizador);
    };
  }, [filtros]);

  const cambiarFiltro = (campo: keyof FiltrosBusqueda, valor: string) => {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }));
  };

  const abrirAgregar = () => {
    setTareaEditada(null);
    setMostrarModal(true);
  };

  const abrirEditar = (tarea: Tarea) => {
    setTareaEditada(tarea);
    setMostrarModal(true);
  };

  const guardarTarea = async (datosFormulario: TareaFormulario) => {
    if (tareaEditada) {
      const actualizada = await actualizarTarea(tareaEditada._id, datosFormulario);
      setDatos((anteriores) =>
        anteriores.map((tarea) =>
          tarea._id === actualizada._id ? actualizada : tarea,
        ),
      );
    } else {
      const nueva = await crearTarea(datosFormulario);
      setDatos((anteriores) => [nueva, ...anteriores]);
    }
    setMostrarModal(false);
  };

  const cerrarEliminar = () => {
    setTareaAEliminar(null);
    setErrorEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!tareaAEliminar) return;
    try {
      await eliminarTarea(tareaAEliminar._id);
      setDatos((anteriores) =>
        anteriores.filter((tarea) => tarea._id !== tareaAEliminar._id),
      );
      cerrarEliminar();
    } catch (e) {
      setErrorEliminar(mensajeError(e, "No se pudo eliminar la tarea"));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Tareas</h2>
        <Button onClick={abrirAgregar}>Agregar tarea</Button>
      </div>

      <FiltrosTareas filtros={filtros} onCambiar={cambiarFiltro} />

      {cargando && <p>Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!cargando && !error && datos.length === 0 && (
        <p className="text-secondary">No hay tareas que coincidan con la búsqueda.</p>
      )}
      {!cargando && !error && (
        <Row className="g-3">
          {datos.map((tarea) => (
            <Col xs={12} md={6} lg={4} key={tarea._id}>
              <TareaCard
                tarea={tarea}
                onEditar={abrirEditar}
                onEliminar={setTareaAEliminar}
              />
            </Col>
          ))}
        </Row>
      )}

      <ModalTarea
        mostrar={mostrarModal}
        tarea={tareaEditada}
        onCerrar={() => setMostrarModal(false)}
        onGuardar={guardarTarea}
      />

      <ModalConfirmarEliminar
        tarea={tareaAEliminar}
        error={errorEliminar}
        onCancelar={cerrarEliminar}
        onConfirmar={confirmarEliminar}
      />
    </>
  );
};

export default ListaTareas;
EOF
w src/pages/PaginaTareas.tsx <<'EOF'
import { Container } from "react-bootstrap";
import ListaTareas from "../components/ListaTareas/ListaTareas";

const PaginaTareas = () => {
  return (
    <Container className="py-5">
      <ListaTareas />
    </Container>
  );
};

export default PaginaTareas;
EOF
w src/App.tsx <<'EOF'
import { Routes, Route } from "react-router-dom";
import BarraNavegacion from "./components/BarraNavegacion/BarraNavegacion";
import PaginaInicio from "./pages/PaginaInicio";
import PaginaTareas from "./pages/PaginaTareas";
import PaginaNoEncontrada from "./pages/PaginaNoEncontrada";

function App() {
  return (
    <>
      <BarraNavegacion />
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/tareas" element={<PaginaTareas />} />
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>
    </>
  );
}

export default App;
EOF
w src/components/BarraNavegacion/BarraNavegacion.tsx <<'EOF'
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const BarraNavegacion = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">Pilar Tecno</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-principal" />
        <Navbar.Collapse id="navbar-principal">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/tareas">Tareas</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BarraNavegacion;
EOF
w src/pages/PaginaInicio.tsx <<'EOF'
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import BotonColor from "../components/BotonColor/BotonColor";

const PaginaInicio = () => {
  const [colorTitulo, setColorTitulo] = useState("#1B2A4A");

  return (
    <section className="py-5 bg-light">
      <Container className="py-5">
        <Row className="align-items-center g-4">
          <Col md={6}>
            <h1 className="display-5 fw-bold" style={{ color: colorTitulo }}>
              Pilar Tecno
            </h1>
            <p className="lead text-secondary">
              Gestor de tareas: organizá lo que tenés que hacer, con prioridades.
            </p>
            <div className="d-flex gap-2">
              <Link to="/tareas" className="btn btn-primary">
                Ver tareas
              </Link>
              <BotonColor
                colorActual={colorTitulo}
                onElegirColor={setColorTitulo}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PaginaInicio;
EOF
sed -i 's|<title>.*</title>|<title>Tareas · Pilar Tecno</title>|' index.html
git add -A
git commit -q -m "refactor: reemplazar el ABM de libros por el de tareas de mi api"

########################################################################
# COMMIT 2 · endpoints de negocio: completar, reabrir y resumen
########################################################################
cat >> src/types/Tarea.ts <<'EOF'

// Respuesta de GET /api/tareas/resumen
export type Resumen = {
  total: number;
  completadas: number;
  pendientes: number;
  pendientesAltaPrioridad: number;
  porPrioridad: Record<Prioridad, number>;
};
EOF
cat > src/services/tareaService.ts <<'EOF'
import axios from "axios";
import type {
  Tarea,
  TareaFormulario,
  FiltrosBusqueda,
  Resumen,
} from "../types/Tarea";

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

// ---- Endpoints de negocio ----

export const completarTarea = async (id: string): Promise<Tarea> => {
  try {
    const respuesta = await axios.put(`${BASE_URL}/${id}/completar`);
    return respuesta.data;
  } catch (error) {
    return lanzarError(error, "No se pudo completar la tarea");
  }
};

export const reabrirTarea = async (id: string): Promise<Tarea> => {
  try {
    const respuesta = await axios.put(`${BASE_URL}/${id}/reabrir`);
    return respuesta.data;
  } catch (error) {
    return lanzarError(error, "No se pudo reabrir la tarea");
  }
};

export const obtenerResumen = async (): Promise<Resumen> => {
  try {
    const respuesta = await axios.get(`${BASE_URL}/resumen`);
    return respuesta.data;
  } catch (error) {
    return lanzarError(error, "No se pudo cargar el resumen");
  }
};
EOF
w src/components/PanelResumen/PanelResumen.tsx <<'EOF'
import { Row, Col, Card } from "react-bootstrap";
import type { Resumen } from "../../types/Tarea";

type Props = {
  resumen: Resumen | null;
};

const PanelResumen = ({ resumen }: Props) => {
  if (!resumen) return null;

  const datos = [
    { etiqueta: "Total", valor: resumen.total, color: "dark" },
    { etiqueta: "Pendientes", valor: resumen.pendientes, color: "warning" },
    { etiqueta: "Completadas", valor: resumen.completadas, color: "success" },
    {
      etiqueta: "Alta prioridad pendientes",
      valor: resumen.pendientesAltaPrioridad,
      color: "danger",
    },
  ];

  return (
    <Row className="g-3 mb-4">
      {datos.map((dato) => (
        <Col xs={6} md={3} key={dato.etiqueta}>
          <Card className="text-center h-100">
            <Card.Body>
              <div className={`fs-2 fw-bold text-${dato.color}`}>{dato.valor}</div>
              <small className="text-secondary">{dato.etiqueta}</small>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PanelResumen;
EOF
w src/components/TareaCard/TareaCard.tsx <<'EOF'
import { Card, Badge, Button } from "react-bootstrap";
import type { Tarea } from "../../types/Tarea";

const colorPorPrioridad: Record<Tarea["prioridad"], string> = {
  alta: "danger",
  media: "warning",
  baja: "success",
};

type Props = {
  tarea: Tarea;
  onEditar: (tarea: Tarea) => void;
  onEliminar: (tarea: Tarea) => void;
  onCompletar: (tarea: Tarea) => void;
  onReabrir: (tarea: Tarea) => void;
};

const TareaCard = ({ tarea, onEditar, onEliminar, onCompletar, onReabrir }: Props) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title className={tarea.completada ? "text-decoration-line-through text-secondary" : ""}>
          {tarea.titulo}
        </Card.Title>
        {tarea.descripcion && (
          <Card.Text className="text-secondary">{tarea.descripcion}</Card.Text>
        )}
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Badge bg={colorPorPrioridad[tarea.prioridad]}>
            Prioridad {tarea.prioridad}
          </Badge>
          <Badge bg={tarea.completada ? "success" : "secondary"}>
            {tarea.completada ? "Completada" : "Pendiente"}
          </Badge>
        </div>
        {tarea.fechaCompletada && (
          <small className="text-secondary d-block mt-2">
            Completada el {new Date(tarea.fechaCompletada).toLocaleDateString("es-AR")}
          </small>
        )}
        <div className="mt-3 d-flex flex-wrap gap-2">
          {tarea.completada ? (
            <Button size="sm" variant="outline-secondary" onClick={() => onReabrir(tarea)}>
              Reabrir
            </Button>
          ) : (
            <Button size="sm" variant="outline-success" onClick={() => onCompletar(tarea)}>
              Completar
            </Button>
          )}
          <Button size="sm" variant="outline-primary" onClick={() => onEditar(tarea)}>
            Editar
          </Button>
          <Button size="sm" variant="outline-danger" onClick={() => onEliminar(tarea)}>
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TareaCard;
EOF
w src/components/ListaTareas/ListaTareas.tsx <<'EOF'
import { useState, useEffect, useCallback } from "react";
import { Row, Col, Button } from "react-bootstrap";
import {
  obtenerTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
  completarTarea,
  reabrirTarea,
  obtenerResumen,
} from "../../services/tareaService";
import type {
  Tarea,
  TareaFormulario,
  FiltrosBusqueda,
  Resumen,
} from "../../types/Tarea";
import { mensajeError } from "../../utils/mensajeError";
import TareaCard from "../TareaCard/TareaCard";
import FiltrosTareas from "../FiltrosTareas/FiltrosTareas";
import PanelResumen from "../PanelResumen/PanelResumen";
import ModalTarea from "../ModalTarea/ModalTarea";
import ModalConfirmarEliminar from "../ModalConfirmarEliminar/ModalConfirmarEliminar";

const ListaTareas = () => {
  const [datos, setDatos] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [filtros, setFiltros] = useState<FiltrosBusqueda>({
    q: "",
    prioridad: "",
    completada: "",
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tareaEditada, setTareaEditada] = useState<Tarea | null>(null);
  const [tareaAEliminar, setTareaAEliminar] = useState<Tarea | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  // Vuelve a pedir los números del panel (después de crear, editar, borrar, etc.)
  const refrescarResumen = useCallback(() => {
    obtenerResumen()
      .then(setResumen)
      .catch(() => setResumen(null));
  }, []);

  useEffect(() => {
    refrescarResumen();
  }, [refrescarResumen]);

  // Carga inicial y búsquedas: sin filtros, la API devuelve todas las tareas.
  // Debounce: espera 400 ms desde la última tecla antes de pedir los datos.
  useEffect(() => {
    let ignorar = false;

    const temporizador = setTimeout(() => {
      setCargando(true);
      setError(null);
      obtenerTareas(filtros)
        .then((resultado) => {
          if (!ignorar) setDatos(resultado);
        })
        .catch((e) => {
          if (!ignorar) setError(mensajeError(e, "No se pudieron cargar las tareas"));
        })
        .finally(() => {
          if (!ignorar) setCargando(false);
        });
    }, 400);

    return () => {
      ignorar = true;
      clearTimeout(temporizador);
    };
  }, [filtros]);

  const cambiarFiltro = (campo: keyof FiltrosBusqueda, valor: string) => {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }));
  };

  const reemplazarTarea = (actualizada: Tarea) => {
    setDatos((anteriores) =>
      anteriores.map((tarea) =>
        tarea._id === actualizada._id ? actualizada : tarea,
      ),
    );
  };

  const abrirAgregar = () => {
    setTareaEditada(null);
    setMostrarModal(true);
  };

  const abrirEditar = (tarea: Tarea) => {
    setTareaEditada(tarea);
    setMostrarModal(true);
  };

  const guardarTarea = async (datosFormulario: TareaFormulario) => {
    if (tareaEditada) {
      reemplazarTarea(await actualizarTarea(tareaEditada._id, datosFormulario));
    } else {
      const nueva = await crearTarea(datosFormulario);
      setDatos((anteriores) => [nueva, ...anteriores]);
    }
    setMostrarModal(false);
    refrescarResumen();
  };

  const completar = async (tarea: Tarea) => {
    try {
      reemplazarTarea(await completarTarea(tarea._id));
      setErrorAccion(null);
      refrescarResumen();
    } catch (e) {
      setErrorAccion(mensajeError(e, "No se pudo completar la tarea"));
    }
  };

  const reabrir = async (tarea: Tarea) => {
    try {
      reemplazarTarea(await reabrirTarea(tarea._id));
      setErrorAccion(null);
      refrescarResumen();
    } catch (e) {
      setErrorAccion(mensajeError(e, "No se pudo reabrir la tarea"));
    }
  };

  const cerrarEliminar = () => {
    setTareaAEliminar(null);
    setErrorEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!tareaAEliminar) return;
    try {
      await eliminarTarea(tareaAEliminar._id);
      setDatos((anteriores) =>
        anteriores.filter((tarea) => tarea._id !== tareaAEliminar._id),
      );
      cerrarEliminar();
      refrescarResumen();
    } catch (e) {
      setErrorEliminar(mensajeError(e, "No se pudo eliminar la tarea"));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Tareas</h2>
        <Button onClick={abrirAgregar}>Agregar tarea</Button>
      </div>

      <PanelResumen resumen={resumen} />

      <FiltrosTareas filtros={filtros} onCambiar={cambiarFiltro} />

      {errorAccion && <p className="text-danger">{errorAccion}</p>}
      {cargando && <p>Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!cargando && !error && datos.length === 0 && (
        <p className="text-secondary">No hay tareas que coincidan con la búsqueda.</p>
      )}
      {!cargando && !error && (
        <Row className="g-3">
          {datos.map((tarea) => (
            <Col xs={12} md={6} lg={4} key={tarea._id}>
              <TareaCard
                tarea={tarea}
                onEditar={abrirEditar}
                onEliminar={setTareaAEliminar}
                onCompletar={completar}
                onReabrir={reabrir}
              />
            </Col>
          ))}
        </Row>
      )}

      <ModalTarea
        mostrar={mostrarModal}
        tarea={tareaEditada}
        onCerrar={() => setMostrarModal(false)}
        onGuardar={guardarTarea}
      />

      <ModalConfirmarEliminar
        tarea={tareaAEliminar}
        error={errorEliminar}
        onCancelar={cerrarEliminar}
        onConfirmar={confirmarEliminar}
      />
    </>
  );
};

export default ListaTareas;
EOF
git add -A
git commit -q -m "feat: agregar completar, reabrir y panel de resumen de tareas"

########################################################################
# COMMIT 3 · variables de entorno y README
########################################################################
w .env.example <<'EOF'
# Copiá este archivo como .env y completalo (el .env NO se sube a GitHub).

# Dirección de la API de tareas (por defecto la API local del curso de Node)
VITE_API_URL=http://localhost:3000/api/tareas

# Mismo valor que TOKEN_SECRETO en el .env de la API. La API lo pide para CREAR tareas.
VITE_API_TOKEN=
EOF
w README.md <<'EOF'
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
EOF
git add -A
git commit -q -m "docs: adaptar readme y variables de entorno a la api de tareas"

git checkout -q main
git merge -q --no-ff feature/api-tareas -m "Merge branch 'feature/api-tareas'"
echo; echo "LISTO. Historial:"; git log --oneline --graph | head -14
