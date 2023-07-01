describe('Message to attendees', () => {
  beforeEach(() => {
    cy.setLocalStorage();
    cy.task('db:reset');
  });

  it('Can message to attendees', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.createEvent();
    cy.publishCurrentEvent();
    cy.visit('/dashboard');
    cy.get('[data-testid="filter-button"]').click();
    cy.get('[data-testid="filter-option-button"]')
      .contains('Organizing')
      .click();
    cy.get('[data-testid="event-card"]').first().click();
    cy.get('[data-testid="manage-event-button"]').click();
    cy.get('[data-testid="select-option-button"]')
      .contains('Attendees')
      .click();
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
