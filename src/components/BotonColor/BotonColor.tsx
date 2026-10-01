import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

type BotonColorProps = {
  colorActual: string;
  onElegirColor: (color: string) => void;
};

const BotonColor = ({ colorActual, onElegirColor }: BotonColorProps) => {
  const [colorElegido, setColorElegido] = useState(colorActual);
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleAbrir = () => {
    setColorElegido(colorActual);
    setMostrarModal(true);
  };

  const handleAceptar = () => {
    onElegirColor(colorElegido);
    setMostrarModal(false);
  };

  return (
    <>
      <Button onClick={handleAbrir}>Personalizar</Button>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Elegí un color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="color"
            value={colorElegido}
            onChange={(e) => setColorElegido(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAceptar}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BotonColor;
