// Notas.jsx
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

export function Notas() {
  const { fetchAuth } = useAuth();
  const [notas, setNotas] = useState([]);

  useEffect(() => {
    cargarNotas();
  }, []);

  async function cargarNotas() {
    try {
      const response = await fetchAuth("http://localhost:3000/notas");
      const data = await response.json();
      setNotas(data);
    } catch (error) {
      console.error("❌ Error obteniendo notas:", error);
    }
  }

  async function eliminarNota(id) {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta nota?");
    if (!confirmar) return;

    try {
      await fetchAuth(`http://localhost:3000/notas/${id}`, {
        method: "DELETE",
      });

      cargarNotas();
    } catch (error) {
      console.error("❌ Error eliminando nota:", error);
      alert("⚠️ Error inesperado al eliminar la nota.");
    }
  }

  function calcularPromedio(n1, n2, n3) {
    return ((n1 + n2 + n3) / 3).toFixed(2);
  }

  return (
    <article>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Notas por alumno</h2>
        <Link to="/notas/nueva">
          <button className="secondary">+ Nueva nota</button>
        </Link>
      </header>

      <table>
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Materia</th>
            <th>Nota 1</th>
            <th>Nota 2</th>
            <th>Nota 3</th>
            <th>Promedio</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {notas.map((n) => (
            <tr key={n.id}>
              <td>{n.alumno}</td>
              <td>{n.materia}</td>
              <td>{n.nota1}</td>
              <td>{n.nota2}</td>
              <td>{n.nota3}</td>
              <td><strong>{calcularPromedio(n.nota1, n.nota2, n.nota3)}</strong></td>

              <td>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link to={`/notas/editar/${n.id}`}>
                    <button className="btn-editar">✏️ Editar</button>
                  </Link>

                  <button className="btn-eliminar" onClick={() => eliminarNota(n.id)}>
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
