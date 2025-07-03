import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

const provincias = [
  { id: "arequipa", nombre: "Arequipa" },
  { id: "moquegua", nombre: "Moquegua" },
  { id: "puno", nombre: "Puno" },
];

const distritosPorProvincia: Record<string, { id: string; nombre: string }[]> =
  {
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

  // Actualizar distrito al cambiar provincia
  const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvincia(e.target.value);
    setDistrito(""); // reset distrito al cambiar provincia
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes poner la lógica para buscar con provincia, distrito y keyword
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

        <Link
          to="/login"
          className="text-decoration-none text-dark"
          style={{ cursor: "pointer" }}
        > 
        <div className="container text-center">
          <div className="row align-items-center">
            <div className="col col-sm-3" ><i className="bi bi-person-circle fs-3"></i></div>
            <div className="col"><span className="col">Login</span></div>
          </div>
        </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

/*
<span
            className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white me-2"
            style={{ width: "40px", height: "40px" }}
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-person-fill"></i>
          </span>
          <span
            className=" text-decoration-none text-dark"
            data-bs-toggle="dropdown"
          >
            Login
          </span>



 */