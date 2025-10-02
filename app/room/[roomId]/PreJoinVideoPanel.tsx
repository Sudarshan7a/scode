"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  VideoPreview,
  Call,
  type User,
} from "@stream-io/video-react-sdk";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { PreviewControls } from "./PreviewControls";
import { useToast } from "@/hooks/useToast";

type Props = {
  roomId: string;
  isHost: boolean;
  // invoked when user has successfully joined (after join promise resolves)
  onJoined: (client: StreamVideoClient, call: Call) => void;
};

/**
 * PreJoinVideoPanel fetches a token, creates the Stream client & call, enables local devices for preview
 * but DOES NOT call join until the user explicitly clicks Start/Join.
 */
export default function PreJoinVideoPanel({ roomId, isHost, onJoined }: Props) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [hostRoomExists, setHostRoomExists] = useState<boolean | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraMuted, setIsCameraMuted] = useState(false);
  const initializedRef = useRef(false);
  const { error: showErrorToast, info: showInfoToast } = useToast();

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

  // Fetch token & prepare call (getOrCreate only if host wants to start, participants only get if it exists)
  useEffect(() => {
    let active = true;
    async function setupPreview() {
      try {
        if (!apiKey) {
          throw new Error("Stream video not configured (missing api key)");
        }
        setLoading(true);
        setError(null);

        // Always fetch token for current user
        const tokenRes = await fetch(
          `/api/video/token?roomId=${encodeURIComponent(roomId)}`
        );
        if (!tokenRes.ok) {
          throw new Error(`Failed to fetch video token (${tokenRes.status})`);
        }
        const { token, userId } = (await tokenRes.json()) as {
          token?: string;
          userId?: string;
        };
        if (!token || !userId) throw new Error("Invalid token response");
        const user: User = { id: userId };
        const c = new StreamVideoClient({ apiKey, user, token });
        const newCall = c.call("default", roomId);

        // For participants we want to check if call exists already. We'll attempt a get() and if 404 -> host not started.
        if (!isHost) {
          try {
            await newCall.get();
            setHostRoomExists(true);
          } catch (err: any) {
            const isNotFoundError =
              err &&
              typeof err === "object" &&
              "status" in err &&
              err.status === 404;
            if (isNotFoundError) {
              setHostRoomExists(false);
            } else {
              console.warn("Call get() failed (non-404)", err);
              // treat as unknown; user can retry join later
              setHostRoomExists(false);
            }
          }
        }
        if (isHost) {
          // Host creates call (idempotent). We do not join yet.
          try {
            await newCall.getOrCreate();
            setHostRoomExists(true);
          } catch (e) {
            console.error("Host getOrCreate failed", e);
            setHostRoomExists(false);
          }
        }

        if (!active) return;
        setClient(c);
        setCall(newCall as Call);

        // Enable camera & mic for local preview (do not publish yet since not joined) - SDK auto device setup on join
        // We just rely on VideoPreview which accesses camera state via hooks after join; before join we can't show live stream
        // So we could alternatively use getUserMedia directly, but we'll keep minimal & show placeholder until joined.
      } catch (e) {
        if (!active) return;
        console.error(e);
        setError(
          e instanceof Error ? e.message : "Failed to prepare video preview"
        );
      } finally {
        if (active) setLoading(false);
      }
    }
    setupPreview();
    return () => {
      active = false;
    };
  }, [apiKey, roomId, isHost]);

  useEffect(() => {
    if (!call) return;

    let cancelled = false;
    let timeoutId: NodeJS.Timeout;
    setPreviewError(null);

    call.camera.enable().catch((err) => {
      if (!cancelled) {
        console.warn("Camera preview failed", err);
        setPreviewError(
          "Camera preview unavailable. Check your browser permissions."
        );

        // Auto-hide error message after 5 seconds
        timeoutId = setTimeout(() => {
          if (!cancelled) {
            setPreviewError(null);
          }
        }, 5000);
      }
    });

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (!initializedRef.current) {
        call.camera.disable().catch(() => undefined);
      }
    };
  }, [call]);

  const handleJoin = useCallback(async () => {
    if (!client || !call || joining) return;
    setJoining(true);
    setError(null); // Clear previous errors
    try {
      // Set device states based on preview settings before joining
      if (!isCameraMuted) {
        await call.camera.enable();
      } else {
        await call.camera.disable();
      }

      if (!isMicMuted) {
        await call.microphone.enable();
      } else {
        await call.microphone.disable();
      }

      // Attempt to join - for participants, this will fail if host hasn't started
      console.log(isHost);
      await call.join({ create: isHost });
      initializedRef.current = true;
      onJoined(client, call);
    } catch (e: any) {
      console.error("Join failed", e);

      // Check if it's a 404 (call doesn't exist yet)
      const isCallNotFound =
        e && typeof e === "object" && "status" in e && e.status === 404;

      if (!isHost && isCallNotFound) {
        showInfoToast("The host hasn't started the call yet. Please try again.", {
          duration: 4000,
        });
        setHostRoomExists(false);
      } else {
        const errorMessage = e instanceof Error ? e.message : "Failed to join call";
        showErrorToast(errorMessage, { duration: 5000 });
      }
    } finally {
      setJoining(false);
    }
  }, [client, call, isHost, joining, onJoined, isMicMuted, isCameraMuted, showErrorToast, showInfoToast]);

  if (!apiKey) {
    return (
      <div className="p-3 text-xs rounded border border-yellow-300 bg-yellow-50 text-yellow-800">
        Video unavailable (missing NEXT_PUBLIC_STREAM_API_KEY)
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-xl border-1 border-mysecondary bg-background p-4 shadow-sm">
      {loading && (
        <div className="flex items-center justify-center gap-2 py-6 text-xs text-foreground">
          <LoadingSpinner size="small" />
          <span>Preparing preview…</span>
        </div>
      )}
      {!loading && error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}
      {!loading && !error && client && call && (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <div className="flex flex-col gap-3">
              <div
                className="relative w-full overflow-hidden rounded-lg bg-black/60"
                style={{ aspectRatio: "16/9" }}
              >
                <div className=" [&_video]:!object-contain [&_video]:object-[0%_0%]">
                  <VideoPreview className="!max-h-full !max-w-full" />
                </div>
                {previewError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-3 text-center text-xs text-red-200">
                    {previewError}
                  </div>
                )}
              </div>
              {!isHost && (
                <div className="text-center text-xs text-foreground">
                  {hostRoomExists === false
                    ? "Click 'Join Call' to check if the host has started."
                    : "Ready to join the call."}
                </div>
              )}
              <div className="flex gap-2 justify-center">
                <PreviewControls
                  isMicMuted={isMicMuted}
                  isCameraMuted={isCameraMuted}
                  onMicToggle={setIsMicMuted}
                  onCameraToggle={setIsCameraMuted}
                />
              </div>
              <Button
                size="default"
                className="w-full font-semibold"
                disabled={joining}
                onClick={handleJoin}
              >
                {joining ? "Joining…" : "Join Call"}
              </Button>
            </div>
          </StreamCall>
        </StreamVideo>
      )}
    </div>
  );
}
