describe('Invite attendees', () => {
  it('Can invite attendees by email', () => {
    cy.login();
    cy.createOfflineEvent();
    cy.publishCurrentEvent();
    cy.get('[data-testid="event-attendees-button"]').click();
    cy.get('[data-testid="invite-button"]');
    cy.get('[data-testid="invite-button"]').click();
    cy.get('[data-testid="invite-by-email-open-modal-button"]').click();
    cy.get('[data-testid="invite-by-email-first-name-input"]').type('John');
    cy.get('[data-testid="invite-by-email-last-name-input"]').type('Doe');
    cy.get('[data-testid="invite-by-email-email-input"]').type(
      'idarase+123@gmail.com'
    );
    cy.get('[data-testid="invite-by-email-submit-button"]').click();
    cy.get('[data-testid="invitee-card"]').contains(Cypress.env('user_email'));
    cy.get('[data-testid="invitee-card"]')
      .get('[data-testid="sign-up-status-badge"]')
      .contains('Invited');
  });
});
