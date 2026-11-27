import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/');
    await expect(this.page.getByRole('heading', { name: 'Welcome to Shady Meadows B&B' })).toBeVisible();
  }
}
