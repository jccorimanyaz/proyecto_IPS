import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import "../../styles/dashboard.css";

const provincias = [
  { id: "arequipa", nombre: "Arequipa" },
  { id: "moquegua", nombre: "Moquegua" },
  { id: "puno", nombre: "Puno" },
];

const distritosPorProvincia: Record<string, { id: string; nombre: string }[]> = {
  arequipa: [
    { id: "cayma", nombre: "Cayma" },
    { id: "yanahuara", nombre: "Yanahuara" },
    { id: "paucarpata", nombre: "Paucarpata" },
  ],
  moquegua: [
    { id: "moquegua-centro", nombre: "Moquegua Centro" },
    { id: "ilo", nombre: "Ilo" },
  ],
  puno: [
    { id: "puno-centro", nombre: "Puno Centro" },
    { id: "juliaca", nombre: "Juliaca" },
  ],
};

const Navbar: React.FC = () => {
  const [provincia, setProvincia] = useState("");
  const [distrito, setDistrito] = useState("");
  const [keyword, setKeyword] = useState("");

  const authState = useAppSelector((state) => state.auth);

  // Agregamos log para ver todo el estado de auth
  console.log("Navbar - authState:", authState);

  const { user, isAuthenticated } = authState;

  useEffect(() => {
    console.log("Navbar - isAuthenticated:", isAuthenticated);
    console.log("Navbar - user:", user);
  }, [isAuthenticated, user]);

  const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvincia(e.target.value);
    setDistrito("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Buscando en provincia: ${provincia}, distrito: ${distrito}, keyword: ${keyword}`
    );
  };

  return (
    <nav className="navbar navbar-expand bg-light px-4 py-3 shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <form
          className="d-flex align-items-center gap-2"
          onSubmit={handleSearch}
        >
          <input
            className="form-control"
            type="search"
            placeholder="Buscar"
            aria-label="Buscar"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ minWidth: "150px" }}
          />

          <select
            className="form-select"
            value={provincia}
            onChange={handleProvinciaChange}
            aria-label="Seleccionar Provincia"
          >
            <option value="">Provincia</option>
            {provincias.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={distrito}
            onChange={(e) => setDistrito(e.target.value)}
            aria-label="Seleccionar Distrito"
            disabled={!provincia}
          >
            <option value="">Distrito</option>
            {provincia &&
              distritosPorProvincia[provincia].map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
          </select>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={!provincia}
          >
            Buscar
          </button>
        </form>

        {isAuthenticated && user ? (
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-person-circle fs-3"></i>
            <span>{user.first_name} {user.last_name}</span>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-decoration-none text-dark"
            style={{ cursor: "pointer" }}
          >
            <div className="container text-center">
              <div className="row align-items-center">
                <div className="col col-sm-3">
                  <i className="bi bi-person-circle fs-3"></i>
                </div>
                <div className="col">
                  <span className="col">Login</span>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
