import {Page} from '@playwright/test';

export class Auth {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async login() {
    await this.page.goto('http://localhost:3000/');
    await this.page.setViewportSize({width: 1070, height: 1016});

    const isUserSectionVisible = await this.page
      .getByTestId('user-header-button')
      .isVisible();

    if (isUserSectionVisible) {
      await this.page.getByTestId('user-header-button').click();
      await this.page.getByTestId('logout-button').click();
    }

    await this.page.getByTestId('login-button').click();
    await this.page.type('#identifier-field', 'idarase+clerk_test@gmail.com');
    await this.page.click('.cl-formButtonPrimary');
    await this.page.type('[name="codeInput-0"]', '424242', {delay: 100});

    await this.page.waitForTimeout(3000);
  }
}
