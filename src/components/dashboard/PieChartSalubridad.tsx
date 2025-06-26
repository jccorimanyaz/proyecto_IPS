import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export interface PieDataEntry {
    state: string,
    value: number
}

interface PieChartSalubridadProps {
  data: PieDataEntry[];
}

const PieChartSalubridad: React.FC<PieChartSalubridadProps> = ({ data }) => {
  const COLORS = ['#28a745', '#dc3545', '#ffc107'];
  return (
    <div>
      <h5>Estado de Salubridad</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="state"
            outerRadius={100}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartSalubridad;
