# Exploratory testing: automationintesting.online

Tested 26 Nov 2026 on Chrome, with DevTools open so I could see the API calls behind each page. The site footer says restful-booker-platform v2.2.

I split the session into areas (home page, booking, contact form, admin) and noted test ideas as I went. Anything that looked wrong went into the issues list for that area.

## Home page

Test ideas:

- All the nav links (Rooms, Booking, Amenities, Location, Contact, Admin) go to the right place
- "Book Now" in the hero scrolls down to the availability check
- Room cards show the right name, price, features and picture (compare with `/api/room`)
- Check Availability with future dates, past dates, and checkout before checkin
- Footer links (Cookie Policy, Privacy Policy, Admin panel)
- Layout on a phone-sized screen

Issues:

- All three room images have `alt="Single Room"`, including the Double and the Suite. A screen reader would read the wrong room type.
- The "Getting Here" section repeats the welcome text instead of giving directions.
- The social media icons in the footer link to `#`.

## Booking a room

How it works: pick a room, which opens `/reservation/{id}?checkin=...&checkout=...`, click Reserve Now, fill in first name, last name, email and phone, then click Reserve Now again. You should get a "Booking Confirmed" message showing the dates.

Test ideas:

- Book with all fields filled in. Should be confirmed and show up in the admin panel under that room.
- Leave email blank. Should show an error and not create a booking.
- Leave first name, last name or phone blank
- Phone number too short / too long
- Email in the wrong format
- Checkout date before the checkin date
- Book dates that are already taken
- Cancel halfway through the form

Issues:

- **Reservation page is blank.** `GET /api/room/1` (and 2 and 3) returns a 500, so the page has nothing to render. Bug report BR-001 below.
- **The API accepts a booking with no email.** The form says email "must not be empty", but posting straight to `/api/booking` without an email returns 201 and creates the booking. Bug report BR-003 below.
- The price summary adds a £25 cleaning fee and £15 service fee that aren't mentioned anywhere on the room card. Guests only find out at the last step.

## Contact form

Test ideas:

- Submit it empty
- Submit a valid message and check it appears under Admin > Messages
- Boundary lengths: subject 5-100 chars, message 20-2000, phone 11-21
- HTML/script in the message, then open it in admin

Submitting it empty gives these errors, which look right:

- Name may not be blank
- Email may not be blank
- Phone may not be blank / Phone must be between 11 and 21 characters.
- Subject may not be blank / Subject must be between 5 and 100 characters.
- Message may not be blank / Message must be between 20 and 2000 characters.

The unread count on the admin Messages tab goes up when a new message comes in.

## Admin panel

Login is `admin` / `password`.

Test ideas:

- Login with correct and wrong details
- Rooms list matches what's on the front page
- Create a room, check it appears on the front page, delete it
- Open a room and check its bookings are listed
- Delete a booking
- Report calendar shows bookings on the right dates
- Change branding and check the front page updates
- Logout, then try to open an admin page directly

Issues:

- **Can't delete bookings.** The bin icon calls `DELETE /api/booking/{id}`, which returns a 500. `GET /api/booking/{id}` does the same. Bug report BR-002 below.
- After the failed delete, the bookings list on the page went empty even though the bookings were still there in the API. So the admin is shown something that isn't true.
- The room detail page (`/admin/room/1`) was showing blank type, description, features and price at one point. Same cause as BR-001 since it uses the same room endpoint.
- There's a Logout button on the login page before you've logged in.

## Bug reports

### BR-001: Reservation page doesn't load, room endpoint returns 500

**Severity:** Critical  
**Environment:** https://automationintesting.online, Chrome, 26 Nov 2026

**Steps**

1. Go to the home page
2. Click "Book now" on any room (or go to `/reservation/1?checkin=2026-12-15&checkout=2026-12-17`)
3. Open DevTools and look at the Network and Console tabs

**Expected:** The reservation page shows the room details, calendar and Reserve Now button. `GET /api/room/1` returns 200 with the room.

**Actual:** The page is blank. `GET /api/room/1` returns 500 with the body `Internal Server Error`, and the console shows `Unexpected token 'I', "Internal S"... is not valid JSON` because the page tries to parse that as JSON. Rooms 2 and 3 do the same. The list endpoint `GET /api/room` still works fine.

**Impact:** Nobody can book a room through the website.

**Evidence:** `evidence/reservation-room2.png`

### BR-002: Deleting a booking fails with a 500

**Severity:** Critical  
**Environment:** https://automationintesting.online/admin, logged in as admin

**Steps**

1. Make sure room 1 has a booking (I created one through `POST /api/booking`)
2. Go to `/admin/room/1`
3. Click the bin icon next to the booking
4. Check the Network tab, then call `GET /api/booking?roomid=1`

**Expected:** The delete succeeds and the booking is gone from the page and from the API.

**Actual:** `DELETE /api/booking/{id}` returns 500. The booking is still returned by the API. `GET /api/booking/{id}` also returns 500. The page cleared the bookings list anyway.

**Impact:** Staff can't remove bookings, and the screen can show the wrong state after a failed delete.

**Evidence:** `evidence/admin-room1-bookings.png`

### BR-003: API creates bookings without an email address

**Severity:** Major

**Steps:** `POST /api/booking` with roomid, firstname, lastname, phone and dates but no `email` field.

**Expected:** 400 with a validation error, like the form gives.

**Actual:** 201 and a new booking id.

**Why it matters:** The validation only exists in the front end. Anything calling the API directly can create bookings the B&B has no way of contacting.

## What I'd look at next

- An accessibility scan of the home and reservation pages
- Two people booking the same dates at the same time
- Whether branding changes survive a refresh
- Read/unread behaviour on admin messages
