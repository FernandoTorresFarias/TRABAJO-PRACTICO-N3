import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function AlumnoNuevo() {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();

  const [apellido, setApellido] = useState("");
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");

  const [error, setError] = useState("");  // ✅ muestra errores específicos
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");        // limpia errores previos
    setLoading(true);

    try {
      const response = await fetchAuth("http://localhost:3000/alumnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apellido, nombre, dni }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Errores recibidos:", data);

        // ✅ si vienen errores por campo desde la API
        if (data.errors) {
          const mensajes = data.errors.map(err => err.msg).join(" • ");
          setError(mensajes);
        } else {
          setError(data.message || "Error al registrar el alumno");
        }

        setLoading(false);
        return;
      }

      navigate("/alumnos"); // vuelve al listado
    } catch (err) {
      setError("Error inesperado al registrar");
    }

    setLoading(false);
  }

  return (
    <article>
      <h2>Nuevo Alumno</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Apellido
          <input
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
        </label>

        <label>
          Nombre
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>

        <label>
          DNI
          <input
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
          />
        </label>

        {/* ✅ ahora muestra errores de la API (dni duplicado, etc.) */}
        {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </article>
  );
}
