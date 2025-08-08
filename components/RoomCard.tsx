import React from "react";
import MyButton from "@/components/custom/button/MyButton";

interface RoomCardProps {
  recreate?: boolean;
  className?: string;
  title?: string;
  description?: string;
  language?: string;
  status: "live" | "scheduled" | "ended" | "saved";
  isPrivate?: boolean;
  scheduledAt?: null | string;
  startedAt?: null | string;
  participants?: number;
  maxParticipants?: number;
  host?: {
    name: string;
    avatar: string;
  };
}

interface ButtonProps {
  label: string;
  variant?: "default" | "secondary";
  onClick?: () => void;
}

const RoomCard = ({
  recreate = false,
  title,
  description,
  scheduledAt,
  status,
  host,
  className,
}: RoomCardProps) => {
  const buttons: Record<"live" | "scheduled" | "ended" | "saved", ButtonProps> =
    {
      live: { label: "Join Now", variant: "default" },
      scheduled: { label: "Notify Me", variant: "default" },
      ended: { label: "View Details", variant: "default" },
      saved: { label: "View Notes", variant: "default" },
    };

  const button = buttons[status];

  return (
    <div
      className={`bg-mybackground rounded-lg border-2 flex-1 border-mysecondary/80 duration-300 min-w-[300px] p-5 flex flex-col justify-between ${
        className ?? ""
      }`}
    >
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-myforeground font-navbar line-clamp-2">
          {title || "Room Title"}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3">
          {description || "Short description about the room or session."}
        </p>
        <div className="text-xs text-gray-500 mt-2">
          <p>{scheduledAt || "Weekday, DD/MM/YYYY"}</p>
          <p>by {host?.name || "username"}</p>
        </div>
      </div>

      {button.label && (
        <div
          className={`mt-4 ${
            status === "ended" && recreate ? "flex gap-2" : ""
          }`}
        >
          <MyButton
            variant={button.variant || "default"}
            label={button.label}
            className={`${
              !recreate ? "flex-1" : "w-full"
            } cursor-pointer bg-[#ff9819] hover:bg-mysecondary text-[#f8f8f8] rounded-full px-4 py-2`}
          />
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
