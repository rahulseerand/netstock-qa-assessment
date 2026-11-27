import { test, expect } from '@playwright/test';
import { ReservationPage } from '../pages/ReservationPage';
import { stubRoomByIdFromList } from '../fixtures/roomApiStub';
import { futureStay, uniqueGuest } from '../fixtures/testData';

test.describe('Booking success', () => {
  test('creates a booking when all required fields are provided', async ({ page, request }) => {
    await stubRoomByIdFromList(page, request);

    const stay = futureStay(140, 2);
    const guest = uniqueGuest('Book');
    const reservation = new ReservationPage(page);

    await reservation.open(1, stay.checkin, stay.checkout);
    await reservation.startBookingForm();
    await reservation.fillGuest(guest);

    const bookingResponse = page.waitForResponse(
      (res) =>
        res.url().includes('/api/booking') &&
        res.request().method() === 'POST' &&
        res.status() === 201,
      { timeout: 20_000 },
    );
    await reservation.submitBooking();
    await bookingResponse;

    await expect(reservation.confirmationHeading()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(`${stay.checkin} - ${stay.checkout}`)).toBeVisible();
  });
});

