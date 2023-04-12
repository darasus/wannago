Cypress.Commands.addAll({
  login(user = 'user_1_email') {
    cy.visit('/');
    cy.document().then(doc => {
      if (doc.querySelector('[data-testid="dashboard-button"]')) {
        cy.get('[data-testid="dashboard-button"]');
      } else {
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="login-email-input"]').type(Cypress.env(user));
        cy.get('[data-testid="login-email-form-submit"]').click();
        cy.get('[data-testid="login-code-input"]').type(Cypress.env('otp'));
        cy.get('[data-testid="add-event-button"]');
        cy.get('[data-testid="header-user-section-button"]').contains('John');
      }
    });
  },
  createOfflineEvent() {
    cy.visit('/dashboard');
    cy.get('[data-testid="add-event-button"]').click();
    cy.get('[data-testid="event-form-title"]').type('Test title');
    cy.get('[data-testid="event-form-description"]')
      .click()
      .type('Test description');
    cy.get('[data-testid="file-input"]').selectFile(
      'cypress/support/event-preview.jpg',
      {force: true}
    );
    cy.get('[data-testid="event-form-start-date"]').type('2023-06-01T08:30');
    cy.get('[data-testid="event-form-end-date"]').type('2023-06-01T18:30');
    cy.get('[data-testid="event-form-address"]').type('Paris');
    cy.get('[data-testid="location-input-option"]').first().click();
    cy.get('[data-testid="event-form-max-attendees"]').type('10');
    cy.wait(1000);
    cy.get('[data-testid="file-input-image-preview"]');
    cy.get('[data-testid="event-form-submit-button"]').click();
    cy.get('[data-testid="event-title"]').should('be.visible');
  },
  publishCurrentEvent() {
    cy.get('[data-testid="manage-event-button"]').click();
    cy.get('[data-testid="select-option-button"]').contains('Publish').click();
    cy.get('[data-testid="confirm-dialog-confirm-button"]').click();
  },
});
