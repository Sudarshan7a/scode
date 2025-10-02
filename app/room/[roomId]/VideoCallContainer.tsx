"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  CallControls,
  type User,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import PreJoinVideoPanel from "./PreJoinVideoPanel";

type Props = {
  roomId: string;
  isHost: boolean;
};

// Minimal, self-contained video call container.
// It expects a backend at /api/video/token to provide { token, userId } for the current user.
// If not configured, it renders a small non-blocking message.
export default function VideoCallContainer({ roomId, isHost }: Props) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<ReturnType<
    StreamVideoClient["call"]
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false); // whether user has actually joined the call
  const [callEnded, setCallEnded] = useState(false); // whether call has ended

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

  // On joined callback from pre-join panel
  const handleJoined = useCallback(
    (c: StreamVideoClient, callInstance: any) => {
      setClient(c);
      setCall(callInstance);
      setJoined(true);
    },
    []
  );

  const handleLeaveConfirmed = async () => {
    try {
      setCallEnded(true); // Show "call ended" immediately

      // Just leave the call, don't end the room
      await call?.leave();
      console.log("Left call");
    } catch (err) {
      console.warn("Failed to leave call gracefully", err);
    } finally {
      client?.disconnectUser?.();
      // Don't redirect, just stay on the page
    }
  };

  // Lightweight UI: show helpful message if not configured
  if (!apiKey) {
    return (
      <div className="w-full rounded-md border border-yellow-300 bg-yellow-50 text-yellow-900 p-3 text-sm">
        Video is not configured. Set NEXT_PUBLIC_STREAM_API_KEY and implement
        /api/video/token.
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-md border border-red-300 bg-red-50 text-red-900 p-3 text-sm">
        {error}
      </div>
    );
  }

  // If not joined yet show pre-join panel
  if (!joined) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <PreJoinVideoPanel
          roomId={roomId}
          isHost={isHost}
          onJoined={handleJoined}
        />
      </div>
    );
  }

  if (!client || !call) {
    return (
      <div className="w-full rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-600 flex items-center gap-3">
        <LoadingSpinner size="small" />
        <span>Finalizing call…</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-md border border-mysecodary bg-background overflow-hidden relative">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme className="h-full">
            <div className="flex flex-col justify-end h-full">
              <div className="min-h-64 h-full overflow-hidden">
                <SpeakerLayout mirrorLocalParticipantVideo={true} />
              </div>
              {!callEnded && (
                <div className="border-t border-gray-200 ">
                  <CallControls onLeave={handleLeaveConfirmed} />
                </div>
              )}
            </div>
          </StreamTheme>
        </StreamCall>
      </StreamVideo>

      {/* Call Ended Overlay */}
      {callEnded && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center space-y-4 p-6">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Call Ended
              </h3>
              <p className="text-sm text-foreground">
                You have left the video call
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
