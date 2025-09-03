import { z } from "zod";

// Helper to validate Mongo ObjectId strings (24 hex chars)
const objectIdString = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId (expected 24 hex chars)");

const collaboratorSchema = z.object({
  userId: objectIdString,
  role: z.enum(["host", "participant"]),
  joinedAt: z.date().optional(),
});

// Schedule (create) room schema - matches Mongo validation requirements
export const scheduleRoomSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  ownerId: objectIdString,
  isPrivate: z.boolean(),
  createdAt: z.date().optional(),
  duration: z.number().positive().int(),
  scheduledFor: z.date().optional().nullable(),
  description: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  savedCodeId: objectIdString.optional(),
  collaborators: z.array(collaboratorSchema).optional(),
  endedAt: z.date().optional().nullable(),
});

// Host (start) room schema - used when starting/hosting a room live
export const hostRoomSchema = z.object({
  roomId: objectIdString,
  ownerId: objectIdString,
  // optional override fields when starting a room
  title: z.string().optional(),
  isPrivate: z.boolean().optional(),
  startedAt: z.date().optional(),
});

// Join room schema - user joins a room as participant or host
export const joinRoomSchema = z.object({
  roomId: objectIdString,
  userId: objectIdString.optional(), // if omitted, use auth userId
  role: z.enum(["host", "participant"]).optional().default("participant"),
});

// Server-side inferred types (from Mongo validation schemas)
export type ScheduleRoomValues = z.infer<typeof scheduleRoomSchema>;
export type HostRoomValues = z.infer<typeof hostRoomSchema>;
export type JoinRoomValues = z.infer<typeof joinRoomSchema>;
// export type ScheduleRoomValues = z.infer<typeof scheduleRoomSchema>;
// export type HostRoomValues = z.infer<typeof hostRoomSchema>;
// export type JoinRoomValues = z.infer<typeof joinRoomSchema>;

// --- Form-level Zod schemas (match UI forms) ---------------------------------
// These validate the data coming from the React forms (roomName, date/time,
// roomType, privacy level, etc.). Keep them separate from the server-side
// Mongo validation schemas above so we can have UI-friendly fields.

export const scheduleFormSchema = scheduleRoomSchema.extend({
  // UI fields used by ScheduleForm components
  // allow ownerId to be optional in the UI form (server still requires it)
  ownerId: objectIdString.optional(),
  roomType: z.enum(["interview", "mock", "pairing"]).optional(),
  privacyLevel: z.enum(["public", "private"]).optional(),
  editorEnabled: z.boolean().optional(),
  languagePreference: z.string().optional().nullable(),
  // helper UI-only fields
  scheduledAt: z.date().optional().nullable(),
  time: z.string().optional().nullable(),
});

export const hostFormSchema = z.object({
  roomName: z.string().min(1, "Room name is required"),
  description: z.string().optional().nullable(),
  roomType: z.enum(["interview", "mock", "pairing"]).optional(),
  privacyLevel: z.enum(["public", "private"]).optional(),
  editorEnabled: z.boolean().optional(),
  languagePreference: z.string().optional().nullable(),
});

export const joinFormSchema = z.object({
  roomName: z.string().min(1, "Room link or ID is required"),
});

// Form value types (used by react-hook-form in the UI)
export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
export type HostFormValues = z.infer<typeof hostFormSchema>;
export type JoinFormValues = z.infer<typeof joinFormSchema>;
