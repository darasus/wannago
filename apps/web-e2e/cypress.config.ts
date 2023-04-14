const {defineConfig} = require('cypress');
import {resetDB} from './utils/resetDB';

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
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      user_1_email: 'idarase+1+automation+clerk_test@gmail.com',
      user_1_id: '52cb62d5-c6ca-4da3-be41-d1c3a83dfa21',
      organization_1_email:
        'idarase+1+organization+automation+clerk_test@gmail.com',
      organization_1_id: '5d78757d-c68b-45fd-8954-0e14cb0b6753',
      user_2_email: 'idarase+2+automation+clerk_test@gmail.com',
      user_2_id: 'ba2c68ad-f288-43c5-b3c5-6bfcc3611a98',
      organization_2_email:
        'idarase+2+organization+automation+clerk_test@gmail.com',
      organization_2_id: '28acab1f-7c9d-4782-a168-393ff902aba5',
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
