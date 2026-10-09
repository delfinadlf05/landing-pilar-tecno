import { useState, useEffect } from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import {
  obtenerRecursos,
  crearRecurso,
  actualizarRecurso,
  eliminarRecurso,
} from "../../services/recursoService";
import type { Recurso, RecursoFormulario } from "../../types/Recurso";
import { mensajeError } from "../../utils/mensajeError";
import ModalLibro from "../ModalLibro/ModalLibro";
import ModalConfirmarEliminar from "../ModalConfirmarEliminar/ModalConfirmarEliminar";

const ListaLibros = () => {
  const [datos, setDatos] = useState<Recurso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [libroEditado, setLibroEditado] = useState<Recurso | null>(null);
  const [libroAEliminar, setLibroAEliminar] = useState<Recurso | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  useEffect(() => {
    obtenerRecursos()
      .then(setDatos)
      .catch((e) => setError(mensajeError(e, "No se pudieron cargar los libros")))
      .finally(() => setCargando(false));
  }, []);

  const abrirAgregar = () => {
    setLibroEditado(null);
    setMostrarModal(true);
  };

  const abrirEditar = (libro: Recurso) => {
    setLibroEditado(libro);
    setMostrarModal(true);
  };

  const guardarLibro = async (datosFormulario: RecursoFormulario) => {
    if (libroEditado) {
      const actualizado = await actualizarRecurso(libroEditado._id, datosFormulario);
      setDatos((anteriores) =>
        anteriores.map((libro) =>
          libro._id === actualizado._id ? actualizado : libro,
        ),
      );
    } else {
      const nuevo = await crearRecurso(datosFormulario);
      setDatos((anteriores) => [...anteriores, nuevo]);
    }
    setMostrarModal(false);
  };

  const cerrarEliminar = () => {
    setLibroAEliminar(null);
    setErrorEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!libroAEliminar) return;
    try {
      await eliminarRecurso(libroAEliminar._id);
      setDatos((anteriores) =>
        anteriores.filter((libro) => libro._id !== libroAEliminar._id),
      );
      cerrarEliminar();
    } catch (e) {
      setErrorEliminar(mensajeError(e, "No se pudo eliminar el libro"));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Libros</h2>
        <Button onClick={abrirAgregar}>Agregar libro</Button>
      </div>
      {cargando && <p>Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!cargando && !error && datos.length === 0 && (
        <p className="text-secondary">Todavía no hay libros cargados.</p>
      )}
      {!cargando && !error && (
        <Row>
          {datos.map((libro) => (
            <Col xs={12} md={6} lg={4} key={libro._id}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>{libro.titulo}</Card.Title>
                  <Card.Subtitle className="text-secondary mb-2">
                    {libro.autor} · {libro.categoria}
                  </Card.Subtitle>
                  <Badge bg="info">{libro.estado}</Badge>
                  <div className="mt-3 d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => abrirEditar(libro)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => setLibroAEliminar(libro)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <ModalLibro
        mostrar={mostrarModal}
        libro={libroEditado}
        onCerrar={() => setMostrarModal(false)}
        onGuardar={guardarLibro}
      />

      <ModalConfirmarEliminar
        libro={libroAEliminar}
        error={errorEliminar}
        onCancelar={cerrarEliminar}
        onConfirmar={confirmarEliminar}
      />
    </>
  );
};

export default ListaLibros;
