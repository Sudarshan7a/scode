import { User } from "../types/user";
import { connectToMongo } from "./mongodb";
import { ObjectId, WithId, Document } from "mongodb";
import { mockRooms } from "../types/roomsTypes";

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

export async function getUpcomingRooms(
  userId?: string,
  limit?: number
): Promise<mockRooms[]> {
  const { roomsCollection } = await connectToMongo();

  if (!userId) {
    console.log("No userId provided");
    return [];
  }

  console.log("Fetching rooms for userId:", userId, "limit:", limit);
  const userObjectId = new ObjectId(userId);

  const query = {
    $or: [{ ownerId: userObjectId }, { "collaborators.userId": userObjectId }],
    status: "scheduled",
    scheduledAt: { $ne: null },
  };

  console.log("Query:", JSON.stringify(query));
  let cursor = roomsCollection.find(query).sort({ scheduledAt: 1 });

  if (limit) {
    cursor = cursor.limit(limit);
  }

  const results = await cursor.toArray();

  console.log("Found rooms:", results.length);

  // Transform the data to match the expected format
  const transformedResults = results.map((room) => ({
    ...room,
    _id: { $oid: room._id.toString() },
    ownerId: { $oid: room.ownerId.toString() },
    createdAt: room.createdAt ? { $date: room.createdAt.toISOString() } : null,
    scheduledAt: room.scheduledAt
      ? { $date: room.scheduledAt.toISOString() }
      : null,
    startedAt: room.startedAt ? { $date: room.startedAt.toISOString() } : null,
    participants: room.collaborators?.length || 0,
    collaborators:
      room.collaborators?.map((collab: { userId: ObjectId; role: string; joinedAt: Date }) => ({
        ...collab,
        userId: { $oid: collab.userId.toString() },
        joinedAt: { $date: collab.joinedAt.toISOString() },
      })) || [],
  }));

  return transformedResults as unknown as mockRooms[];
}

export async function getOldRooms() {
  const { roomsCollection } = await connectToMongo();
  const results = await roomsCollection
    .find({ endTime: { $lt: new Date() } })
    .toArray();

  // Transform the data to match the expected format
  const transformedResults = results.map((room) => ({
    ...room,
    _id: { $oid: room._id.toString() },
    ownerId: { $oid: room.ownerId.toString() },
    createdAt: room.createdAt ? { $date: room.createdAt.toISOString() } : null,
    scheduledAt: room.scheduledAt
      ? { $date: room.scheduledAt.toISOString() }
      : null,
    startedAt: room.startedAt ? { $date: room.startedAt.toISOString() } : null,
    participants: room.collaborators?.length || 0,
    collaborators:
      room.collaborators?.map((collab: { userId: ObjectId; role: string; joinedAt: Date }) => ({
        ...collab,
        userId: { $oid: collab.userId.toString() },
        joinedAt: { $date: collab.joinedAt.toISOString() },
      })) || [],
  }));

  return transformedResults as unknown as mockRooms[];
}

export async function getAllRooms() {
  const { roomsCollection } = await connectToMongo();
  const results = await roomsCollection.find({}).toArray();

  // Transform the data to match the expected format
  const transformedResults = results.map((room) => ({
    ...room,
    _id: { $oid: room._id.toString() },
    ownerId: { $oid: room.ownerId.toString() },
    createdAt: room.createdAt ? { $date: room.createdAt.toISOString() } : null,
    scheduledAt: room.scheduledAt
      ? { $date: room.scheduledAt.toISOString() }
      : null,
    startedAt: room.startedAt ? { $date: room.startedAt.toISOString() } : null,
    participants: room.collaborators?.length || 0,
    collaborators:
      room.collaborators?.map((collab: { userId: ObjectId; role: string; joinedAt: Date }) => ({
        ...collab,
        userId: { $oid: collab.userId.toString() },
        joinedAt: { $date: collab.joinedAt.toISOString() },
      })) || [],
  }));

  return transformedResults as unknown as mockRooms[];
}

//room validation mongo db

// {
//   $jsonSchema: {
//     bsonType: 'object',
//     required: [
//       'title',
//       'ownerId',
//       'isPrivate',
//       'createdAt',
//       'duration'
//     ],
//     properties: {
//       title: {
//         bsonType: 'string',
//         description: 'Title of the room'
//       },
//       ownerId: {
//         bsonType: 'objectId',
//         description: 'Creator of the room'
//       },
//       collaborators: {
//         bsonType: 'array',
//         items: {
//           bsonType: 'object',
//           properties: {
//             userId: {
//               bsonType: 'objectId'
//             },
//             role: {
//               'enum': [
//                 'host',
//                 'participant'
//               ]
//             },
//             joinedAt: {
//               bsonType: 'date'
//             }
//           }
//         },
//         description: 'Optional list of collaborators'
//       },
//       isPrivate: {
//         bsonType: 'bool'
//       },
//       createdAt: {
//         bsonType: 'date'
//       },
//       duration: {
//         bsonType: [
//           'int',
//           'double'
//         ],
//         description: 'Duration of the room in minutes'
//       },
//       scheduledFor: {
//         bsonType: 'date',
//         description: 'Exact date+time when room starts'
//       },
//       description: {
//         bsonType: 'string',
//         description: 'Short description of the room/session'
//       },
//       language: {
//         bsonType: 'string'
//       },
//       savedCodeId: {
//         bsonType: 'objectId'
//       },
//       endedAt: {
//         bsonType: 'date'
//       }
//     }
//   }
// }
