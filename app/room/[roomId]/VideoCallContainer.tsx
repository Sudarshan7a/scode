"use client";
import React, { useEffect, useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type Props = {
  roomId: string;
  isHost: boolean;
};

// Minimal, self-contained video call container.
// It expects a backend at /api/video/token to provide { token, userId } for the current user.
// If not configured, it renders a small non-blocking message.
export default function VideoCallContainer({ roomId, isHost }: Props) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<ReturnType<StreamVideoClient["call"]> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

  useEffect(() => {
    let active = true;
    let createdClient: StreamVideoClient | null = null;
    let createdCall: ReturnType<StreamVideoClient["call"]> | null = null;

    async function init() {
      try {
        setLoading(true);
        setError(null);
        if (!apiKey) {
          throw new Error(
            "Stream video not configured: NEXT_PUBLIC_STREAM_API_KEY is missing."
          );
        }

        const res = await fetch(
          `/api/video/token?roomId=${encodeURIComponent(roomId)}`
        );
        if (!res.ok) {
          const msg =
            res.status === 501
              ? "Stream video token endpoint not implemented. Implement /api/video/token to enable video."
              : `Failed to fetch video token (${res.status})`;
          throw new Error(msg);
        }

        const { token, userId } = (await res.json()) as {
          token?: string;
          userId?: string;
        };
        if (!token || !userId) {
          throw new Error("Invalid token response from /api/video/token.");
        }

        const user: User = { id: userId };
        const streamClient = new StreamVideoClient({ apiKey, user, token });
        const streamCall = streamClient.call("default", roomId);

        await streamCall.getOrCreate();
        await streamCall.join({ create: true });

        if (!active) {
          await streamCall.leave().catch(() => undefined);
          streamClient.disconnectUser?.();
          return;
        }

        createdClient = streamClient;
        createdCall = streamCall;

        setClient(streamClient);
        setCall(streamCall);
      } catch (e) {
        console.error("Stream video init error:", e);
        setError(e instanceof Error ? e.message : "Failed to initialize video call.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void init();

    return () => {
      active = false;
      void createdCall?.leave();
      createdClient?.disconnectUser?.();
    };
  }, [apiKey, roomId]);

  const handleLeaveConfirmed = async () => {
    try {
      if (isHost) {
        await fetch("/api/rooms/end", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId }),
        }).catch((err) => console.warn("Failed to request end room", err));
      }
      await call?.leave();
    } catch (err) {
      console.warn("Failed to leave call gracefully", err);
    } finally {
      client?.disconnectUser?.();
      window.location.reload();
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

  if (loading || !client || !call) {
    return (
      <div className="w-full rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-600 flex items-center gap-3">
        <LoadingSpinner size="small" />
        <span>Connecting to call…</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full  rounded-md border border-mysecodary bg-background overflow-hidden">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme className="h-full">
            <div className="flex flex-col justify-end h-full">
              <div className="min-h-64 h-full overflow-hidden">
                <SpeakerLayout />
              </div>{" "}
              <div className="border-t border-gray-200 ">
                <CallControls onLeave={() => setConfirmOpen(true)} />
                {/* Confirmation popover for leaving / ending room */}
                <Popover open={confirmOpen} onOpenChange={setConfirmOpen}>
                  <PopoverAnchor>
                    <div aria-hidden className="w-0 h-0" />
                  </PopoverAnchor>
                  <PopoverContent align="end" className="w-80">
                    <div className="space-y-3">
                      <div className="text-sm font-medium">
                        {isHost ? "End room for everyone?" : "Leave this room?"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isHost
                          ? "You are the host. Ending will disconnect all participants and mark the session as ended."
                          : "You'll leave the video call. The room will remain active for others."}
                      </p>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          className="px-3 py-1.5 text-xs rounded border"
                          onClick={() => setConfirmOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                          onClick={async () => {
                            setConfirmOpen(false);
                            await handleLeaveConfirmed();
                          }}
                        >
                          {isHost ? "End room" : "Leave room"}
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
    </div>
  );
}
