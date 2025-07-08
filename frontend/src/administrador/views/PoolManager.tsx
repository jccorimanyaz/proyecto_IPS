import React, { useState } from 'react';
// Imports corregidos para usar solo los componentes necesarios
import { Table, Button, Card, Alert } from 'react-bootstrap';
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

  /**
   * Procesa y guarda los datos de la piscina, asegurando que los tipos
   * de datos coincidan con la interfaz `Pool`.
   */
  const handleSave = async (poolData: Partial<Pool>) => {
    try {
      // 1. Sanitizar los datos para corregir tipos (string -> number/null)
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

      // 2. Asegurarse de que commercial_name sea undefined si está vacío
      if ('commercial_name' in sanitizedData && (sanitizedData.commercial_name === null || sanitizedData.commercial_name === '')) {
        sanitizedData.commercial_name = undefined;
      }

      // 3. Ejecutar la acción de crear o editar
      if (selectedPool && selectedPool.id) {
        await editPool(selectedPool.id, sanitizedData);
      } else {
        // Para crear, se necesita el objeto completo, no parcial
        // Asegurarse de que los campos requeridos estén presentes
        const newPool = {
          ...sanitizedData,
          // Campos requeridos con valores por defecto si no están presentes
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

      // 4. Cerrar el modal después de guardar exitosamente
      setShowModal(false);
      setSelectedPool(null);
    } catch (error) {
      console.error('Error al guardar la piscina:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  // Loading state
  if (loading && !pools.length) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header, botones de acción */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-4">
        <h1>Gestión de Piscinas</h1>
        <div className="d-flex gap-2">
          <Button 
            variant="outline-primary" 
            onClick={handleExportCSV}
            disabled={exporting || pools.length === 0}
          >
            {exporting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Exportando...
              </>
            ) : (
              <>
                <i className="bi bi-download me-2" />
                Exportar CSV
              </>
            )}
          </Button>
          <Button variant="success" onClick={() => handleOpenModal(null)}>
            <i className="bi bi-plus-lg me-2" />
            Nueva Piscina
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mx-4">
          <i className="bi bi-exclamation-triangle me-2" />
          {error}
        </Alert>
      )}

      {/* Estadísticas opcionales */}
      {stats && (
        <div className="row mb-4 px-4">
          <div className="col-md-3">
            <Card className="text-center">
              <Card.Body>
                <h5 className="card-title">Total</h5>
                <h3 className="text-primary">{stats.totalPools || 0}</h3>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-3">
            <Card className="text-center">
              <Card.Body>
                <h5 className="card-title">Activas</h5>
                <h3 className="text-success">{stats.activePools || 0}</h3>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-3">
            <Card className="text-center">
              <Card.Body>
                <h5 className="card-title">Saludables</h5>
                <h3 className="text-info">{stats.healthyPools || 0}</h3>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-3">
            <Card className="text-center">
              <Card.Body>
                <h5 className="card-title">Promedio Rating</h5>
                <h3 className="text-warning">{stats.averageRating ? Number(stats.averageRating).toFixed(1) : 'N/A'}</h3>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}

      {/* Tabla de piscinas */}
      <Card className="mx-4">
        <Card.Header>
          <h5 className="mb-0">Lista de Piscinas ({pools.length})</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {pools.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-4 text-muted"></i>
              <p className="text-muted mt-3">No hay piscinas registradas</p>
              <Button variant="primary" onClick={() => handleOpenModal(null)}>
                <i className="bi bi-plus-lg me-2" />
                Crear primera piscina
              </Button>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>N° Archivo</th>
                  <th>Propietario</th>
                  <th>Nombre Comercial</th>
                  <th>Distrito</th>
                  <th>Estado Resolución</th>
                  <th>Estado Actual</th>
                  <th>Rating</th>
                  <th>Activo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pools.map(pool => (
                  <tr key={pool.id}>
                    <td>{pool.file_number || '-'}</td>
                    <td>{pool.legal_name}</td>
                    <td>{pool.commercial_name || '-'}</td>
                    <td>{pool.district}</td>
                    <td>
                      <span className={`badge ${pool.state === 'RES_VALID' ? 'bg-success' : 'bg-warning'}`}>
                        {pool.state === 'RES_VALID' ? 'Válida' : 'Expirada'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${pool.current_state === 'HEALTHY' ? 'bg-success' : 'bg-danger'}`}>
                        {pool.current_state === 'HEALTHY' ? 'Saludable' : 'No Saludable'}
                      </span>
                    </td>
                    <td>{pool.rating ? Number(pool.rating).toFixed(1) : '-'}</td>
                    <td>
                      <span className={`badge ${pool.is_active ? 'bg-success' : 'bg-secondary'}`}>
                        {pool.is_active ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline-primary" 
                          onClick={() => handleOpenModal(pool)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil-square" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant={pool.is_active ? "outline-warning" : "outline-success"} 
                          onClick={() => toggleActive(pool.id!, !pool.is_active)}
                          title={pool.is_active ? "Desactivar" : "Activar"}
                        >
                          <i className={`bi ${pool.is_active ? 'bi-pause' : 'bi-play'}`} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

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