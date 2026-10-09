import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const PaginaNoEncontrada = () => {
  return (
    <Container className="py-5 text-center">
      <h1 className="display-4">404</h1>
      <p className="lead text-secondary">La página que buscás no existe.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </Container>
  );
};

export default PaginaNoEncontrada;
