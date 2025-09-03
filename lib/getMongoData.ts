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

export async function getUpcomingRooms(): Promise<mockRooms[]> {
  const { roomsCollection } = await connectToMongo();
  // Return rooms that are scheduled
  return (await roomsCollection
    .find({ status: "scheduled" })
    .toArray()) as unknown as mockRooms[];
}

export async function getOldRooms() {
  const { roomsCollection } = await connectToMongo();
  return (await roomsCollection
    .find({ endTime: { $lt: new Date() } })
    .toArray()) as unknown as mockRooms[];
}
export async function getAllRooms() {
  const { roomsCollection } = await connectToMongo();
  return (await roomsCollection.find({}).toArray()) as unknown as mockRooms[];
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
