import { test, expect } from '@playwright/test';
import { ReservationPage } from '../pages/ReservationPage';
import { stubRoomByIdFromList } from '../fixtures/roomApiStub';
import { futureStay, uniqueGuest } from '../fixtures/testData';

test.describe('Booking validation', () => {
  test('shows an error when email is missing', async ({ page, request }) => {
    await stubRoomByIdFromList(page, request);

    const stay = futureStay(130, 2);
    const guest = uniqueGuest('NoMail');
    const reservation = new ReservationPage(page);

    await reservation.open(1, stay.checkin, stay.checkout);
    await reservation.startBookingForm();
    await reservation.fillGuest({
      firstname: guest.firstname,
      lastname: guest.lastname,
      email: '', // intentionally blank
      phone: guest.phone,
    });
    await reservation.submitBooking();

    await expect(reservation.validationAlert()).toContainText(/must not be empty/i);
    await expect(reservation.confirmationHeading()).toHaveCount(0);
  });
});
