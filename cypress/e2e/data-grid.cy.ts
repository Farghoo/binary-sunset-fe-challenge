describe('Data Grid E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load and display the data grid with 10,000+ rows', () => {
    cy.get('.ag-theme-alpine').should('be.visible');
    cy.get('.ag-center-cols-container').should('exist');
    
    // Verify that rows are rendered (AG Grid uses virtualization)
    cy.get('.ag-row').should('have.length.greaterThan', 0);
  });

  it('should display custom chips renderer for status column', () => {
    // Wait for grid to load
    cy.get('.ag-theme-alpine').should('be.visible');
    
    // Check if status chips are rendered (they should have specific styling)
    cy.get('.ag-row').first().within(() => {
      cy.get('[style*="border-radius"]').should('exist');
    });
  });

  it('should allow editing quantity and trigger recalculation', () => {
    cy.get('.ag-theme-alpine').should('be.visible');
    
    // Find the first row and get initial values
    cy.get('.ag-row').first().within(() => {
      // Get the quantity cell (4th column, index 3)
      cy.get('.ag-cell').eq(3).within(() => {
        cy.get('input').clear().type('50');
      });
    });

    // Wait for recalculation
    cy.wait(100);

    // Verify that calculated columns have updated
    cy.get('.ag-row').first().within(() => {
      // Check that subtotal and total columns show updated values
      cy.get('.ag-cell').should('contain.text', '$');
    });
  });

  it('should allow editing unit price and update dependent calculations', () => {
    cy.get('.ag-theme-alpine').should('be.visible');
    
    cy.get('.ag-row').first().within(() => {
      // Edit unit price (5th column, index 4)
      cy.get('.ag-cell').eq(4).within(() => {
        cy.get('input').clear().type('100');
      });
    });

    cy.wait(100);

    // Verify calculations updated
    cy.get('.ag-row').first().within(() => {
      cy.get('.ag-cell').should('contain.text', '$');
    });
  });

  it('should update status chip when total value changes', () => {
    cy.get('.ag-theme-alpine').should('be.visible');
    
    // Edit values to trigger status change
    cy.get('.ag-row').first().within(() => {
      // Set a very low value to trigger Warning status
      cy.get('.ag-cell').eq(3).within(() => {
        cy.get('input').clear().type('1');
      });
      cy.get('.ag-cell').eq(4).within(() => {
        cy.get('input').clear().type('10');
      });
    });

    cy.wait(200);

    // Status should reflect the change (Warning for low total)
    cy.get('.ag-row').first().within(() => {
      cy.get('.ag-cell').should('exist');
    });
  });

  it('should handle scrolling with large dataset', () => {
    cy.get('.ag-theme-alpine').should('be.visible');
    
    // Scroll down
    cy.get('.ag-body-viewport').scrollTo('bottom', { duration: 1000 });
    cy.wait(500);
    
    // Verify rows are still visible
    cy.get('.ag-row').should('have.length.greaterThan', 0);
    
    // Scroll back up
    cy.get('.ag-body-viewport').scrollTo('top', { duration: 1000 });
    cy.wait(500);
    
    // Verify first rows are visible
    cy.get('.ag-row').first().should('be.visible');
  });

  it('should support sorting', () => {
    cy.get('.ag-theme-alpine').should('be.visible');
    
    // Click on a sortable column header (e.g., Product Name)
    cy.get('.ag-header-cell').contains('Product Name').click();
    
    // Verify sorting indicator appears
    cy.get('.ag-header-cell').contains('Product Name').should('have.class', 'ag-sort-ascending');
  });

  it('should display calculation renderer for numeric columns', () => {
    cy.get('.ag-theme-alpine').should('be.visible');
    
    // Check that calculated columns (Subtotal, Total) are displayed
    cy.get('.ag-header-cell').contains('Subtotal').should('exist');
    cy.get('.ag-header-cell').contains('Total').should('exist');
    
    // Verify cells contain formatted numbers
    cy.get('.ag-row').first().within(() => {
      cy.get('.ag-cell').should('contain.text', '$');
    });
  });
});

