import { useState } from 'react'



function App() {

  return (
    <>
    <article>
  <header>
    <h2>🎓 Bienvenido al Módulo de Gestión de Alumnos</h2>
  </header>

  <p>
    En este espacio podés administrar toda la información relacionada con los alumnos del sistema.
    Desde aquí podrás <strong>agregar nuevos registros</strong>, <strong>editar datos existentes</strong> 
    o <strong>eliminar alumnos</strong> cuando sea necesario.
  </p>

  <h3>🧭 Instrucciones de navegación</h3>
  <ul>
    <li>Usá el botón <strong>“+ Nuevo alumno”</strong> para registrar un nuevo estudiante.</li>
    <li>En la tabla de alumnos, el botón <strong>✏️ Editar</strong> te permite modificar la información del alumno seleccionado.</li>
    <li>El botón <strong>🗑️ Eliminar</strong> abre un cuadro de confirmación antes de borrar un registro.</li>
    <li>Podés acceder al resto de los módulos (Materias, Notas, etc.) desde la barra de navegación superior.</li>
  </ul>

  <p>
    Recordá que cualquier cambio realizado se guarda automáticamente en la base de datos.
    Si experimentás algún error, actualizá la página o revisá tu conexión con el servidor.
  </p>

  <footer>
    <p style={{ fontSize: "0.9rem", color: "gray" }}>
      Sistema de Gestión Académica — © {new Date().getFullYear()}
    </p>
  </footer>
</article>
    </>
  )
}

export default App
