import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Tab, Nav, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Pool } from '../types'; // Adjust the import path according to your project structure

interface Props {
  show: boolean;
  onHide: () => void;
  onSave: () => void;
  poolToEdit?: Pool;
}

const PoolForm: React.FC<Props> = ({ show, onHide, onSave, poolToEdit }) => {
  const [form, setForm] = useState<Pool>({
    file_number: '',
    legal_name: '',
    commercial_name: '',
    pool_type: '',
    address: '',
    district: '',
    capacity: 0,
    area_m2: 0,
    volume_m3: 0,
    approval_resolution_number: '',
    approval_date: '',
    state: 'RES_VALID',
    observations: '',
    expiration_date: '',
    last_inspection_date: '',
    current_state: 'HEALTHY',
    latitude: 0,
    longitude: 0,
    image_url: '',
    rating: 0,
  });

  useEffect(() => {
    if (poolToEdit) {
      // Transform dates to yyyy-MM-dd for input value
      const transformDate = (d?: string) => d ? d.substr(0, 10) : '';
      setForm({
        ...poolToEdit,
        approval_date: transformDate(poolToEdit.approval_date),
        expiration_date: transformDate(poolToEdit.expiration_date),
        last_inspection_date: transformDate(poolToEdit.last_inspection_date),
      } as Pool);
    }
  }, [poolToEdit]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: 
        ['capacity','area_m2','volume_m3','latitude','longitude','rating'].includes(name)
          ? Number(value)
          : value
    }));
  };

  const handleSubmit = () => {
    const req = poolToEdit
      ? axios.put(`/api/admin/pools/${poolToEdit.id}/`, form)
      : axios.post('/api/admin/pools/', form);
    req
      .then(() => { onSave(); onHide(); })
      .catch(err => console.error(err));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{poolToEdit ? 'Editar Piscina' : 'Nueva Piscina'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey="general">
          <Nav variant="tabs">
            <Nav.Item><Nav.Link eventKey="general">General</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="normativo">Normativo</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="ubicacion">Ubicación</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="otros">Otros</Nav.Link></Nav.Item>
          </Nav>
          <Tab.Content className="mt-3">
            {/* General */}
            <Tab.Pane eventKey="general">
              <Form.Group className="mb-3">
                <Form.Label>File Number</Form.Label>
                <Form.Control name="file_number" value={form.file_number} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Legal Name / Owner</Form.Label>
                <Form.Control name="legal_name" value={form.legal_name} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Commercial Name</Form.Label>
                <Form.Control name="commercial_name" value={form.commercial_name || ''} onChange={handleChange} />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Control name="pool_type" value={form.pool_type} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Capacity</Form.Label>
                    <Form.Control type="number" name="capacity" value={form.capacity} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Area (m²)</Form.Label>
                    <Form.Control type="number" step="0.01" name="area_m2" value={form.area_m2} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Volume (m³)</Form.Label>
                    <Form.Control type="number" step="0.01" name="volume_m3" value={form.volume_m3} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Normativo */}
            <Tab.Pane eventKey="normativo">
              <Form.Group className="mb-3">
                <Form.Label>Approval Resolution Number</Form.Label>
                <Form.Control name="approval_resolution_number" value={form.approval_resolution_number || ''} onChange={handleChange} />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Approval Date</Form.Label>
                    <Form.Control type="date" name="approval_date" value={form.approval_date || ''} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Expires On</Form.Label>
                    <Form.Control type="date" name="expiration_date" value={form.expiration_date || ''} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Select name="state" value={form.state} onChange={handleChange}>
                  <option value="RES_VALID">Resolution Valid</option>
                  <option value="RES_EXPIRED">Resolution Expired</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Observations</Form.Label>
                <Form.Control as="textarea" rows={3} name="observations" value={form.observations || ''} onChange={handleChange} />
              </Form.Group>
            </Tab.Pane>

            {/* Ubicación */}
            <Tab.Pane eventKey="ubicacion">
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control as="textarea" rows={2} name="address" value={form.address} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>District</Form.Label>
                <Form.Control name="district" value={form.district} onChange={handleChange} />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control type="number" step="0.000000001" name="latitude" value={form.latitude || 0} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control type="number" step="0.000000001" name="longitude" value={form.longitude || 0} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Otros */}
            <Tab.Pane eventKey="otros">
              <Form.Group className="mb-3">
                <Form.Label>Last Inspection Date</Form.Label>
                <Form.Control type="date" name="last_inspection_date" value={form.last_inspection_date || ''} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Current State</Form.Label>
                <Form.Select name="current_state" value={form.current_state} onChange={handleChange}>
                  <option value="HEALTHY">Healthy</option>
                  <option value="UNHEALTHY">Unhealthy</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control name="image_url" value={form.image_url || ''} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Rating (1-5)</Form.Label>
                <Form.Control type="number" step="0.1" max="5" name="rating" value={form.rating || 0} onChange={handleChange} />
              </Form.Group>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PoolForm;