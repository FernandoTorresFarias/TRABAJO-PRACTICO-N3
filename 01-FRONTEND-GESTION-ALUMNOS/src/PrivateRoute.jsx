import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute() {
  const { token } = useAuth();

  // Si NO hay token, redirige a login
  if (!token) return <Navigate to="/" />;

  // Si hay token, muestra el contenido de la ruta (hijos)
  return <Outlet />;
}
