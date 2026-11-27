import { Page, expect } from '@playwright/test';
import { ADMIN } from '../fixtures/testData';

export class AdminLoginPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/admin');
  }

  async login(username = ADMIN.username, password = ADMIN.password) {
    await this.open();
    // skip the form if we're already logged in
    if (await this.page.getByRole('textbox', { name: 'Username' }).isVisible().catch(() => false)) {
      await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
      await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
      await this.page.getByRole('button', { name: 'Login' }).click();
    }
    await expect(this.page.getByRole('link', { name: 'Rooms' })).toBeVisible();
  }

  async loginExpectFailure(username: string, password: string) {
    await this.open();
    await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible();
  }
}
