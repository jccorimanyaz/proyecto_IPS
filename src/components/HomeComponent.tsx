import React from 'react';
import '../styles/home.css';

function HomeComponent() {
  return (
    <div className="container py-4">
      <div className="map-placeholder mb-4">
        Aquí irá el mapa interactivo
      </div>

      <div className="pool-list">
        <div className="card d-flex flex-row align-items-center p-3 gap-3">
          <div className="pool-image rounded bg-secondary"></div>

          <div className="flex-grow-1 px-3">
            <h5 className="mb-1">Nombre de la Piscina</h5>
            <ul className="mb-0 text-muted small">
              <li>Agua limpia</li>
              <li>Cloración adecuada</li>
              <li>Sin objetos flotantes</li>
            </ul>
          </div>

          <div className="d-flex align-items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <i key={i} className="bi bi-star text-secondary fs-5"></i>
            ))}
            <i className="bi bi-heart text-danger px-4 fs-4 "></i>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default HomeComponent;
