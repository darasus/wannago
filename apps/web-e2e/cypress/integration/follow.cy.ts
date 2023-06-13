describe('Follow', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('Can follow organization', () => {
    cy.login('user_2_email');
    cy.visit('/dashboard');
    cy.get('[data-testid="organization-header-button"]').click();
    cy.createOfflineEvent();
    cy.publishCurrentEvent();
    cy.logout();
    cy.login('user_1_email');
    cy.visit(`/o/${Cypress.env('organization_2_id')}`);
    cy.get('[data-testid="follow-button"]').click();
    cy.get('[data-testid="follower-count"]').should('have.text', '1');
    cy.wait(2000);
    cy.visit('/dashboard');
    cy.get('[data-testid="select-button"]').click();
    cy.get('[data-testid="select-option-button"]')
      .contains('Following')
      .click();
    cy.reload();
    cy.get('[data-testid="event-card"]')
      .first()
      .should('contain.text', 'Organization 2');
  });

  it('Can follow user', () => {
    cy.login('user_2_email');
    cy.visit('/dashboard');
    cy.createOfflineEvent();
    cy.publishCurrentEvent();
    cy.logout();
    cy.login('user_1_email');
    cy.visit(`/u/${Cypress.env('user_2_id')}`);
    cy.get('[data-testid="follow-button"]').click();
    cy.get('[data-testid="follower-count"]').should('have.text', '1');
    cy.wait(2000);
    cy.visit('/dashboard');
    cy.get('[data-testid="select-button"]').click();
    cy.get('[data-testid="select-option-button"]')
      .contains('Following')
      .click();
    cy.reload();
    cy.get('[data-testid="event-card"]').first().should('contain.text', 'John');
  });
});
