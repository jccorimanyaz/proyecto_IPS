import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./containers/Home";
import LoginPage from "./containers/auth/LoginPage";
import RegisterPage from "./containers/auth/SignupPage";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks"; // tu hook de dispatch
import { loadUser } from "./features/auth/authApi";
import "./styles/index.css";

import Pool from "./containers/Pool";

// Vistas del administrador
import Dashboard from "./administrador/views/Dashboard";
import PoolManager from "./administrador/views/PoolManager";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas / usuario normal (requieren login) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/pool/:id"
          element={
            <PrivateRoute>
              <Pool />
            </PrivateRoute>
          }
        />
        <Route
          path="/pool"
          element={
            <PrivateRoute>
              <Pool />
            </PrivateRoute>
          }
        />

        {/* Rutas de autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas del administrador */}
        {/* POR AHORA NO REQUIEREN LOGIN (modo debug) */}
        {/* Para habilitar auth, envolver en <PrivateRoute><Dashboard/></PrivateRoute> y requerir role admin */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/pools" element={<PoolManager />} />

        {/* Redirección por defecto */}
        <Route path="/*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
