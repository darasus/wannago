import {user_1_email, user_1_id} from '../../constants';

describe('create event', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can create free event', () => {
    cy.login(user_1_email);
    cy.createEvent(user_1_id);
  });
});
