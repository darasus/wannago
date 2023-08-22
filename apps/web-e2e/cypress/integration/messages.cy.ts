import {users} from '../../constants';

describe('Messages', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can send message to organization', () => {
    cy.login(users.user_1.email, users.user_1.password);
    const randomMessage = 'Message ' + Math.random();
    cy.visit(`/o/${users.user_2.organization.id}`);
    cy.wait(3000);
    cy.get('button').contains('Message').click();
    cy.get('[data-testid="message-input"]').type(randomMessage);
    cy.get('[data-testid="message-form-submit-button"]').click();
    cy.get('[data-testid="message-text"]')
      .contains(randomMessage)
      .should('be.visible');
  });

  it('can send message to user', () => {
    cy.login(users.user_1.email, users.user_1.password);
    const randomMessage = 'Message ' + Math.random();
    cy.visit(`/o/${users.user_2.organization.id}`);
    cy.wait(3000);
    cy.get('button').contains('Message').click();
    cy.get('[data-testid="message-input"]').type(randomMessage);
    cy.get('[data-testid="message-form-submit-button"]').click();
    cy.get('[data-testid="message-text"]')
      .contains(randomMessage)
      .should('be.visible');
  });
});
