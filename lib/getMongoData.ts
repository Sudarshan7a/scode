import { User } from "@/types/user";
import { connectToMongo } from "./mongodb";
import { ObjectId, WithId, Document } from "mongodb";

export async function getUser(userId: string): Promise<User> {
  const { usersCollection } = await connectToMongo();
  const user: WithId<Document> | null = await usersCollection.findOne(
    { _id: new ObjectId(userId) },
    { projection: { name: 1, email: 1, role: 1 } }
  );

  if (!user) return null;
  return {
    id: user._id?.toString(),
    name: user.name as string,
    email: user.email as string,
    role: user.role as string,
  };
}

export async function getUpcomingRooms() {
  const { roomsCollection } = await connectToMongo();
  return roomsCollection.find({ startTime: { $gt: new Date() } }).toArray();
}

export async function getOldRooms() {
  const { roomsCollection } = await connectToMongo();
  return roomsCollection.find({ endTime: { $lt: new Date() } }).toArray();
}
