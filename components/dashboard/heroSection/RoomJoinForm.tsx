import MyButton from "@/components/custom/button/MyButton";
import PlusIcon from "@/components/icons/PlusIcon";
import React from "react";

function RoomJoinForm() {
  return (
    <div className=" flex w-full max-w-md items-center justify-start gap-2 lg:flex-row lg:gap-4">
      <div>
        <MyButton
          label={
            <span className="flex items-center justify-center gap-2 ">
              <PlusIcon className="scale-150" />
              <p className="scale-105 text-mybackground font-secondary font-medium">
                New meeting
              </p>
            </span>
          }
          variant="default"
          className="rounded-full "
        />
      </div>
      <div className="relative ">
        <input
          type="text"
          placeholder="Enter Room ID or Link"
          className="w-full py-2 px-2 pl-3 pr-20 border-1 border-myforeground rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-mysecondary-hover hover:bg-mysecondary-hover/80 text-white py-1.5 px-4 rounded-full text-sm font-medium transition-colors cursor-pointer">
          Join
        </button>
      </div>
    </div>
  );
}

export default RoomJoinForm;
