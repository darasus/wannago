const {defineConfig} = require('cypress');
import {resetDB} from './utils/resetDB';
import {
  user_1_email,
  organization_1_email,
  user_1_id,
  organization_1_id,
  organization_2_email,
  organization_2_id,
  user_2_email,
  user_2_id,
} from './constants';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/commands.ts',
    viewportHeight: 1000,
    viewportWidth: 1240,
    video: false,
    execTimeout: 60000,
    taskTimeout: 60000,
    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
    pageLoadTimeout: 60000,
    projectId: 'nvo5fb',
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      user_1_email,
      user_1_id,
      organization_1_email,
      organization_1_id,
      user_2_email,
      user_2_id,
      organization_2_email,
      organization_2_id,
      otp: '424242',
    },
    setupNodeEvents(on: any, config: any) {
      on('task', {
        async 'db:reset'() {
          await resetDB();

          return 'done';
        },
      });
    },
  },
});
