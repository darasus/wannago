const {defineConfig} = require('cypress');
import {resetDB} from './utils/resetDB';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/commands.ts',
    viewportHeight: 1000,
    viewportWidth: 1240,
    video: true,
    execTimeout: 60000,
    taskTimeout: 60000,
    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
    pageLoadTimeout: 60000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on: any, config: any) {
      require('cypress-fail-fast/plugin')(on, config);
      on('task', {
        async 'db:reset'() {
          await resetDB();

          return 'done';
        },
      });
      return config;
    },
  },
});
