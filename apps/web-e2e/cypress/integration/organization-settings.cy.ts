import {organization_1_email, user_1_email} from '../../constants';

describe('organization settings', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can update organization', () => {
    cy.login(user_1_email);
    cy.visit(`/dashboard`);
    cy.get('[data-testid="header-user-button"]').click();
    cy.get('[data-testid="organizations-button"]').click();
    cy.get('[data-testid="organization-item-card-settings-button"]').click();
    cy.get('[data-testid="team-settings-form-input-name"]')
      .clear()
      .type('Organization 1');
    cy.get('[data-testid="team-settings-form-input-email"]')
      .clear()
      .type(organization_1_email);
    cy.wait(3000);
    cy.get('[data-testid="team-settings-form-input-submit-button"]').click();
    cy.get('[data-sonner-toast]')
      .contains('Organization is updated!')
      .should('be.visible');
  });
});
