import { Routes, Route } from "react-router-dom";
import BarraNavegacion from "./components/BarraNavegacion/BarraNavegacion";
import PaginaInicio from "./pages/PaginaInicio";
import PaginaTareas from "./pages/PaginaTareas";
import PaginaNoEncontrada from "./pages/PaginaNoEncontrada";

function App() {
  return (
    <>
      <BarraNavegacion />
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/tareas" element={<PaginaTareas />} />
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>
    </>
  );
}

export default App;
