import { Card, Badge, Button } from "react-bootstrap";
import type { Recurso } from "../../types/Recurso";

const colorPorEstado: Record<Recurso["estado"], string> = {
  Disponible: "success",
  Prestado: "warning",
  Vencido: "danger",
};

type Props = {
  libro: Recurso;
  onEditar: (libro: Recurso) => void;
  onEliminar: (libro: Recurso) => void;
  onPrestar: (libro: Recurso) => void;
  onDevolver: (libro: Recurso) => void;
};

const LibroCard = ({ libro, onEditar, onEliminar, onPrestar, onDevolver }: Props) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>{libro.titulo}</Card.Title>
        <Card.Subtitle className="text-secondary mb-2">
          {libro.autor} · {libro.categoria}
        </Card.Subtitle>
        <Badge bg={colorPorEstado[libro.estado]}>{libro.estado}</Badge>
        {libro.fechaDevolucion && (
          <small className="text-secondary d-block mt-2">
            Devolver antes del{" "}
            {new Date(libro.fechaDevolucion).toLocaleDateString("es-AR")}
          </small>
        )}
        <div className="mt-3 d-flex flex-wrap gap-2">
          {libro.estado === "Disponible" ? (
            <Button size="sm" variant="outline-success" onClick={() => onPrestar(libro)}>
              Prestar
            </Button>
          ) : (
            <Button size="sm" variant="outline-secondary" onClick={() => onDevolver(libro)}>
              Devolver
            </Button>
          )}
          <Button size="sm" variant="outline-primary" onClick={() => onEditar(libro)}>
            Editar
          </Button>
          <Button size="sm" variant="outline-danger" onClick={() => onEliminar(libro)}>
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LibroCard;
