import { Container, Row, Col } from "react-bootstrap";
import BotonColor from "../components/BotonColor/BotonColor";
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
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <h1>Pilar tecno</h1>
          <p>Bienvenido al curso de React</p>
          <BotonColor />
        </Col>
        <Col md={6}>
          <ul>
            {cursos.map((curso) => (
              <li key={curso.id}>{curso.nombre}</li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
