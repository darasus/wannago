const {defineConfig} = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/integration/**/*.cy.{js,jsx}',
    supportFile: 'cypress/support/commands.js',
    viewportHeight: 1000,
    viewportWidth: 1240,
    video: false,
    execTimeout: 60000,
    taskTimeout: 60000,
    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
    pageLoadTimeout: 60000,
    requestTimeout: 60000,
    retries: 0,
    env: {
      user_email: 'idarase+automation+clerk_test@gmail.com',
      otp: '424242',
    },
  },
});
