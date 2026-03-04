import React from 'react';
import { render, screen } from '@testing-library/react';
import { CalculationRenderer } from '../CalculationRenderer';
import { ICellRendererParams } from 'ag-grid-community';

describe('CalculationRenderer', () => {
  const createMockParams = (value: number): ICellRendererParams => ({
    value,
    data: {},
    node: {} as never,
    api: {} as never,
    columnApi: {} as never,
    colDef: {} as never,
    column: {} as never,
    rowIndex: 0,
    getValue: () => value,
    setValue: jest.fn(),
    formatValue: jest.fn(),
    valueFormatted: value.toString(),
    refreshCell: jest.fn(),
    eGridCell: document.createElement('div'),
    eParentOfValue: document.createElement('div'),
    addRenderedRowListener: jest.fn(),
  });

  it('should render positive numbers correctly', () => {
    const params = createMockParams(1234.56);
    render(<CalculationRenderer {...params} />);

    const element = screen.getByText(/1,234\.56/);
    expect(element).toBeInTheDocument();
  });

  it('should render negative numbers in red', () => {
    const params = createMockParams(-100);
    render(<CalculationRenderer {...params} />);

    const element = screen.getByText(/-100\.00/);
    expect(element).toBeInTheDocument();
    expect(element).toHaveStyle({ color: '#ff4444' });
  });

  it('should render high values with bold font and emoji', () => {
    const params = createMockParams(1500);
    render(<CalculationRenderer {...params} />);

    const element = screen.getByText(/1,500\.00/);
    expect(element).toBeInTheDocument();
    expect(element).toHaveStyle({ fontWeight: 'bold' });
    expect(screen.getByText(/💰/)).toBeInTheDocument();
  });

  it('should format numbers with 2 decimal places', () => {
    const params = createMockParams(99.9);
    render(<CalculationRenderer {...params} />);

    const element = screen.getByText(/99\.90/);
    expect(element).toBeInTheDocument();
  });
});

