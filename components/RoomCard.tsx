import React from "react";
import MyButton from "@/components/custom/button/MyButton";

interface RoomCardProps {
  title?: string;
  description?: string;
  date?: string;
  username?: string;
  buttons?: Array<{
    label: string;
    onClick?: () => void;
    variant?:
      | "default"
      | "link"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | null
      | undefined;
  }>;
}

const RoomCard = ({
  title,
  description,
  date,
  username,
  buttons,
}: RoomCardProps) => {
  return (
    <div className="bg-mybackground rounded-lg border-2 border-mysecondary/80 duration-300 w-[300px] p-5 flex flex-col justify-between">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-myforeground font-navbar line-clamp-2">
          {title || "Room Title"}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3">
          {description || "Short description about the room or session."}
        </p>
        <div className="text-xs text-gray-500 mt-2">
          <p>{date || "Weekday, DD/MM/YYYY"}</p>
          <p>by {username || "username"}</p>
        </div>
      </div>

      {buttons && buttons.length > 0 && (
        <div className={`mt-4 ${buttons.length > 1 ? "flex gap-2" : ""}`}>
          {buttons.map((button, index) => (
            <MyButton
              key={index}
              variant={button.variant || "default"}
              // onClick={button.onClick}
              label={button.label}
              className={`${
                buttons.length > 1 ? "flex-1" : "w-full"
              } cursor-pointer bg-[#ff9819] hover:bg-mysecondary text-[#f8f8f8] rounded-full px-4 py-2`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomCard;
