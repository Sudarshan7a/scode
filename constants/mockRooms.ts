import { mockRooms } from "../types/roomsTypes";

export const mockRoomsData: mockRooms[] = [
  {
    _id: { $oid: "68b0922404392e0d955a1597" },

    title: "Frontend System Design",
    description:
      "Deep dive into scalable frontend architectures, component design patterns, and state management strategies for large applications.",
    language: "JavaScript",
    status: "live",
    isPrivate: false,
    host: {
      name: "Alice",
      avatar: "/avatars/alice.png",
    },
    ownerId: { $oid: "507f1f77bcf86cd799439011" },
    collaborators: [
      {
        userId: { $oid: "507f191e810c19729de860ea" },
        role: "participant",
        joinedAt: { $date: "2025-05-28T10:00:00.000Z" },
      },
    ],
    createdAt: { $date: "2025-05-27T20:00:00.000Z" },
    scheduledAt: null,
    startedAt: { $date: "2025-05-28T10:00:00.000Z" },
    duration: 60,
    participants: 3,
    maxParticipants: 5,
  },

  {
    _id: { $oid: "68b0922404392e0d955a1598" },

    title: "ML Case Interview Prep",
    description:
      "Practice machine learning case study interviews with real-world scenarios, model selection, and feature engineering discussions.",
    language: "Python",
    status: "scheduled",
    isPrivate: false,
    host: {
      name: "Bob",
      avatar: "/avatars/bob.png",
    },
    ownerId: { $oid: "507f1f77bcf86cd799439012" },
    collaborators: [
      {
        userId: { $oid: "507f191e810c19729de860eb" },
        role: "host",
        joinedAt: { $date: "2025-05-29T09:00:00.000Z" },
      },
    ],
    createdAt: { $date: "2025-05-28T19:00:00.000Z" },
    scheduledAt: { $date: "2025-06-01T15:00:00.000Z" },
    startedAt: null,
    duration: 45,
    participants: 0,
    maxParticipants: 2,
  },
  {
    _id: { $oid: "68b0922404392e0d955a1599" },

    title: "Backend with Rust",
    description:
      "Explore high-performance backend development using Rust, covering memory safety, concurrency, and web frameworks like Actix.",
    language: "Rust",
    status: "live",
    isPrivate: true,
    host: {
      name: "Clara",
      avatar: "/avatars/clara.png",
    },
    ownerId: { $oid: "507f1f77bcf86cd799439013" },
    collaborators: [
      {
        userId: { $oid: "507f191e810c19729de860ec" },
        role: "participant",
        joinedAt: { $date: "2025-05-28T09:30:00.000Z" },
      },
    ],
    createdAt: { $date: "2025-05-27T18:00:00.000Z" },
    scheduledAt: null,
    startedAt: { $date: "2025-05-28T09:30:00.000Z" },
    duration: 50,
    participants: 2,
    maxParticipants: 2,
  },
  {
    _id: { $oid: "68b0922404392e0d955a159a" },

    title: "DSA Mock Interview",
    description:
      "Intensive data structures and algorithms interview preparation with coding challenges, optimization techniques, and complexity analysis.",
    language: "C++",
    status: "scheduled",
    isPrivate: false,
    host: {
      name: "Dan",
      avatar: "/avatars/dan.png",
    },
    ownerId: { $oid: "507f1f77bcf86cd799439014" },
    collaborators: [
      {
        userId: { $oid: "507f191e810c19729de860ed" },
        role: "host",
        joinedAt: { $date: "2025-05-29T10:00:00.000Z" },
      },
    ],
    createdAt: { $date: "2025-05-28T17:00:00.000Z" },
    scheduledAt: { $date: "2025-06-02T13:30:00.000Z" },
    startedAt: null,
    duration: 40,
    participants: 1,
    maxParticipants: 2,
  },
  {
    _id: { $oid: "68b0922404392e0d955a159b" },

    title: "AI Ethics Roundtable",
    description:
      "Open discussion on ethical implications of AI development, bias in algorithms, privacy concerns, and responsible AI practices.",
    language: "General",
    status: "ended",
    isPrivate: false,
    host: {
      name: "Eva",
      avatar: "/avatars/eva.png",
    },
    ownerId: { $oid: "507f1f77bcf86cd799439015" },
    collaborators: [
      {
        userId: { $oid: "507f191e810c19729de860ee" },
        role: "participant",
        joinedAt: { $date: "2025-05-25T18:00:00.000Z" },
      },
    ],
    createdAt: { $date: "2025-05-24T16:00:00.000Z" },
    scheduledAt: { $date: "2025-05-25T18:00:00.000Z" },
    startedAt: { $date: "2025-05-25T18:00:00.000Z" },
    duration: 90,
    participants: 4,
    maxParticipants: 6,
  },
];
