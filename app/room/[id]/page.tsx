import LeftTools from "./LeftTools";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CollaborativeEditor from "./CollaborativeEditor";

export default function RoomPage() {
  return (
    <div className="flex h-screen w-full justify-between">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={30} defaultSize={50}>
          <LeftTools />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30} defaultSize={50}>
          <CollaborativeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
