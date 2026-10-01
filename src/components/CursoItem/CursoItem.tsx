type CursoItemProps = {
  id: number;
  nombre: string;
};

const CursoItem = ({ id, nombre }: CursoItemProps) => {
  return (
    <li>
      {nombre} (curso #{id})
    </li>
  );
};

export default CursoItem;
