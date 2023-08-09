import {user_1_email, user_1_id} from '../../constants';

describe('create event', () => {
  it('can sign up (free event)', () => {
    cy.visit('/', {failOnStatusCode: false});
    cy.login(user_1_email);
    cy.createEvent(user_1_id);
    cy.publishCurrentEvent();
    cy.get('[data-testid="attend-button"]').click();
    cy.get('[data-testid="event-signup-label"]').should('be.visible');
  });

  it('can cancel sign up (free event)', () => {
    cy.visit('/', {failOnStatusCode: false});
    cy.login(user_1_email);
    cy.createEvent(user_1_id);
    cy.publishCurrentEvent();
    cy.get('[data-testid="attend-button"]').click();
    cy.get('[data-testid="cancel-signup-button"]').click();
    cy.get('[data-testid="confirm-dialog-confirm-button"]').click();
    cy.get('[data-testid="attend-button"]').should('be.visible');
  });
});
