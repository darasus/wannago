/// <reference path="./node_modules/cypress/types/cy-blob-util.d.ts" />
/// <reference path="./node_modules/cypress/types/cy-bluebird.d.ts" />
/// <reference path="./node_modules/cypress/types/cy-minimatch.d.ts" />
/// <reference path="./node_modules/cypress/types/lodash/index.d.ts" />
/// <reference path="./node_modules/cypress/types/sinon/index.d.ts" />
/// <reference path="./node_modules/cypress/types/jquery/index.d.ts" />
/// <reference path="./node_modules/cypress/types/cypress.d.ts" />
/// <reference path="./node_modules/cypress/types/cypress-type-helpers.d.ts" />
/// <reference path="./node_modules/cypress/types/cypress-global-vars.d.ts" />

interface CreateEventOptions {
  type?: 'free' | 'paid';
  eventVisibility?: 'public' | 'protected';
  signUpProtection?: 'public' | 'protected';
  listing?: 'listed' | 'unlisted';
  eventTitle?: string;
}

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(email: string, password: string): void;
    createEvent(authorId?: string, options?: CreateEventOptions): void;
    toggleSession(): void;
    logout(): void;
    publishCurrentEvent(): void;
  }
}
