import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Testing Configuration
 * 
 * Optimized for:
 * - Fast execution in CI (headless chromium only)
 * - Local debugging with UI mode
 * - Deterministic behavior with network mocking
 * - Trace artifacts for failure investigation
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',
  
  // Maximum time one test can run (30 seconds)
  timeout: 30 * 1000,
  
  // Fail fast: stop after first failure in CI
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI only
  workers: process.env.CI ? 1 : undefined, // Sequential in CI, parallel locally
  
  // Reporter configuration
  reporter: process.env.CI
    ? [
        ['html', { outputFolder: 'playwright-report' }],
        ['junit', { outputFile: 'playwright-results.xml' }],
        ['github'], // GitHub Actions annotations
      ]
    : [
        ['html', { outputFolder: 'playwright-report' }],
        ['list'], // Detailed console output for local dev
      ],

  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // Collect traces on first retry for debugging
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure (for debugging)
    video: 'retain-on-failure',
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Timeouts
    actionTimeout: 10 * 1000, // 10 seconds for actions
    navigationTimeout: 15 * 1000, // 15 seconds for navigation
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Headless in CI, headed locally for debugging
        headless: !!process.env.CI,
      },
    },
    
    // Uncomment to test on Firefox (adds ~2 min to CI)
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    
    // Uncomment to test on WebKit/Safari (adds ~2 min to CI)
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Run local dev server before starting tests
  webServer: process.env.CI
    ? undefined // In CI, server should already be running
    : {
        command: 'pnpm run dev',
        port: 3000,
        reuseExistingServer: true, // Don't restart if already running
        timeout: 120 * 1000, // 2 minutes to start
      },
});
