## Binary Sunset FE Challenge – AG Grid Data Table

### Objective

Develop a **high-performance, interactive data table** using **AG Grid** that demonstrates:
- **Advanced cell rendering**
- **Dynamic, row-level calculations**
- **Real-time, input-driven updates**

The solution should be **robust, well-tested**, and capable of handling **large datasets (10,000+ rows)** efficiently.

### Requirements

#### AG Grid Implementation

- **Large dataset**: Display **at least 10,000 rows** of data.
- **Data variety**: Include a mix of **string**, **number**, and **boolean** fields.
- **Performance features**:
  - Use **AG Grid virtualization** and appropriate **performance optimizations**.
  - Ensure **smooth scrolling**, sorting, and interaction even with the full dataset.

#### Custom Cell Renderers

- **Chips renderer**:
  - Create a custom cell renderer that displays values as styled **“chips”** (badges/tags).
  - The chip’s appearance (e.g. **color**, **icon**, **label**) should change based on:
    - The cell’s raw value, and/or
    - A **calculated status** (e.g. `"High Priority"`, `"Pending"`, `"Completed"`, `"Warning"`).
- **Calculation display renderer**:
  - Implement a custom cell renderer to show **results of dynamic calculations**.
  - This should clearly reflect updated values when underlying data changes.

#### Dynamic Calculations

- **Calculated columns**:
  - Include **at least two columns** whose values are **derived from other columns** in the same row.
  - These values must **recalculate in real-time** when source data changes.
- **Interaction with chips renderer**:
  - One calculated column should **influence a chips-rendered column**.
  - Example: If a calculated `Profit` column falls below a threshold, a `Status` column (using the chips renderer) should show `"Warning"` or similar.

#### Input Fields for Interaction

- **Editable cells**:
  - Make at least one column **directly editable** via input fields (e.g. number/text inputs).
- **Update behavior**:
  - Editing a value must:
    - **Instantly update** that cell’s value in the grid.
    - **Trigger recalculation** of any **dependent calculated columns**.
    - **Update any affected chips** in related cells (e.g. status indicators).

#### Performance

- The table must remain **highly performant and responsive** with **10,000+ entries** while:
  - Scrolling
  - Editing values
  - Sorting / filtering (if implemented)
- You should:
  - **Minimize unnecessary re-renders**
  - Optimize **data update flows** to prevent UI lag.

#### Testing

- **Unit tests**:
  - Cover **custom cell renderers**.
  - Cover **calculation logic**.
  - Cover **data update mechanisms** (e.g. how edits propagate to dependent cells).
- **Integration / E2E tests**:
  - Add integration or end-to-end tests for **critical user flows**, such as:
    - Editing a value and seeing dependent values + chips update.
    - Interacting with a large dataset (e.g. scrolling and editing combined).
- Aim for **good test coverage** on **all custom components and logic**.

### Deliverables

- **Functional web application** demonstrating:
  - AG Grid table with **10,000+ rows**
  - **Custom chips renderer**
  - **Custom calculation renderer**
  - **Dynamic calculations** and **editable inputs** that propagate changes
- **Source code**, including:
  - Custom components and renderers
  - Data generation logic (for the 10k+ rows)
  - Tests (unit + integration/E2E where applicable)
- A **clear setup guide** in this `README` (see below).

### Technology Stack (Suggested)

