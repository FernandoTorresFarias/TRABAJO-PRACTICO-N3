import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function AgregarNota() {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();

  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);

  const [alumnoId, setAlumnoId] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [nota1, setNota1] = useState("");
  const [nota2, setNota2] = useState("");
  const [nota3, setNota3] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Cargar alumnos y materias al iniciar
  useEffect(() => {
    cargarAlumnos();
    cargarMaterias();
  }, []);

  async function cargarAlumnos() {
    const res = await fetchAuth("http://localhost:3000/alumnos");
    const data = await res.json();
    setAlumnos(data);
  }

  async function cargarMaterias() {
    const res = await fetchAuth("http://localhost:3000/materias");
    const data = await res.json();
    setMaterias(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetchAuth("http://localhost:3000/notas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alumno_id: alumnoId,
          materia_id: materiaId,
          nota1,
          nota2,
          nota3,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const mensajes = data.errors.map(err => err.msg).join(" • ");
          setError(mensajes);
        } else {
          setError(data.message || "Error al registrar la nota");
        }
        setLoading(false);
        return;
      }

      navigate("/notas");
    } catch (err) {
      setError("Error inesperado al registrar la nota");
    }

    setLoading(false);
  }

  return (
    <article>
      <h2>Registrar Nota</h2>

      <form onSubmit={handleSubmit}>

        <label>
          Alumno
          <select value={alumnoId} onChange={(e) => setAlumnoId(e.target.value)} required>
            <option value="">Seleccione un alumno</option>
            {alumnos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.apellido}, {a.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Materia
          <select value={materiaId} onChange={(e) => setMateriaId(e.target.value)} required>
            <option value="">Seleccione una materia</option>
            {materias.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Nota 1
          <input
            type="number"
            min="1"
            max="10"
            value={nota1}
            onChange={(e) => setNota1(e.target.value)}
            required
          />
        </label>

        <label>
          Nota 2
          <input
            type="number"
            min="1"
            max="10"
            value={nota2}
            onChange={(e) => setNota2(e.target.value)}
            required
          />
        </label>

        <label>
          Nota 3
          <input
            type="number"
            min="1"
            max="10"
            value={nota3}
            onChange={(e) => setNota3(e.target.value)}
            required
          />
        </label>

        {error && <p style={{ color: "crimson" }}>⚠️ {error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Registrar nota"}
        </button>
      </form>
    </article>
  );
}
