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

  it('can sign up (free event) to visibility protected event', () => {
    cy.visit('/', {failOnStatusCode: false});
    cy.login(users.user_1.email, users.user_1.password);
    cy.createEvent(users.user_1.id, {
      eventVisibility: 'protected',
    });
    cy.publishCurrentEvent();
    cy.logout();
    cy.visit('/', {failOnStatusCode: false});
    cy.login(users.user_2.email, users.user_2.password);
    cy.visit('/u/' + users.user_1.id);
    cy.get('[data-testid="event-card"]').first().click();
    cy.get('[data-testid="code-input"]').type('1234');
    cy.get('[data-testid="code-form-button"]').click();
    cy.get('[data-testid="event-title"]').should('be.visible');
  });

  it('can sign up (free event) to sign up protected event', () => {
    cy.visit('/', {failOnStatusCode: false});
    cy.login(users.user_1.email, users.user_1.password);
    cy.createEvent(users.user_1.id, {
      signUpProtection: 'protected',
    });
    cy.publishCurrentEvent();
    cy.logout();
    cy.visit('/', {failOnStatusCode: false});
    cy.login(users.user_2.email, users.user_2.password);
    cy.visit('/u/' + users.user_1.id);
    cy.get('[data-testid="event-card"]').first().click();
    cy.wait(1000);
    cy.get('[data-testid="protected-attend-button"]').click();
    cy.get('[data-testid="event-code-input"]').type('4321');
    cy.get('[data-testid="event-code-form-submit"]').click();
    cy.get('[data-testid="event-signup-label"]').should(
      'contain.text',
      "You're signed up!"
    );
  });
});
