import React from "react";
import BottomBar from "../../../components/joinRoom/BottomBar";
import VideoCallContainer from "./VideoCallContainer";

type Props = {
  roomId: string;
};

function LeftTools({ roomId }: Props) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="pt-2 px-2 h-full">
        <VideoCallContainer roomId={roomId} />
      </div>
      <div className="mt-auto">
        <BottomBar />
      </div>
    </div>
  );
}

export default LeftTools;
