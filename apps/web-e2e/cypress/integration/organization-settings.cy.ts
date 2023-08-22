import {users} from '../../constants';

describe('organization settings', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can update organization', () => {
    cy.login(users.user_1.email, users.user_1.password);
    cy.visit(`/dashboard`);
    cy.wait(1000);
    cy.get('[data-testid="header-user-button"]').click();
    cy.get('[data-testid="organizations-button"]').click();
    cy.get('[data-testid="organization-item-card-settings-button"]').click();
    cy.get('[data-testid="team-settings-form-input-name"]')
      .clear()
      .type('Organization 1');
    cy.get('[data-testid="team-settings-form-input-email"]')
      .clear()
      .type(users.user_1.email);
    cy.wait(3000);
    cy.get('[data-testid="team-settings-form-input-submit-button"]').click();
    cy.get('[data-sonner-toast]')
      .contains('Organization is updated!')
      .should('be.visible');
  });
});
