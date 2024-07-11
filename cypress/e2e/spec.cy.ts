/// <reference types="Cypress" />

describe('template spec', () => {
  it('Should show the undo-button disabled', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="undo-btn"]').should('have.attr', 'disabled');
  })

  it("Should render reset button initially", () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="undo-btn"]').should('have.attr', 'disabled');
    cy.get('[data-cy="reset-btn"]').should("be.visible");
  })

  it('Should start fresh initially with no circle inside and only show circle when clicking on an empty square', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy^="circle-"]').should('not.exist');
    cy.get('[data-cy="tbody"]').find("tr td").first().click();
    cy.get('[data-cy^="circle-"]').should('exist');
  })
})