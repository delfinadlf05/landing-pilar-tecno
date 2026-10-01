import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const BotonColor = () => {
  const [colorTitulo, setColorTitulo] = useState("#1B2A4A");
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <>
      <Button onClick={() => setMostrarModal(true)}>Personalizar</Button>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Elegí un color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="color"
            value={colorTitulo}
            onChange={(e) => setColorTitulo(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => setMostrarModal(false)}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BotonColor;
