import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import ModalPiscinaForm from './ModalPiscinaForm';
import { Pool } from '../../types/Pool';

interface TablaPiscinasProps {
  piscinas: Pool[];
}

const TablaPiscinas: React.FC<TablaPiscinasProps> = ({ piscinas }) => {
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState<Pool | null>(null);

  const handleEdit = (p: Pool) => {
    setCurrent(p);
    setShowModal(true);
  };

  return (
    <>
      <Button className="mb-3" onClick={() => { setCurrent(null); setShowModal(true); }}>
        + Nueva Piscina
      </Button>
      <Table striped hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Comercial</th>
            <th>Distrito</th>
            <th>Rating</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {piscinas.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.commercial_name}</td>
              <td>{p.district}</td>
              <td>{p.rating}</td>
              <td>{p.current_state}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(p)}>Editar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ModalPiscinaForm show={showModal} onHide={() => setShowModal(false)} piscina={current} />
    </>
  );
};

export default TablaPiscinas;