import {users} from '../../constants';

const getNewEmail = () => {
  const emailParts = users.user_1.email.split('@');

  return `${emailParts[0]}+${Math.random()}@${emailParts[1]}`;
};

describe('invite attendees', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can invite attendees', () => {
    const newEmail = getNewEmail();
    cy.login(users.user_2.email, users.user_2.password);
    cy.visit('/');
    cy.createEvent(users.user_2.organization.id);
    cy.publishCurrentEvent();
    cy.get('button').contains('Manage event').click();
    cy.get('[data-testid="select-option-button"]')
      .contains('Attendees')
      .click();
    cy.get('[data-testid="invite-button"]').click();
    cy.get('[data-testid="invite-by-email-open-modal-button"]').click();
    cy.get('[data-testid="invite-by-email-first-name-input"]').type('John');
    cy.get('[data-testid="invite-by-email-last-name-input"]').type('Doe');
    cy.get('[data-testid="invite-by-email-email-input"]').type(newEmail);
    cy.get('[data-testid="invite-by-email-submit-button"]').click();
    cy.get('[data-testid="invitee-card"]')
      .first()
      .should('contain.text', newEmail);
    cy.get('[data-testid="sign-up-status-badge"]')
      .first()
      .contains('Invited')
      .should('be.visible');
  });
});
