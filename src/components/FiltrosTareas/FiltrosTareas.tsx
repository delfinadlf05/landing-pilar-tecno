import { Row, Col, Form } from "react-bootstrap";
import type { FiltrosBusqueda } from "../../types/Tarea";

type Props = {
  filtros: FiltrosBusqueda;
  onCambiar: (campo: keyof FiltrosBusqueda, valor: string) => void;
};

const FiltrosTareas = ({ filtros, onCambiar }: Props) => {
  return (
    <Row className="g-2 mb-4">
      <Col md={4}>
        <Form.Control
          placeholder="Buscar por título"
          value={filtros.q}
          onChange={(e) => onCambiar("q", e.target.value)}
        />
      </Col>
      <Col md={4}>
        <Form.Select
          value={filtros.prioridad}
          onChange={(e) => onCambiar("prioridad", e.target.value)}
        >
          <option value="">Todas las prioridades</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </Form.Select>
      </Col>
      <Col md={4}>
        <Form.Select
          value={filtros.completada}
          onChange={(e) => onCambiar("completada", e.target.value)}
        >
          <option value="">Pendientes y completadas</option>
          <option value="false">Solo pendientes</option>
          <option value="true">Solo completadas</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default FiltrosTareas;
