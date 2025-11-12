// 1. IMPORTAR useLocation
import { Outlet, Link, useLocation } from "react-router";
import { useAuth } from "./AuthContext";
import LoginForm from "./LoginFormulario";

export const Layout = () => {
  const { token, logout } = useAuth();
  // 2. OBTENER LA UBICACIÓN ACTUAL
  const location = useLocation();

  // 3. REVISAR SI ESTAMOS EN LA RUTA PÚBLICA DE REGISTRO
  const isPublicUnauthRoute = location.pathname === "/registro";

  // 4. LÓGICA DE CONTENIDO
  let content;
  if (!token) {
    // Si NO hay token
    if (isPublicUnauthRoute) {
      // y estamos en /registro, mostramos el Outlet (que cargará RegistroFormulario)
      content = <Outlet />;
    } else {
      // si no, mostramos el Login (en "/", por ejemplo)
      content = <LoginForm />;
    }
  } else {
    // Si HAY token, mostramos siempre el Outlet
    content = <Outlet />;
  }

  return (
    <main className="container">
      {/* nav superior (queda igual) */}
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/alumnos">Alumnos</Link></li>
          <li><Link to="/materias">Materias</Link></li>
          <li><Link to="/notas">Notas</Link></li>
        </ul>

        {token && (
          <button onClick={logout} className="contrast outline">
            Cerrar sesión
          </button>
        )}
      </nav>
      {/* contenido principal */}
      {/* 5. USAR LA NUEVA LÓGICA DE CONTENIDO */}
      <section className={token ? "section--page" : "section--centered"}>
        {content}
      </section>
    </main>
  );
};