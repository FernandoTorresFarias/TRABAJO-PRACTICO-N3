import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
export default function RegistroFormulario() {
  const { login } = useAuth(); // opcional para auto-login después del registro
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje("❌ Error: " + data.message);
        return;
      }

      setMensaje("✅ Usuario registrado correctamente");

      // Auto login después de registrarse (opcional)
      // await login(email, password);

    } catch (err) {
      setMensaje("❌ Error inesperado");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registrarse</h3>

      <label>Nombre</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />

      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <label>Contraseña</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

      <button type="submit">Crear cuenta</button>

      {mensaje && <p>{mensaje}</p>}  
      {/* 3. AÑADIR EL LINK PARA VOLVER AL LOGIN */}
      <hr />
      <p>¿Ya tenés cuenta?</p>
      <Link to="/" role="button" className="secondary">
        Iniciar Sesión
      </Link>
    </form>
  );
}
