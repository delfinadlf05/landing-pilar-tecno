import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header/Header";
import Saludo from "../components/Saludo/Saludo";
import type { Curso } from "../types/Curso";

const cursos: Curso[] = [
  {
    id: 1,
    nombre: "React",
    descripcion: "Componentes, JSX, estado y efectos para construir interfaces.",
    nivel: "Inicial",
  },
  {
    id: 2,
    nombre: "Node.js",
    descripcion: "APIs con rutas, controladores y conexión a base de datos.",
    nivel: "Intermedio",
  },
  {
    id: 3,
    nombre: "TypeScript",
    descripcion: "Tipado estático para escribir código más seguro y ordenado.",
    nivel: "Inicial",
  },
];

const HomePage = () => {
  return (
    <section id="inicio">
      <Container className="mt-4">
        <Row>
          <Col md={6}>
            <Header cursos={cursos} />
          </Col>
          <Col md={6}>
            <Saludo />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HomePage;
