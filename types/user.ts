export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarId?: number; // 0-6 for avatar selection
  pronouns?: string;
  dateOfBirth?: string;
} | null;
