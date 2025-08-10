export const usersCollectionValidation = {
  $jsonSchema: {
    bsonType: "object",
    required: ["email", "name", "passwordHash", "role", "emailVerified"],
    properties: {
      name: {
        bsonType: "string",
        pattern: "^[A-Za-z]+$",
        description: "Letters only, no spaces",
      },
      email: {
        bsonType: "string",
        pattern:
          "^.+@((gmail|outlook|hotmail|yahoo|icloud|aol|mail|protonmail|zoho|gmx)\\.com|sdit\\.ac\\.in)$",
        description: "Only approved domains (major .com providers or sdit.ac.in)",
      },
      passwordHash: { bsonType: "string" },
      role: { enum: ["user", "admin"] },
      avatarUrl: { bsonType: "string" },
      createdAt: { bsonType: "date" },
      emailVerified: {
        bsonType: "bool",
        description: "Whether the user's email is verified",
      },
    },
  },
} as const;

// Keep this in sync with usersCollectionValidation.$jsonSchema.properties.email.pattern
// The pattern allows only the following .com domains
export const allowedEmailDomains = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
  "aol.com",
  "mail.com",
  "protonmail.com",
  "zoho.com",
  "gmx.com",
  "sdit.ac.in",
] as const;

export function isEmailDomainAllowed(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at === -1) return false;
  const domain = email.slice(at + 1).toLowerCase();
  return (allowedEmailDomains as readonly string[]).includes(domain);
}

export const userActivityValidation = {
  $jsonSchema: {
    bsonType: "object",
    required: ["userId", "attendedRooms", "upcomingRooms"],
    properties: {
      userId: { bsonType: "objectId" },
      attendedRooms: { bsonType: "array", items: { bsonType: "objectId" } },
      upcomingRooms: { bsonType: "array", items: { bsonType: "objectId" } },
    },
  },
} as const;

export const savedNoteValidation = {
  $jsonSchema: {
    bsonType: "object",
    required: ["roomId", "savedBy", "notes"],
    properties: {
      roomId: { bsonType: "objectId" },
      savedBy: { bsonType: "objectId" },
      notes: { bsonType: "string" },
    },
  },
} as const;

export const savedCodeValidation = {
  $jsonSchema: {
    bsonType: "object",
    required: ["roomId", "language", "content"],
    properties: {
      roomId: { bsonType: "objectId" },
      language: { enum: ["javascript", "python", "cpp", "java", "go"] },
      content: { bsonType: "string" },
    },
  },
} as const;

export const roomsCollectionValidation = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "title",
      "ownerId",
      "collaborators",
      "isPrivate",
      "createdAt",
      "duration",
    ],
    properties: {
      title: {
        bsonType: "string",
        description: "Must be alphanumeric with no spaces",
      },
      ownerId: { bsonType: "objectId" },
      collaborators: {
        bsonType: "array",
        items: {
          bsonType: "object",
          required: ["userId", "role", "joinedAt"],
          properties: {
            userId: { bsonType: "objectId" },
            role: { enum: ["interviewer", "candidate", "observer"] },
            joinedAt: { bsonType: "date" },
          },
        },
      },
      isPrivate: { bsonType: "bool" },
      createdAt: { bsonType: "date" },
      duration: { bsonType: "double" },
      scheduledFor: { bsonType: "date" },
      language: { bsonType: "string" },
      inviteCode: { bsonType: "string" },
      metadata: {
        bsonType: "object",
        properties: {
          tags: { bsonType: "array", items: { bsonType: "string" } },
          difficulty: { enum: ["easy", "medium", "hard"] },
        },
      },
    },
  },
} as const;

export const roomSaveValidation = {
  $jsonSchema: {
    bsonType: "object",
    required: ["roomId", "savedCodeId", "savedNoteId", "createdAt"],
    properties: {
      roomId: { bsonType: "objectId" },
      savedCodeId: { bsonType: "objectId" },
      savedNoteId: { bsonType: "objectId" },
      createdAt: { bsonType: "date" },
    },
  },
} as const;

export const refreshTokenValidation = {
  $jsonSchema: {
    bsonType: "object",
    required: ["userId", "token", "createdAt", "expiresAt"],
    properties: {
      userId: { bsonType: "string" },
      token: { bsonType: "string" },
      createdAt: { bsonType: "date" },
      expiresAt: { bsonType: "date" },
    },
  },
} as const;
