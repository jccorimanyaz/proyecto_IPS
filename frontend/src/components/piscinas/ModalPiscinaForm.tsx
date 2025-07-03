import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Pool } from '../../types/Pool';

interface ModalPiscinaFormProps {
  show: boolean;
  onHide: () => void;
  piscina: Pool | null;
}

const ModalPiscinaForm: React.FC<ModalPiscinaFormProps> = ({ show, onHide, piscina }) => {
  const [form, setForm] = useState<Partial<Pool>>({});

  useEffect(() => {
    setForm(piscina ?? {});
  }, [piscina]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Guardar', form);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{piscina ? 'Editar Piscina' : 'Nueva Piscina'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Comercial</Form.Label>
            <Form.Control
              name="commercial_name"
              value={form.commercial_name || ''}
              onChange={handleChange}
            />
          </Form.Group>
          {/* Agrega más campos según Piscina type */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPiscinaForm;