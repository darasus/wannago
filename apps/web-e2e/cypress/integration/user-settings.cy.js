describe('user-settings', () => {
  it('Can update first and last name', () => {
    const firstName = 'John' + Math.random();
    const lastName = 'Doe' + Math.random();

    cy.login();
    cy.visit('/settings');
    cy.get('[data-testid="first-name-input"]').clear();
    cy.get('[data-testid="first-name-input"]').type(firstName);
    cy.get('[data-testid="last-name-input"]').clear();
    cy.get('[data-testid="last-name-input"]').type(lastName);
    cy.get('[data-testid="user-settings-submit-button"]').click();
    cy.wait(10000);
    cy.get('[data-testid="header-user-section-button"]').click();
    cy.get('[data-testid="profile-button"]').click();
    cy.get('[data-testid="user-profile-name"]').contains(firstName);
    cy.get('[data-testid="user-profile-name"]').contains(lastName);
  });
});
