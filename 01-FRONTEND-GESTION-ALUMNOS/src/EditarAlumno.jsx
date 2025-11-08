import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function AlumnoEditar() {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [apellido, setApellido] = useState("");
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarAlumno();
  }, []);

  async function cargarAlumno() {
    const result = await fetchAuth(`http://localhost:3000/alumnos/${id}`);
    const alumno = await result.json();

    setApellido(alumno.apellido);
    setNombre(alumno.nombre);
    setDni(alumno.dni);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetchAuth(`http://localhost:3000/alumnos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apellido, nombre, dni }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Aqui la data",data)
        //  Nuevo manejo de errores
        if (data.errors) {
          const mensajes = data.errors.map(err => err.msg).join(" • ");
          setError(mensajes);
        } else {
          setError(data.message || "Error inesperado");
        }

        setLoading(false);
        return;
      }

      navigate("/alumnos");
    } catch (err) {
      setError(" Error inesperado al actualizar");
    }

    setLoading(false);
  }

  return (
    <article>
      <h2>Editar Alumno</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Apellido
          <input value={apellido} onChange={(e) => setApellido(e.target.value)} required />
        </label>

        <label>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>

        <label>
          DNI
          <input value={dni} onChange={(e) => setDni(e.target.value)} required />
        </label>

        {/* mensaje ahora viene desde el backend con detalle */}
        {error && <p style={{ color: "red", }}>⚠️ {error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </article>
  );
}
