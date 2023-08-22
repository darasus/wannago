import {users} from '../../constants';

describe('follow', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can follow organization', () => {
    cy.login(users.user_1.email, users.user_1.password);
    cy.visit(`/o/${users.user_2.organization.id}`);
    cy.wait(3000);
    cy.get('button').contains('Follow').click();
    cy.get('button').contains('Unfollow').should('be.visible');
  });

  it('can follow user', () => {
    cy.login(users.user_1.email, users.user_1.password);
    cy.visit(`/u/${users.user_2.id}`);
    cy.wait(3000);
    cy.get('button').contains('Follow').click();
    cy.get('button').contains('Unfollow').should('be.visible');
  });
});
