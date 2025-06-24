import React from "react";

const PoolComponent = () => {
  const pool = {
    name: "Piscina Municipal de Cayma",
    image:
      "https://parquesdesantander.com/wp-content/uploads/2021/09/acuaparque-juegos-piscina-VF-1024x683.jpg", // Imagen de ejemplo
    description:
      "Piscina con infraestructura moderna, sistema de limpieza diario y supervisión DIGESA.",
    rating: 4.5,
    comments: [
      { user: "Ana", rating: 5, text: "Excelente limpieza y buen ambiente." },
      {
        user: "Luis",
        rating: 4,
        text: "Muy buena, pero deberían mejorar las duchas.",
      },
    ],
  };

  return (
    <div className="container py-4">
      {/* Contenedor principal */}
      <div className="row align-items-center mb-4 shadow-sm rounded border ">
        <div className="col-md-5 p-0">
          <img
            src={pool.image}
            className="img-fluid rounded-start w-100 h-100"
            style={{ maxHeight: "300px", objectFit: "cover" }}
            alt={`Piscina ${pool.name}`}
          />
        </div>
        <div className="col-md-7 d-flex flex-column justify-content-between p-4">
          {/* Nombre de la piscina */}
          <div>
            <h3 className="fw-bold mb-4">{pool.name}</h3>
            
          </div>
          {/* Observaciones como lista */}
          <div className="flex-grow-1 d-flex align-items-center">
            <ul className="mb-0">
              <li>Sistema de limpieza diario</li>
              <li>Supervisión regular de DIGESA</li>
              <li>Área segura para niños</li>
              <li>Agua con cloración adecuada</li>
            </ul>
          </div>

          {/* Calificación */}
          <div className="text-center mt-5 ">
            <p className="mb-0 text-dark">
              Calificación: {pool.rating} ⭐
            </p>
          </div>
        </div>
      </div>

      {/* Comentarios */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Comentarios</h5>
          {pool.comments.map((comment, idx) => (
            <div key={idx} className="mb-3 border-bottom pb-2">
              <p className="mb-1">
                <strong>{comment.user}</strong>
              </p>
              <p className="mb-1">{comment.text}</p>
              <p className="text-dark">⭐ {comment.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoolComponent;
