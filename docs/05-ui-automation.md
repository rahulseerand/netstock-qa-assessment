# UI automation

Playwright with TypeScript, against https://automationintesting.online.

## Running it

```bash
cd ui-tests
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

By default it runs every test in Chromium, Firefox and WebKit. Every test is recorded, and the videos end up in `test-results/`. I've copied a few into `evidence/`.

## Layout

```
ui-tests/
  playwright.config.ts
  pages/        page objects (home, reservation, admin login, admin room)
  fixtures/     test data helpers and the room stub
  tests/
    booking-validation.spec.ts
    booking-success.spec.ts
    booking-delete.spec.ts
    extras.spec.ts
```

The page objects hold the locators and actions, so a test reads like `reservation.fillGuest(guest)` and if a field changes it only needs fixing in one place. Wherever possible I find elements by role or placeholder text, not CSS classes. The exception is the admin bin icon, which has no text or label, so I had to use its `.bookingDelete` class.

## The tests

**Missing email** (`booking-validation.spec.ts`)  
Opens room 1 with some dates, clicks Reserve Now, fills in everything except the email and submits. Checks that "must not be empty" appears and that there's no confirmation.

**Successful booking** (`booking-success.spec.ts`)  
Same thing but with every field filled in. It waits for the booking API call to come back with 201, then checks the page shows "Booking Confirmed" with the right dates.

**Delete a booking** (`booking-delete.spec.ts`)  
Creates a booking through the API first, then logs into the admin panel, opens room 1, finds the booking by name and clicks the bin icon. Checks the booking has gone from the page and from the API.

I create the booking through the API because this test is about deleting, not booking. Going through the booking form first would make it slower and give it more ways to fail for unrelated reasons.

**Extras** (`extras.spec.ts`)  
- Empty contact form shows the validation messages
- Wrong admin password keeps you on the login page

## Working around the site's bugs

Two of the bugs I found in exploratory testing affect these tests.

**Room page returns 500 (BR-001).** The reservation page loads its room from `GET /api/room/{id}`, which is broken, so the page is blank and there's no form to test. `fixtures/roomApiStub.ts` intercepts that one request and answers it with the room from `GET /api/room`, which works. Nothing else is stubbed, so the booking itself still goes to the real API. Once BR-001 is fixed the stub can be deleted.

**Delete returns 500 (BR-002).** The delete test is marked with `test.fail()`, so Playwright expects it to fail and reports it as passing for now. If someone fixes the endpoint, the test will start passing, Playwright will flag that as unexpected, and the marker can come off. I preferred that to skipping the test, because a skip would hide the problem.

## Test data

The site is shared, so `fixtures/testData.ts` generates a unique first name and email each run and picks random dates somewhere between about 4 and 18 months ahead. Early on I used fixed dates, and the success test failed on a re-run, most likely because the first run had already booked those dates.
