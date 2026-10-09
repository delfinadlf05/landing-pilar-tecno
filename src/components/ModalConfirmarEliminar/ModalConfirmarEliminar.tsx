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
