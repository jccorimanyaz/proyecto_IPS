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

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <Router>
      <Routes>
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

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={<Navigate to="/" replace />} />

        {/* Add more routes as needed */}
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
