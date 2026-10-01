import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import CursoItem from "../CursoItem/CursoItem";
import BotonColor from "../BotonColor/BotonColor";
import type { Curso } from "../../types/Curso";

type HeaderProps = {
  cursos: Curso[];
};

const Header = ({ cursos }: HeaderProps) => {
  const [contador, setContador] = useState(0);
  const [colorTitulo, setColorTitulo] = useState("#1B2A4A");

  useEffect(() => {
    document.title = `Clics: ${contador}`;
  }, [contador]);

  const handleClick = () => {
    setContador((prev) => prev + 1);
  };

  return (
    <>
      <h1 style={{ color: colorTitulo }}>Pilar tecno</h1>
      <p>Bienvenido al curso de React</p>
      <BotonColor colorActual={colorTitulo} onElegirColor={setColorTitulo} />
      <ul className="mt-3">
        {cursos.map((curso) => (
          <CursoItem key={curso.id} id={curso.id} nombre={curso.nombre} />
        ))}
      </ul>
      <p>Hiciste clic {contador} veces</p>
      <Button variant="outline-primary" onClick={handleClick}>
        Saludar
      </Button>
    </>
  );
};

export default Header;
