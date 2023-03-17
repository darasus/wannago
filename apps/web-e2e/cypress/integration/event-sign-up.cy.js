describe('Event sign up', () => {
  it('Can sign up to an event', () => {
    cy.login();
    cy.createOfflineEvent();
    cy.publishCurrentEvent();
    cy.get('[data-testid="attend-button"]').click();
    cy.get('[data-testid="event-status-label"]');
  });

  it('Can cancel sign up to an event', () => {
    cy.login();
    cy.createOfflineEvent();
    cy.publishCurrentEvent();
    cy.get('[data-testid="attend-button"]').click();
    cy.get('[data-testid="cancel-signup-button"]').click();
    cy.get('[data-testid="confirm-dialog-confirm-button"]').click();
    cy.get('[data-testid="attend-button"]');
  });
});
