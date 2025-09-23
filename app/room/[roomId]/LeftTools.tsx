import React from "react";
import BottomBar from "../../../components/joinRoom/BottomBar";
import VideoCallContainer from "./VideoCallContainer";

type Props = {
  roomId: string;
  isHost: boolean;
};

function LeftTools({ roomId, isHost }: Props) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="pt-2 px-2 h-full">
        <VideoCallContainer roomId={roomId} isHost={isHost} />
      </div>
      <div className="mt-auto">
        <BottomBar />
      </div>
    </div>
  );
}

export default LeftTools;
