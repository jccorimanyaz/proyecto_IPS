import React, { useState } from 'react';
import '../styles/home.css';
//para el mapa
import Mapa from './Mapa';
import { Pool } from '../types/Pool';
import { poolsData } from '../data/poolsData';

function HomeComponent() {
  //estado que contendrá todos los datos de las piscinas
  const [pools] = useState<Pool[]>(poolsData);

  //estado para la piscina seleccionada
  const [selectedPool, setSelectedPool] = useState<Pool | null>(poolsData[0] || null);

  //logica para manejar la selección de una piscina
  const handlePoolSelect = (pool: Pool) => {
    setSelectedPool(pool);
  };

  return (
    <div className="container py-4">
      <div className="map-placeholder mb-4">
        <Mapa
          pools={pools}
          onPoolSelect={handlePoolSelect}
          selectedPoolId={selectedPool?.id}
        />
      </div>

      <div className="pool-list">
        {selectedPool ? (
          <div className="card d-flex flex-row align-items-center p-3 gap-3">
            <div className="pool-image rounded bg-secondary"></div>

            <div className="flex-grow-1 px-3">
              <h5 className="mb-1">{selectedPool.name}</h5>
              {selectedPool.features && selectedPool.features.length > 0 && (
                <ul className="mb-0 text-muted small">
                  {selectedPool.features.slice(0, 3).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="d-flex align-items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="bi bi-star text-secondary fs-5"></i>
              ))}
              <i className="bi bi-heart text-danger px-4 fs-4 "></i>
            </div>
          </div>
        ) : (
          <div className="card p-3 text-center text-muted">
            <p className="mb-0">Haz clic en un marcador del mapa para ver los detalles.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeComponent;