"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "../ui/input";
import { AvatarSelector } from "./AvatarSelector";
import { useToast } from "@/hooks/useToast";
import { axiosInstance } from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserCache, AvatarCache } from "@/lib/userCache";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarId: number;
  pronouns: string;
  dateOfBirth: string;
}

export function GeneralSettings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { error: showError, promise } = useToast();
  const router = useRouter();

  const refreshProfileInBackground = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/user/me");
      if (response.data.success && response.data.authenticated) {
        setProfile(response.data.user);
        UserCache.set({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          avatarId: response.data.user.avatarId,
          pronouns: response.data.user.pronouns,
          role: response.data.user.role,
          dateOfBirth: response.data.user.dateOfBirth,
        });
      }
    } catch (err) {
      // Silent fail for background refresh
      console.error("Background profile refresh failed:", err);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      // Check cache first
      const cachedData = UserCache.get();
      if (cachedData) {
        setIsAuthenticated(true);
        setProfile({
          id: "", // ID not needed from cache
          email: cachedData.email,
          name: cachedData.name,
          role: cachedData.role || "",
          avatarId: cachedData.avatarId,
          pronouns: cachedData.pronouns || "",
          dateOfBirth: cachedData.dateOfBirth || "",
        });

        setLoading(false);

        // Optionally refresh from API in background if cache is old
        const cacheAge = UserCache.getAge();
        if (cacheAge && cacheAge > 10 * 60 * 1000) {
          // Refresh if older than 10 minutes
          refreshProfileInBackground();
        }

        return;
      }

      // Cache miss - fetch from API
      const response = await axiosInstance.get("/api/user/me");

      if (response.data.success && response.data.authenticated) {
        setIsAuthenticated(true);
        setProfile(response.data.user);

        // Cache the user data
        UserCache.set({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          avatarId: response.data.user.avatarId,
          pronouns: response.data.user.pronouns,
          role: response.data.user.role,
          dateOfBirth: response.data.user.dateOfBirth,
        });
      } else {
        setIsAuthenticated(false);
      }
    } catch (err: unknown) {
      console.error("Failed to load profile:", err);

      // If 401 (not authenticated), don't show error toast
      if (
        (err as { response?: { status?: number } }).response?.status === 401
      ) {
        setIsAuthenticated(false);
      } else {
        showError("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showError]); // refreshProfileInBackground intentionally omitted to prevent infinite loop

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      const response = await promise(
        axiosInstance.put("/api/user/update-profile", profile),
        {
          loading: "Saving changes...",
          success: "Profile updated successfully!",
          error: "Failed to update profile",
        }
      );

      if (response.data.success) {
        setProfile(response.data.user);

        // Update cache with new data
        UserCache.set({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          avatarId: response.data.user.avatarId,
          pronouns: response.data.user.pronouns,
          role: response.data.user.role,
          dateOfBirth: response.data.user.dateOfBirth,
        });

        // Update avatar cache separately
        AvatarCache.set(response.data.user.avatarId);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSelect = (avatarId: number) => {
    if (profile) {
      setProfile({ ...profile, avatarId });
    }
  };

  // Not authenticated state
  if (!isAuthenticated && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            User not authenticated
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to access your profile.
          </p>
        </div>
        <Button
          onClick={() => router.push("/login")}
          className="bg-mysecondary hover:bg-mysecondary-hover text-white px-8 py-2"
        >
          Login
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-40">
      <AvatarSelector
        currentAvatarId={profile.avatarId}
        onSelect={handleAvatarSelect}
      />
      <ProfileForm
        profile={profile}
        setProfile={setProfile}
        onSubmit={handleSubmit}
        saving={saving}
      />
    </div>
  );
}

interface ProfileFormProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
}

function ProfileForm({
  profile,
  setProfile,
  onSubmit,
  saving,
}: ProfileFormProps) {
  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <form
      className="w-full text-sm font-medium font-sans mt-8"
      onSubmit={onSubmit}
    >
      <div className="flex gap-20">
        <div className="mb-4 flex-1">
          <label className="block mb-1">Name</label>
          <Input
            value={profile.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>
        <div className="mb-4 flex-1">
          <label className="block mb-1">Pronouns</label>
          <Input
            placeholder="He/Him, She/Her, They/Them"
            value={profile.pronouns}
            onChange={(e) => handleChange("pronouns", e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-20">
        <div className="mb-4 flex-1">
          <label className="block mb-1">Current role</label>
          <Input
            value={profile.role}
            onChange={(e) => handleChange("role", e.target.value)}
          />
        </div>
        <div className="mb-4 flex-1">
          <label className="block mb-1">Date of birth</label>
          <Input
            type="date"
            value={profile.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={saving}
        className="w-full bg-mysecondary text-white py-2 px-4 rounded-md hover:bg-mysecondary-hover hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
