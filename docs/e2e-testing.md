# E2E Testing with Playwright

## Overview

This document describes the end-to-end (E2E) testing strategy for the application using Playwright. E2E tests validate complete user journeys from signup to room management, ensuring the application works correctly from a user's perspective.

## Table of Contents

- [Architecture](#architecture)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Debugging](#debugging)
- [CI Integration](#ci-integration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Architecture

### Test Pyramid Position

```
        /\
       /  \  E2E Tests (Playwright)
      /____\  ← You are here
     /      \ Integration Tests (Vitest)
    /________\ Unit Tests (Vitest)
```

**E2E Tests Focus:**
- User-facing workflows
- Cross-component interactions
- Full authentication flows
- Real browser behavior
- Network/WebSocket mocking

**Coverage:** 10 E2E tests covering:
- Auth flow (4 tests): Signup → Login → Logout
- Room flow (6 tests): Create → Join → Leave

---

## Test Structure

### Directory Layout

```
tests/e2e/
├── fixtures.ts              # Custom Playwright fixtures & helpers
├── pages/
│   ├── AuthPage.ts          # Page Object Model for auth
│   └── RoomPage.ts          # Page Object Model for rooms
├── auth-flow.spec.ts        # Authentication E2E tests
└── room-flow.spec.ts        # Room management E2E tests

playwright.config.ts         # Playwright configuration
playwright-report/           # HTML test reports (gitignored)
test-results/                # Trace files (gitignored)
playwright-results.xml       # JUnit XML for CI (gitignored)
```

### Page Object Model (POM)

**Why POM?**
- Encapsulates page interactions
- Reduces code duplication
- Improves test maintainability
- Single source of truth for selectors

**Example:**

```typescript
// tests/e2e/pages/AuthPage.ts
export class AuthPage {
  constructor(private page: Page) {}

  async gotoSignup() {
    await this.page.goto('/signup');
    await this.page.waitForLoadState('networkidle');
  }

  async signup(email: string, username: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}
```

### Custom Fixtures

**Purpose:** Provide reusable utilities and page objects to all tests.

```typescript
// tests/e2e/fixtures.ts
export const test = base.extend<CustomFixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  roomPage: async ({ page }, use) => {
    await use(new RoomPage(page));
  },
});

// Usage in tests
test('should login', async ({ authPage }) => {
  await authPage.login('user@example.com', 'password');
});
```

---

## Running Tests

### Local Development

#### Run all E2E tests (headless)
```bash
pnpm test:e2e
```

#### Run with UI mode (debugging)
```bash
pnpm test:e2e:ui
```

#### Run with debugger attached
```bash
pnpm test:e2e:debug
```

#### Run specific test file
```bash
npx playwright test tests/e2e/auth-flow.spec.ts
```

#### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

#### Run with specific browser
```bash
npx playwright test --project=chromium
```

### CI/CD Pipeline

E2E tests run automatically in GitHub Actions:
- **Trigger:** On push to `main`, `develop`, `feat/**` branches
- **Timing:** After unit/integration tests pass (~15 min total)
- **Browser:** Chromium only (headless)
- **Parallelization:** Sequential (1 worker) for determinism

**Pipeline Job:**
```yaml
e2e:
  name: E2E Tests (Playwright)
  runs-on: ubuntu-latest
  timeout-minutes: 15
  needs: test
```

---

## Writing Tests

### Test Anatomy

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: clear cookies, mock APIs
  });

  test('should complete user flow', async ({ page, authPage }) => {
    // Step 1: Navigate
    await test.step('Navigate to page', async () => {
      await authPage.gotoSignup();
      await expect(page).toHaveURL(/\/signup$/);
    });

    // Step 2: Interact
    await test.step('Fill form', async () => {
      await page.fill('input[name="email"]', 'test@example.com');
    });

    // Step 3: Assert
    await test.step('Verify result', async () => {
      await expect(page.locator('text=Success')).toBeVisible();
    });
  });
});
```

### API Mocking

**Why mock?**
- Deterministic behavior
- No database pollution
- Fast test execution
- No external dependencies

**Example:**

```typescript
import { mockApiRoute } from './fixtures';

test('should handle signup', async ({ page }) => {
  // Mock API response
  await mockApiRoute(
    page,
    '**/api/auth/signup',
    {
      ok: true,
      message: 'Signup successful',
      redirect: '/dashboard',
    },
    200
  );

  // Perform action
  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');

  // Verify
  await page.waitForURL('**/dashboard');
});
```

### WebSocket Mocking

**Example:**

```typescript
import { mockWebSocket } from './fixtures';

