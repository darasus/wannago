const {defineConfig} = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/integration/**/*.cy.{js,jsx}',
    supportFile: 'cypress/support/commands.js',
    viewportHeight: 1000,
    viewportWidth: 1240,
    video: false,
  },
});
