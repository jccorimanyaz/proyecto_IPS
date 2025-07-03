import React from 'react';
import { CSVLink } from 'react-csv';
import { Button } from 'react-bootstrap';
import { Pool } from '../../types/Pool';

interface ExportCSVProps {
  data: Pool[];
}

const ExportCSV: React.FC<ExportCSVProps> = ({ data }) => {
  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Nombre Comercial', key: 'commercial_name' },
    { label: 'Distrito', key: 'district' },
    { label: 'Rating', key: 'rating' },
    { label: 'Estado', key: 'current_state' },
  ];

  return (
    <CSVLink data={data} headers={headers} filename="piscinas.csv">
      <Button className="mb-3">Exportar CSV</Button>
    </CSVLink>
  );
};

export default ExportCSV;