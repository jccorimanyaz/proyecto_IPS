import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/dashboard/SummaryCards';
import PieChartSalubridad, { PieDataEntry } from '../components/dashboard/PieChartSalubridad';
import BarChartRating, { BarDataEntry } from '../components/dashboard/BarChartRating';
import HeatmapMap from '../components/dashboard/HeatMap';

const AdminDashboard: React.FC = () => {
  const summary = { totalSalubres: 42, totalInsalubres: 18, pctPositivos: 76 };
  const pieData: PieDataEntry[] = [
    { state: 'Salubre', value: 42 },
    { state: 'Insalubre', value: 18 },
    { state: 'Pendiente', value: 5 },
  ];
  const barData: BarDataEntry[] = [
    { district: 'Cayma', avgRating: 4.2 },
    { district: 'Yanahuara', avgRating: 3.9 },
  ];

  const heatData: [number, number, number][] = [
    [-16.409, -71.537, 0.5],
    [-16.415, -71.520, 0.7],
    // …
  ];

  return (
    <div className="wrapper">
        <Sidebar />
        <div className="main">
            <Navbar />
            <main className="content px-3 py-4">
                <h2>Dashboard Administrador</h2>
                <SummaryCards {...summary} />
                <div className="row">
                    <div className="col-md-6">
                    <PieChartSalubridad data={pieData} />
                    </div>
                    <div className="col-md-6">
                    <BarChartRating data={barData} />
                    </div>
                </div>
                <div className="mt-5">
                    <HeatmapMap heatData={heatData} />
                </div>
            </main>
        </div>
    </div>
  );
};

export default AdminDashboard;