import { MongoClient, Db, Collection } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbNameFromEnv = process.env.MONGODB_DB; // optional override
const options = {};

// Prevent multiple connections in dev (hot reload)
const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
};

let db: Db;

export async function connectToMongo(): Promise<{
  usersCollection: Collection;
  refreshTokensCollection: Collection;
  savedRoomsCollection: Collection;
  roomsCollection: Collection;
  savedNotesCollection: Collection;
  savedCodeCollection: Collection;
  usersActivitiesCollection: Collection;
}> {
  if (!globalWithMongo._mongoClient) {
    const client = new MongoClient(uri, options);
    await client.connect();
    globalWithMongo._mongoClient = client;
  }

  if (!db) {
    db = dbNameFromEnv
      ? globalWithMongo._mongoClient.db(dbNameFromEnv)
      : globalWithMongo._mongoClient.db();
  }

  return {
    usersCollection: globalWithMongo._mongoClient.db().collection("users"),
    refreshTokensCollection: globalWithMongo._mongoClient
      .db()
      .collection("refreshTokens"),
    savedRoomsCollection: globalWithMongo._mongoClient
      .db()
      .collection("savedRooms"),
    roomsCollection: globalWithMongo._mongoClient.db().collection("rooms"),
    savedNotesCollection: globalWithMongo._mongoClient
      .db()
      .collection("savedNotes"),
    savedCodeCollection: globalWithMongo._mongoClient
      .db()
      .collection("savedCode"),
    usersActivitiesCollection: globalWithMongo._mongoClient
      .db()
      .collection("usersActivities"),
  };
}
