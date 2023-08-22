import {users} from '../../constants';

describe('Login', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('Can login', () => {
    cy.login(users.user_1.email, users.user_1.password);
  });
});
