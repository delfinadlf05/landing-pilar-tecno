import { useState, useEffect } from "react";
import ModalConfirmar from "../ModalConfirmar/ModalConfirmar";
import type { Tarea } from "../../types/Tarea";

const Footer = () => {
  const [busqueda, setBusqueda] = useState("");
  const [tareas, setTareas] = useState<Tarea[]>([
    { id: 1, descripcion: "Repasar renderizado condicional" },
    { id: 2, descripcion: "Terminar el array de Header" },
    { id: 3, descripcion: "Probar el evento onChange" },
  ]);
  const [tareaAEliminar, setTareaAEliminar] = useState<number | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(event.target.value);
  };

  const tareasFiltradas = tareas.filter((tarea) =>
    tarea.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const confirmarEliminacion = () => {
    setTareas(tareas.filter((tarea) => tarea.id !== tareaAEliminar));
    setTareaAEliminar(null);
  };

  useEffect(() => {
    console.log(`Encontradas: ${tareasFiltradas.length}`);
  }, [tareasFiltradas.length]);

  return (
    <>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar tarea..."
        value={busqueda}
        onChange={handleChange}
      />
      <ul className="list-group mb-4">
        {tareasFiltradas.map((tarea) => (
          <li
            key={tarea.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {tarea.descripcion}
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => setTareaAEliminar(tarea.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <ModalConfirmar
        show={tareaAEliminar !== null}
        mensaje="¿Seguro que querés eliminar esta tarea?"
        onCancelar={() => setTareaAEliminar(null)}
        onConfirmar={confirmarEliminacion}
      />
      <p className="text-muted">© 2026 Pilar Tecno</p>
    </>
  );
};

export default Footer;
