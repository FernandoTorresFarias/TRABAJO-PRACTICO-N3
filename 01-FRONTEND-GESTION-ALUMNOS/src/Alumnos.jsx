import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

export function Alumnos() {
  const { fetchAuth } = useAuth();
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    cargarAlumnos();
  }, []);

  async function cargarAlumnos() {
    try {
      const response = await fetchAuth("http://localhost:3000/alumnos");
      const data = await response.json();
      setAlumnos(data);
    } catch (error) {
      console.error("Error al obtener alumnos:", error);
    }
  }

  async function eliminarAlumno(id) {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este alumno?");
    if (!confirmar) return;

    try {
      await fetchAuth(`http://localhost:3000/alumnos/${id}`, {
        method: "DELETE",
      });

      cargarAlumnos();
    } catch (error) {
      console.error("Error al eliminar alumno:", error);
      alert("⚠️ Error inesperado al eliminar el alumno.");
    }
  }

  return (
    <article>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Listado de Alumnos</h2>
        <Link to="/alumnos/nuevo">
          <button className="secondary">+ Nuevo alumno</button>
        </Link>
      </header>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Apellido</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {alumnos.map((al) => (
            <tr key={al.id}>
              <td>{al.id}</td>
              <td>{al.apellido}</td>
              <td>{al.nombre}</td>
              <td>{al.dni}</td>
              <td>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link to={`/alumnos/editar/${al.id}`}>
                    <button className="btn-editar">✏️ Editar</button>
                  </Link>

                  <button className="btn-eliminar" onClick={() => eliminarAlumno(al.id)}>
                    🗑️ Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
