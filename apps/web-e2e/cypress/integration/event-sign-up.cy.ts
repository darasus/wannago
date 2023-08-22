import {users} from '../../constants';

describe('create event', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can sign up (free event)', () => {
    cy.visit('/', {failOnStatusCode: false});
    cy.login(users.user_1.email, users.user_1.password);
    cy.createEvent(users.user_1.id);
    cy.publishCurrentEvent();
    cy.get('[data-testid="attend-button"]').click();
    cy.get('[data-testid="event-signup-label"]').should('be.visible');
  });

  it('can cancel sign up (free event)', () => {
    cy.visit('/', {failOnStatusCode: false});
    cy.login(users.user_1.email, users.user_1.password);
    cy.createEvent(users.user_1.id);
    cy.publishCurrentEvent();
    cy.get('[data-testid="attend-button"]').click();
    cy.get('[data-testid="cancel-signup-button"]').click();
    cy.get('[data-testid="confirm-dialog-confirm-button"]').click();
    cy.get('[data-testid="attend-button"]').should('be.visible');
  });
});
