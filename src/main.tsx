import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { AgGridProvider } from "ag-grid-react";
import { AllCommunityModule } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AgGridProvider modules={[AllCommunityModule]}>
      <App />
    </AgGridProvider>
  </React.StrictMode>
);
