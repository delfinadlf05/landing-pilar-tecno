import { Modal, Button } from "react-bootstrap";
import type { Recurso } from "../../types/Recurso";

type Props = {
  libro: Recurso | null;
  error: string | null;
  onCancelar: () => void;
  onConfirmar: () => void;
};

const ModalConfirmarEliminar = ({ libro, error, onCancelar, onConfirmar }: Props) => {
  return (
    <Modal show={!!libro} onHide={onCancelar} centered>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar libro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Seguro que querés eliminar "{libro?.titulo}"?
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