test('should connect to room', async ({ page }) => {
  await mockWebSocket(page);
  
  await page.goto('/room/123');
  
  // WebSocket connection is mocked
  // Test can proceed without real WebSocket server
});
```

### Test Helpers

```typescript
// Generate unique test data
const testUser = generateTestUser();
// Returns: { email, username, password }

const testRoom = generateTestRoom();
// Returns: { title, description, roomId }
```

---

## Debugging

### 1. UI Mode (Recommended)

```bash
pnpm test:e2e:ui
```

**Features:**
- Time-travel debugging
- Step-by-step execution
- Inspect DOM at any point
- View network requests
- See console logs

### 2. Debug Mode

```bash
pnpm test:e2e:debug
```

Opens Playwright Inspector with breakpoints.

### 3. Headed Mode

```bash
npx playwright test --headed --debug
```

See browser actions in real-time.

### 4. Trace Viewer

After test failure, view traces:

```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

**Trace Contents:**
- Screenshots at each step
- Network requests/responses
- Console logs
- DOM snapshots
- Action timeline

### 5. Screenshot on Failure

Automatic screenshots saved to `test-results/` on failure.

### 6. VSCode Integration

Install **Playwright Test for VSCode** extension:
- Run tests from editor
- Set breakpoints
- View results inline

---

## CI Integration

### GitHub Actions Workflow

**File:** `.github/workflows/test.yml`

```yaml
e2e:
  name: E2E Tests (Playwright)
  runs-on: ubuntu-latest
  timeout-minutes: 15
  needs: test

  steps:
    - Install dependencies
    - Install Playwright browsers
    - Build application
    - Start server (port 3000)
    - Run Playwright tests
    - Upload reports & traces
```

### Artifacts

**Uploaded on test completion:**
1. **playwright-report/** - HTML report (30 days)
2. **playwright-results.xml** - JUnit format (30 days)
3. **test-results/** - Traces on failure only (30 days)

**Accessing artifacts:**
1. Go to GitHub Actions run
2. Scroll to bottom → Artifacts section
3. Download and unzip
4. Open `index.html` for HTML report
5. Use `npx playwright show-trace trace.zip` for traces

### Viewing Results

**In GitHub Actions:**
- ✅ Green check = All tests passed
- ❌ Red X = Tests failed (click for details)
- 🟡 Yellow dot = Tests running

**HTML Report:**
```bash
# After downloading artifact
npx playwright show-report playwright-report/
```

---

## Best Practices

### 1. Use Page Objects

❌ **Bad:** Hardcoded selectors in tests
```typescript
await page.fill('input[name="email"]', 'test@example.com');
```

✅ **Good:** Encapsulated in Page Object
```typescript
await authPage.fillEmail('test@example.com');
```

### 2. Use Test Steps

❌ **Bad:** Flat test structure
```typescript
test('should login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

✅ **Good:** Organized with steps
```typescript
test('should login', async ({ page }) => {
  await test.step('Navigate to login', async () => {
    await page.goto('/login');
  });

  await test.step('Submit credentials', async () => {
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
  });

  await test.step('Verify redirect', async () => {
    await expect(page).toHaveURL('/dashboard');
  });
});
```

### 3. Mock External Dependencies

✅ **Always mock:**
- API calls
- WebSocket connections
- Third-party services
- Database operations

### 4. Use Explicit Waits

❌ **Bad:** Fixed timeouts
```typescript
await page.waitForTimeout(5000); // Flaky
```

✅ **Good:** Wait for specific conditions
```typescript
await page.waitForURL('**/dashboard');
await page.waitForSelector('text=Welcome');
await page.waitForLoadState('networkidle');
```

### 5. Clean State Between Tests

```typescript
test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});
```

### 6. Use Data Generators

✅ **Good:** Unique test data
```typescript
const testUser = generateTestUser();
// Different email/username each run
```

### 7. Keep Tests Independent

Each test should:
- Set up its own data
- Not depend on other tests
- Be runnable in isolation

---

## Troubleshooting

### Common Issues

#### 1. Test Timeout

**Error:** `Test timeout of 30000ms exceeded`

**Solutions:**
```typescript
// Increase timeout for specific test
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ...
});

// Or in config
timeout: 60 * 1000,
```

#### 2. Element Not Found

**Error:** `locator.click: Timeout 10000ms exceeded`

**Debug:**
```typescript
// Check if element exists
const isVisible = await page.locator('button').isVisible();
console.log('Button visible:', isVisible);

// Wait for element
await page.waitForSelector('button', { timeout: 15000 });

// Use more specific selector
await page.locator('button:has-text("Submit")').click();
```

#### 3. Flaky Tests

**Causes:**
- Race conditions
- Timing-dependent assertions
- Network delays

**Solutions:**
```typescript
// Use explicit waits
await page.waitForLoadState('networkidle');

