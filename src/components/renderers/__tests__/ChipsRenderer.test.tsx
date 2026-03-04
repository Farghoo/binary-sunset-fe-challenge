import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChipsRenderer } from '../ChipsRenderer';
import { ICellRendererParams } from 'ag-grid-community';

describe('ChipsRenderer', () => {
  const createMockParams = (status: string): ICellRendererParams => ({
    value: status,
    data: { status },
    node: {} as never,
    api: {} as never,
    columnApi: {} as never,
    colDef: {} as never,
    column: {} as never,
    rowIndex: 0,
    getValue: () => status,
    setValue: jest.fn(),
    formatValue: jest.fn(),
    valueFormatted: status,
    refreshCell: jest.fn(),
    eGridCell: document.createElement('div'),
    eParentOfValue: document.createElement('div'),
    addRenderedRowListener: jest.fn(),
  });

  it('should render High Priority chip with correct styling', () => {
    const params = createMockParams('High Priority');
    const { container } = render(<ChipsRenderer {...params} />);

    const chip = container.querySelector('span[style*="background-color"]') as HTMLElement;
    expect(chip).toBeInTheDocument();
    expect(chip.style.backgroundColor).toBe('rgb(255, 241, 242)');
    expect(chip.style.color).toBe('rgb(220, 38, 38)');
  });

  it('should render Warning chip with correct styling', () => {
    const params = createMockParams('Warning');
    const { container } = render(<ChipsRenderer {...params} />);

    const chip = container.querySelector('span[style*="background-color"]') as HTMLElement;
    expect(chip).toBeInTheDocument();
    expect(chip.style.backgroundColor).toBe('rgb(255, 247, 237)');
    expect(chip.style.color).toBe('rgb(234, 88, 12)');
  });

  it('should render Completed chip with correct styling', () => {
    const params = createMockParams('Completed');
    const { container } = render(<ChipsRenderer {...params} />);

    const chip = container.querySelector('span[style*="background-color"]') as HTMLElement;
    expect(chip).toBeInTheDocument();
    expect(chip.style.backgroundColor).toBe('rgb(240, 253, 244)');
    expect(chip.style.color).toBe('rgb(22, 163, 74)');
  });

  it('should render Pending chip with correct styling', () => {
    const params = createMockParams('Pending');
    const { container } = render(<ChipsRenderer {...params} />);

    const chip = container.querySelector('span[style*="background-color"]') as HTMLElement;
    expect(chip).toBeInTheDocument();
    expect(chip.style.backgroundColor).toBe('rgb(255, 251, 235)');
    expect(chip.style.color).toBe('rgb(217, 119, 6)');
  });

  it('should render Normal chip as default', () => {
    const params = createMockParams('Normal');
    const { container } = render(<ChipsRenderer {...params} />);

    const chip = container.querySelector('span[style*="background-color"]') as HTMLElement;
    expect(chip).toBeInTheDocument();
    expect(chip.style.backgroundColor).toBe('rgb(239, 246, 255)');
    expect(chip.style.color).toBe('rgb(37, 99, 235)');
  });

  it('should default to Normal for unknown status', () => {
    const params = createMockParams('Unknown');
    render(<ChipsRenderer {...params} />);

    const chip = screen.getByText(/Unknown/);
    expect(chip).toBeInTheDocument();
  });

  it('should apply hover styles on mouse enter', () => {
    const params = createMockParams('High Priority');
    const { container } = render(<ChipsRenderer {...params} />);

    const chip = container.querySelector('span[style*="background-color"]') as HTMLElement;
    const initialBoxShadow = chip.style.boxShadow;

    fireEvent.mouseEnter(chip);

    expect(chip.style.transform).toBe('translateY(-1px)');
    expect(chip.style.boxShadow).not.toBe(initialBoxShadow);
    expect(chip.style.boxShadow).toContain('0 4px 8px');
  });

  it('should remove hover styles on mouse leave', () => {
    const params = createMockParams('High Priority');
    const { container } = render(<ChipsRenderer {...params} />);

    const chip = container.querySelector('span[style*="background-color"]') as HTMLElement;
    const initialBoxShadow = chip.style.boxShadow;

    fireEvent.mouseEnter(chip);
    expect(chip.style.transform).toBe('translateY(-1px)');

    fireEvent.mouseLeave(chip);
    expect(chip.style.transform).toBe('translateY(0)');
    expect(chip.style.boxShadow).toBe(initialBoxShadow);
  });
});

