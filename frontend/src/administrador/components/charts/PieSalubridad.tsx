import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API from '../../../api/axios';
import { extractArray } from '../../../utils/api';

interface Pool {
  current_state: 'HEALTHY' | 'UNHEALTHY';
}

interface DataItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const COLORS = {
  HEALTHY: '#10b981',   // Verde esmeralda
  UNHEALTHY: '#ef4444', // Rojo coral
};

const PieSalubridad: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPools, setTotalPools] = useState(0);

  useEffect(() => {
    API.get('pool/all/')
      .then(res => {
        const pools = extractArray<Pool>(res.data);
        const counts = pools.reduce(
          (acc, p) => {
            if (p.current_state === 'HEALTHY') acc.HEALTHY++;
            else acc.UNHEALTHY++;
            return acc;
          },
          { HEALTHY: 0, UNHEALTHY: 0 }
        );

        const total = counts.HEALTHY + counts.UNHEALTHY;
        setTotalPools(total);

        setData([
          {
            name: 'Saludables',
            value: counts.HEALTHY,
            percentage: total > 0 ? Math.round((counts.HEALTHY / total) * 100) : 0,
            color: COLORS.HEALTHY
          },
          {
            name: 'No Saludables',
            value: counts.UNHEALTHY,
            percentage: total > 0 ? Math.round((counts.UNHEALTHY / total) * 100) : 0,
            color: COLORS.UNHEALTHY
          },
        ]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="border border-secondary rounded p-2 bg-white shadow-sm">
          <p className="fw-bold mb-1 text-dark">{data.name}</p>
          <p className="mb-0 small text-muted">{data.value} piscinas</p>
          <p className="mb-0 small text-muted">{data.percentage}% del total</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '0.8rem', fontWeight: 600 }}
      >
        {percentage > 5 ? `${percentage}%` : ''}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0 text-dark">Estado de Salubridad</h5>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center" style={{ height: 350 }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted">Cargando datos de salubridad...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length || data.every(d => d.value === 0)) {
    return (
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Estado de Salubridad</h5>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center" style={{ height: 350 }}>
          <div className="text-center">
            <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            <p className="text-muted mt-3">No hay datos disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Estado de Salubridad</h5>
        <span className="badge bg-light text-dark">
          {totalPools} piscinas
        </span>
      </div>

      <div className="card-body p-4">
        <div className="row">
          <div className="col-md-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string, entry: any) => (
                    <span style={{ color: entry.color, fontWeight: 'bold' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="col-md-4">
            <div className="h-100 d-flex flex-column justify-content-center">
              <h6 className="text-muted mb-3">Resumen</h6>
              {data.map((item, index) => (
                <div key={index} className="mb-3 p-3 rounded bg-light">
                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="me-2 rounded-circle"
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: item.color
                      }}
                    ></div>
                    <span className="fw-bold">{item.name}</span>
                  </div>
                  <div className="text-muted small">
                    <div>{item.value} piscinas</div>
                    <div className="fw-bold" style={{ color: item.color }}>
                      {item.percentage}% del total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieSalubridad;