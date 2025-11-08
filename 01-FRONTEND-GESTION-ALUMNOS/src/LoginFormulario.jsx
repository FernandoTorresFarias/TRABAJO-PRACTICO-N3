import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
const LoginForm = () => {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const result = await login(email, password);

    if (result.success) {
      setMensaje("✅ Sesión iniciada correctamente");
    } else {
      setMensaje("❌ Error al iniciar sesión");
    }
  };

  return (
    <article>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Correo electrónico
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit">Ingresar</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
      {error && <p style={{ color: "crimson" }}>⚠️ {error}</p>}

      {/* 2. AÑADIR EL LINK A REGISTRO */}
      <hr />
      <p>¿No tenés cuenta?</p>
      <Link to="/registro" role="button" className="secondary">
        Registrarse
      </Link>
    </article>
  );
};

export default LoginForm;
