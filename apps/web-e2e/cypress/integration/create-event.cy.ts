import {users} from '../../constants';

describe('create event', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can create free event', () => {
    cy.login(users.user_1.email, users.user_1.password);
    cy.createEvent();
  });

  it('can create visibility protected event', () => {
    cy.login(users.user_1.email, users.user_1.password);
    cy.createEvent(users.user_1.id, {
      eventVisibility: 'protected',
    });
    cy.publishCurrentEvent();
    cy.get('[data-testid="manage-event-button"]').click();
    cy.get('[data-testid="select-option-button"]').contains('Info').click();
    cy.get('[data-testid="event-visibility-value"]').contains('Protected');
  });

  it('can create sign up protection protected event', () => {
    cy.login(users.user_1.email, users.user_1.password);
    cy.createEvent(users.user_1.id, {
      signUpProtection: 'protected',
    });
    cy.publishCurrentEvent();
    cy.get('[data-testid="manage-event-button"]').click();
    cy.get('[data-testid="select-option-button"]').contains('Info').click();
    cy.get('[data-testid="event-sign-up-protection-value"]').contains(
      'Protected'
    );
  });

  it('can create unlisted event', () => {
    cy.login(users.user_1.email, users.user_1.password);
    cy.createEvent(users.user_1.id, {
      listing: 'unlisted',
    });
    cy.publishCurrentEvent();
    cy.get('[data-testid="manage-event-button"]').click();
    cy.get('[data-testid="select-option-button"]').contains('Info').click();
    cy.get('[data-testid="event-listing-value"]').contains('Unlisted');
  });
});
