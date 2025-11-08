import { createContext, useContext, useState } from "react";

// Contexto para compartir el estado de autenticación/autorización
const AuthContext = createContext(null);

// Hook personalizado para acceder al contexto de auth
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  //  Iniciar sesión con email y contraseña
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const session = await response.json();

      if (!response.ok && response.status === 400) {
        throw new Error(session.error);
      }

      setToken(session.token);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };

  //  Cerrar sesión
  const logout = () => {
    setToken(null);
    setError(null);
  };

  //  Realizar una petición autenticada
  const fetchAuth = async (url, options = {}) => {
    if (!token) {
      throw new Error("No está iniciada la sesión");
    }

   return fetch(url, {
   ...options,
   headers: {
    ...options.headers,
    Authorization: `Bearer ${token}`,
   },}); };

   return (
    <AuthContext.Provider value={{ token, error, login, logout, fetchAuth }}>
      {children}
    </AuthContext.Provider>
  );};
