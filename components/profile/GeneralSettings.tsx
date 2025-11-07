"use client";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { AvatarSelector } from "./AvatarSelector";
import { useToast } from "@/hooks/useToast";
import { axiosInstance } from "@/lib/axiosInstance";

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
  const { error: showError, success, promise } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // Get userId from cookie
      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userId="))
        ?.split("=")[1];

      if (!userId) {
        showError("User not authenticated");
        return;
      }

      const response = await axiosInstance.get(
        `/api/user/profile?userId=${userId}`
      );

      if (response.data.success) {
        setProfile(response.data.user);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      showError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="flex gap-20">
        <div className="mb-4 flex-1">
          <label className="block mb-1">Email</label>
          <Input
            value={profile.email}
            disabled
            className="bg-gray-100 dark:bg-gray-800"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        <div className="mb-4 flex-1"></div>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="w-full bg-mysecondary text-white py-2 px-4 rounded-md hover:bg-mysecondary-hover hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