// Retry assertions
await expect(page.locator('text=Success')).toBeVisible({ timeout: 10000 });

// Enable retries in config (already enabled in CI)
retries: process.env.CI ? 2 : 0,
```

#### 4. WebSocket Connection Failed

**Solution:** Ensure WebSocket is mocked
```typescript
import { mockWebSocket } from './fixtures';

test.beforeEach(async ({ page }) => {
  await mockWebSocket(page);
});
```

#### 5. Server Not Starting in CI

**Error:** `wait-on timeout`

**Check:**
1. Build succeeded: `pnpm build`
2. Port 3000 not blocked
3. Environment variables set
4. Increase timeout: `npx wait-on http://localhost:3000 -t 120000`

#### 6. Screenshot/Trace Not Generated

**Fix:** Configure in `playwright.config.ts`
```typescript
use: {
  screenshot: 'only-on-failure',
  trace: 'on-first-retry',
  video: 'retain-on-failure',
}
```

### Debug Commands

```bash
# Verbose output
npx playwright test --debug

# Show browser
npx playwright test --headed

# Single test
npx playwright test -g "should login"

# Update snapshots
npx playwright test --update-snapshots

# List all tests
npx playwright test --list

# Show report
npx playwright show-report

# Show trace
npx playwright show-trace test-results/[test]/trace.zip
```

---

## Performance Optimization

### Current Performance

- **Local:** ~2-3 minutes (with UI)
- **CI:** ~4-5 minutes (headless, 1 worker)

### Optimization Tips

#### 1. Parallel Execution (Local)

```typescript
// playwright.config.ts
workers: process.env.CI ? 1 : undefined, // Parallel locally
```

#### 2. Limit Browsers

✅ **Current:** Chromium only (fast)
❌ **Avoid:** Firefox + WebKit (adds ~8 min)

#### 3. Skip Unnecessary Waits

```typescript
// Skip waiting for fonts, images in CI
use: {
  ...devices['Desktop Chrome'],
  ignoreHTTPSErrors: true,
}
```

#### 4. Reuse Browser Context

```typescript
// Share auth state across tests
const authFile = 'tests/e2e/.auth/user.json';

test('setup', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  await page.context().storageState({ path: authFile });
});

test.use({ storageState: authFile });
```

---

## Maintenance

### Updating Tests

When UI changes:
1. Update selectors in Page Objects (not test files)
2. Run tests to verify
3. Update snapshots if needed: `npx playwright test --update-snapshots`

### Adding New Tests

1. Create test file: `tests/e2e/feature.spec.ts`
2. Import fixtures: `import { test, expect } from './fixtures'`
3. Use Page Objects for interactions
4. Mock APIs for determinism
5. Add test steps for clarity
6. Run locally: `npx playwright test feature.spec.ts`
7. Verify in CI after push

### Updating Playwright

```bash
# Check for updates
pnpm outdated @playwright/test

# Update
pnpm update @playwright/test

# Reinstall browsers
npx playwright install chromium
```

---

## Resources

### Official Documentation
- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

### Internal Docs
- [CI/CD Pipeline](./ci-cd-pipeline.md)
- [Phase 3.5 Completion](./phase-3-completion.md)
- [Quick Reference](./ci-quick-reference.md)

### Tutorials
- [Playwright Tutorial](https://playwright.dev/docs/intro)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Debugging Guide](https://playwright.dev/docs/debug)

---

## Quick Reference

### Commands

```bash
# Run tests
pnpm test:e2e              # Headless
pnpm test:e2e:ui           # UI mode
pnpm test:e2e:debug        # Debug mode

# View reports
npx playwright show-report
npx playwright show-trace test-results/[test]/trace.zip

# Update
pnpm update @playwright/test
npx playwright install
```

### Config Files

- `playwright.config.ts` - Main configuration
- `tests/e2e/fixtures.ts` - Custom fixtures
- `.github/workflows/test.yml` - CI integration

### Test Patterns

```typescript
// Basic test
test('should work', async ({ page }) => {
  await page.goto('/path');
  await expect(page).toHaveURL(/path/);
});

// With Page Object
test('should login', async ({ authPage }) => {
  await authPage.login('email', 'password');
});

// With steps
test('should complete flow', async ({ page }) => {
  await test.step('Step 1', async () => { /* ... */ });
  await test.step('Step 2', async () => { /* ... */ });
});

// With mocking
test('should mock API', async ({ page }) => {
  await mockApiRoute(page, '**/api/endpoint', { data: 'value' });
});
```

---

**Last Updated:** Phase 3.5 - E2E Testing Implementation  
**Test Coverage:** 10 E2E tests (4 auth + 6 room)  
**CI Time:** +4-5 minutes to pipeline  
**Maintenance:** Update Page Objects when UI changes
