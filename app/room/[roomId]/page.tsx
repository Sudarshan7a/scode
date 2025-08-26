"use client";
import LeftTools from "./LeftTools";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CollaborativeEditor from "./CollaborativeEditor";
import { use } from "react";

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);

  return (
    <div className="flex h-screen w-full justify-between">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={30} defaultSize={40}>
          <LeftTools />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30} defaultSize={60}>
          <CollaborativeEditor roomId={roomId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
