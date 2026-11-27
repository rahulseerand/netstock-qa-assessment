# Netstock QA Assessment

Rahul Karamchund

My submission for the Netstock Test Automation Engineer assessment.

## Contents

- `docs/01-git-linux.md` - Task 1, the deployment commands and why I chose them
- `docs/02-exploratory.md` - test ideas, issues and bug reports for automationintesting.online
- `docs/03-sql.md` and `sql/` - SQL answers, plus a small script that checks them in SQLite
- `docs/04-api.md` and `api/` - Postman collection for Restful Booker
- `docs/05-ui-automation.md` and `ui-tests/` - Playwright tests (TypeScript)
- `evidence/` - screenshots, test reports and videos

`docs/00-approach.md` has a short note on how I went about it.

## Setup

You'll need Node 18 or newer (I used Node 24) and Python 3 if you want to run the SQL check.

### SQL

```bash
cd sql
python verify.py
```

### API tests

```bash
cd api
npm install
npm test
```

This runs the collection with Newman and writes an HTML report to `api/reports/newman-report.html`. You can also just import the two JSON files into Postman and run the collection from there.

### UI tests

```bash
cd ui-tests
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

Use `npx playwright test --project=chromium --headed` if you want to watch it run in one browser.

The three required scenarios are in `ui-tests/tests/`:

1. `booking-validation.spec.ts` - booking with no email shows an error
2. `booking-success.spec.ts` - booking with all the required details goes through
3. `booking-delete.spec.ts` - deleting a booking from the admin panel

Note: the delete test is currently marked as an expected failure because the delete endpoint on the demo site returns a 500. More on that in `docs/05-ui-automation.md`.
