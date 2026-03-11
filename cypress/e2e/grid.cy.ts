describe('Order Analytics Grid', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.ag-row', { timeout: 30000 }).should('exist');
  });

  it('loads the grid and shows total row count in toolbar', () => {
    cy.contains('15,000 rows', { timeout: 15000 }).should('exist');
  });

  it('renders status chips in the Status column', () => {
    cy.get('[col-id="status"] .ag-cell-value', { timeout: 15000 }).first().within(() => {
      cy.get('span').should('exist');
    });
  });

  it('renders device chips in the Device column', () => {
    cy.get('[col-id="device_type"] .ag-cell-value', { timeout: 15000 }).first().within(() => {
      cy.get('span').should('exist');
    });
  });

  it('editing price_usd to low value shows Loss status and negative profit', () => {
    cy.get('[row-index="0"] [col-id="price_usd"]').dblclick();
    cy.focused().clear().type('5{enter}');

    cy.get('[row-index="0"] [col-id="profit"]', { timeout: 5000 }).should('contain', '-');
    cy.get('[row-index="0"] [col-id="status"]').should('contain', 'Loss');
  });

  it('editing price_usd to high value shows Excellent status', () => {
    cy.get('[row-index="0"] [col-id="price_usd"]').dblclick();
    cy.focused().clear().type('500{enter}');

    cy.get('[row-index="0"] [col-id="status"]', { timeout: 5000 }).should('contain', 'Excellent');
    cy.get('[row-index="0"] [col-id="profit"]').should('contain', '▲');
  });

  it('can click the profit column header without crashing the grid', () => {
    cy.get('[col-id="profit"] .ag-header-cell-label').click();
    cy.get('.ag-row').should('exist');
  });

  it('scrolling the grid viewport does not break rendering', () => {
    cy.get('.ag-body-viewport').scrollTo('bottom');
    cy.get('.ag-row').should('exist');
    cy.get('.ag-body-viewport').scrollTo('top');
    cy.get('[row-index="0"]').should('exist');
  });
});
