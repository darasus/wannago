import {user_1_email} from '../../constants';

describe('create event', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can create free event', () => {
    cy.login(user_1_email);
    cy.createEvent();
  });
});
