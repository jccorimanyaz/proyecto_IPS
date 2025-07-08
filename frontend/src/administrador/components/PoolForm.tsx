// src/components/PoolForm.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Pool } from '../types';

interface PoolFormProps {
    show: boolean;
    onHide: () => void;
    onSave: (poolData: Partial<Pool>) => Promise<void>;
    selectedPool: Pool | null;
}

const PoolForm: React.FC<PoolFormProps> = ({ show, onHide, onSave, selectedPool }) => {
    const [formData, setFormData] = useState<Partial<Pool>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = selectedPool !== null;

    useEffect(() => {
        // Inicializa el formulario con los datos de la piscina seleccionada o valores por defecto
        if (selectedPool) {
            setFormData(selectedPool);
        } else {
            setFormData({
                state: 'RES_VALID',
                current_state: 'HEALTHY',
                is_active: true,
            });
        }
    }, [selectedPool, show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSaving(true);
        try {
            await onSave(formData);
            onHide();
        } catch (err: any) {
            setError(err.message || 'Error al guardar. Verifique los campos.');
        } finally {
            setIsSaving(false);
        }
    };

    // Campos que solo se muestran en el modo de creación
    const creationFields = (
        <>
            {/* ... Agrega aquí todos los campos del modelo `Pool` para la creación ... */}
            {/* Ejemplo: */}
            <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>N° de Archivo</Form.Label><Form.Control type="text" name="file_number" value={formData.file_number || ''} onChange={handleChange} required /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Propietario Legal</Form.Label><Form.Control type="text" name="legal_name" value={formData.legal_name || ''} onChange={handleChange} required /></Form.Group></Col>
            </Row>
             <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Distrito</Form.Label><Form.Control type="text" name="district" value={formData.district || ''} onChange={handleChange} required /></Form.Group></Col>
                {/* ... y así sucesivamente con todos los campos del modelo */}
            </Row>
        </>
    );

    // Campos que se muestran tanto en creación como en edición (los que están en la tabla)
    const commonFields = (
         <>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Estado Actual</Form.Label>
                        <Form.Select name="current_state" value={formData.current_state || 'HEALTHY'} onChange={handleChange}>
                            <option value="HEALTHY">Saludable</option>
                            <option value="UNHEALTHY">No Saludable</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                 <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Rating (1-5)</Form.Label>
                        <Form.Control type="number" name="rating" min="1" max="5" step="0.1" value={formData.rating || ''} onChange={handleChange} />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3">
                <Form.Check type="switch" name="is_active" label="Piscina Activa" checked={formData.is_active ?? true} onChange={handleChange} />
            </Form.Group>
        </>
    );

    return (
        <Modal show={show} onHide={onHide} size="lg" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? `Editar Piscina: ${selectedPool?.legal_name}`: 'Nueva Piscina'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    {!isEditMode && creationFields}
                    {commonFields}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={isSaving}>Cancelar</Button>
                    <Button variant="primary" type="submit" disabled={isSaving}>
                        {isSaving ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/> Guardando...</> : (isEditMode ? 'Actualizar' : 'Crear')}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default PoolForm;