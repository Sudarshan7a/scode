export type mockRooms = {
  _id: { $oid: string };
  title: string;
  description: string;
  language: string;
  status: "live" | "scheduled" | "ended" | "saved";
  isPrivate: boolean;
  host: {
    name: string;
    avatar: string;
  };
  ownerId: { $oid: string };
  collaborators: {
    userId: { $oid: string };
    role: "host" | "participant";
    joinedAt: { $date: string };
  }[];
  createdAt: { $date: string };
  scheduledAt: null | { $date: string };
  startedAt: null | { $date: string };
  duration: number;
  participants: number;
  maxParticipants: number;
};
