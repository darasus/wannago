describe('Create event', () => {
  beforeEach(() => {
    cy.setLocalStorage();
  });
  it('Can create event', () => {
    cy.login();
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
    cy.get('[data-testid="event-form-address-button"]').click();
    cy.get('[data-testid="event-form-address-input"]').type('Paris');
    cy.get('[data-testid="location-input-option"]').first().click();
    cy.get('[data-testid="event-form-max-attendees"]').type('10');
    cy.wait(1000);
    cy.get('[data-testid="file-input-image-preview"]');
    cy.get('[data-testid="event-form-submit-button"]').click();
    cy.get('[data-testid="event-title"]').should('be.visible');
  });
});
