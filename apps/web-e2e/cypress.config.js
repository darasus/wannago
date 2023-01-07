const {defineConfig} = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'tests/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
  },
});
