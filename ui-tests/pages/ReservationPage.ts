import { Page, expect } from '@playwright/test';

export class ReservationPage {
  constructor(private readonly page: Page) {}

  async open(roomId: number, checkin: string, checkout: string) {
    await this.page.goto(`/reservation/${roomId}?checkin=${checkin}&checkout=${checkout}`);
    await expect(this.page.getByRole('button', { name: 'Reserve Now' })).toBeVisible({
      timeout: 20_000,
    });
  }

  async startBookingForm() {
    await this.page.getByRole('button', { name: 'Reserve Now' }).click();
    await expect(this.page.getByPlaceholder('Firstname')).toBeVisible();
  }

  async fillGuest(data: {
    firstname: string;
    lastname: string;
    email?: string;
    phone: string;
  }) {
    await this.page.getByPlaceholder('Firstname').fill(data.firstname);
    await this.page.getByPlaceholder('Lastname').fill(data.lastname);
    if (data.email !== undefined) {
      await this.page.getByPlaceholder('Email').fill(data.email);
    }
    await this.page.getByPlaceholder('Phone').fill(data.phone);
  }

  async submitBooking() {
    await this.page.getByRole('button', { name: 'Reserve Now' }).click();
  }

  validationAlert() {
    return this.page.locator('.alert, .alert-danger');
  }

  confirmationHeading() {
    return this.page.getByText(/Booking Confirmed/i);
  }
}
