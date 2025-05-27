import React, { useState } from 'react';
import '../styles/list.css';

const mockData = [
  {
    id: 1,
    nombre: "Piscina Municipal",
    provincia: "Arequipa",
    distrito: "Cercado",
    estado: "Salubre",
    calificacion: "4.2",
  },
  {
    id: 2,
    nombre: "Club Natación",
    provincia: "Arequipa",
    distrito: "Yanahuara",
    estado: "Insalubre",
    calificacion: "2.7",
  },
  {
    id: 3,
    nombre: "Piscina del Sur",
    provincia: "Arequipa",
    distrito: "Hunter",
    estado: "En visto",
    calificacion: "3.5",
  },
];

const ListComponent = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);


  const handleRowClick = (id: number) => {
    setSelectedRow(id);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Piscinas</h2>
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Provincia</th>
              <th>Distrito</th>
              <th>Estado</th>
              <th>Calificación</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((piscina) => (
              <tr
                key={piscina.id}
                className={`selectable-row ${selectedRow === piscina.id ? 'table-primary' : ''}`}
                onClick={() => handleRowClick(piscina.id)}
              >
                <td>{piscina.nombre}</td>
                <td>{piscina.provincia}</td>
                <td>{piscina.distrito}</td>
                <td>
                  <span
                    className={`badge ${
                      piscina.estado === "Salubre"
                        ? "bg-success"
                        : piscina.estado === "Insalubre"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {piscina.estado}
                  </span>
                </td>
                <td>
                  {piscina.calificacion} / 5&nbsp;
                  <i className="bi bi-star-fill text-warning"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListComponent;
