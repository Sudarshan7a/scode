import React, { useState } from "react";
import MyButton from "./custom/button/MyButton";
import { mockRooms } from "../types/roomsTypes";
import { axiosInstance } from "@/lib/axiosInstance";

interface RoomCardProps {
  recreate?: boolean;
  className?: string;
  room: mockRooms;
  isOwner?: boolean;
}

interface ButtonProps {
  label: string;
  variant?: "default" | "secondary";
  onClick?: () => void;
}

const RoomCard = ({
  recreate = false,
  room,
  className,
  isOwner = false,
}: RoomCardProps) => {
  const [isNotifying, setIsNotifying] = useState(false);

  // Debug logging
  console.log("RoomCard received room data:", room);
  console.log("Room _id:", room?._id);

  const {
    title,
    description,
    language,
    status,
    isPrivate,
    host,
    scheduledAt,
    startedAt,
    participants,
    maxParticipants,
    duration,
    _id,
  } = room || {};

  // Format date for display
  const formatDate = (dateObj: { $date: string } | null) => {
    if (!dateObj) return null;
    return new Date(dateObj.$date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const displayDate = scheduledAt
    ? formatDate(scheduledAt)
    : startedAt
    ? formatDate(startedAt)
    : "Date not set";

  const handleNotify = async () => {
    // Handle different possible formats of room ID
    const roomId = _id?.$oid || _id?.toString() || _id;

    if (!roomId) {
      alert("Room ID is missing");
      console.error("Room ID debugging:", { _id, roomId, room });
      return;
    }

    setIsNotifying(true);
    try {
      const { data: userData } = await axiosInstance.get("/api/auth/me");

      if (!userData.user?.id) {
        alert("Please log in to subscribe to notifications");
        return;
      }

      const { data } = await axiosInstance.post("/api/rooms/notify", {
        roomId: roomId,
        userId: userData.user.id,
      });

      alert(data.message || data.error);
    } catch (error) {
      alert("Failed to subscribe to notifications");
    } finally {
      setIsNotifying(false);
    }
  };

  const buttons: Record<"live" | "scheduled" | "ended" | "saved", ButtonProps> =
    {
      live: { label: "Join Now", variant: "default" },
      scheduled: {
        label: isOwner
          ? "Start Room"
          : isNotifying
          ? "Subscribing..."
          : "Notify Me",
        variant: "default",
        onClick: !isOwner ? handleNotify : undefined,
      },
      ended: { label: "View Details", variant: "default" },
      saved: { label: "View Notes", variant: "default" },
    };

  const button = buttons[status as keyof typeof buttons] || {
    label: "",
    variant: "default",
  };

  return (
    <div
      className={`bg-mybackground rounded-lg border-2 flex-1 border-mysecondary/80 duration-300 min-w-[300px] p-5 flex flex-col justify-between ${
        className ?? ""
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-myforeground font-navbar line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-mysecondary/20 rounded-full text-mysecondary">
              {language}
            </span>
            {isPrivate && (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                Private
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 line-clamp-3">{description}</p>
        <div className="text-xs text-gray-500 mt-2 space-y-1">
          <p>{displayDate}</p>
          <p>by {host?.name ?? "Unknown host"}</p>
          <div className="flex items-center justify-between">
            <p>
              {participants ?? 0}/{maxParticipants ?? "—"} participants
            </p>
            <p>{duration ?? "—"} min</p>
          </div>
        </div>
      </div>

      {button.label && (
        <div
          className={`mt-4 ${
            status === "ended" && recreate ? "flex gap-2" : ""
          }`}
        >
          <div
            onClick={button.onClick}
            className={`${!recreate ? "flex-1" : "w-full"} cursor-pointer`}
          >
            <MyButton
              variant={button.variant || "default"}
              label={button.label}
              className="w-full bg-[#ff9819] hover:bg-mysecondary text-[#f8f8f8] rounded-full px-4 py-2"
            />
          </div>
          {recreate && (
            <MyButton
              variant="default"
              label="Recreate Room"
              className="flex-1 cursor-pointer bg-[#ff9819] hover:bg-mysecondary text-[#f8f8f8] rounded-full px-4 py-2"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RoomCard;
