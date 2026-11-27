import { Page, expect } from '@playwright/test';

export class AdminRoomPage {
  constructor(private readonly page: Page) {}

  async openRoom(roomId: number) {
    await this.page.goto(`/admin/room/${roomId}`);
    await expect(this.page.getByText('First name')).toBeVisible();
  }

  async expectBookingVisible(firstname: string) {
    await expect(this.page.getByText(firstname, { exact: true })).toBeVisible({ timeout: 15_000 });
  }

  async deleteBookingByFirstname(firstname: string) {
    const row = this.page.locator('.row').filter({ hasText: firstname }).first();
    await expect(row).toBeVisible();
    await row.locator('.bookingDelete').click();
  }

  async expectBookingGone(firstname: string) {
    await expect(this.page.getByText(firstname, { exact: true })).toHaveCount(0, {
      timeout: 15_000,
    });
  }
}
