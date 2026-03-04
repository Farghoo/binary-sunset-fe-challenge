import React, { useMemo } from 'react';
import { DataGrid } from './components/DataGrid';
import { generateDataset } from './utils/dataGenerator';
import './App.css';

function App() {
  const rowData = useMemo(() => generateDataset(10000), []);

  return (
    <div className="App">
      <header style={{ padding: '20px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <h1>Binary Sunset FE Challenge - AG Grid Data Table</h1>
        <p>High-performance data table with 10,000+ rows, custom renderers, and dynamic calculations</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Total rows: {rowData.length.toLocaleString()} | 
          Edit quantity, unit price, or discount to see real-time calculations
        </p>
      </header>
      <DataGrid rowData={rowData} />
    </div>
  );
}

export default App;

