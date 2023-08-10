import {user_1_email} from '../../constants';

describe('user settings', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can update user', () => {
    const firstName = 'John' + Math.random();
    const lastName = 'Doe' + Math.random();
    cy.login(user_1_email);
    cy.visit(`/settings`);
    cy.wait(3000);
    cy.get('[data-testid="first-name-input"]').clear();
    cy.get('[data-testid="first-name-input"]').type(firstName);
    cy.get('[data-testid="last-name-input"]').clear().type(lastName);
    cy.get('[data-testid="user-settings-submit-button"]').click();
    cy.get('[data-sonner-toast]')
      .contains('User is updated!')
      .should('be.visible');
    cy.get('[data-testid="header-user-button"]')
      .contains(firstName)
      .should('be.visible');
  });
});
