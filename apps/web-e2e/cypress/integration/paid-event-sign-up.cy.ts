import {users} from '../../constants';

describe('paid event', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });

  it('can sign up', () => {
    cy.intercept(
      'POST',
      '/api/trpc/lambda/payments.createCheckoutSession',
      (req) => {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              id: 'cs_test_a1b2c3d4e5f6g7h8i9j0',
            },
          },
        });
      }
    );
    cy.visit('/', {failOnStatusCode: false});
    cy.login(users.user_1.email, users.user_1.password);
    cy.createEvent(users.user_1.id, {
      type: 'paid',
    });
    cy.publishCurrentEvent();
    cy.get('[data-testid="buy-ticket-button"]').click();
    cy.get('[data-testid="buy-tickets-button"]').should('exist');
  });
});
