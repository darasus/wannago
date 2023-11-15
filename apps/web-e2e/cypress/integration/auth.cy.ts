import {users} from '../../constants';

describe('Auth', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('Can login', () => {
    cy.login(users.user_1.email, users.user_1.password);
    cy.get('[data-testid="header-user-button"]').should('contain.text', 'John');
  });

  it('Can logout', () => {
    cy.login(users.user_1.email, users.user_1.password);
    cy.get('[data-testid="header-user-button"]').should('contain.text', 'John');
    cy.logout();
    cy.get('[data-testid="login-button"]').should('be.visible');
  });
});
