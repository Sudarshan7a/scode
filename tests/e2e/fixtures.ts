import { test as base, Page } from '@playwright/test';
import { AuthPage } from './pages/AuthPage';
import { RoomPage } from './pages/RoomPage';

/**
 * Custom fixtures for E2E tests
 * Provides page objects and helper utilities
 */

type CustomFixtures = {
  authPage: AuthPage;
  roomPage: RoomPage;
};

/**
 * Extended test with custom fixtures
 * Usage: import { test, expect } from './fixtures';
 */
// eslint-disable-next-line react-hooks/rules-of-hooks
export const test = base.extend<CustomFixtures>({
  // eslint-disable-next-line react-hooks/rules-of-hooks
  authPage: async ({ page }, use) => {
    const authPage = new AuthPage(page);
    await use(authPage);
  },

  // eslint-disable-next-line react-hooks/rules-of-hooks
  roomPage: async ({ page }, use) => {
    const roomPage = new RoomPage(page);
    await use(roomPage);
  },
});

export { expect } from '@playwright/test';

/**
 * Helper function to mock API responses
 */
export async function mockApiRoute(
  page: Page,
  url: string,
  response: Record<string, unknown>,
  status = 200
) {
  await page.route(url, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Helper function to mock WebSocket connection
 */
export async function mockWebSocket(page: Page) {
  await page.addInitScript(() => {
    // Mock WebSocket for deterministic testing
    class MockWebSocket {
      onopen: ((event: Event) => void) | null = null;
      onmessage: ((event: MessageEvent) => void) | null = null;
      onerror: ((event: Event) => void) | null = null;
      onclose: ((event: CloseEvent) => void) | null = null;

      constructor(public url: string) {
        setTimeout(() => {
          if (this.onopen) {
            this.onopen(new Event('open'));
          }
        }, 100);
      }

      send(data: string) {
        console.log('MockWebSocket send:', data);
      }

      close() {
        if (this.onclose) {
          this.onclose(new CloseEvent('close'));
        }
      }
    }

    // @ts-expect-error - Mocking WebSocket
    window.WebSocket = MockWebSocket;
  });
}

/**
 * Generate random test user credentials
 */
export function generateTestUser() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  
  return {
    email: `test.user.${timestamp}.${random}@example.com`,
    username: `testuser${timestamp}${random}`,
    password: 'TestPassword123!',
  };
}

/**
 * Generate random room data
 */
export function generateTestRoom() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  
  return {
    title: `Test Room ${timestamp}`,
    description: `E2E test room created at ${new Date().toISOString()}`,
    roomId: `room-${timestamp}-${random}`,
  };
}
