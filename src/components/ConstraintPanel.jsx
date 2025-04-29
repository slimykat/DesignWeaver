import React from 'react';
import './styles/constraintPanel.css';
import { Card } from 'antd';

const ConstraintPanel = () => {
  return (
    <div className="constriant-panel">
      <Card title="Form">Chair</Card>
      <Card title="Size">Inches</Card>
      <Card title="Material">Wood</Card>
      <Card title="Feature">Soft</Card>
      <Card title="Function">Living room</Card>
      <Card title="Style">Barrel</Card>
    </div>
  );
};

export default ConstraintPanel