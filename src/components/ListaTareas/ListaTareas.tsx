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
