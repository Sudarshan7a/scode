/**
 * E2E Test: Authentication Flow
 * 
 * Tests the complete user authentication journey:
 * 1. Signup with email/password
 * 2. Verify redirect to check-email page
 * 3. Login with same credentials
 * 4. Verify successful login and dashboard access
 * 5. Logout
 * 6. Verify redirect back to login page
 * 
 * Uses API mocking for deterministic behavior
 */

import { test, expect, mockApiRoute, generateTestUser } from './fixtures';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and storage before each test
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should complete full signup → login → logout flow', async ({
    page,
    authPage,
  }) => {
    const testUser = generateTestUser();

    // ============================================
    // Step 1: Signup
    // ============================================
    await test.step('Navigate to signup page', async () => {
      await authPage.gotoSignup();
      await expect(page).toHaveURL(/\/signup$/);
      await expect(page.locator('h1')).toContainText(/Collaborate/i);
    });

    await test.step('Fill and submit signup form', async () => {
      // Mock signup API call
      await mockApiRoute(
        page,
        '**/api/auth/signup',
        {
          ok: true,
          message: 'Verification email sent! Please check your inbox.',
          redirect: '/check-email',
        },
        200
      );

      // Fill signup form using react-hook-form field names
      await page.fill('input[name="username"]', testUser.username);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);

      // Submit form
      await page.click('button[type="submit"]');
    });

    await test.step('Verify redirect to check-email page', async () => {
      // Wait for navigation to check-email
      await page.waitForURL('**/check-email', { timeout: 10000 });
      await expect(page).toHaveURL(/\/check-email$/);
    });

    // ============================================
    // Step 2: Login
    // ============================================
    await test.step('Navigate to login page', async () => {
      await authPage.gotoLogin();
      await expect(page).toHaveURL(/\/login$/);
    });

    await test.step('Fill and submit login form', async () => {
      // Mock login API call
      await mockApiRoute(
        page,
        '**/api/auth/login',
        {
          ok: true,
          message: 'Login successful!',
          redirect: '/dashboard',
          user: {
            id: 'test-user-id',
            email: testUser.email,
            username: testUser.username,
          },
        },
        200
      );

      // Fill login form
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);

      // Submit form
      await page.click('button[type="submit"]');
    });

    await test.step('Verify successful login and dashboard access', async () => {
      // Wait for navigation to dashboard
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      await expect(page).toHaveURL(/\/dashboard$/);
      
      // Verify user is logged in (check for user menu or username)
      // Note: Adjust selector based on your actual UI
      const userElement = page.locator(`text="${testUser.username}"`).first();
      await expect(userElement).toBeVisible({ timeout: 5000 });
    });

    // ============================================
    // Step 3: Logout
    // ============================================
    await test.step('Logout from application', async () => {
      // Mock logout API call
      await mockApiRoute(
        page,
        '**/api/auth/logout',
        {
          ok: true,
          message: 'Logged out successfully',
        },
        200
      );

      // Find and click logout button
      // Note: Adjust selector based on your actual UI
      const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")').first();
      
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
      } else {
        // If logout is in a dropdown/menu, click the menu first
        const userMenu = page.locator('[data-testid="user-menu"], button:has-text("' + testUser.username + '")').first();
        if (await userMenu.isVisible()) {
          await userMenu.click();
          await page.locator('button:has-text("Logout"), a:has-text("Logout")').first().click();
        }
      }
    });

    await test.step('Verify redirect to login page after logout', async () => {
      // Wait for navigation back to login or home
      await page.waitForURL(/\/(login|$)/, { timeout: 10000 });
      
      // Verify user is logged out (username should not be visible)
      const userElement = page.locator(`text="${testUser.username}"`);
      await expect(userElement).not.toBeVisible();
    });
  });

  test('should show error for invalid login credentials', async ({
    page,
    authPage,
  }) => {
    await test.step('Navigate to login page', async () => {
      await authPage.gotoLogin();
      await expect(page).toHaveURL(/\/login$/);
    });

    await test.step('Submit invalid credentials', async () => {
      // Mock failed login API call
      await mockApiRoute(
        page,
        '**/api/auth/login',
        {
          ok: false,
          message: 'Invalid email or password',
        },
        401
      );

      await page.fill('input[name="email"]', 'invalid@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
    });

    await test.step('Verify error message is displayed', async () => {
      // Wait for error message to appear
      const errorMessage = page.locator('text=/Invalid email or password/i');
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
      
      // Verify still on login page (no redirect)
      await expect(page).toHaveURL(/\/login$/);
    });
  });

  test('should validate signup form fields', async ({ page, authPage }) => {
    await test.step('Navigate to signup page', async () => {
      await authPage.gotoSignup();
      await expect(page).toHaveURL(/\/signup$/);
    });

    await test.step('Submit empty form', async () => {
      await page.click('button[type="submit"]');
    });

    await test.step('Verify validation errors appear', async () => {
      // Check for validation messages (react-hook-form with zod)
      // Wait a bit for validation to run
      await page.waitForTimeout(500);
      
      // Should have validation errors for required fields
      const formMessages = page.locator('[role="alert"], .text-red-500, .text-destructive');
      const count = await formMessages.count();
      
      // Expect at least one validation error
      expect(count).toBeGreaterThan(0);
    });
  });

  test('should handle password mismatch in signup', async ({
    page,
    authPage,
  }) => {
    const testUser = generateTestUser();

    await test.step('Navigate to signup page', async () => {
      await authPage.gotoSignup();
    });

    await test.step('Fill form with mismatched passwords', async () => {
      await page.fill('input[name="username"]', testUser.username);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');
      
      await page.click('button[type="submit"]');
    });

    await test.step('Verify password mismatch error', async () => {
      // Wait for validation error
      await page.waitForTimeout(500);
      
      const errorMessage = page.locator('text=/password.*match/i, text=/passwords.*same/i').first();
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    });
  });
});
