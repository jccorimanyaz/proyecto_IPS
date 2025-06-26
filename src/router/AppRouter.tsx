import Home from "../pages/Home";
import List from "../pages/List";
import Login from "../pages/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import Pool from "../pages/Pool";

//rutas de admin
//import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import PiscinasAdmin from '../pages/PiscinasAdmin';

export const AppRouter = () => {
  return (
    <Routes>
      {/* rutas publicas para el usuario normal */}
      <Route path="/" element={<Home />} />
      <Route path="/list" element={<List/>} />
      <Route path="/*" element={<Navigate to="/" />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/pool/:id" element={<Pool />} />

      <Route path="/pool" element={<Pool/>} />

      {/* rutas publicas para el admin (sin auth) */}
      {/*<Route path="/admin/login" element={<AdminLogin />} />*/}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/piscinas" element={<PiscinasAdmin />} />

      {/* Redirecciones */}
      <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;