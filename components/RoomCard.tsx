import React from "react";
import MyButton from "@/components/custom/button/MyButton";

// export type mockRooms = {
//   id: string;
//   title: string;
//   description: string;
//   language: string;
//   status: string;
//   isPrivate: boolean;
//   host: {
//     name: string;
//     avatar: string;
//   };
//   scheduledAt: null | string;
//   startedAt: null | string;
//   participants: number;
//   maxParticipants: number;
// };

interface RoomCardProps {
  recreate?: boolean; // Optional prop to indicate if the card is recreated
  className?: string;
  title?: string;
  description?: string;
  language?: string;
  status: "live" | "scheduled" | "ended" | "saved"; // Made status more specific or keep as string
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
  recreate = false, // Default value for recreate prop
  title,
  description,
  scheduledAt,
  status, // Added status prop
  // startedAt,
  // participants,
  // maxParticipants,
  host,
  className,
}: RoomCardProps) => {
  const buttons: Record<"live" | "scheduled" | "ended" | "saved", ButtonProps> =
    {
      live: {
        label: "Join Now",
        variant: "default",
        // onClick: () => console.log("Join Now clicked"), // Example onClick
      },
      scheduled: {
        label: "Notify Me",
        variant: "default",
        // onClick: () => console.log("Notify Me clicked"), // Example onClick
      },
      ended: {
        label: "View Details",
        variant: "default",
        // onClick: () => console.log("View Details clicked"), // Example onClick
      },
      saved: {
        label: "View Notes",
        variant: "default",
        // onClick: () => console.log("View Notes clicked"), // Example onClick
      },
    };
  let button: ButtonProps; // Renamed for clarity

  switch (status) {
    case "live":
      button = buttons.live;
      break;
    case "scheduled":
      button = buttons.scheduled;
      break;
    case "ended":
      button = buttons.ended;
      break;
    case "saved":
      button = buttons.saved;
      break;
  }
  return (
    <div
      className={`bg-mybackground rounded-lg border-2 flex-1 border-mysecondary/80 duration-300 min-w-[300px] p-5 flex flex-col justify-between ${className}`}
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
            button.label === "ended" && recreate === true ? "flex gap-2" : ""
          }`}
        >
          <MyButton
            variant={button.variant || "default"}
            // onClick={button.onClick}
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
