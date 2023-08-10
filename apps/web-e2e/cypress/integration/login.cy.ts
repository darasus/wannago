describe('Login', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('Can login', () => {
    cy.login();
  });
});
