import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

interface SummaryCardsProps {
    totalSalubres: number;
    totalInsalubres: number;
    pctPositivos: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ totalSalubres, totalInsalubres, pctPositivos }) => (
  <Row className="mb-4">
    <Col md={4}>
      <Card className="text-center">
        <Card.Body>
          <Card.Title>Piscinas Salubres</Card.Title>
          <Card.Text className="display-4">{totalSalubres}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
    <Col md={4}>
      <Card className="text-center">
        <Card.Body>
          <Card.Title>Piscinas Insalubres</Card.Title>
          <Card.Text className="display-4">{totalInsalubres}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
    <Col md={4}>
      <Card className="text-center">
        <Card.Body>
          <Card.Title>% Comentarios Positivos</Card.Title>
          <Card.Text className="display-4">{pctPositivos}%</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  </Row>
);

export default SummaryCards;