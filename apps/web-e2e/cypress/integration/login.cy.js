describe('Login', () => {
  beforeEach(() => {
    cy.setLocalStorage();
  });
  it('Can login', () => {
    cy.login();
  });
});
