import { ObjectId } from "mongodb";

export type UserRole = "user" | "admin";

export interface User {
  _id?: ObjectId;
  name: string; // letters only, no spaces
  email: string; // restricted domains
  passwordHash: string;
  role: "user" | "admin";
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt?: Date;
}

export type RefreshToken = {
  _id?: ObjectId;
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
};

interface Collaborator {
  userId: ObjectId;
  role: "interviewer" | "candidate" | "observer";
  joinedAt: Date;
}

interface Metadata {
  tags?: string[];
  difficulty?: "easy" | "medium" | "hard";
}

export interface Room {
  _id?: ObjectId;
  title: string; // alphanumeric, no spaces
  ownerId: ObjectId;
  collaborators: Collaborator[];
  isPrivate: boolean;
  createdAt: Date;
  duration: number; // hours, float allowed
  scheduledFor?: Date;
  language?: string;
  inviteCode?: string;
  metadata?: Metadata;
}

export interface SavedCode {
  _id?: ObjectId;
  roomId: ObjectId;
  language: "javascript" | "python" | "cpp" | "java" | "go";
  content: string;
}

export interface SavedNote {
  _id?: ObjectId;
  roomId: ObjectId;
  savedBy: ObjectId;
  notes: string;
}

export interface SavedRoom {
  _id?: ObjectId;
  roomId: ObjectId;
  savedCodeId: ObjectId;
  savedNoteId: ObjectId;
  createdAt: Date;
}

export interface usersActivities {
  _id?: ObjectId;
  userId: ObjectId;
  attendedRooms: ObjectId[];
  upcomingRooms: ObjectId[];
}
