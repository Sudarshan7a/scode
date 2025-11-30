import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { mockRooms } from "../types/roomsTypes";
import { axiosInstance } from "@/lib/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, Users, Lock, User, FileCode } from "lucide-react";

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
  const router = useRouter();
  const [isNotifying, setIsNotifying] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

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

  const handleDetails = () => {
    setShowDetailsDialog(true);
  };

  const handleJoinRoom = () => {
    const roomId = _id?.$oid || _id?.toString() || _id;
    if (roomId) {
      router.push(`/room/${roomId}`);
    }
  };

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

      const response = await axiosInstance.post("/api/rooms/notify", {
        roomId: roomId,
        userId: userData.user.id,
      });

      alert(
        response.data.message || "Successfully subscribed to notifications"
      );
    } catch (error) {
      console.error("Notification subscription failed:", error);
      const axiosError = error as {
        response?: { data?: { error?: string; message?: string } };
      };
      const errorMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        "Failed to subscribe to notifications";
      alert(errorMessage);
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
      ended: {
        label: "View Details",
        variant: "default",
        onClick: handleDetails,
      },
      saved: { label: "View Notes", variant: "default" },
    };

  const button = buttons[status as keyof typeof buttons] || {
    label: "",
    variant: "default",
  };

  return (
    <>
      <div
        className={`bg-mybackground rounded-lg border-2  border-mysecondary/80 duration-300 min-w-[300px] p-5 flex flex-col justify-between ${
          className ?? ""
        }`}
      >
        <div className="space-y-2 min-h-[160px]">
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
          <div className="flex justify-between flex-col">
            <p className="text-sm  text-gray-500 line-clamp-3">{description}</p>
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
              <Button
                variant={button.variant || "default"}
                className="w-full bg-[#ff9819] hover:bg-mysecondary-hover text-[#f8f8f8] rounded-full px-4 py-2"
              >
                {button.label}
              </Button>
            </div>
            {recreate && (
              <Button
                variant="default"
                className="flex-1 cursor-pointer bg-[#ff9819] hover:bg-mysecondary text-[#f8f8f8] rounded-full px-4 py-2"
              >
                Recreate Room
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Room Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {title}
            </DialogTitle>
            <DialogDescription className="text-foreground/70">
              Room Details and Summary
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                Description
              </h3>
              <p className="text-foreground/90">{description}</p>
            </div>

            {/* Room Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Host */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <User className="h-5 w-5 text-mysecondary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground/70">Host</p>
                  <p className="text-foreground font-medium">
                    {host?.name ?? "Unknown host"}
                  </p>
                </div>
              </div>

              {/* Language */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <FileCode className="h-5 w-5 text-mysecondary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground/70">
                    Language
                  </p>
                  <p className="text-foreground font-medium">{language}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <Calendar className="h-5 w-5 text-mysecondary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground/70">Date</p>
                  <p className="text-foreground font-medium">{displayDate}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <Clock className="h-5 w-5 text-mysecondary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground/70">
                    Duration
                  </p>
                  <p className="text-foreground font-medium">
                    {duration ?? "—"} minutes
                  </p>
                </div>
              </div>

              {/* Participants */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <Users className="h-5 w-5 text-mysecondary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground/70">
                    Participants
                  </p>
                  <p className="text-foreground font-medium">
                    {participants ?? 0}/{maxParticipants ?? "—"}
                  </p>
                </div>
              </div>

              {/* Privacy */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <Lock className="h-5 w-5 text-mysecondary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground/70">
                    Privacy
                  </p>
                  <p className="text-foreground font-medium">
                    {isPrivate ? "Private" : "Public"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-sm font-medium text-foreground/70">
                Status
              </span>
              <span className="px-3 py-1 rounded-full bg-mysecondary/20 text-mysecondary text-sm font-medium capitalize">
                {status}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoomCard;
