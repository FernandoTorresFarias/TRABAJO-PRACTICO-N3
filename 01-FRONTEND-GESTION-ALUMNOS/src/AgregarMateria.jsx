import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function AgregarMateria() {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [year, setYear] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetchAuth("http://localhost:3000/materias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, codigo, year }),
      });

      const data = await response.json();

      if (!response.ok) {
        // ✨ Manejo de errores desde el backend
        if (data.errors) {
          const mensajes = data.errors.map(err => err.msg).join(" • ");
          setError(mensajes);
        } else {
          setError(data.message || "Error al registrar la materia");
        }

        setLoading(false);
        return;
      }

      navigate("/materias");

    } catch (err) {
      setError("Error inesperado al registrar");
    }

    setLoading(false);
  }

  return (
    <article>
      <h2>Nueva Materia</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Nombre de la materia
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>

        <label>
          Código
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
        </label>

        <label>
          Año
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
        </label>

        {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </article>
  );
}
