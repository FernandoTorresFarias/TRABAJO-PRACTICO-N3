import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { ConfirmModal } from "./ConfirmModal";

export function Notas() {
  const { fetchAuth } = useAuth();
  const [notas, setNotas] = useState([]);

  // Estados para manejar el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [notaAEliminar, setNotaAEliminar] = useState(null);
  const [mensajeError, setMensajeError] = useState("");

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

  // Abrir modal
  function pedirConfirmacion(id) {
    setNotaAEliminar(id);
    setMensajeError("");
    setModalAbierto(true);
  }

  // Confirmar eliminación
  async function eliminarNota() {
    try {
      const response = await fetchAuth(`http://localhost:3000/notas/${notaAEliminar}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setMensajeError(`⚠️ No se puede eliminar:\n${data.message}`);
        return;
      }

      setModalAbierto(false);
      setNotaAEliminar(null);
      cargarNotas();
    } catch (error) {
      console.error("❌ Error eliminando nota:", error);
      setMensajeError("⚠️ Error inesperado al eliminar la nota.");
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
              <td>
                <strong>{calcularPromedio(n.nota1, n.nota2, n.nota3)}</strong>
              </td>
              <td>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link to={`/notas/editar/${n.id}`}>
                    <button className="btn-editar">✏️ Editar</button>
                  </Link>

                  <button
                    className="btn-eliminar"
                    onClick={() => pedirConfirmacion(n.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmación */}
      <ConfirmModal
        open={modalAbierto}
        message={
          mensajeError
            ? mensajeError
            : "¿Seguro que deseas eliminar esta nota?"
        }
        onConfirm={eliminarNota}
        onCancel={() => setModalAbierto(false)}
      />
    </article>
  );
}
