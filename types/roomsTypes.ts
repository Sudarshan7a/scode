export type mockRooms = {
  id: string;
  title: string;
  description: string;
  language: string;
  status: "live" | "scheduled" | "ended" | "saved";
  isPrivate: boolean;
  host: {
    name: string;
    avatar: string;
  };
  scheduledAt: null | string;
  startedAt: null | string;
  participants: number;
  maxParticipants: number;
};
