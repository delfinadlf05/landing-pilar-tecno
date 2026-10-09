import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header/Header";
import Saludo from "../components/Saludo/Saludo";
import Footer from "../components/Footer/Footer";
import CursoCard from "../components/CursoCard/CursoCard";
import ListaLibros from "../components/ListaLibros/ListaLibros";
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
    <>
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

      <section id="libros" className="py-5">
        <Container>
          <ListaLibros />
        </Container>
      </section>

      <section id="cursos" className="py-5 bg-light mt-4">
        <Container>
          <h2 className="mb-4">Cursos</h2>
          <Row className="g-4">
            {cursos.map((curso) => (
              <Col key={curso.id} md={4}>
                <CursoCard
                  nombre={curso.nombre}
                  descripcion={curso.descripcion}
                  nivel={curso.nivel}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section id="contacto" className="py-5">
        <Container>
          <h2 className="mb-3">Contacto y tareas</h2>
          <Footer />
        </Container>
      </section>
    </>
  );
};

export default HomePage;
