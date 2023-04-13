describe('Team', () => {
  it('can update team', () => {
    cy.login();
    cy.visit('/settings/personal');
    cy.get('[data-testid="team-settings-button"]').click();
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
