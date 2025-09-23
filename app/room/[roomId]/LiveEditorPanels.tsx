"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import LeftTools from "./LeftTools";
import CollaborativeEditor from "./CollaborativeEditor";

type Props = {
  roomId: string;
  isHost: boolean;
  onEndSession: () => Promise<void>;
  isEnding: boolean;
  onLeaveRoom: () => Promise<void>;
  isLeaving: boolean;
};

export default function LiveEditorPanels({
  roomId,
  isHost,
  onEndSession,
  isEnding,
  onLeaveRoom,
  isLeaving,
}: Props) {
  return (
    <AsyncErrorBoundary
      fallbackTitle="Editor Failed to Load"
      fallbackMessage="The collaborative editor encountered an error. Please refresh the page to continue."
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={30} defaultSize={40}>
          <AsyncErrorBoundary
            fallbackTitle="Tools Failed to Load"
            fallbackMessage="Unable to load the sidebar tools."
          >
            <LeftTools roomId={roomId} isHost={isHost} />
          </AsyncErrorBoundary>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30} defaultSize={60}>
          <AsyncErrorBoundary
            fallbackTitle="Code Editor Failed to Load"
            fallbackMessage="The code editor encountered an error. Please refresh to continue coding."
          >
            <CollaborativeEditor
              roomId={roomId}
              isHost={isHost}
              onEndSession={onEndSession}
              isEnding={isEnding}
              onLeaveRoom={onLeaveRoom}
              isLeaving={isLeaving}
            />
          </AsyncErrorBoundary>
        </ResizablePanel>
      </ResizablePanelGroup>
    </AsyncErrorBoundary>
  );
}
