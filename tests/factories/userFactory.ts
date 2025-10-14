import { ObjectId } from "mongodb";

export interface TestUser {
  id: string;
  name: string;
  email: string;
}

export function createTestUser(overrides: Partial<TestUser> = {}): TestUser {
  const id = new ObjectId().toHexString();
  return {
    id,
    name: `Test User ${id.slice(0, 6)}`,
    email: `${id.slice(0, 6)}@example.com`,
    ...overrides,
  };
}
