import { Card, Badge } from "react-bootstrap";

type CursoCardProps = {
  nombre: string;
  descripcion: string;
  nivel: string;
};

const CursoCard = ({ nombre, descripcion, nivel }: CursoCardProps) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Badge bg="secondary" className="mb-2">
          {nivel}
        </Badge>
        <Card.Title>{nombre}</Card.Title>
        <Card.Text>{descripcion}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CursoCard;
