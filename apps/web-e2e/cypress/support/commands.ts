import {users} from '../../constants';

// TODO REMOVE THIS WHEN YOU CAN!!!
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

Cypress.Commands.addAll({
  login(email = users.user_1.email, password = users.user_1.password) {
    cy.visit('/', {failOnStatusCode: false});
    cy.get('[data-testid="login-button"]').click();
    cy.wait(1000);
    cy.get('[data-testid="login-email-input"]').type(email);
    cy.get('[data-testid="login-password-input"]').type(password);
    cy.get('[data-testid="login-form-submit"]').click();
    cy.get('[data-testid="add-event-button"]');
    cy.get('[data-testid="header-user-button"]').contains('John');
  },
  createEvent(authorId, options) {
    let {type, eventVisibility, signUpProtection, listing, eventTitle} =
      options || {};

    if (typeof type === 'undefined') {
      type = 'free';
    }

    cy.visit('/e/add');
    cy.wait(3000);
    if (authorId) {
      cy.get('[data-testid="event-form-created-by-input"]').click();
      cy.get(`[data-testid="created-by-option-${authorId}"]`).click();
    }
    cy.get('[data-testid="event-form-title"]').type(
      eventTitle || 'Test title',
      {
        force: true,
      }
    );
    // cy.get('[data-testid="event-form-description"]')
    //   .click()
    //   .type('Test description', {force: true});
    // cy.get('[data-testid="file-input"]').selectFile(
    //   'cypress/support/event-preview.jpg',
    //   {force: true}
    // );
    // date
    cy.get(
      '[data-testid="event-form-start-date"] > [data-testid="calendar-button"]'
    ).click();
    cy.get('[data-testid="calendar-next-month-button"]').last().click();
    cy.get('[data-testid="calendar-date-button"]').contains('20').click();
    cy.get(
      '[data-testid="event-form-end-date"] > [data-testid="calendar-button"]'
    ).click();
    cy.get('[data-testid="calendar-next-month-button"]').last().click();
    cy.get('[data-testid="calendar-date-button"]').contains('21').click();
    // address
    cy.get('[data-testid="event-form-address-button"]').click();
    cy.get('[data-testid="event-form-address-input"]').type('Paris');
    cy.get('[data-testid="location-input-option"]').first().click();
    // attendees
    cy.get('[data-testid="event-form-max-attendees"]').clear().type('10');
    cy.wait(1000);
    // event visibility
    if (eventVisibility === 'protected') {
      cy.get('[data-testid="event-visibility-protected-button"]').click();
      cy.get('[data-testid="event-visibility-protected-code-input"]')
        .clear()
        .type('1234');
    }
    if (signUpProtection === 'protected') {
      cy.get(
        '[data-testid="event-sign-up-protection-protected-button"]'
      ).click();
      cy.get('[data-testid="event-sign-up-protection-protected-code-input"]')
        .clear()
        .type('4321');
    }
    if (listing === 'unlisted') {
      cy.get('[data-testid="event-listing-unlisted-button"]').click();
    }
    //// cy.get('[data-testid="file-input-image-preview"]');
    cy.get('[data-testid="event-form-submit-button"]').click();
    cy.url().should('include', '/e/');
    cy.get('[data-testid="event-title"]').should('be.visible');
  },
  publishCurrentEvent() {
    cy.get('[data-testid="manage-event-button"]').click();
    cy.get('[data-testid="select-option-button"]').contains('Publish').click();
    cy.get('[data-testid="confirm-dialog-confirm-button"]').click();
  },
  toggleSession() {
    cy.get('[data-testid="header-user-button"]').click();
    cy.get('[data-testid="toggle-session-button"]').click();
  },
  logout() {
    cy.get('[data-testid="header-user-button"]').click();
    cy.get('[data-testid="logout-button"]').click();
    cy.wait(3000);
  },
  setLocalStorage() {
    window.localStorage.setItem('cookie-consent', 'true');
  },
});
