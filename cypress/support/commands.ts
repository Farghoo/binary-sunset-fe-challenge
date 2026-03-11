// Custom Cypress commands for AG Grid interactions

Cypress.Commands.add('getGridCell', (rowIndex: number, colField: string) => {
  return cy.get(`.ag-row[row-index="${rowIndex}"] .ag-cell[col-id="${colField}"]`);
});

Cypress.Commands.add('waitForGridRows', (minRows: number) => {
  cy.get('.ag-row', { timeout: 30000 }).should('have.length.greaterThan', minRows);
});

declare global {
  namespace Cypress {
    interface Chainable {
      getGridCell(rowIndex: number, colField: string): Chainable<JQuery<HTMLElement>>;
      waitForGridRows(minRows: number): Chainable<void>;
    }
  }
}
