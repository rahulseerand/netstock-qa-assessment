import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { HomePage } from '../pages/HomePage';

test.describe('Extra coverage from exploratory findings', () => {
  test('contact form shows validation when submitted empty', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Email may not be blank')).toBeVisible();
    await expect(page.getByText('Name may not be blank')).toBeVisible();
    await expect(page.getByText('Phone may not be blank')).toBeVisible();
    await expect(page.getByText('Phone must be between 11 and 21 characters.')).toBeVisible();
  });

  test('admin rejects invalid credentials', async ({ page }) => {
    const login = new AdminLoginPage(page);
    await login.loginExpectFailure('admin', 'not-the-password');
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  });
});
