import { Card, Badge, Button } from "react-bootstrap";
import type { Tarea } from "../../types/Tarea";

const colorPorPrioridad: Record<Tarea["prioridad"], string> = {
  alta: "danger",
  media: "warning",
  baja: "success",
};

type Props = {
  tarea: Tarea;
  onEditar: (tarea: Tarea) => void;
  onEliminar: (tarea: Tarea) => void;
};

const TareaCard = ({ tarea, onEditar, onEliminar }: Props) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>{tarea.titulo}</Card.Title>
        {tarea.descripcion && (
          <Card.Text className="text-secondary">{tarea.descripcion}</Card.Text>
        )}
        <Badge bg={colorPorPrioridad[tarea.prioridad]}>
          Prioridad {tarea.prioridad}
        </Badge>
        <div className="mt-3 d-flex flex-wrap gap-2">
          <Button size="sm" variant="outline-primary" onClick={() => onEditar(tarea)}>
            Editar
          </Button>
          <Button size="sm" variant="outline-danger" onClick={() => onEliminar(tarea)}>
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TareaCard;
