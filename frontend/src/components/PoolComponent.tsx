import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Comment {
  user: string;
  rating: number;
  text: string;
}

interface Pool {
  id: number | string;
  commercial_name: string;
  image_url?: string;
  description?: string;
  rating: number;
  comments: Comment[];
  current_state: 'HEALTHY' | 'UNHEALTHY';
}

const PoolComponent = () => {
  const { id } = useParams();
  const [pool, setPool] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/pool/all/${id}/`)
      .then((res) => {
        setPool(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("No se pudo cargar la información de la piscina.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-5">Cargando piscina...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (!pool) return null;

  return (
    
    <div className="container py-4">
      <div className="row align-items-center mb-4 shadow-sm rounded border">
        <div className="col-md-5 p-0">
          <img
            src={pool.image_url || "https://via.placeholder.com/500x300?text=Sin+imagen"}
            className="img-fluid rounded-start w-100 h-100"
            style={{ maxHeight: "300px", objectFit: "cover" }}
            alt={`Piscina ${pool.commercial_name}`}
          />
        </div>
        <div className="col-md-7 d-flex flex-column justify-content-between p-4">
          <div>
            <h3 className="fw-bold mb-2">{pool.commercial_name}</h3>
            <span className={`badge ${
                pool.current_state === 'HEALTHY'
                  ? 'bg-success'
                  : 'bg-danger'
              }`}>
                {pool.current_state === 'HEALTHY' ? 'Salubre' : 'Insalubre'}
          </span>
          </div>
          
          <div className="flex-grow-1 d-flex align-items-center mt-3">
            <ul className="mb-0">
              <li>Sistema de limpieza diario</li>
              <li>Supervisión regular de DIGESA</li>
              <li>Área segura para niños</li>
              <li>Agua con cloración adecuada</li>
            </ul>
          </div>
          <div className="text-center mt-5">
            <p className="mb-0 text-dark">Calificación: {pool.rating} ⭐</p>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Comentarios</h5>
          {pool.comments && pool.comments.length > 0 ? (
            pool.comments.map((comment, idx) => (
              <div key={idx} className="mb-3 border-bottom pb-2">
                <p className="mb-1">
                  <strong>{comment.user}</strong>
                </p>
                <p className="mb-1">{comment.text}</p>
                <p className="text-dark">⭐ {comment.rating}</p>
              </div>
            ))
          ) : (
            <p className="text-muted">No hay comentarios aún.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoolComponent;