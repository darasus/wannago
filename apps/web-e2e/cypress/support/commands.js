Cypress.Commands.addAll({
  login() {
    cy.visit('/');
    cy.document().then(doc => {
      if (doc.querySelector('[data-testid="dashboard-button"]')) {
        cy.get('[data-testid="dashboard-button"]');
      } else {
        cy.get('[data-testid="login-button"]').click();
        cy.get('#identifier-field').type('idarase+clerk_test@gmail.com');
        cy.get('.cl-formButtonPrimary').click();
        cy.get('[name="codeInput-0"]').type('424242');
        cy.get('[data-testid="add-event-button"]');
      }
    });
  },
});
