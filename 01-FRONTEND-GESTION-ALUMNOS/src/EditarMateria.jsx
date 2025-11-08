// EditarMateria.jsx
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function MateriaEditar() {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [year, setYear] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarMateria();
  }, []);

  async function cargarMateria() {
    const result = await fetchAuth(`http://localhost:3000/materias/${id}`);
    const materia = await result.json();

    setNombre(materia.nombre);
    setCodigo(materia.codigo);
    setYear(materia.year);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetchAuth(`http://localhost:3000/materias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, codigo, year }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const mensajes = data.errors.map(err => err.msg).join(" • ");
          setError(mensajes);
        } else {
          setError(data.message || "Error al actualizar la materia");
        }

        setLoading(false);
        return;
      }

      navigate("/materias");
    } catch (err) {
      setError("Error inesperado al actualizar");
    }

    setLoading(false);
  }

  return (
    <article>
      <h2>Editar Materia</h2>

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
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </article>
  );
}
