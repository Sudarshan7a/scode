import React, { useState } from "react";
import BottomBar, { TabType } from "../../../components/joinRoom/BottomBar";
import VideoCallContainer from "./VideoCallContainer";
import NotesPage from "../../../components/joinRoom/notes/NotesPage";
import AiChat from "../../../components/joinRoom/gemmini/AiChat";

type Props = {
  roomId: string;
  isHost: boolean;
};

function LeftTools({ roomId, isHost }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("call");

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <div
          className={`absolute inset-0 ${
            activeTab === "notes" ? "block" : "hidden"
          }`}
        >
          <NotesPage sessionId={roomId} />
        </div>
        <div
          className={`absolute inset-0 ${
            activeTab === "call" ? "block" : "hidden"
          }`}
        >
          <div className="pt-2 px-2 h-full">
            <VideoCallContainer roomId={roomId} isHost={isHost} />
          </div>
        </div>
        <div
          className={`absolute inset-0 ${
            activeTab === "ai" ? "block" : "hidden"
          }`}
        >
          <AiChat />
        </div>
      </div>
      <div className="mt-auto">
        <BottomBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default LeftTools;
