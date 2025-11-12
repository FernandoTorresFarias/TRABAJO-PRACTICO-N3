import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import "./login.css"

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

  // 2. ESTA ES LA ESTRUCTURA HTML QUE COINCIDE CON TU login.css
  return (
    <div className="login-wrapper">
      
      {/* Columna Izquierda (Azul) */}
      <div className="login-left">
        {/* Asegúrate de tener 'logo.png' en tu carpeta /public */}
        <img 
          src="./recursos/milogo.png" 
          alt="Logo" 
          className="login-image" 
          style={{ width: "150px", marginBottom: "1rem" }} 
        />
        <h2 style={{color:"#373c44"}}>¡Sistema de Gestión De Alumnos!</h2>  <h2>Instituto St. Barbara</h2>
      </div>

      {/* Columna Derecha (Formulario) */}
      <div className="login-right">
        
        {/* Usamos <article> para que PicoCSS le dé el estilo de "tarjeta" */}
        <article className="login-card">
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

          {/* 3. Link de Registro (ahora en un <footer>) */}
          <footer>
            <p style={{ margin: 0, paddingTop: '1rem', borderTop: '1px solid var(--pico-muted-border-color)' }}>
              ¿No tenés cuenta? <Link to="/registro">Registrarse</Link>
            </p>
          </footer>

        </article>
      </div>
    </div>
  );
};

export default LoginForm;