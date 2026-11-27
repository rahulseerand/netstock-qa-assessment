import { Page, APIRequestContext } from '@playwright/test';

type Room = {
  roomid: number;
  roomName: string;
  type: string;
  accessible: boolean;
  image: string;
  description: string;
  features: string[];
  roomPrice: number;
};

// Workaround for BR-001: GET /api/room/{id} returns 500, which leaves the reservation
// page blank. Answer it with the room from /api/room instead. Only this GET is stubbed.
export async function stubRoomByIdFromList(page: Page, request: APIRequestContext) {
  const res = await request.get('https://automationintesting.online/api/room');
  if (!res.ok()) {
    throw new Error(`Unable to load /api/room for stub: ${res.status()}`);
  }
  const data = (await res.json()) as { rooms: Room[] };

  await page.route('**/api/room/*', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    const id = Number(route.request().url().split('/').pop());
    const room = data.rooms.find((r) => r.roomid === id);
    if (!room) {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(room),
    });
  });

  return data.rooms;
}
