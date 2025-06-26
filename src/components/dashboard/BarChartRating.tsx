import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export interface BarDataEntry {
  district: string;
  avgRating: number;
}

interface BarChartRatingProps {
  data: BarDataEntry[];
}

const BarChartRating: React.FC<BarChartRatingProps> = ({ data }) => (
  <div className="mt-4">
    <h5>Rating Promedio por Distrito</h5>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="district" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="avgRating" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BarChartRating;