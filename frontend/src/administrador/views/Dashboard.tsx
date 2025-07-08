import React, { useEffect, useState } from 'react';
import AdminLayout from '../AdminLayout';
import PieSalubridad from '../components/charts/PieSalubridad';
import BarRating from '../components/charts/BarRating';
import { Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import API from '../../api/axios';
import { extractArray } from '../../utils/api';

interface Pool {
  id: number;
  district: string;
  rating: number | null;
  current_state: 'HEALTHY' | 'UNHEALTHY';
  is_active: boolean;
}

interface DashboardStats {
  totalPools: number;
  healthyPools: number;
  unhealthyPools: number;
  averageRating: number;
  totalDistricts: number;
  activePools: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPools: 0,
    healthyPools: 0,
    unhealthyPools: 0,
    averageRating: 0,
    totalDistricts: 0,
    activePools: 0
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('pool/all/');
        const pools = extractArray<Pool>(res.data);

        const districts = new Set(pools.map(p => p.district));

        const ratingsWithValues = pools.filter(p => p.rating !== null);

        // ✅ PROMEDIO PONDERADO
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
          totalPools: pools.length,
          healthyPools: pools.filter(p => p.current_state === 'HEALTHY').length,
          unhealthyPools: pools.filter(p => p.current_state === 'UNHEALTHY').length,
          averageRating,
          totalDistricts: districts.size,
          activePools: pools.filter(p => p.is_active).length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const exportPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF('l', 'mm', 'a4'); // Landscape

      doc.setFontSize(20);
      doc.text('Dashboard de Piscinas - Reporte', 20, 20);
      doc.setFontSize(12);
      doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 20, 30);

      doc.setFontSize(14);
      doc.text('Estadísticas Generales:', 20, 45);
      doc.setFontSize(10);
      doc.text(`Total de Piscinas: ${stats.totalPools}`, 20, 55);
      doc.text(`Piscinas Activas: ${stats.activePools}`, 20, 62);
      doc.text(`Piscinas Saludables: ${stats.healthyPools}`, 20, 69);
      doc.text(`Piscinas No Saludables: ${stats.unhealthyPools}`, 20, 76);
      doc.text(`Rating Promedio: ${stats.averageRating}/5`, 20, 83);
      doc.text(`Distritos Registrados: ${stats.totalDistricts}`, 20, 90);

      const chartElements = document.querySelectorAll('.dashboard-chart');
      let y = 100;

      for (const elem of Array.from(chartElements)) {
        const canvas = await html2canvas(elem as HTMLElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        if (y > 150) {
          doc.addPage();
          y = 20;
        }
        doc.addImage(imgData, 'PNG', 20, y, 250, 120);
        y += 130;
      }

      doc.save(`dashboard-piscinas-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted">Cargando dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="d-flex justify-content-between align-items-center mb-4 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg">
          <div>
            <h1 className="mb-1 display-5 fw-bold text-dark">Dashboard</h1>
            <p className="mb-0 opacity-75 text-dark">Panel de Control - Sistema de Gestión de Piscinas</p>
          </div>
          <Button variant="light" onClick={exportPDF} disabled={exporting} className="btn-lg shadow-sm">
            {exporting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Generando PDF...
              </>
            ) : (
              <>
                <i className="bi bi-file-earmark-pdf me-2" />
                Exportar PDF
              </>
            )}
          </Button>
        </div>

        <Row className="mb-4">
          {/* Total piscinas */}
          <Col md={2}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <i className="bi bi-water text-primary mb-2" style={{ fontSize: '2.5rem' }} />
                <h3 className="fw-bold text-primary mb-1">{stats.totalPools}</h3>
                <p className="text-muted mb-0 small">Total Piscinas</p>
              </Card.Body>
            </Card>
          </Col>
          {/* Piscinas saludables */}
          <Col md={2}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <i className="bi bi-check-circle text-success mb-2" style={{ fontSize: '2.5rem' }} />
                <h3 className="fw-bold text-success mb-1">{stats.healthyPools}</h3>
                <p className="text-muted mb-0 small">Saludables</p>
              </Card.Body>
            </Card>
          </Col>
          {/* No saludables */}
          <Col md={2}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <i className="bi bi-x-circle text-danger mb-2" style={{ fontSize: '2.5rem' }} />
                <h3 className="fw-bold text-danger mb-1">{stats.unhealthyPools}</h3>
                <p className="text-muted mb-0 small">No Saludables</p>
              </Card.Body>
            </Card>
          </Col>
          {/* Promedio Rating */}
          <Col md={2}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <i className="bi bi-star-fill text-warning mb-2" style={{ fontSize: '2.5rem' }} />
                <h3 className="fw-bold text-warning mb-1">{stats.averageRating}</h3>
                <p className="text-muted mb-0 small">Rating Promedio</p>
              </Card.Body>
            </Card>
          </Col>
          {/* Distritos */}
          <Col md={2}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <i className="bi bi-geo-alt text-info mb-2" style={{ fontSize: '2.5rem' }} />
                <h3 className="fw-bold text-info mb-1">{stats.totalDistricts}</h3>
                <p className="text-muted mb-0 small">Distritos</p>
              </Card.Body>
            </Card>
          </Col>
          {/* Activas */}
          <Col md={2}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <i className="bi bi-toggle-on text-success mb-2" style={{ fontSize: '2.5rem' }} />
                <h3 className="fw-bold text-success mb-1">{stats.activePools}</h3>
                <p className="text-muted mb-0 small">Activas</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row className="g-4">
          <Col lg={5}><div className="dashboard-chart"><PieSalubridad /></div></Col>
          <Col lg={7}><div className="dashboard-chart"><BarRating /></div></Col>
        </Row>

        {/* Info adicional */}
        <Row className="mt-4">
          <Col md={12}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-info-circle text-primary me-2" style={{ fontSize: '1.5rem' }} />
                  <h5 className="mb-0">Información del Sistema</h5>
                </div>
                <Row>
                  <Col md={4}>
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted">Porcentaje de Salud</h6>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <div className="progress" style={{ height: '8px' }}>
                            <div className="progress-bar bg-success" style={{ width: `${stats.totalPools > 0 ? (stats.healthyPools / stats.totalPools) * 100 : 0}%` }} />
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
                            <div className="progress-bar bg-info" style={{ width: `${stats.totalPools > 0 ? (stats.activePools / stats.totalPools) * 100 : 0}%` }} />
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
      </div>
    </AdminLayout>
  );
};

export default Dashboard;