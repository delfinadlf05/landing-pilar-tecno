import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import {
  buscarRecursos,
  crearRecurso,
  actualizarRecurso,
  eliminarRecurso,
  prestarRecurso,
  devolverRecurso,
} from "../../services/recursoService";
import type {
  Recurso,
  RecursoFormulario,
  FiltrosBusqueda,
} from "../../types/Recurso";
import { mensajeError } from "../../utils/mensajeError";
import LibroCard from "../LibroCard/LibroCard";
import FiltrosLibros from "../FiltrosLibros/FiltrosLibros";
import ModalLibro from "../ModalLibro/ModalLibro";
import ModalConfirmarEliminar from "../ModalConfirmarEliminar/ModalConfirmarEliminar";

const ListaLibros = () => {
  const [datos, setDatos] = useState<Recurso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosBusqueda>({
    autor: "",
    categoria: "",
    estado: "",
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [libroEditado, setLibroEditado] = useState<Recurso | null>(null);
  const [libroAEliminar, setLibroAEliminar] = useState<Recurso | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  // Carga inicial y búsquedas: sin filtros, la API devuelve todos los libros.
  // Debounce: espera 400 ms desde la última tecla antes de pedir los datos.
  useEffect(() => {
    let ignorar = false;

    const temporizador = setTimeout(() => {
      setCargando(true);
      setError(null);
      buscarRecursos(filtros)
        .then((resultado) => {
          if (!ignorar) setDatos(resultado);
        })
        .catch((e) => {
          if (!ignorar) setError(mensajeError(e, "No se pudieron cargar los libros"));
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

  const reemplazarLibro = (actualizado: Recurso) => {
    setDatos((anteriores) =>
      anteriores.map((libro) =>
        libro._id === actualizado._id ? actualizado : libro,
      ),
    );
  };

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
      reemplazarLibro(await actualizarRecurso(libroEditado._id, datosFormulario));
    } else {
      const nuevo = await crearRecurso(datosFormulario);
      setDatos((anteriores) => [...anteriores, nuevo]);
    }
    setMostrarModal(false);
  };

  const prestar = async (libro: Recurso) => {
    try {
      reemplazarLibro(await prestarRecurso(libro._id));
      setErrorAccion(null);
    } catch (e) {
      setErrorAccion(mensajeError(e, "No se pudo prestar el libro"));
    }
  };

  const devolver = async (libro: Recurso) => {
    try {
      reemplazarLibro(await devolverRecurso(libro._id));
      setErrorAccion(null);
    } catch (e) {
      setErrorAccion(mensajeError(e, "No se pudo devolver el libro"));
    }
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

      <FiltrosLibros filtros={filtros} onCambiar={cambiarFiltro} />

      {errorAccion && <p className="text-danger">{errorAccion}</p>}
      {cargando && <p>Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!cargando && !error && datos.length === 0 && (
        <p className="text-secondary">No hay libros que coincidan con la búsqueda.</p>
      )}
      {!cargando && !error && (
        <Row className="g-3">
          {datos.map((libro) => (
            <Col xs={12} md={6} lg={4} key={libro._id}>
              <LibroCard
                libro={libro}
                onEditar={abrirEditar}
                onEliminar={setLibroAEliminar}
                onPrestar={prestar}
                onDevolver={devolver}
              />
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
