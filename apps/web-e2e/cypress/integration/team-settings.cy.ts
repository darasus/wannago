describe('Team', () => {
  beforeEach(() => {
    cy.setLocalStorage();
  });

  it('can update team', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.get('[data-testid="header-user-button"]').click();
    cy.get('[data-testid="organizations-button"]').click();
    cy.get('[data-testid="organization-item-card-settings-button"]').click();
    cy.get('[data-testid="team-settings-form-input-name"]')
      .clear()
      .type('Organization 1');
    cy.get('[data-testid="team-settings-form-input-email"]')
      .clear()
      .type(Cypress.env('organization_1_email'));
    cy.get('[data-testid="file-input"]').selectFile(
      'cypress/support/logo.png',
      {force: true}
    );
    cy.get('[data-testid="file-input-image-preview"]');
    cy.get('[data-testid="team-settings-form-input-submit-button"]').click();
    cy.get('[data-testid="toast-success"]').should('be.visible');
  });
});
