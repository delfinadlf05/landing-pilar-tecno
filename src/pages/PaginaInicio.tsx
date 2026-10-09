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
