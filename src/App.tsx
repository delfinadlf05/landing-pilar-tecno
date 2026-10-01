import { Container, Row, Col } from "react-bootstrap";
import BarraNavegacion from "./components/BarraNavegacion/BarraNavegacion";

function App() {
  return (
    <>
      <BarraNavegacion />
      <Container className="mt-4">
        <Row>
          <Col md={6}>
            <h1>Pilar tecno</h1>
            <p>Bienvenido al curso de React</p>
          </Col>
          <Col md={6}>
            {/* acá van los cursos, más adelante */}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
