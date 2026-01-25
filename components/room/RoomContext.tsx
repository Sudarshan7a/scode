"use client";
import { createContext, useContext } from "react";
import type { RoomInfo } from "../../types/room";

interface RoomContextValue {
  roomId: string;
  isHost: boolean;
  roomInfo: RoomInfo;
  isStarting: boolean;
  isJoining: boolean;
  isEnding: boolean;
  isLeaving: boolean;
  isPrivate: boolean;
  requiresPassword: boolean;
  passwordError: string;
  handleStartRoom: () => void;
  handleJoinRoom: (password?: string) => void;
  handleEndSession: () => Promise<void>;
  handleLeaveRoom: () => Promise<void>;
}

const RoomContext = createContext<RoomContextValue | null>(null);

export const RoomProvider = RoomContext.Provider;

export function useRoomContext() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within RoomProvider");
  }
  return context;
}
