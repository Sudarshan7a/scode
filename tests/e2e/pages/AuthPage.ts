import { Page } from '@playwright/test';

/**
 * Page Object Model for Authentication pages
 * Provides reusable methods for interacting with auth flows
 */
export class AuthPage {
  constructor(private page: Page) {}

  // Navigation
  async gotoSignup() {
    await this.page.goto('/signup');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoLogin() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  // Signup actions
  async fillSignupForm(email: string, username: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
  }

  async submitSignup() {
    await this.page.click('button[type="submit"]');
  }

  async signup(email: string, username: string, password: string) {
    await this.fillSignupForm(email, username, password);
    await this.submitSignup();
  }

  // Login actions
  async fillLoginForm(email: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
  }

  async submitLogin() {
    await this.page.click('button[type="submit"]');
  }

  async login(email: string, password: string) {
    await this.fillLoginForm(email, password);
    await this.submitLogin();
  }

  // Logout
  async logout() {
    // Click user menu or logout button
    await this.page.click('[data-testid="user-menu"]');
    await this.page.click('[data-testid="logout-button"]');
  }

  // Assertions/Validations
  async expectToBeOnDashboard() {
    await this.page.waitForURL('**/dashboard', { timeout: 10000 });
  }

  async expectToBeOnLogin() {
    await this.page.waitForURL('**/login', { timeout: 5000 });
  }

  async expectErrorMessage(message: string) {
    await this.page.waitForSelector(`text="${message}"`, { timeout: 5000 });
  }
}
