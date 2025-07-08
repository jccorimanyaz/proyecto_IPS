import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Badge, Row, Col, Card, Modal, Form, Alert } from 'react-bootstrap';
import FileSaver from 'file-saver';
import API from '../../api/axios';
import { Pool } from '../types';
import AdminLayout from '../AdminLayout';
import { extractArray } from '../../utils/api';

interface PoolStats {
  totalPools: number;
  healthyPools: number;
  unhealthyPools: number;
  activePools: number;
  averageRating: number;
}

const PoolManager: React.FC = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [stats, setStats] = useState<PoolStats>({
    totalPools: 0,
    healthyPools: 0,
    unhealthyPools: 0,
    activePools: 0,
    averageRating: 0
  });

  const fetchPools = async () => {
    setLoading(true);
    try {
      const res = await API.get('pool/all/');
      const poolsData = extractArray<Pool>(res.data);
      setPools(poolsData);
      calculateStats(poolsData);
    } catch (error) {
      console.error('Error fetching pools:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (poolsData: Pool[]) => {
    const ratingsWithValues = poolsData.filter(p => p.rating !== null);
    
    // Promedio ponderado similar al Dashboard
    const weightedSum = ratingsWithValues.reduce((sum, p) => {
      const weight = p.is_active ? 1 : 0.5;
      return sum + (p.rating! * weight);
    }, 0);

    const totalWeight = ratingsWithValues.reduce((sum, p) => {
      return sum + (p.is_active ? 1 : 0.5);
    }, 0);

    const averageRating = totalWeight > 0 
      ? Math.round((weightedSum / totalWeight) * 10) / 10 
      : 0;

    setStats({
      totalPools: poolsData.length,
      healthyPools: poolsData.filter(p => p.current_state === 'HEALTHY').length,
      unhealthyPools: poolsData.filter(p => p.current_state === 'UNHEALTHY').length,
      activePools: poolsData.filter(p => p.is_active).length,
      averageRating
    });
  };

  useEffect(() => {
    fetchPools();
  }, []);

  const exportCSV = async () => {
    setExporting(true);
    try {
      const csvHeaders = ['ID', 'N° Archivo', 'Propietario', 'Distrito', 'Estado', 'Rating', 'Activo', 'Fecha Creación'];
      const csvRows = pools.map(p => [
        p.id,
        p.file_number || '-',
        p.legal_name,
        p.district,
        p.current_state === 'HEALTHY' ? 'Saludable' : 'No Saludable',
        p.rating ?? '-',
        p.is_active ? 'Sí' : 'No',
        new Date().toLocaleDateString('es-ES')
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      FileSaver.saveAs(blob, `piscinas-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleEdit = (pool: Pool) => {
    setSelectedPool(pool);
    setShowModal(true);
  };

  const handleToggleActive = async (pool: Pool) => {
    try {
      await API.patch(`pool/${pool.id}/`, { is_active: !pool.is_active });
      fetchPools(); // Refrescar datos
    } catch (error) {
      console.error('Error toggling pool status:', error);
    }
  };

  if (loading) {
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
        {/* Header similar al Dashboard */}
        <div className="d-flex justify-content-between align-items-center mb-4 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg">
          <div>
            <h1 className="mb-1 display-5 fw-bold text-dark">Gestión de Piscinas</h1>
            <p className="mb-0 opacity-75 text-dark">Administración y Control de Registros</p>
          </div>
          <div>
            <Button variant="light" onClick={exportCSV} disabled={exporting} className="me-2 shadow-sm">
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
            <Button variant="success" onClick={() => setShowModal(true)} className="shadow-sm">
              <i className="bi bi-plus-lg me-2" />
              Nueva Piscina
            </Button>
          </div>
        </div>

        {/* Stats Cards similar al Dashboard */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <i className="bi bi-water text-primary mb-2" style={{ fontSize: '2.5rem' }} />
                <h3 className="fw-bold text-primary mb-1">{stats.totalPools}</h3>
                <p className="text-muted mb-0 small">Total Piscinas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <i className="bi bi-check-circle text-success mb-2" style={{ fontSize: '2.5rem' }} />
                <h3 className="fw-bold text-success mb-1">{stats.healthyPools}</h3>
                <p className="text-muted mb-0 small">Saludables</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <i className="bi bi-toggle-on text-info mb-2" style={{ fontSize: '2.5rem' }} />
                <h3 className="fw-bold text-info mb-1">{stats.activePools}</h3>
                <p className="text-muted mb-0 small">Activas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <i className="bi bi-star-fill text-warning mb-2" style={{ fontSize: '2.5rem' }} />
                <h3 className="fw-bold text-warning mb-1">{stats.averageRating}</h3>
                <p className="text-muted mb-0 small">Rating Promedio</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Progress indicators */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-bar-chart text-primary me-2" style={{ fontSize: '1.5rem' }} />
                  <h5 className="mb-0">Indicadores de Rendimiento</h5>
                </div>
                <Row>
                  <Col md={4}>
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Porcentaje de Salud</h6>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <div className="progress" style={{ height: '8px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              style={{ width: `${stats.totalPools > 0 ? (stats.healthyPools / stats.totalPools) * 100 : 0}%` }} 
                            />
                          </div>
                        </div>
                        <span className="ms-2 fw-bold">
                          {stats.totalPools > 0 ? Math.round((stats.healthyPools / stats.totalPools) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Piscinas Activas</h6>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <div className="progress" style={{ height: '8px' }}>
                            <div 
                              className="progress-bar bg-info" 
                              style={{ width: `${stats.totalPools > 0 ? (stats.activePools / stats.totalPools) * 100 : 0}%` }} 
                            />
                          </div>
                        </div>
                        <span className="ms-2 fw-bold">
                          {stats.totalPools > 0 ? Math.round((stats.activePools / stats.totalPools) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Última Actualización</h6>
                      <p className="mb-0 fw-bold">{new Date().toLocaleString('es-ES')}</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-dark text-center align-middle">
                  <tr>
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
                  {pools.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4">
                        <div className="text-muted">
                          <i className="bi bi-inbox" style={{ fontSize: '2rem' }} />
                          <p className="mt-2">No hay piscinas registradas</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pools.map((pool, idx) => (
                      <tr key={pool.id} className="align-middle text-center">
                        <td className="fw-bold">{pool.file_number || '-'}</td>
                        <td className="text-start">{pool.legal_name}</td>
                        <td>{pool.district}</td>
                        <td>
                          <Badge bg={pool.current_state === 'HEALTHY' ? 'success' : 'danger'}>
                            {pool.current_state === 'HEALTHY' ? 'Saludable' : 'No Saludable'}
                          </Badge>
                        </td>
                        <td>
                          {pool.rating != null ? (
                            <div className="d-flex align-items-center justify-content-center">
                              <i className="bi bi-star-fill text-warning me-1" />
                              <span className="fw-bold">{Number(pool.rating).toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <Badge bg={pool.is_active ? 'success' : 'secondary'}>
                            {pool.is_active ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button 
                              size="sm" 
                              variant="outline-primary" 
                              onClick={() => handleEdit(pool)}
                              title="Editar piscina"
                            >
                              <i className="bi bi-pencil-square" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant={pool.is_active ? "outline-warning" : "outline-success"}
                              onClick={() => handleToggleActive(pool)}
                              title={pool.is_active ? "Desactivar" : "Activar"}
                            >
                              <i className={`bi ${pool.is_active ? 'bi-pause' : 'bi-play'}`} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Modal para editar/crear piscina */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedPool ? 'Editar Piscina' : 'Nueva Piscina'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>N° de Archivo</Form.Label>
                    <Form.Control 
                      type="text" 
                      defaultValue={selectedPool?.file_number || ''}
                      placeholder="Ingrese el número de archivo"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Propietario Legal</Form.Label>
                    <Form.Control 
                      type="text" 
                      defaultValue={selectedPool?.legal_name || ''}
                      placeholder="Nombre del propietario"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Distrito</Form.Label>
                    <Form.Control 
                      type="text" 
                      defaultValue={selectedPool?.district || ''}
                      placeholder="Distrito"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select defaultValue={selectedPool?.current_state || 'HEALTHY'}>
                      <option value="HEALTHY">Saludable</option>
                      <option value="UNHEALTHY">No Saludable</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control 
                      type="number" 
                      min="1" 
                      max="5" 
                      step="0.1"
                      defaultValue={selectedPool?.rating || ''}
                      placeholder="1.0 - 5.0"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado de Actividad</Form.Label>
                    <Form.Check 
                      type="switch"
                      label="Piscina Activa"
                      defaultChecked={selectedPool?.is_active ?? true}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => {
              // Aquí iría la lógica para guardar
              setShowModal(false);
              setSelectedPool(null);
            }}>
              {selectedPool ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default PoolManager;