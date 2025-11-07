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

      if (data.success && data.user.avatarId !== undefined) {
        setAvatarId(data.user.avatarId);
        // Cache the avatarId for future use (24 hours)
        AvatarCache.set(data.user.avatarId);
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

  if (avatarId === null || avatarId === undefined) {
    return <AvatarIcon className={className} />;
  }

  return (
    <div className={`${className} relative rounded-full overflow-hidden`}>
      <Image
        src={`/avatars/avatar${avatarId}.jpg`}
        alt="User Avatar"
        fill
        className="object-cover"
      />
    </div>
  );
}
