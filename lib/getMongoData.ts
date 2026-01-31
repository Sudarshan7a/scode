import { User } from "../types/user";
import { connectToMongo } from "./mongodb";
import { ObjectId, WithId, Document, Collection } from "mongodb";
import { mockRooms } from "../types/roomsTypes";

/**
 * Fetches user info for a list of owner IDs
 * Returns a map of ownerId -> { name, avatarId }
 */
async function getHostInfoForRooms(
  usersCollection: Collection<Document>,
  ownerIds: ObjectId[]
): Promise<Map<string, { name: string; avatarId?: number }>> {
  const hostMap = new Map<string, { name: string; avatarId?: number }>();

  if (ownerIds.length === 0) return hostMap;

  const users = await usersCollection
    .find(
      { _id: { $in: ownerIds } },
      { projection: { _id: 1, name: 1, avatarId: 1 } }
    )
    .toArray();

  for (const user of users) {
    hostMap.set(user._id.toString(), {
      name: user.name as string,
      avatarId: user.avatarId as number | undefined,
    });
  }

  return hostMap;
}

/**
 * Transforms a MongoDB room document to the BSON Extended JSON format expected by mockRooms
 * Optionally includes host info if provided
 */
function transformRoomDocument(
  room: WithId<Document>,
  hostInfo?: { name: string; avatarId?: number }
): mockRooms {
  const avatarPath =
    hostInfo?.avatarId !== undefined
      ? `/avatars/avatar${hostInfo.avatarId}.jpg`
      : "/avatars/avatar0.jpg";

  return {
    ...room,
    _id: { $oid: room._id.toString() },
    ownerId: { $oid: room.ownerId.toString() },
    host: {
      name: hostInfo?.name ?? "Unknown",
      avatar: avatarPath,
    },
    createdAt: room.createdAt ? { $date: room.createdAt.toISOString() } : null,
    scheduledAt: room.scheduledAt
      ? { $date: room.scheduledAt.toISOString() }
      : null,
    startedAt: room.startedAt ? { $date: room.startedAt.toISOString() } : null,
    participants: room.collaborators?.length || 0,
    collaborators:
      room.collaborators?.map(
        (collab: { userId: ObjectId; role: string; joinedAt: Date }) => ({
          ...collab,
          userId: { $oid: collab.userId.toString() },
          joinedAt: { $date: collab.joinedAt.toISOString() },
        })
      ) || [],
  } as mockRooms;
}

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
  const { roomsCollection, usersCollection } = await connectToMongo();

  if (!userId) {
    console.log("No userId provided");
    return [];
  }

  console.log("Fetching rooms for userId:", userId, "limit:", limit);
  let userObjectId;
  try {
    userObjectId = new ObjectId(userId);
  } catch {
    console.error("Invalid userId format:", userId);
    return [];
  }
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

  // Get unique owner IDs and fetch host info
  const ownerIds = [...new Set(results.map((r) => r.ownerId as ObjectId))];
  const hostMap = await getHostInfoForRooms(usersCollection, ownerIds);

  // Transform the data to match the expected format with host info
  return results.map((room) => {
    const hostInfo = hostMap.get(room.ownerId.toString());
    return transformRoomDocument(room, hostInfo);
  });
}

export async function getOldRooms() {
  const { roomsCollection, usersCollection } = await connectToMongo();
  const results = await roomsCollection
    .find({ endTime: { $lt: new Date() } })
    .toArray();

  // Get unique owner IDs and fetch host info
  const ownerIds = [...new Set(results.map((r) => r.ownerId as ObjectId))];
  const hostMap = await getHostInfoForRooms(usersCollection, ownerIds);

  // Transform the data to match the expected format with host info
  return results.map((room) => {
    const hostInfo = hostMap.get(room.ownerId.toString());
    return transformRoomDocument(room, hostInfo);
  });
}

export interface PaginatedRoomsResult {
  rooms: mockRooms[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export async function getAllRooms(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedRoomsResult> {
  const { roomsCollection, usersCollection } = await connectToMongo();

  // Validate pagination parameters
  const validPage = Math.max(1, page);
  const validPageSize = Math.min(Math.max(1, pageSize), 100); // Cap at 100

  // Calculate skip
  const skip = (validPage - 1) * validPageSize;

  // Get total count for pagination metadata
  const totalCount = await roomsCollection.countDocuments({});
  const totalPages = Math.ceil(totalCount / validPageSize);

  // Fetch paginated results
  const results = await roomsCollection
    .find({})
    .sort({ createdAt: -1 }) // Sort by most recent first
    .skip(skip)
    .limit(validPageSize)
    .toArray();

  // Get unique owner IDs and fetch host info
  const ownerIds = [...new Set(results.map((r) => r.ownerId as ObjectId))];
  const hostMap = await getHostInfoForRooms(usersCollection, ownerIds);

  // Transform the data to match the expected format with host info
  const transformedResults = results.map((room) => {
    const hostInfo = hostMap.get(room.ownerId.toString());
    return transformRoomDocument(room, hostInfo);
  });

  return {
    rooms: transformedResults,
    pagination: {
      page: validPage,
      pageSize: validPageSize,
      totalCount,
      totalPages,
    },
  };
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
