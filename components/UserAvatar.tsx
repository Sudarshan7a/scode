"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import AvatarIcon from "./icons/AvatarIcon";
import { AvatarCache } from "@/lib/userCache";

interface UserAvatarProps {
  className?: string;
}

export default function UserAvatar({
  className = "w-10 h-10",
}: UserAvatarProps) {
  const [avatarId, setAvatarId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserAvatar();
  }, []);

  const loadUserAvatar = async () => {
    try {
      // Check localStorage cache first
      const cachedAvatarId = AvatarCache.get();

      if (cachedAvatarId !== null) {
        setAvatarId(cachedAvatarId);
        setLoading(false);
        return;
      }

      // Cache miss or expired - fetch from API
      const response = await fetch("/api/user/me");
      const data = await response.json();

      if (data.success) {
        const userAvatarId = data.user.avatarId ?? 0; // Default to 0 if undefined
        setAvatarId(userAvatarId);
        // Cache the avatarId for future use (24 hours)
        AvatarCache.set(userAvatarId);
      }
    } catch (err) {
      console.error("Failed to load avatar:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AvatarIcon className={className} />;
  }

  // Use avatarId or default to 0
  const displayAvatarId = avatarId ?? 0;

  return (
    <div className={`${className} relative rounded-full overflow-hidden`}>
      <Image
        src={`/avatars/avatar${displayAvatarId}.jpg`}
        alt="User Avatar"
        fill
        className="object-cover"
      />
    </div>
  );
}
