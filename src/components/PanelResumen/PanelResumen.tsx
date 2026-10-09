import { Row, Col, Card } from "react-bootstrap";
import type { Resumen } from "../../types/Tarea";

type Props = {
  resumen: Resumen | null;
};

const PanelResumen = ({ resumen }: Props) => {
  if (!resumen) return null;

  const datos = [
    { etiqueta: "Total", valor: resumen.total, color: "dark" },
    { etiqueta: "Pendientes", valor: resumen.pendientes, color: "warning" },
    { etiqueta: "Completadas", valor: resumen.completadas, color: "success" },
    {
      etiqueta: "Alta prioridad pendientes",
      valor: resumen.pendientesAltaPrioridad,
      color: "danger",
    },
  ];

  return (
    <Row className="g-3 mb-4">
      {datos.map((dato) => (
        <Col xs={6} md={3} key={dato.etiqueta}>
          <Card className="text-center h-100">
            <Card.Body>
              <div className={`fs-2 fw-bold text-${dato.color}`}>{dato.valor}</div>
              <small className="text-secondary">{dato.etiqueta}</small>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PanelResumen;