- **Framework**: React
- **Grid library**: AG Grid (latest stable version)
  - Official React getting started guide: [`https://www.ag-grid.com/react-data-grid/getting-started/`](https://www.ag-grid.com/react-data-grid/getting-started/)
  - You may use the **AG Grid Enterprise** version **for testing purposes** if you wish; the evaluation **watermark is acceptable** for this challenge.
- **Testing**:
  - Jest
  - React Testing Library
  - Cypress (or a similar framework) for E2E / integration tests

You are free to add supporting libraries and tooling as needed, but please keep the stack **focused and justifiable**.

### Getting Started

#### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager

#### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fe-challenge
```

2. Install dependencies:
```bash
npm install
```

#### Running the Application

1. Start the development server:
```bash
npm run dev
```

The application will open automatically in your browser at `http://localhost:3000`.

2. Build for production:
```bash
npm run build
```

3. Preview production build:
```bash
npm run preview
```

#### Running Tests

1. **Unit Tests** (Jest + React Testing Library):
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

2. **E2E Tests** (Cypress):

First, make sure the development server is running (`npm run dev`), then:

Open Cypress Test Runner:
```bash
npm run cypress:open
```

Run Cypress tests headless:
```bash
npm run cypress:run
```

### Implementation Details

#### Features Implemented

✅ **AG Grid with 10,000+ rows**
- Dataset generation with 10,000 rows by default
- Virtual scrolling enabled for optimal performance
- Smooth scrolling and interaction with large datasets

✅ **Custom Cell Renderers**
- **ChipsRenderer**: Displays status values as styled chips with colors and icons
  - Statuses: High Priority (🔴), Pending (⏳), Completed (✅), Warning (⚠️), Normal (ℹ️)
  - Dynamic color coding based on calculated values
- **CalculationRenderer**: Displays calculated values with formatting
  - Monospace font for numbers
  - Special indicators for high values (💰)
  - Color coding for negative values

✅ **Dynamic Calculations**
- **Subtotal**: Calculated as `quantity × unitPrice`
- **Total**: Calculated as `subtotal × (1 - discount/100)`
- **Status**: Dynamically calculated based on total value, active status, and quantity
  - Warning: total < $50
  - High Priority: total > $1000
  - Pending: item is inactive
  - Completed: total > $500 and quantity > 10
  - Normal: default status

✅ **Editable Cells**
- Quantity, Unit Price, and Discount columns are directly editable
- Real-time recalculation of dependent columns
- Instant status updates based on new calculated values

✅ **Performance Optimizations**
- AG Grid virtualization (only visible rows are rendered)
- Memoized column definitions to prevent unnecessary re-renders
- Efficient data update flows using AG Grid's built-in refresh mechanisms
- Row buffering configured for smooth scrolling

#### Project Structure

```
fe-challenge/
├── src/
│   ├── components/
│   │   ├── DataGrid.tsx              # Main AG Grid component
│   │   └── renderers/
│   │       ├── ChipsRenderer.tsx      # Status chips renderer
│   │       ├── CalculationRenderer.tsx # Calculation display renderer
│   │       └── EditableCellRenderer.tsx # Editable input renderer
│   ├── utils/
│   │   ├── dataGenerator.ts          # Dataset generation logic
│   │   └── calculations.ts           # Calculation functions
│   ├── types/
│   │   └── data.ts                   # TypeScript type definitions
│   ├── App.tsx                       # Main application component
│   └── main.tsx                      # Application entry point
├── cypress/
│   └── e2e/
│       └── data-grid.cy.ts           # E2E tests
└── src/
    └── **/__tests__/                 # Unit tests
```

#### Test Coverage

- **Unit Tests**: 
  - Custom cell renderers (ChipsRenderer, CalculationRenderer)
  - Calculation logic (subtotal, total, status)
  - Data generation utilities
- **E2E Tests**:
  - Grid loading and rendering
  - Cell editing and recalculation
  - Status updates
  - Scrolling with large datasets
  - Sorting functionality

### Assumptions and Trade-offs

1. **Data Generation**: 
   - Using random data generation for the 10,000+ rows
   - Data is generated in-memory (not fetched from an API)
   - Assumes data structure remains consistent

2. **Performance**:
   - Relies on AG Grid's built-in virtualization
   - No pagination implemented (all rows loaded at once)
   - Calculations are performed client-side

3. **Status Logic**:
   - Status calculation is based on simple thresholds
   - Can be extended with more complex business rules if needed

4. **Styling**:
   - Uses AG Grid's Alpine theme
   - Custom styling for chips and calculations
   - Responsive design considerations for large tables

5. **Testing**:
   - E2E tests require the dev server to be running
   - Some tests may need adjustment based on actual rendered content
   - Coverage threshold set to 70% for branches, functions, lines, and statements

### Notes

- The application uses **AG Grid Community** version (free)
- All calculations are performed in real-time as values are edited
- The grid supports sorting and filtering out of the box
- Status chips automatically update when dependent values change

---

For this challenge repository, your task is to:

1. **Fork** this repository to your own GitHub account.
2. Implement the AG Grid-based table as described above.
3. Add appropriate tests.
4. Ensure the app runs reliably and performs well with large datasets.
5. **Open a Pull Request** from your fork back to this repository (`Farghoo/binary-sunset-fe-challenge`) with:
   - A clear title and short description of your solution.
   - Any notes on trade-offs, assumptions, or limitations.

