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
- **Testing**:
  - Jest
  - React Testing Library
  - Cypress (or a similar framework) for E2E / integration tests

You are free to add supporting libraries and tooling as needed, but please keep the stack **focused and justifiable**.

### Getting Started (What We Expect in Your Submission)

When you implement your solution, please make sure your repository includes:

- **Setup instructions**:
  - How to install dependencies
  - How to run the development server
  - How to run the test suite and (if applicable) Cypress or other E2E tests
- **Any assumptions or trade-offs** you made, documented briefly in this file.

For this challenge repository, your task is to:

1. **Fork** this repository to your own GitHub account.
2. Implement the AG Grid-based table as described above.
3. Add appropriate tests.
4. Ensure the app runs reliably and performs well with large datasets.
5. **Open a Pull Request** from your fork back to this repository (`Farghoo/binary-sunset-fe-challenge`) with:
   - A clear title and short description of your solution.
   - Any notes on trade-offs, assumptions, or limitations.

