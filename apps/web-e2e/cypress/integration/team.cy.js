describe('Team', () => {
  it('can create team', () => {
    cy.login();
    cy.visit('/settings/personal');
    cy.get('[data-testid="team-settings-button"]').click();

    cy.document().then(doc => {
      if (doc.querySelector('[data-testid="team-settings-remove-button"]')) {
        cy.get('[data-testid="team-settings-remove-button"]').click();
        cy.get('[data-testid="confirm-dialog-confirm-button"]').click();
        cy.get('[data-testid="toast-success"]').should('be.visible');
        cy.get('[data-testid="team-settings-form-input-name"]').should(
          'be.empty'
        );
      }
    });

    cy.wait(1000);

    cy.get('[data-testid="team-settings-form-input-name"]').type('Test team');
    cy.get('[data-testid="team-settings-form-input-email"]').type(
      'email@email.com'
    );
    cy.get('[data-testid="file-input"]').selectFile(
      'cypress/support/logo.png',
      {force: true}
    );
    cy.get('[data-testid="file-input-image-preview"]');
    cy.get('[data-testid="team-settings-form-input-submit-button"]').click();
    cy.get('[data-testid="toast-success"]').should('be.visible');
  });
});
