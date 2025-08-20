export type MockRoomStatus = "live" | "scheduled" | "ended" | "saved";

export interface MockRoom {
  id: string;
  title: string;
  description: string;
  language: string;
  status: MockRoomStatus;
  isPrivate: boolean;
  host: {
    name: string;
    avatar: string;
  };
  scheduledAt: string | null;
  startedAt: string | null;
  participants: number;
  maxParticipants: number;
}
