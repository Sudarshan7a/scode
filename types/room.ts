// Centralized room-related TypeScript types used across room UI & APIs
// Keeping these separate from implementation utilities to allow reuse.

export type RoomState =
  | "loading"
  | "not-found"
  | "scheduled"
  | "ended"
  | "live"
  | "error";

export type ScheduledInfo = {
  scheduledAt: string | null;
  title?: unknown;
  description?: unknown;
};
export type EndedInfo = { title?: unknown; endedAt?: unknown };
export type LiveInfo = {
  title?: unknown;
  description?: unknown;
  room?: unknown;
};
export type ErrorInfo = { message: string };
export type RoomInfo =
  | ScheduledInfo
  | EndedInfo
  | LiveInfo
  | ErrorInfo
  | Record<string, unknown>
  | null;

// Minimal shape returned by /api/rooms/details
export type RoomDetailsData = {
  isHost?: boolean;
  status?: string;
  scheduledAt?: string | null;
  title?: unknown;
  description?: unknown;
  endedAt?: unknown;
  room?: unknown;
};
