import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Cell
} from 'recharts';
import API from '../../../api/axios';
import { extractArray } from '../../../utils/api';

interface Pool {
  district: string;
  rating: number | null;
}

interface RatingItem {
  district: string;
  average: number;
  count: number;
  color: string;
}

const BarRating: React.FC = () => {
  const [data, setData] = useState<RatingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getColorByRating = (rating: number): string => {
    if (rating >= 4.5) return '#10b981';
    if (rating >= 4.0) return '#22c55e';
    if (rating >= 3.5) return '#eab308';
    if (rating >= 3.0) return '#f59e0b';
    if (rating >= 2.0) return '#f97316';
    return '#ef4444';
  };

  useEffect(() => {
    API.get('pool/all/')
      .then(res => {
        const pools = extractArray<Pool>(res.data);
        const filteredPools = pools.filter(p => p.rating !== null);
        const sums: Record<string, { total: number; count: number }> = {};

        filteredPools.forEach(p => {
          if (!sums[p.district]) sums[p.district] = { total: 0, count: 0 };
          sums[p.district].total += p.rating!;
          sums[p.district].count += 1;
        });

        const chartData: RatingItem[] = Object.entries(sums)
          .map(([district, { total, count }]) => {
            const average = Number((total / count).toFixed(1));
            return {
              district,
              average,
              count,
              color: getColorByRating(average)
            };
          })
          .sort((a, b) => b.average - a.average);

        setData(chartData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="border rounded p-2 bg-white shadow-sm">
          <p className="fw-bold mb-2 text-dark">{label}</p>
          <div className="d-flex align-items-center mb-2">
            <div>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    color: i < Math.floor(data.average) ? '#facc15' : '#d1d5db',
                    fontSize: '1.25rem'
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="ms-2 fw-bold">{data.average}/5</span>
          </div>
          <p className="small text-muted">
            Basado en {data.count} piscina{data.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ x, y, width, value }: any) => (
    <text
      x={x + width / 2}
      y={y - 5}
      textAnchor="middle"
      style={{ fontSize: '0.8rem', fontWeight: 600 }}
      fill="#374151"
    >
      {value}
    </text>
  );

  const renderHeader = (content: string) => (
    <div className="card-header bg-primary text-white">
      <h5 className="mb-0">{content}</h5>
    </div>
  );

  if (loading) {
    return (
      <div className="card mb-4">
        {renderHeader('Rating Promedio por Distrito')}
        <div className="card-body d-flex justify-content-center align-items-center" style={{ height: 350 }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted">Cargando datos de rating...</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card mb-4">
        {renderHeader('Rating Promedio por Distrito')}
        <div className="card-body d-flex justify-content-center align-items-center" style={{ height: 350 }}>
          <div className="text-center">
            <i className="bi bi-bar-chart text-warning" style={{ fontSize: '3rem' }}></i>
            <p className="text-muted mt-3">No hay datos de rating disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Rating Promedio por Distrito</h5>
        <span className="badge bg-light text-dark">
          {data.length} distrito{data.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="card-body p-4">
        <div className="row">
          <div className="col-md-9">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data}
                margin={{ top: 30, right: 30, left: 20, bottom: 60 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="district"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis
                  domain={[0, 5]}
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  label={{ value: 'Rating', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="average"
                  radius={[4, 4, 0, 0]}
                  label={<CustomLabel />}
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="col-md-3">
            <div className="h-100 d-flex flex-column justify-content-center">
              <h6 className="text-muted mb-3">Leyenda de Rating</h6>

              <div className="mb-3">
                {[
                  { range: '4.5 - 5.0', color: '#10b981', label: 'Excelente' },
                  { range: '4.0 - 4.4', color: '#22c55e', label: 'Muy Bueno' },
                  { range: '3.5 - 3.9', color: '#eab308', label: 'Bueno' },
                  { range: '3.0 - 3.4', color: '#f59e0b', label: 'Regular' },
                  { range: '2.0 - 2.9', color: '#f97316', label: 'Malo' },
                  { range: '< 2.0', color: '#ef4444', label: 'Muy Malo' }
                ].map((item, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <div
                      className="me-2 rounded"
                      style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: item.color
                      }}
                    ></div>
                    <div>
                      <div className="small fw-bold">{item.label}</div>
                      <div className="small text-muted">{item.range}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 p-3 bg-light rounded">
                <h6 className="small text-muted mb-2">Estadísticas</h6>
                <div className="small">
                  <div>
                    Promedio general:{' '}
                    <strong>
                      {(data.reduce((sum, item) => sum + item.average, 0) / data.length).toFixed(1)}
                    </strong>
                  </div>
                  <div>Mejor distrito: <strong>{data[0]?.district}</strong></div>
                  <div>Rating más alto: <strong>{data[0]?.average}</strong></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarRating;
