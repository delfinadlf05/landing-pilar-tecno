import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Tarea, TareaFormulario } from "../../types/Tarea";
import { mensajeError } from "../../utils/mensajeError";

type Props = {
  mostrar: boolean;
  tarea?: Tarea | null;
  onCerrar: () => void;
  onGuardar: (datos: TareaFormulario) => Promise<void>;
};

const esquema = Yup.object({
  titulo: Yup.string()
    .trim()
    .required("El título es obligatorio")
    .max(100, "El título no puede superar los 100 caracteres"),
  descripcion: Yup.string()
    .trim()
    .max(300, "La descripción no puede superar los 300 caracteres"),
  prioridad: Yup.string()
    .oneOf(["baja", "media", "alta"], "Elegí una prioridad válida")
    .required("La prioridad es obligatoria"),
});

const valoresIniciales: TareaFormulario = {
  titulo: "",
  descripcion: "",
  prioridad: "media",
};

const ModalTarea = ({ mostrar, tarea, onCerrar, onGuardar }: Props) => {
  const formik = useFormik<TareaFormulario>({
    initialValues: tarea
      ? {
          titulo: tarea.titulo,
          descripcion: tarea.descripcion ?? "",
          prioridad: tarea.prioridad,
        }
      : valoresIniciales,
    enableReinitialize: true,
    validationSchema: esquema,
    onSubmit: async (valores, { resetForm, setStatus }) => {
      try {
        await onGuardar(valores);
        resetForm();
      } catch (error) {
        setStatus(mensajeError(error, "No se pudo guardar la tarea"));
      }
    },
  });

  const cerrar = () => {
    formik.resetForm();
    onCerrar();
  };

  return (
    <Modal show={mostrar} onHide={cerrar} centered>
      <Form onSubmit={formik.handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{tarea ? "Editar tarea" : "Agregar tarea"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="titulo">
            <Form.Label>Título</Form.Label>
            <Form.Control
              name="titulo"
              value={formik.values.titulo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.titulo && !!formik.errors.titulo}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.titulo}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="descripcion">
            <Form.Label>Descripción (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.descripcion && !!formik.errors.descripcion}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.descripcion}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="prioridad">
            <Form.Label>Prioridad</Form.Label>
            <Form.Select
              name="prioridad"
              value={formik.values.prioridad}
              onChange={formik.handleChange}
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </Form.Select>
          </Form.Group>

          {formik.status && (
            <p className="text-danger mt-3 mb-0">{formik.status}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={formik.isSubmitting}>
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalTarea;
