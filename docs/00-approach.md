# Approach

I started with the exploratory testing because it fed into everything else. By the time I got to the API and UI tests I already knew which flows mattered and where the site was broken, so I wasn't writing automation blind.

The SQL and Git/Linux questions are standalone. For the SQL "what's the output" question I worked it out by hand first and then loaded the data into SQLite to check my answer.

## Tools

- **Playwright with TypeScript** for the UI tests. It handles waiting for elements, runs on Chromium, Firefox and WebKit, and gives you an HTML report and video without extra plugins.
- **Postman** for the API collection, run from the command line with **Newman** so it can produce a report and could run in CI later.
- **Page objects** for the UI tests, so locators are in one place.

## Things worth knowing

The demo site is shared with everyone else practising on it and it gets reset now and then. I used generated names and random future dates in the tests so they don't trip over other people's bookings.

Two endpoints on automationintesting.online were returning 500 errors while I was testing (details in the exploratory doc). I didn't want the UI tests to just fail on day one for reasons unrelated to what they're checking, so:

- for the booking form tests I stubbed the one broken room lookup with data from the working room list endpoint. The actual booking request still goes to the real API.
- the delete test is marked as an expected failure until the delete endpoint is fixed.

## If I had more time

- Run both suites in GitHub Actions on every push
- Add accessibility checks with axe
- Pull the base URL and credentials out into environment config
