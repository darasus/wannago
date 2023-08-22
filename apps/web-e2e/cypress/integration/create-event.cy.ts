import {users} from '../../constants';

describe('create event', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can create free event', () => {
    cy.login(users.user_1.email, users.user_1.password);
    cy.createEvent();
  });
});
