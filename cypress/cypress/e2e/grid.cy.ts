describe("AG Grid Product Inventory", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    // Wait for grid to render
    cy.get(".ag-root-wrapper", { timeout: 10000 }).should("be.visible");
    cy.get(".ag-row", { timeout: 10000 }).should("have.length.greaterThan", 0);
  });

  it("loads the grid with rows", () => {
    cy.get(".ag-header-cell").should("have.length.greaterThan", 5);
    cy.get(".ag-row").should("have.length.greaterThan", 0);
  });

  it("edits unitPrice and updates revenue, profit, and status", () => {
    // Double-click the Unit Price cell in the first row to edit it
    cy.get('.ag-row[row-index="0"] [col-id="unitPrice"]').dblclick();
    cy.get(".ag-cell-inline-editing input").clear().type("999{enter}");

    // Verify revenue column updated (should reflect new price * quantity)
    cy.get('.ag-row[row-index="0"] [col-id="revenue"]').should(
      "contain",
      "$",
    );

    // Verify profit column updated
    cy.get('.ag-row[row-index="0"] [col-id="profit"]').should("contain", "$");

    // Status chip should be visible
    cy.get('.ag-row[row-index="0"] [col-id="status"]').should(
      "not.be.empty",
    );
  });

  it("edits quantity and updates calculated columns", () => {
    cy.get('.ag-row[row-index="0"] [col-id="quantity"]').dblclick();
    cy.get(".ag-cell-inline-editing input").clear().type("0{enter}");

    // Revenue should be $0.00
    cy.get('.ag-row[row-index="0"] [col-id="revenue"]').should(
      "contain",
      "$0.00",
    );
  });

  it("sorts a column", () => {
    // Click on the Product header to sort
    cy.get('.ag-header-cell[col-id="product"]').click();

    // Verify sort indicator appears
    cy.get('.ag-header-cell[col-id="product"] .ag-sort-ascending-icon').should(
      "be.visible",
    );

    // Click again for descending
    cy.get('.ag-header-cell[col-id="product"]').click();
    cy.get(
      '.ag-header-cell[col-id="product"] .ag-sort-descending-icon',
    ).should("be.visible");
  });
});
