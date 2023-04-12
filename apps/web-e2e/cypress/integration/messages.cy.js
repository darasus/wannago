describe('Messages', () => {
  it('Can send message to organization', () => {
    const randomMessage = 'Message ' + Math.random();
    cy.login();
    cy.visit('/o/5cc4c5be-ebce-49e6-83db-2e8458a685f6');
    cy.get('[data-testid="message-button"]').click();
    cy.get('[data-testid="message-input"]').type(randomMessage);
    cy.get('[data-testid="message-form-submit-button"]').click();
    cy.get('[data-testid="message-text"]')
      .last()
      .should('contain', randomMessage);
  });
});
