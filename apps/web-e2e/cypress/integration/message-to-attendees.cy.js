describe('Message to attendees', () => {
  it('Can message to attendees', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.get('[data-testid="event-card"]').first().click();
    cy.get('[data-testid="event-attendees-button"]').click();
    cy.get('[data-testid="message-attendees-button"]').click();
    cy.get('[data-testid="message-attendees-input-subject"]').type(
      'Test subject'
    );
    cy.get('[data-testid="message-attendees-input-message"]').type(
      'Test message'
    );
    cy.get('[data-testid="message-attendees-form-submit"]').click();
    cy.get('[data-testid="toast-success"]').should('be.visible');
  });
});
