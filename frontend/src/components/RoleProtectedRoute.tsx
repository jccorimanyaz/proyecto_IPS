import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { ReactNode } from "react";

interface RoleProtectedRouteProps {
  allowedRoles: string[];
  children: ReactNode;
}

export default function RoleProtectedRoute({ allowedRoles, children }: RoleProtectedRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  console.log("RoleProtectedRoute:");
  console.log("isAuthenticated:", isAuthenticated);
  console.log("user:", user);
  console.log("allowedRoles:", allowedRoles);

  // 🔴 Mientras no sepamos si está autenticado, mostramos un loader o null
  if (isAuthenticated === null) {
    console.log("Autenticación cargando...");
    return <div>Cargando...</div>; // Puedes poner un spinner
  }

  if (!isAuthenticated) {
    console.log("No autenticado. Redirigiendo a /login");
    return <Navigate to="/login" />;
  }

  if (user && allowedRoles.includes(user.role)) {
    console.log("Rol permitido. Mostrando children");
    return <>{children}</>;
  }

  console.log("Rol NO permitido. Redirigiendo a /");
  return <Navigate to="/" />;
}

