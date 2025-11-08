import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

export function Materias() {
  const { fetchAuth } = useAuth();
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    cargarMaterias();
  }, []);

  async function cargarMaterias() {
    try {
      const response = await fetchAuth("http://localhost:3000/materias");
      const data = await response.json();
      setMaterias(data);
    } catch (error) {
      console.error(" Error al obtener materias:", error);
    }
  }

  async function eliminarMateria(id) {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta materia?");

    if (!confirmar) return; //  canceló usuario

    try {
      const response = await fetchAuth(`http://localhost:3000/materias/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        //  Mostramos el mensaje de la API (FK con notas)
        alert(` No se puede eliminar:\n${data.message}`);
        return;
      }

      cargarMaterias();

    } catch (error) {
      console.error("Error al eliminar materia:", error);
      alert("⚠️ Error inesperado al eliminar la materia.");
    }
  }

  return (
    <article>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Listado de Materias</h2>
        <Link to="/materias/nueva">
          <button className="secondary">+ Nueva materia</button>
        </Link>
      </header>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Materia</th>
            <th>Código</th>
            <th>Año</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {materias.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.nombre}</td>
              <td>{m.codigo}</td>
              <td>{m.year}</td>
              <td>
                <Link to={`/materias/editar/${m.id}`}>
                  <button>✏️ Editar</button>
                </Link>
                <button onClick={() => eliminarMateria(m.id)} className="contrast">
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
