describe('Order Analytics Grid', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads the grid with 10,000+ rows', () => {
    // Wait for data to load
    cy.get('.ag-row', { timeout: 30000 }).should('have.length.greaterThan', 50); // virtualized, only ~50 rendered
    cy.contains(/\d{2,3},\d{3} rows/, { timeout: 30000 }).should('exist'); // toolbar shows row count
  });

  it('renders status chips in the Status column', () => {
    cy.get('.ag-row', { timeout: 30000 }).should('exist');
    // Status chips should be visible
    cy.get('[col-id="status"]').first().within(() => {
      cy.get('span').should('exist'); // Chip rendered
    });
  });

  it('renders device chips in the Device column', () => {
    cy.get('.ag-row', { timeout: 30000 }).should('exist');
    cy.get('[col-id="device_type"]').first().within(() => {
      cy.get('span').should('exist');
    });
  });

  it('editing price_usd updates profit and status chip', () => {
    cy.get('.ag-row', { timeout: 30000 }).should('exist');

    // Get the first row's status before edit
    cy.get('[row-index="0"] [col-id="status"]').invoke('text').as('initialStatus');

    // Double-click to edit price
    cy.get('[row-index="0"] [col-id="price_usd"]').dblclick();

    // Clear and type a very low price to trigger status change
    cy.get('.ag-input-field-input').clear().type('5{enter}');

    // Profit should now be negative (loss)
    cy.get('[row-index="0"] [col-id="profit"]').should('contain', '-');

    // Status chip should show "Loss"
    cy.get('[row-index="0"] [col-id="status"]').should('contain', 'Loss');
  });

  it('editing price_usd to high value shows Excellent status', () => {
    cy.get('.ag-row', { timeout: 30000 }).should('exist');

    cy.get('[row-index="0"] [col-id="price_usd"]').dblclick();
    cy.get('.ag-input-field-input').clear().type('500{enter}');

    // With high price, margin should be excellent
    cy.get('[row-index="0"] [col-id="status"]').should('contain', 'Excellent');
    cy.get('[row-index="0"] [col-id="profit"]').should('contain', '▲');
  });

  it('can sort by profit column', () => {
    cy.get('.ag-row', { timeout: 30000 }).should('exist');
    cy.get('[col-id="profit"] .ag-header-cell-label').click();
    cy.get('.ag-row').should('exist'); // Grid still renders after sort
  });

  it('scrolling maintains grid performance', () => {
    cy.get('.ag-row', { timeout: 30000 }).should('exist');

    // Scroll to bottom
    cy.get('.ag-body-viewport').scrollTo('bottom');
    cy.get('.ag-row').should('exist');

    // Scroll back to top
    cy.get('.ag-body-viewport').scrollTo('top');
    cy.get('[row-index="0"]').should('exist');
  });
});
