import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@picocss/pico";
import "./index.css";
import  {Layout}  from "./Layout.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import  App  from "./App.jsx"; 
import  {Alumnos}  from "./Alumnos.jsx";
import  {Materias}  from "./Materias.jsx";
import  {Notas}  from "./Notas.jsx";

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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
