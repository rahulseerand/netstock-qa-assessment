import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminRoomPage } from '../pages/AdminRoomPage';
import { futureStay, uniqueGuest } from '../fixtures/testData';

test.describe('Admin booking delete', () => {
  test('deletes a booking from the room detail page', async ({ page, request }) => {
    // Remove once BR-002 is fixed
    test.fail(true, 'BR-002: DELETE /api/booking/{id} returns 500');

    const guest = uniqueGuest('Del');
    const stay = futureStay(150, 2);

    const create = await request.post('https://automationintesting.online/api/booking', {
      data: {
        roomid: 1,
        firstname: guest.firstname,
        lastname: guest.lastname,
        depositpaid: false,
        email: guest.email,
        phone: guest.phone,
        bookingdates: { checkin: stay.checkin, checkout: stay.checkout },
      },
    });
    expect(create.status(), 'create booking via API').toBe(201);

    const login = new AdminLoginPage(page);
    await login.login();

    const room = new AdminRoomPage(page);
    await room.openRoom(1);
    await room.expectBookingVisible(guest.firstname);

    await room.deleteBookingByFirstname(guest.firstname);
    await room.expectBookingGone(guest.firstname);

    const list = await request.get('https://automationintesting.online/api/booking?roomid=1');
    expect(list.ok()).toBeTruthy();
    const body = await list.json();
    const stillThere = (body.bookings || []).some(
      (b: { firstname: string }) => b.firstname === guest.firstname,
    );
    expect(stillThere, 'booking still returned by API').toBeFalsy();
  });
});
