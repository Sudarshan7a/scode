"use client";

import { useState, useEffect } from "react";
import { UserCache } from "@/lib/userCache";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarId?: number;
  notifications: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      //use axious
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setUser(null);
          setError("Not authenticated");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUser(data.user);

      // Update cache
      if (data.user) {
        UserCache.set({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          avatarId: data.user.avatarId ?? 0,
          pronouns: data.user.pronouns,
          role: data.user.role,
          dateOfBirth: data.user.dateOfBirth,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}
