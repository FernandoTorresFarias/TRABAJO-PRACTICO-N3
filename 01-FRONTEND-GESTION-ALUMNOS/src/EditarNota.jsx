import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarNota() {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);

  const [alumnoId, setAlumnoId] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [nota1, setNota1] = useState("");
  const [nota2, setNota2] = useState("");
  const [nota3, setNota3] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarSelects();
    cargarNota();
  }, []);

  async function cargarSelects() {
    const resAlumnos = await fetchAuth("http://localhost:3000/alumnos");
    setAlumnos(await resAlumnos.json());

    const resMaterias = await fetchAuth("http://localhost:3000/materias");
    setMaterias(await resMaterias.json());
  }

  async function cargarNota() {
    try {
      const res = await fetchAuth(`http://localhost:3000/notas/${id}`);
      const nota = await res.json();

      // seteamos valores ya existentes
      setAlumnoId(nota.alumno_id);
      setMateriaId(nota.materia_id);
      setNota1(nota.nota1);
      setNota2(nota.nota2);
      setNota3(nota.nota3);
    } catch (err) {
      setError("Error al cargar la nota.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetchAuth(`http://localhost:3000/notas/${id}`, {
        method: "PUT",
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
          setError(data.message || "Error al editar la nota");
        }
        setLoading(false);
        return;
      }

      navigate("/notas");
    } catch (err) {
      setError("Error inesperado al editar");
    }

    setLoading(false);
  }

  return (
    <article>
      <h2>Editar Nota</h2>

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
          {loading ? "Guardando cambios..." : "Guardar cambios"}
        </button>
      </form>
    </article>
  );
}
