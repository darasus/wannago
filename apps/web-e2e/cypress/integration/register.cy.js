const email = Math.random() + '+clerk_test@gmail.com';

describe('Register', () => {
  it('Can register', () => {
    cy.visit('/register');
    cy.get('[data-testid="register-first-name-input"]').type('John');
    cy.get('[data-testid="register-last-name-input"]').type('Doe');
    cy.get('[data-testid="register-email-input"]').type(email);
    cy.get('[data-testid="register-user-info-form-submit"]').click();

    cy.get('[data-testid="register-code-input"]').type(Cypress.env('otp'));
    cy.get('[data-testid="register-code-form-submit"]').click();
    cy.get('[data-testid="add-event-button"]');
    // TODO: create user
    // cy.get('[data-testid="header-user-section-button"]').contains('John');
  });
});
