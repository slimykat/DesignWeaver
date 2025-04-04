import React from 'react';
import './styles/referencePanel.css';
import { Card } from 'antd';
const gridStyle = {
    width: '50%',
    textAlign: 'center',
    
    
};

const ReferencePanel = () => {
  return (
    <div className="reference-panel">
      <Card title="Client Required References">
        <Card.Grid style={gridStyle}>img</Card.Grid>
      </Card>
      <Card title="Designer Own References">
        <Card.Grid style={gridStyle}>img</Card.Grid>
        <Card.Grid style={gridStyle}>img</Card.Grid>
        <Card.Grid style={gridStyle}>img</Card.Grid>
        <Card.Grid style={gridStyle}>img</Card.Grid>
        <Card.Grid style={gridStyle}>img</Card.Grid>
      </Card>
    </div>
  );
};

export default ReferencePanel