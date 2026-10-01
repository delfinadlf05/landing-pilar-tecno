type ModalConfirmarProps = {
  show: boolean;
  mensaje: string;
  onCancelar: () => void;
  onConfirmar: () => void;
};

const ModalConfirmar = ({
  show,
  mensaje,
  onCancelar,
  onConfirmar,
}: ModalConfirmarProps) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div style={{ background: "white", padding: 24, borderRadius: 8 }}>
        <p>{mensaje}</p>
        <button className="btn btn-secondary me-2" onClick={onCancelar}>
          Cancelar
        </button>
        <button className="btn btn-danger" onClick={onConfirmar}>
          Sí, eliminar
        </button>
      </div>
    </div>
  );
};

export default ModalConfirmar;
