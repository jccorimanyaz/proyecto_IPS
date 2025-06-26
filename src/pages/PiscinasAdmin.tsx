import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TablaPiscinas from '../components/piscinas/TablaPiscinas';
import ExportCSV from '../components/piscinas/ExportCSV';
import { Pool } from '../types/Pool';

const PiscinasAdmin: React.FC = () => {
  const mockPools: Pool[] = [
    { id: 1, commercial_name: 'Piscina A', legal_name: '', address: '', district: 'Cayma', latitude: 0, longitude: 0, rating: 4.2, current_state: 'Salubre' },
  ];

  return (
    <div className="wrapper">
        <Sidebar />
        <div className="main">
            <Navbar />
            <main className="content px-3 py-4">
                <h2>Gestión de Piscinas</h2>
                <ExportCSV data={mockPools} />
                <TablaPiscinas piscinas={mockPools} />
            </main>
        </div>
    </div>
  );
};

export default PiscinasAdmin;