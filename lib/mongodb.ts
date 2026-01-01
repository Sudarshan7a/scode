import { MongoClient, Db, Collection, ObjectId } from "mongodb";

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
    usersCollection: db.collection("users"),
    refreshTokensCollection: db.collection("refreshTokens"),
    roomsCollection: db.collection("rooms"),
    savedNotesCollection: db.collection("savedNotes"),
    savedCodeCollection: db.collection("savedCode"),
    usersActivitiesCollection: db.collection("usersActivities"),
  };
}

export async function getUserUpcomingRooms(userId: string | ObjectId) {
  const { roomsCollection } = await connectToMongo();
  let userObjectId: ObjectId;
  try {
    userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId;
  } catch {
    throw new Error(`Invalid userId format: ${userId}`);
  }
  return await roomsCollection
    .find({
      "collaborators.userId": userObjectId,
      scheduledFor: { $gte: new Date() },
    })
    .sort({ scheduledFor: 1 })
    .toArray();
}
