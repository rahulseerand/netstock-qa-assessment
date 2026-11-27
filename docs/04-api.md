# API tests: Restful Booker

Files:

- `api/restful-booker.postman_collection.json` - the collection
- `api/restful-booker.postman_environment.json` - base URL, login details, and variables filled in during the run
- `api/reports/newman-report.html` - report from the last run (16 requests, 38 assertions, all passing)

To run it: `cd api`, `npm install`, `npm test`. Or import both files into Postman and use the collection runner. The requests depend on each other, so run them in order.

## Structure

The collection has four folders:

1. **Health** - `GET /ping`
2. **Auth** - `POST /auth` with the right and wrong password
3. **Bookings** - a full create/read/update/delete cycle on one booking
4. **Negative cases** - unknown id, no token, bad body

The Bookings folder goes: create a booking, find it in the full list, find it by name filter, filter by dates, get it by id, update it with PUT, update one field with PATCH, delete it, then check it returns 404.

The create request saves the new `bookingid` to an environment variable and the auth request saves the `token`, so the later requests use those. That way the tests only touch the booking they created and don't depend on whatever else is in the shared database.

## What gets checked

Every request checks the status code. On top of that:

- `/ping`: body is `Created`, response under 3 seconds
- `/auth`: a token comes back with the right password. With the wrong one there's no token and `reason` is `Bad credentials`
- Create: response has a `bookingid` and every field matches what was sent
- List / filters: the response is an array and contains the new booking id
- Get by id: has all the expected fields with the right values
- PUT: the changed fields came back changed
- PATCH: the patched field changed and the rest stayed the same
- Delete, then get: the booking is gone (404)
- Negatives: 404 for an id that doesn't exist, 403 for PUT and DELETE with no token

## Things the API does that you might not expect

I wrote the tests to match how the API actually behaves, but these would be worth raising:

- `DELETE /booking/:id` returns **201 Created**. I'd expect 200 or 204.
- A wrong password on `/auth` returns **200** with `{"reason":"Bad credentials"}` and not a 401.
- `POST /booking` with missing fields returns **500**. It should be a 400 that says what's missing. The test accepts 400 or 500 so it'll still pass if they fix it.
- For PUT, PATCH and DELETE the token goes in a `Cookie: token=...` header. Basic auth works too according to the docs.
