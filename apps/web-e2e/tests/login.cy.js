describe('Login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Can login', () => {
    cy.get('[data-testid="login-button"]').click();
    cy.get('#identifier-field').type('idarase+clerk_test@gmail.com');
    cy.get('.cl-formButtonPrimary').click();
    cy.get('[name="codeInput-0"]').type('424242');
    cy.get('[data-testid="add-event-button"]');
  });
});
