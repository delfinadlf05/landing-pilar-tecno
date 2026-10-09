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
  onCompletar: (tarea: Tarea) => void;
  onReabrir: (tarea: Tarea) => void;
};

const TareaCard = ({ tarea, onEditar, onEliminar, onCompletar, onReabrir }: Props) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title className={tarea.completada ? "text-decoration-line-through text-secondary" : ""}>
          {tarea.titulo}
        </Card.Title>
        {tarea.descripcion && (
          <Card.Text className="text-secondary">{tarea.descripcion}</Card.Text>
        )}
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Badge bg={colorPorPrioridad[tarea.prioridad]}>
            Prioridad {tarea.prioridad}
          </Badge>
          <Badge bg={tarea.completada ? "success" : "secondary"}>
            {tarea.completada ? "Completada" : "Pendiente"}
          </Badge>
        </div>
        {tarea.fechaCompletada && (
          <small className="text-secondary d-block mt-2">
            Completada el {new Date(tarea.fechaCompletada).toLocaleDateString("es-AR")}
          </small>
        )}
        <div className="mt-3 d-flex flex-wrap gap-2">
          {tarea.completada ? (
            <Button size="sm" variant="outline-secondary" onClick={() => onReabrir(tarea)}>
              Reabrir
            </Button>
          ) : (
            <Button size="sm" variant="outline-success" onClick={() => onCompletar(tarea)}>
              Completar
            </Button>
          )}
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
