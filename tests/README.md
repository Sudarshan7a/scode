# Testing Guide

This directory contains the automated test suite for the project. The layout is intentionally hybrid so we can keep colocated smoke tests for fast feedback while centralising shared mocks, factories, and helpers.

```
/tests
  /unit               # fast isolated tests and pure functions
    /api
    /components
    /hooks
    /middleware
    /utils
  /integration        # light integration and feature flows
    /rooms
    /video
    /auth
  /mocks              # third-party and infrastructure mocks
    /stream
    /next             # NextRequest/NextResponse/cookies/fetch helpers
    /db               # Mongo/Redis fakes
  /factories          # reusable test data builders
  /setups             # Vitest / environment bootstrap files
  /utils              # shared helpers such as custom render
  /snapshots
  /coverage           # optional coverage configs per feature
```

## Running the tests

```bash
pnpm test
```

Add `--runInBand` or `--coverage` flags as needed (see `package.json`).

### Key helper modules

- `tests/mocks/next` – utilities for building `NextRequest`, parsing `NextResponse`, managing mock cookies, and mocking `fetch`.
- `tests/mocks/db` – in-memory Mongo/Redis stand-ins plus spies for `connectToMongo` and rate limiter calls.
- `tests/utils/renderWithProviders` – shared React Testing Library wrapper.

## Adding a new test

1. Pick the directory that mirrors the code you are testing (e.g. `tests/unit/utils`).
2. Import shared helpers from `tests/utils` and mocks from `tests/mocks` instead of redefining them.
3. Keep tests deterministic and independent. Rely on factories rather than hard-coded literals where possible.
4. Reach for `/tests/mocks` for infrastructure helpers (e.g. `mockNextCookies`, `createNextRequest`, `mockConnectToMongo`).
5. Update documentation (this file) if you add new directories or conventions.
