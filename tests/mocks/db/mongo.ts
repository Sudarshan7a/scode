import { vi } from "vitest";
import * as mongoModule from "../../../lib/mongodb";

export type CollectionMock<T = unknown> = {
  findOne: ReturnType<typeof vi.fn>;
  find: ReturnType<typeof vi.fn>;
  insertOne: ReturnType<typeof vi.fn>;
  insertMany: ReturnType<typeof vi.fn>;
  updateOne: ReturnType<typeof vi.fn>;
  updateMany: ReturnType<typeof vi.fn>;
  deleteOne: ReturnType<typeof vi.fn>;
  deleteMany: ReturnType<typeof vi.fn>;
  aggregate: ReturnType<typeof vi.fn>;
} & Record<string, unknown>;

export type MongoCollectionsMock = {
  usersCollection: CollectionMock;
  refreshTokensCollection: CollectionMock;
  roomsCollection: CollectionMock;
  savedNotesCollection: CollectionMock;
  savedCodeCollection: CollectionMock;
  usersActivitiesCollection: CollectionMock;
};

const createCollectionMock = (
  overrides: Partial<CollectionMock> = {}
): CollectionMock => {
  return {
    findOne: vi.fn(),
    find: vi.fn(),
    insertOne: vi.fn(),
    insertMany: vi.fn(),
    updateOne: vi.fn(),
    updateMany: vi.fn(),
    deleteOne: vi.fn(),
    deleteMany: vi.fn(),
    aggregate: vi.fn(),
    ...overrides,
  };
};

export function createMongoCollectionsMock(
  overrides: Partial<MongoCollectionsMock> = {}
): MongoCollectionsMock {
  return {
    usersCollection: createCollectionMock(),
    refreshTokensCollection: createCollectionMock(),
    roomsCollection: createCollectionMock(),
    savedNotesCollection: createCollectionMock(),
    savedCodeCollection: createCollectionMock(),
    usersActivitiesCollection: createCollectionMock(),
    ...overrides,
  };
}

export function mockConnectToMongo(
  overrides: Partial<MongoCollectionsMock> = {}
) {
  const collections = createMongoCollectionsMock(overrides);
  const spy = vi
    .spyOn(mongoModule, "connectToMongo")
    .mockResolvedValue(
      collections as unknown as Awaited<
        ReturnType<typeof mongoModule.connectToMongo>
      >
    );

  return { spy, collections };
}
