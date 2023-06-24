describe('Messages', () => {
  beforeEach(() => {
    cy.setLocalStorage();
  });

  it('Can send message to organization', () => {
    const randomMessage = 'Message ' + Math.random();
    cy.login();
    cy.visit(`/o/${Cypress.env('organization_2_id')}`);
    cy.get('[data-testid="message-button"]').click();
    cy.get('[data-testid="message-input"]').type(randomMessage);
    cy.get('[data-testid="message-form-submit-button"]').click();
    cy.get('[data-testid="message-text"]')
      .last()
      .should('contain', randomMessage);
  });

  it('Can send message to user', () => {
    const randomMessage = 'Message ' + Math.random();
    cy.login();
    cy.visit(`/u/${Cypress.env('user_2_id')}`);
    cy.get('[data-testid="message-button"]').click();
    cy.get('[data-testid="message-input"]').type(randomMessage);
    cy.get('[data-testid="message-form-submit-button"]').click();
    cy.get('[data-testid="message-text"]')
      .last()
      .should('contain', randomMessage);
  });
});
