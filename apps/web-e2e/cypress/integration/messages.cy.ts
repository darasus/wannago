import {organization_2_id, user_1_email, user_2_id} from '../../constants';

describe('Messages', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can send message to organization', () => {
    cy.login(user_1_email);
    const randomMessage = 'Message ' + Math.random();
    cy.visit(`/o/${organization_2_id}`);
    cy.wait(3000);
    cy.get('button').contains('Message').click();
    cy.get('[data-testid="message-input"]').type(randomMessage);
    cy.get('[data-testid="message-form-submit-button"]').click();
    cy.get('[data-testid="message-text"]')
      .contains(randomMessage)
      .should('be.visible');
  });

  it('can send message to user', () => {
    cy.login(user_1_email);
    const randomMessage = 'Message ' + Math.random();
    cy.visit(`/u/${user_2_id}`);
    cy.wait(3000);
    cy.get('button').contains('Message').click();
    cy.get('[data-testid="message-input"]').type(randomMessage);
    cy.get('[data-testid="message-form-submit-button"]').click();
    cy.get('[data-testid="message-text"]')
      .contains(randomMessage)
      .should('be.visible');
  });
});
