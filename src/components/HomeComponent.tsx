import React, { useState, useEffect } from 'react';
import '../styles/home.css';
import Mapa from './Mapa';
import { Pool } from '../types/Pool';
import axios from 'axios';

function HomeComponent() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/pool/all/')
      .then((res) => {
        setPools(res.data);
        if (res.data.length > 0) {
          setSelectedPool(res.data[0]); // selecciona el primero por defecto
        }
        console.log('✅ Piscinas cargadas:', res.data);
      })
      .catch((err) => {
        console.error('❌ Error al obtener las piscinas:', err);
      });
  }, []);

  const handlePoolSelect = (pool: Pool) => {
    setSelectedPool(pool);
  };

  return (
    <div className="container py-4">
      <div className="map-placeholder mb-4">
        <Mapa
          pools={pools}
          onPoolSelect={handlePoolSelect}
          selectedPoolId={selectedPool?.id.toString()}
        />
      </div>

      <div className="pool-list">
        {selectedPool ? (
          <div className="card d-flex flex-row align-items-center p-3 gap-3">
            <div className="pool-image rounded bg-secondary" style={{
              width: '120px',
              height: '120px',
              backgroundImage: `url(${selectedPool.image_url || ''})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>

            <div className="flex-grow-1 px-3">
              <h5 className="mb-1">
                {selectedPool.commercial_name || selectedPool.legal_name}
              </h5>
              <p className="text-muted small mb-1">{selectedPool.address}, {selectedPool.district}</p>
              <span className={`badge ${
                selectedPool.current_state === 'HEALTHY'
                  ? 'bg-success'
                  : 'bg-danger'
              }`}>
                {selectedPool.current_state === 'HEALTHY' ? 'Salubre' : 'Insalubre'}
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`bi bi-star${i < Math.round(selectedPool.rating) ? "-fill" : ""} text-warning fs-5`}></i>
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


