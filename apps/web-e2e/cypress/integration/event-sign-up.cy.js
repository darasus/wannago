describe('Event sign up', () => {
  beforeEach(() => {
    cy.setLocalStorage();
  });
  it('Can sign up to an event', () => {
    cy.login();
    cy.createEvent();
    cy.publishCurrentEvent();
    cy.get('[data-testid="attend-button"]').click();
    cy.get('[data-testid="event-signup-success-label"]');
  });

  it('Can cancel sign up to an event', () => {
    cy.login();
    cy.createEvent();
    cy.publishCurrentEvent();
    cy.get('[data-testid="attend-button"]').click();
    cy.get('[data-testid="cancel-signup-button"]').click();
    cy.get('[data-testid="confirm-dialog-confirm-button"]').click();
    cy.get('[data-testid="attend-button"]');
  });
});
