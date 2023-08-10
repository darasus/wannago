import {organization_2_id, user_1_email, user_2_id} from '../../constants';

describe('follow', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can follow organization', () => {
    cy.login(user_1_email);
    cy.visit(`/o/${organization_2_id}`);
    cy.wait(3000);
    cy.get('button').contains('Follow').click();
    cy.get('button').contains('Unfollow').should('be.visible');
  });

  it('can follow user', () => {
    cy.login(user_1_email);
    cy.visit(`/u/${user_2_id}`);
    cy.wait(3000);
    cy.get('button').contains('Follow').click();
    cy.get('button').contains('Unfollow').should('be.visible');
  });
});
