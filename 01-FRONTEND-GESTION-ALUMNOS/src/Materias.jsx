import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { ConfirmModal } from "./ConfirmModal"; // importamos el modal

export function Materias() {
  const { fetchAuth } = useAuth();
  const [materias, setMaterias] = useState([]);

  // Estados para manejar el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [materiaAEliminar, setMateriaAEliminar] = useState(null);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    cargarMaterias();
  }, []);

  async function cargarMaterias() {
    try {
      const response = await fetchAuth("http://localhost:3000/materias");
      const data = await response.json();
      setMaterias(data);
    } catch (error) {
      console.error("Error al obtener materias:", error);
    }
  }

  // Abre el modal
  function pedirConfirmacion(id) {
    setMateriaAEliminar(id);
    setMensajeError("");
    setModalAbierto(true);
  }

  // Ejecuta la eliminación
  async function eliminarMateria() {
    try {
      const response = await fetchAuth(`http://localhost:3000/materias/${materiaAEliminar}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setMensajeError(`⚠️ No se puede eliminar:\n${data.message}`);
        return;
      }

      setModalAbierto(false);
      setMateriaAEliminar(null);
      cargarMaterias();

    } catch (error) {
      console.error("Error al eliminar materia:", error);
      setMensajeError("⚠️ Error inesperado al eliminar la materia.");
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
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link to={`/materias/editar/${m.id}`}>
                    <button className="btn-editar">✏️ Editar</button>
                  </Link>
                  <button
                    className="btn-eliminar"
                    onClick={() => pedirConfirmacion(m.id)}
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
            : "¿Seguro que deseas eliminar esta materia?"
        }
        onConfirm={eliminarMateria}
        onCancel={() => setModalAbierto(false)}
      />
    </article>
  );
}
