export function uniqueGuest(prefix = 'Rahul') {
  const stamp = Date.now().toString(36);
  return {
    firstname: `${prefix}${stamp}`.slice(0, 12),
    lastname: 'Karamchund',
    email: `${prefix.toLowerCase()}.${stamp}@example.com`,
    phone: '01234567890', // must be 11-21 chars
  };
}

// Random dates far ahead so re-runs don't clash with bookings already on the shared site
export function futureStay(daysAhead = 180, nights = 2) {
  const offset = Math.floor(Math.random() * 400);
  const checkin = new Date();
  checkin.setUTCHours(0, 0, 0, 0);
  checkin.setUTCDate(checkin.getUTCDate() + daysAhead + offset);
  const checkout = new Date(checkin);
  checkout.setUTCDate(checkout.getUTCDate() + nights);

  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { checkin: iso(checkin), checkout: iso(checkout) };
}

export const ADMIN = { username: 'admin', password: 'password' } as const;
