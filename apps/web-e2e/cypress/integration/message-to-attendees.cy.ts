import {users} from '../../constants';

describe('Message to attendees', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can message attendees', () => {
    cy.login(users.user_2.email, users.user_2.password);
    cy.visit('/');
    cy.createEvent(users.user_2.organization.id);
    cy.publishCurrentEvent();
    cy.get('[data-testid="manage-event-button"]').click();
    cy.get('[data-testid="select-option-button"]')
      .contains('Attendees')
      .click();
    cy.get('[data-testid="message-attendees-button"]').click();
    cy.get('[data-testid="message-attendees-input-subject"]').type(
      'Test subject'
    );
    cy.get('[data-testid="message-attendees-input-message"]').type(
      'Test message'
    );
    cy.get('[data-testid="message-attendees-form-submit"]').click();
    cy.get('[data-sonner-toast]')
      .contains('Message is sent!')
      .should('be.visible');
  });
});
