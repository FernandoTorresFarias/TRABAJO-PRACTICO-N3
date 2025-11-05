import { Outlet, Link } from "react-router";
import { useAuth } from "./AuthContext";
import LoginForm from "./LoginFormulario";

export const Layout = () => {
  const { token, logout } = useAuth();

  return (
    <main className="container">
      {/* nav superior  */}
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
     <section className={token ? "section--page" : "section--centered"}>
      {!token ? <LoginForm /> : <Outlet />}
     </section>
    </main>
  );
};
