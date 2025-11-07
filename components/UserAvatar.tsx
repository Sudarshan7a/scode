"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import AvatarIcon from "./icons/AvatarIcon";

interface UserAvatarProps {
  className?: string;
}

export default function UserAvatar({ className = "w-10 h-10" }: UserAvatarProps) {
  const [avatarId, setAvatarId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserAvatar();
  }, []);

  const loadUserAvatar = async () => {
    try {
      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userId="))
        ?.split("=")[1];

      if (!userId) {
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/user/profile?userId=${userId}`);
      const data = await response.json();

      if (data.success && data.user.avatarId !== undefined) {
        setAvatarId(data.user.avatarId);
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
