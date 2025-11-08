// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@picocss/pico";
import "./index.css";
import { Layout } from "./Layout.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import { Alumnos } from "./Alumnos.jsx";
import { Materias } from "./Materias.jsx";
import { Notas } from "./Notas.jsx";
import RegistroFormulario from "./RegistroFormulario.jsx";
import AlumnoNuevo from "./AgregarAlumno.jsx";
import AlumnoEditar from "./EditarAlumno.jsx";
import AgregarMateria from "./AgregarMateria.jsx"
import MateriaEditar from "./EditarMateria.jsx";
import AgregarNota from "./AgregarNota.jsx";
import EditarNota from "./EditarNota.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="alumnos" element={<Alumnos />} />
            <Route path="materias" element={<Materias />} />
            <Route path="notas" element={<Notas />} />
            
            {/* 2. AÑADIR LA RUTA DE REGISTRO */}
            <Route path="registro" element={<RegistroFormulario />} />

            <Route path="alumnos/nuevo" element={<AlumnoNuevo />} />
            <Route path="alumnos/editar/:id" element={<AlumnoEditar />} />

            <Route path="materias/nueva" element={<AgregarMateria />} />
            <Route path="materias/editar/:id" element={<MateriaEditar />} />

            <Route path="notas/nueva" element={<AgregarNota />} />
            <Route path="notas/editar/:id" element={<EditarNota />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);