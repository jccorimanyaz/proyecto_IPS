import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Badge } from 'react-bootstrap';
import FileSaver from 'file-saver';
import API from '../../api/axios';
import { Pool } from '../types';
import AdminLayout from '../AdminLayout';

const PoolManager: React.FC = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPools = () => {
    setLoading(true);
    API.get('pool/all/')
      .then(res => setPools(res.data as Pool[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchPools, []);

  const exportCSV = () => {
    const csvHeaders = ['Propietario', 'Distrito', 'Estado', 'Rating', 'Activo'];
    const csvRows = pools.map(p => [
      p.legal_name,
      p.district,
      p.current_state,
      p.rating ?? '-',
      p.is_active ? 'Sí' : 'No'
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'pools.csv');
  };

  return (
    <AdminLayout>
      <div className="mb-4 p-4 bg-light rounded shadow-sm d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold mb-1">Gestión de Piscinas</h2>
          <p className="text-muted mb-0">Administración de registros actuales</p>
        </div>
        <div>
          <Button variant="success" className="me-2" onClick={exportCSV}>
            <i className="bi bi-file-earmark-spreadsheet-fill me-1" />
            Exportar CSV
          </Button>
          <Button variant="primary" onClick={() => {/* abrir modal */}}>
            <i className="bi bi-plus-lg me-1" />
            Nueva Piscina
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-3 text-muted">Cargando piscinas...</p>
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <Table hover bordered className="mb-0">
            <thead className="table-dark text-center align-middle">
              <tr>
                <th>#</th>
                <th>N° Archivo</th>
                <th>Propietario</th>
                <th>Distrito</th>
                <th>Estado</th>
                <th>Rating</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pools.map((p, idx) => (
                <tr key={p.id} className="align-middle text-center">
                  <td>{idx + 1}</td>
                  <td>{p.file_number}</td>
                  <td>{p.legal_name}</td>
                  <td>{p.district}</td>
                  <td>
                    <Badge bg={p.current_state === 'HEALTHY' ? 'success' : 'danger'}>
                      {p.current_state === 'HEALTHY' ? 'Saludable' : 'No Saludable'}
                    </Badge>
                  </td>
                  <td>
                    {p.rating != null
                      ? <>
                          <i className="bi bi-star-fill text-warning me-1" />
                          {Number(p.rating).toFixed(1)}
                        </>
                      : '-'}
                  </td>
                  <td>
                    <Badge bg={p.is_active ? 'success' : 'secondary'}>
                      {p.is_active ? 'Sí' : 'No'}
                    </Badge>
                  </td>
                  <td>
                    <Button size="sm" variant="outline-primary" className="me-2">
                      <i className="bi bi-pencil-square me-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline-danger">
                      <i className="bi bi-x-octagon me-1" />
                      Desactivar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default PoolManager;
