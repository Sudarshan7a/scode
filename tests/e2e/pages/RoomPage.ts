import { Page } from '@playwright/test';

/**
 * Page Object Model for Room Management pages
 * Handles room creation, joining, and management flows
 */
export class RoomPage {
  constructor(private page: Page) {}

  // Navigation
  async gotoRooms() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoCreateRoom() {
    await this.page.goto('/dashboard'); // Or wherever room creation form is
    await this.page.click('[data-testid="create-room-button"]');
  }

  // Room creation
  async fillRoomForm(title: string, description: string) {
    await this.page.fill('input[name="title"]', title);
    await this.page.fill('textarea[name="description"]', description);
  }

  async submitRoomCreation() {
    await this.page.click('button[type="submit"]');
  }

  async createRoom(title: string, description: string) {
    await this.fillRoomForm(title, description);
    await this.submitRoomCreation();
  }

  // Join room
  async joinRoomById(roomId: string) {
    await this.page.goto(`/room/${roomId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async clickJoinButton() {
    await this.page.click('[data-testid="join-room-button"]');
  }

  // Leave room
  async leaveRoom() {
    await this.page.click('[data-testid="leave-room-button"]');
  }

  // Assertions
  async expectRoomToBeCreated(title: string) {
    await this.page.waitForSelector(`text="${title}"`, { timeout: 5000 });
  }

  async expectToBeInRoom(roomId: string) {
    await this.page.waitForURL(`**/room/${roomId}`, { timeout: 10000 });
  }

  async expectToBeOnDashboard() {
    await this.page.waitForURL('**/dashboard', { timeout: 5000 });
  }
}
