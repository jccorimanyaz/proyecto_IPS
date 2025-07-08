import React, { useState } from 'react';
// Imports corregidos para usar solo los componentes necesarios
import { Table, Button, Card, Alert, Spinner } from 'react-bootstrap';
import FileSaver from 'file-saver';
import { usePools } from '../hooks/usePools';
import { Pool } from '../types';
import AdminLayout from '../AdminLayout';
import PoolForm from '../components/PoolForm';

const PoolManager: React.FC = () => {
  const { pools, loading, error, stats, addPool, editPool, toggleActive } = usePools();
  const [exporting, setExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);

  const handleExportCSV = () => {
    setExporting(true);
    const csvHeaders = ['ID', 'N° Archivo', 'Propietario', 'Nombre Comercial', 'Distrito', 'Estado Resolución', 'Estado Actual', 'Rating', 'Activo'];
    
    const csvRows = pools.map(p => [
      p.id,
      p.file_number || '-',
      p.legal_name,
      p.commercial_name || '-',
      p.district,
      p.state === 'RES_VALID' ? 'Válida' : 'Expirada',
      p.current_state === 'HEALTHY' ? 'Saludable' : 'No Saludable',
      p.rating ? Number(p.rating).toFixed(1) : '-',
      p.is_active ? 'Sí' : 'No'
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, `piscinas-${new Date().toISOString().split('T')[0]}.csv`);
    setExporting(false);
  };

  const handleOpenModal = (pool: Pool | null) => {
    setSelectedPool(pool);
    setShowModal(true);
  };

  const handleSave = async (poolData: Partial<Pool>) => {
    try {
      const sanitizedData: Partial<Pool> = { ...poolData };
      const numericFields: (keyof Pool)[] = [
        'capacity', 'area_m2', 'volume_m3', 'rating', 'latitude', 'longitude'
      ];

      numericFields.forEach(field => {
        const value = sanitizedData[field];
        if (value === '' || value === null || value === undefined) {
          sanitizedData[field] = undefined;
        } else {
          const numValue = parseFloat(String(value));
          sanitizedData[field] = isNaN(numValue) ? undefined : (numValue as any);
        }
      });

      if ('commercial_name' in sanitizedData && (sanitizedData.commercial_name === null || sanitizedData.commercial_name === '')) {
        sanitizedData.commercial_name = undefined;
      }

      if (selectedPool && selectedPool.id) {
        await editPool(selectedPool.id, sanitizedData);
      } else {
        const newPool = {
          ...sanitizedData,
          file_number: sanitizedData.file_number || '',
          legal_name: sanitizedData.legal_name || '',
          pool_type: sanitizedData.pool_type || '',
          address: sanitizedData.address || '',
          district: sanitizedData.district || '',
          capacity: sanitizedData.capacity || 0,
          area_m2: sanitizedData.area_m2 || 0,
          volume_m3: sanitizedData.volume_m3 || 0,
          state: sanitizedData.state || 'RES_VALID',
          current_state: sanitizedData.current_state || 'HEALTHY',
          is_active: sanitizedData.is_active ?? true,
        } as Omit<Pool, 'id'>;
        
        await addPool(newPool);
      }

      setShowModal(false);
      setSelectedPool(null);
    } catch (error) {
      console.error('Error al guardar la piscina:', error);
    }
  };

  if (loading && !pools.length) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted">Cargando piscinas...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="pool-manager-container">
        {/* Header con estilos mejorados siguiendo el patrón del Dashboard */}
        <div className="d-flex justify-content-between align-items-center mb-4 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg">
          <div>
            <h1 className="mb-1 display-5 fw-bold text-dark">Gestión de Piscinas</h1>
            <p className="mb-0 opacity-75 text-dark">Administración y control de piscinas registradas</p>
          </div>
          <div className="d-flex gap-2">
            <Button 
              variant="light"
              onClick={handleExportCSV}
              disabled={exporting || pools.length === 0}
              className="btn-lg shadow-sm"
            >
              {exporting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Exportando...
                </>
              ) : (
                <>
                  <i className="bi bi-file-earmark-spreadsheet me-2" />
                  Exportar CSV
                </>
              )}
            </Button>
            <Button variant="success" onClick={() => handleOpenModal(null)} className="btn-lg shadow-sm">
              <i className="bi bi-plus-lg me-2" />
              Nueva Piscina
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mx-0 mb-4">
            <i className="bi bi-exclamation-triangle me-2" />
            {error}
          </Alert>
        )}

        {/* Estadísticas con el mismo estilo del Dashboard */}
        {stats && (
          <div className="row mb-4 g-3">
            <div className="col-md-3">
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <i className="bi bi-water text-primary mb-2" style={{ fontSize: '2.5rem' }} />
                  <h3 className="fw-bold text-primary mb-1">{stats.totalPools || 0}</h3>
                  <p className="text-muted mb-0 small">Total Piscinas</p>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <i className="bi bi-toggle-on text-success mb-2" style={{ fontSize: '2.5rem' }} />
                  <h3 className="fw-bold text-success mb-1">{stats.activePools || 0}</h3>
                  <p className="text-muted mb-0 small">Activas</p>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <i className="bi bi-check-circle text-info mb-2" style={{ fontSize: '2.5rem' }} />
                  <h3 className="fw-bold text-info mb-1">{stats.healthyPools || 0}</h3>
                  <p className="text-muted mb-0 small">Saludables</p>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <i className="bi bi-star-fill text-warning mb-2" style={{ fontSize: '2.5rem' }} />
                  <h3 className="fw-bold text-warning mb-1">{stats.averageRating ? Number(stats.averageRating).toFixed(1) : 'N/A'}</h3>
                  <p className="text-muted mb-0 small">Rating Promedio</p>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}

        {/* Tabla de piscinas con estilos mejorados */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <i className="bi bi-table text-primary me-2" style={{ fontSize: '1.2rem' }} />
                <h5 className="mb-0">Lista de Piscinas</h5>
              </div>
              <span className="badge bg-primary rounded-pill">{pools.length}</span>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {pools.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-droplet display-1 text-muted mb-3"></i>
                <h4 className="text-muted mb-3">No hay piscinas registradas</h4>
                <p className="text-muted mb-4">Comienza agregando la primera piscina al sistema</p>
                <Button variant="primary" size="lg" onClick={() => handleOpenModal(null)} className="shadow-sm">
                  <i className="bi bi-plus-lg me-2" />
                  Crear primera piscina
                </Button>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 text-muted fw-semibold">
                        <i className="bi bi-file-text me-1" />
                        N° Archivo
                      </th>
                      <th className="border-0 text-muted fw-semibold">
                        <i className="bi bi-person me-1" />
                        Propietario
                      </th>
                      <th className="border-0 text-muted fw-semibold">
                        <i className="bi bi-shop me-1" />
                        Nombre Comercial
                      </th>
                      <th className="border-0 text-muted fw-semibold">
                        <i className="bi bi-geo-alt me-1" />
                        Distrito
                      </th>
                      <th className="border-0 text-muted fw-semibold">
                        <i className="bi bi-file-check me-1" />
                        Estado Resolución
                      </th>
                      <th className="border-0 text-muted fw-semibold">
                        <i className="bi bi-heart-pulse me-1" />
                        Estado Actual
                      </th>
                      <th className="border-0 text-muted fw-semibold">
                        <i className="bi bi-star me-1" />
                        Rating
                      </th>
                      <th className="border-0 text-muted fw-semibold">
                        <i className="bi bi-power me-1" />
                        Activo
                      </th>
                      <th className="border-0 text-muted fw-semibold">
                        <i className="bi bi-gear me-1" />
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pools.map((pool, index) => (
                      <tr key={pool.id} className={index % 2 === 0 ? 'bg-light bg-opacity-25' : ''}>
                        <td className="align-middle">
                          <span className="fw-medium">{pool.file_number || '-'}</span>
                        </td>
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                              <i className="bi bi-person text-primary" style={{ fontSize: '0.9rem' }} />
                            </div>
                            <span className="fw-medium">{pool.legal_name}</span>
                          </div>
                        </td>
                        <td className="align-middle">
                          <span className="text-muted">{pool.commercial_name || '-'}</span>
                        </td>
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-geo-alt text-info me-1" />
                            <span>{pool.district}</span>
                          </div>
                        </td>
                        <td className="align-middle">
                          <span className={`badge ${pool.state === 'RES_VALID' ? 'bg-success' : 'bg-warning text-dark'} rounded-pill`}>
                            <i className={`bi ${pool.state === 'RES_VALID' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-1`} />
                            {pool.state === 'RES_VALID' ? 'Válida' : 'Expirada'}
                          </span>
                        </td>
                        <td className="align-middle">
                          <span className={`badge ${pool.current_state === 'HEALTHY' ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                            <i className={`bi ${pool.current_state === 'HEALTHY' ? 'bi-heart-pulse' : 'bi-exclamation-diamond'} me-1`} />
                            {pool.current_state === 'HEALTHY' ? 'Saludable' : 'No Saludable'}
                          </span>
                        </td>
                        <td className="align-middle">
                          {pool.rating ? (
                            <div className="d-flex align-items-center">
                              <i className="bi bi-star-fill text-warning me-1" />
                              <span className="fw-medium">{Number(pool.rating).toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="align-middle">
                          <span className={`badge ${pool.is_active ? 'bg-success' : 'bg-secondary'} rounded-pill`}>
                            <i className={`bi ${pool.is_active ? 'bi-check-lg' : 'bi-x-lg'} me-1`} />
                            {pool.is_active ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>
                        <td className="align-middle">
                          <div className="d-flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline-primary" 
                              onClick={() => handleOpenModal(pool)}
                              title="Editar piscina"
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: '32px', height: '32px' }}
                            >
                              <i className="bi bi-pencil-square" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant={pool.is_active ? "outline-warning" : "outline-success"} 
                              onClick={() => toggleActive(pool.id!, !pool.is_active)}
                              title={pool.is_active ? "Desactivar piscina" : "Activar piscina"}
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: '32px', height: '32px' }}
                            >
                              <i className={`bi ${pool.is_active ? 'bi-pause-fill' : 'bi-play-fill'}`} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Información adicional inspirada en el Dashboard */}
        {pools.length > 0 && (
          <div className="mt-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-info-circle text-primary me-2" style={{ fontSize: '1.5rem' }} />
                  <h5 className="mb-0">Resumen de Gestión</h5>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted mb-2">
                        <i className="bi bi-activity me-1" />
                        Estado de Actividad
                      </h6>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <div className="progress" style={{ height: '8px' }}>
                            <div className="progress-bar bg-success" style={{ width: `${stats && stats.totalPools > 0 ? (stats.activePools / stats.totalPools) * 100 : 0}%` }} />
                          </div>
                        </div>
                        <span className="ms-2 fw-bold">
                          {stats && stats.totalPools > 0 ? Math.round((stats.activePools / stats.totalPools) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted mb-2">
                        <i className="bi bi-shield-check me-1" />
                        Piscinas Saludables
                      </h6>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <div className="progress" style={{ height: '8px' }}>
                            <div className="progress-bar bg-info" style={{ width: `${stats && stats.totalPools > 0 ? (stats.healthyPools / stats.totalPools) * 100 : 0}%` }} />
                          </div>
                        </div>
                        <span className="ms-2 fw-bold">
                          {stats && stats.totalPools > 0 ? Math.round((stats.healthyPools / stats.totalPools) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted mb-2">
                        <i className="bi bi-clock me-1" />
                        Última Actualización
                      </h6>
                      <p className="mb-0 fw-bold">{new Date().toLocaleString('es-ES')}</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>

      {/* Modal del formulario */}
      <PoolForm
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedPool(null);
        }}
        selectedPool={selectedPool}
        onSave={handleSave}
      />
    </AdminLayout>
  );
};

export default PoolManager;