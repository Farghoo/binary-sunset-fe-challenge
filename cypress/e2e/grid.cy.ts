describe("AG Grid leave table", () => {
  it("edits a value and updates dependent cells + status chip", () => {
    cy.visit("/");

    cy.contains("AG Grid Challenge");

    cy.get('[data-cy="leave-grid"] .ag-center-cols-container .ag-row')
      .its("length")
      .should("be.gt", 0);

    // Edit cost to 9999 and commit
    cy.get(
      '[data-cy="leave-grid"] .ag-center-cols-container .ag-row[row-index="0"] [col-id="cost"]'
    ).dblclick();
    cy.focused().clear().type("9999{enter}");
    cy.get(".ag-cell-inline-editing").should("not.exist");

    // Edit revenue to 0 and commit
    cy.get(
      '[data-cy="leave-grid"] .ag-center-cols-container .ag-row[row-index="0"] [col-id="revenue"]'
    ).dblclick();
    cy.focused().clear().type("0{enter}");
    cy.get(".ag-cell-inline-editing").should("not.exist");

    // Wait for calculation to update (sync point)
    cy.get(
      '[data-cy="leave-grid"] .ag-center-cols-container .ag-row[row-index="0"] [col-id="profit_calc"]'
    ).should("contain.text", "-9999.00");

    // Then assert status chip (allow more time)
    cy.get(
      '[data-cy="leave-grid"] .ag-center-cols-container .ag-row[row-index="0"] [col-id="status_chip"]',
      { timeout: 10000 }
    ).should("contain.text", "Critical");
  });
});
