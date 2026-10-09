import { Row, Col, Form } from "react-bootstrap";
import type { FiltrosBusqueda } from "../../types/Recurso";

type Props = {
  filtros: FiltrosBusqueda;
  onCambiar: (campo: keyof FiltrosBusqueda, valor: string) => void;
};

const FiltrosLibros = ({ filtros, onCambiar }: Props) => {
  return (
    <Row className="g-2 mb-4">
      <Col md={4}>
        <Form.Control
          placeholder="Autor"
          value={filtros.autor}
          onChange={(e) => onCambiar("autor", e.target.value)}
        />
      </Col>
      <Col md={4}>
        <Form.Control
          placeholder="Categoría"
          value={filtros.categoria}
          onChange={(e) => onCambiar("categoria", e.target.value)}
        />
      </Col>
      <Col md={4}>
        <Form.Select
          value={filtros.estado}
          onChange={(e) => onCambiar("estado", e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Prestado">Prestado</option>
          <option value="Vencido">Vencido</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default FiltrosLibros;
