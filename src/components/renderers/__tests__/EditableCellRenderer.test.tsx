import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { EditableCellRenderer } from '../EditableCellRenderer';
import { ICellRendererParams } from 'ag-grid-community';

describe('EditableCellRenderer', () => {
  const createMockParams = (
    value: number | string,
    field: string
  ): ICellRendererParams & { field: string; data: Record<string, unknown> } => {
    const mockNode = {
      setData: jest.fn(),
    } as never;

    const mockApi = {
      refreshCells: jest.fn(),
      stopEditing: jest.fn(),
    } as never;

    return {
      value,
      data: { [field]: value },
      field,
      node: mockNode,
      api: mockApi,
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
      registerRowDragger: jest.fn(),
      setTooltip: jest.fn(),
      context: {},
    } as ICellRendererParams & { field: string; data: Record<string, unknown> };
  };

  it('should render text input with decimal inputMode for quantity field', () => {
    const params = createMockParams(10, 'quantity');
    render(<EditableCellRenderer {...params} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('10');
    expect(input).toHaveAttribute('inputMode', 'decimal');
  });

  it('should render text input with decimal inputMode for unitPrice field', () => {
    const params = createMockParams(25.5, 'unitPrice');
    render(<EditableCellRenderer {...params} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('25.5');
    expect(input).toHaveAttribute('inputMode', 'decimal');
  });

  it('should render text input with decimal inputMode for discount field', () => {
    const params = createMockParams(15, 'discount');
    render(<EditableCellRenderer {...params} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('15');
    expect(input).toHaveAttribute('inputMode', 'decimal');
  });

  it('should render text input for other fields', () => {
    const params = createMockParams('test', 'productName');
    render(<EditableCellRenderer {...params} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('test');
  });

  it('should update value on change', () => {
    const params = createMockParams(10, 'quantity');
    render(<EditableCellRenderer {...params} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '20' } });

    expect(input).toHaveValue('20');
  });

  it('should call node.setData and api.refreshCells on change', () => {
    const params = createMockParams(10, 'quantity');
    render(<EditableCellRenderer {...params} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '20' } });

    expect(params.node.setData).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 20 })
    );
    expect(params.api.refreshCells).toHaveBeenCalledWith({
      rowNodes: [params.node],
      force: true,
    });
  });

  it('should call api.stopEditing on blur', () => {
    const params = createMockParams(10, 'quantity');
    render(<EditableCellRenderer {...params} />);

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    expect(params.api.stopEditing).toHaveBeenCalled();
  });

  it('should handle invalid number input', () => {
    const params = createMockParams(10, 'quantity');
    render(<EditableCellRenderer {...params} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc' } });

    // During editing, invalid input is kept as string, converted to 0 on blur
    expect(input).toHaveValue('abc');
  });

  it('should update when value prop changes', () => {
    const params = createMockParams(10, 'quantity');
    const { rerender } = render(<EditableCellRenderer {...params} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('10');

    const newParams = createMockParams(25, 'quantity');
    rerender(<EditableCellRenderer {...newParams} />);

    expect(input).toHaveValue('25');
  });
});

