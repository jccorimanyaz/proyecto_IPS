import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/list.css';

type Pool = {
  id: number;
  commercial_name: string | null;
  address: string;
  district: string;
  capacity: number;
  current_state: 'HEALTHY' | 'UNHEALTHY';
};

const ListComponent = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  useEffect(() => {
    console.log('🔍 Iniciando petición para obtener piscinas...');
    
    axios.get('http://127.0.0.1:8000/pool/all/')
      .then((response) => {
        console.log('✅ Piscinas obtenidas exitosamente:', response.data);
        setPools(response.data);
      })
      .catch((error) => {
        console.error('❌ Error al obtener las piscinas:', error);
      });
  }, []);

  const handleRowClick = (id: number) => {
    console.log(`🖱️ Se hizo clic en la fila con ID ${id}`);
    setSelectedRow(id);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Piscinas</h2>
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre Comercial</th>
              <th>Dirección</th>
              <th>Distrito</th>
              <th>Capacidad</th>
              <th>Estado Actual</th>
              <th>Calificación</th>
            </tr>
          </thead>
          <tbody>
            {pools.map((piscina) => (
              <tr
                key={piscina.id}
                className={`selectable-row ${selectedRow === piscina.id ? 'table-primary' : ''}`}
                onClick={() => handleRowClick(piscina.id)}
              >
                <td>{piscina.id}</td>
                <td>{piscina.commercial_name || 'Sin nombre'}</td>
                <td>{piscina.address}</td>
                <td>{piscina.district}</td>
                <td>{piscina.capacity}</td>
                <td>
                  <span
                    className={`badge ${
                      piscina.current_state === "HEALTHY"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {piscina.current_state === "HEALTHY" ? "Salubre" : "Insalubre"}
                  </span>
                </td>
                <td>
                  {/* Placeholder para futura calificación */}
                  — / 5 <i className="bi bi-star-fill text-warning"></i>
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

