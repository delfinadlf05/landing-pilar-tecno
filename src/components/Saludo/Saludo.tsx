import { useState } from "react";
import { Button } from "react-bootstrap";

const Saludo = () => {
  const esDeNoche = new Date().getHours() >= 20;
  const [mostrarAviso, setMostrarAviso] = useState(false);

  const handleToggle = () => {
    setMostrarAviso((prev) => !prev);
  };

  return (
    <>
      {esDeNoche ? (
        <p>Buenas noches, bienvenido al curso</p>
      ) : (
        <p>Buen día, bienvenido al curso</p>
      )}
      <Button variant="success" onClick={handleToggle}>
        Ver curso nuevo
      </Button>
      {mostrarAviso && (
        <p className="mt-3">¡Ya está disponible el curso de Node avanzado!</p>
      )}
    </>
  );
};

export default Saludo;
