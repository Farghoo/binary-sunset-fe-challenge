import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';

interface CalculationRendererParams extends ICellRendererParams {
  value: number;
  data: {
    [key: string]: unknown;
  };
}

export const CalculationRenderer: React.FC<CalculationRendererParams> = ({ value }) => {
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })
    : value;

  const isNegative = typeof value === 'number' && value < 0;
  const isHighValue = typeof value === 'number' && value > 1000;

  return (
    <span
      style={{
        fontWeight: isHighValue ? 'bold' : 'normal',
        color: isNegative ? '#ff4444' : '#333333',
        fontFamily: 'monospace',
      }}
    >
      {isHighValue && '💰 '}
      {formattedValue}
    </span>
  );
};

