// Utility helpers for the room page. Core shared types are imported from '@/types/room'.
import type {
  RoomState,
  RoomInfo,
  RoomDetailsData,
} from "@/types/room";

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object";
};

// Axios-like error guard
export type AxiosErrorLike = { response: { status?: number; data?: unknown } };
export const hasAxiosResponse = (err: unknown): err is AxiosErrorLike => {
  if (!isObject(err)) return false;
  const resp = (err as Record<string, unknown>).response;
  return isObject(resp);
};

// Basic Mongo ObjectId validation (24 hex chars)
export const isValidObjectId = (id: unknown): boolean =>
  /^[a-fA-F0-9]{24}$/.test(String(id ?? ""));

// Centralized error logger for axios/server errors
export const logRequestError = (context: string, error: unknown) => {
  if (hasAxiosResponse(error)) {
    console.error(`${context} - server response:`, error.response.data);
  } else {
    console.error(`${context}:`, error);
  }
};

// (Types removed – now sourced from '@/types/room')

// Parse a details response into state, info, and host flag
export const deriveRoomState = (
  data: RoomDetailsData
): {
  nextState: RoomState;
  nextInfo: RoomInfo;
  isHost: boolean;
} => {
  const isUserHost = !!data.isHost;
  const status = data.status as string | undefined;

  if (status === "scheduled") {
    return {
      nextState: "scheduled",
      nextInfo: {
        scheduledAt: data.scheduledAt ?? null,
        title: data.title,
        description: data.description,
      },
      isHost: isUserHost,
    };
  }

  if (status === "ended") {
    return {
      nextState: "ended",
      nextInfo: {
        title: data.title,
        endedAt: data.endedAt,
      },
      isHost: isUserHost,
    };
  }

  if (status === "live") {
    return {
      nextState: "live",
      nextInfo: {
        title: data.title,
        description: data.description,
        room: data.room,
      },
      isHost: isUserHost,
    };
  }

  return {
    nextState: "error",
    nextInfo: { message: "Unknown room status" },
    isHost: isUserHost,
  };
};

// Convert an error into state/info outcome for the UI
export const deriveErrorState = (
  err: unknown
): { nextState: RoomState; nextInfo: RoomInfo } => {
  if (hasAxiosResponse(err)) {
    const status = err.response.status ?? 0;
    const errorData = err.response.data as unknown;
    if (status === 404) return { nextState: "not-found", nextInfo: null };
    if (status === 401)
      return {
        nextState: "error",
        nextInfo: {
          message: "Unauthorized. Please sign in to view this room.",
        },
      };
    return {
      nextState: "error",
      nextInfo: {
        message: String(
          isObject(errorData) && "error" in errorData
            ? (errorData as { error: unknown }).error
            : "Unknown error"
        ),
      },
    };
  }
  return {
    nextState: "error",
    nextInfo: { message: err instanceof Error ? err.message : String(err) },
  };
};
