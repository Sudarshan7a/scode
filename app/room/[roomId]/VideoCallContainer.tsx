"use client";
import React, { useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
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

type Props = {
  roomId: string;
  isHost: boolean;
};

// Minimal, self-contained video call container.
// It expects a backend at /api/video/token to provide { token, userId } for the current user.
// If not configured, it renders a small non-blocking message.
export default function VideoCallContainer({ roomId, isHost }: Props) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [callObj, setCallObj] = useState<ReturnType<
    StreamVideoClient["call"]
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [enablingDevices, setEnablingDevices] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const joinedRef = useRef(false);
  // Refs used by init/cleanup helpers
  const localCallRef = useRef<typeof callObj>(null);
  const localClientRef = useRef<StreamVideoClient | null>(null);
  const createdByThisComponentRef = useRef(false);
  const cancelledRef = useRef(false);

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

  // Named handler for leaving the call
  const handleLeave = async () => {
    try {
      // End room only if the user is the host
      if (isHost) {
        try {
          await fetch("/api/rooms/end", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomId }),
          });
        } catch (err) {
          console.warn("Failed to request end room", err);
        }
      }

      // Attempt to leave the Stream call gracefully
      try {
        await callObj?.leave?.();
      } catch (err) {
        console.warn("Failed to leave call gracefully", err);
      }
    } finally {
      // As a final step, reload the page to reset UI state
      window.location.reload();
    }
  };

  const fetchToken = async (rid: string) => {
    const res = await fetch(
      `/api/video/token?roomId=${encodeURIComponent(rid)}`
    );
    console.log(res);
    if (!res.ok) {
      const msg =
        res.status === 501
          ? "Stream video token endpoint not implemented. Implement /api/video/token to enable video."
          : `Failed to fetch video token (${res.status})`;
      throw new Error(msg);
    }
    const data = (await res.json()) as { token?: string; userId?: string };
    if (!data.token || !data.userId)
      throw new Error("Invalid token response from /api/video/token.");
    return data as { token: string; userId: string };
  };

  const createClientAndCall = async (
    apiKey: string,
    roomId: string,
    token: string,
    userId: string
  ) => {
    const user: User = { id: userId };
    // Prefer library singleton accessor if available to avoid duplicate client warnings.
    type StreamClientStatic = typeof StreamVideoClient & {
      getOrCreateInstance?: (args: {
        apiKey: string;
        user: User;
        token: string;
      }) => StreamVideoClient;
    };
    const ClientStatic = StreamVideoClient as StreamClientStatic;
    const c: StreamVideoClient = ClientStatic.getOrCreateInstance
      ? ClientStatic.getOrCreateInstance({ apiKey, user, token })
      : new ClientStatic({ apiKey, user, token });

    const call = c.call("default", roomId);
    await call.getOrCreate();
    // Try to join; if error, retry with media disabled
    let didJoin = false;
    let usedFallback = false;
    try {
      await call.join({ create: true });
      didJoin = true;
    } catch (err) {
      console.warn(
        "Initial join failed (likely device permission). Retrying with audio/video disabled...",
        err
      );
      try {
        // @ts-expect-error optional flags depending on SDK version
        await call.join({ create: true, audio: false, video: false });
        didJoin = true;
        usedFallback = true;
      } catch (err2) {
        console.error("Fallback join without media also failed", err2);
      }
    }

    return { c, call, didJoin, usedFallback } as const;
  };

  // Attempt to enable mic and camera with graceful error handling
  const safeEnableDevices = async (call: NonNullable<typeof callObj>) => {
    setEnablingDevices(true);
    try {
      setDeviceError(null);
      try {
        await call.microphone?.enable?.();
      } catch (err) {
        console.error("Failed to enable microphone", err);
        setDeviceError(
          "Can't access microphone. Check your browser permissions and device settings."
        );
      }
      try {
        await call.camera?.enable?.();
      } catch (err) {
        console.error("Failed to enable camera", err);
        setDeviceError(
          (prev) =>
            prev ??
            "Can't access camera. Check your browser permissions and device settings."
        );
      }
    } finally {
      setEnablingDevices(false);
    }
  };

  // Initialize the Stream client and call once the editor view mounts
  const initCall = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!apiKey)
        throw new Error(
          "Stream video not configured: NEXT_PUBLIC_STREAM_API_KEY is missing."
        );
      // Avoid duplicate init during fast refresh
      if (client && callObj) {
        setLoading(false);
        return;
      }

      const { token, userId } = await fetchToken(roomId);
      const { c, call, didJoin, usedFallback } = await createClientAndCall(
        apiKey,
        roomId,
        token,
        userId
      );

      // If effect has already been cleaned up, dispose immediately
      if (cancelledRef.current) {
        try {
          await call.leave();
        } catch {}
        try {
          c.disconnectUser?.();
        } catch {}
        return;
      }

      localClientRef.current = c;
      localCallRef.current = call;
      createdByThisComponentRef.current = !client;

      setClient(c);
      setCallObj(call);
      joinedRef.current = didJoin;
      if (!didJoin) {
        throw new Error(
          "Failed to join the call. Please check your network and try again."
        );
      }
      if (usedFallback) {
        safeEnableDevices(call);
      }
    } catch (e) {
      console.error("Stream video init error:", e);
      setError(
        e instanceof Error ? e.message : "Failed to initialize video call."
      );
    } finally {
      setLoading(false);
    }
  };

  // Cleanup call and client on unmount or param change
  const cleanupCall = async () => {
    cancelledRef.current = true;
    try {
      if (joinedRef.current && localCallRef.current) {
        await localCallRef.current.leave();
        console.log("Left the call successfully");
      }
    } catch (err) {
      console.warn("Failed to leave Stream call during cleanup", err);
    }
    try {
      if (createdByThisComponentRef.current) {
        localClientRef.current?.disconnectUser?.();
      }
    } catch (err) {
      console.warn("Failed to disconnect Stream client during cleanup", err);
    }
    // Reset refs and state
    localCallRef.current = null;
    localClientRef.current = null;
    createdByThisComponentRef.current = false;
    joinedRef.current = false;
    setCallObj(null);
    setClient(null);
  };

  // isHost is provided via props from LiveEditorPanels

  useEffect(() => {
    cancelledRef.current = false;
    void initCall();
    return () => {
      void cleanupCall();
    };
    // Intentionally do NOT add `client` or `callObj` as dependencies to avoid re-init loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, roomId]);

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

  if (loading || !client || !callObj) {
    return (
      <div className="w-full rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-600 flex items-center gap-3">
        <LoadingSpinner size="small" />
        <span>Connecting to call…</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full  rounded-md border border-mysecodary bg-background overflow-hidden">
      {deviceError && (
        <div className="w-full bg-yellow-50 text-yellow-900 border-b border-yellow-200 px-3 py-2 text-xs flex items-center gap-3">
          <span>{deviceError}</span>
          <button
            className="ml-auto px-2 py-1 rounded border border-yellow-300 hover:bg-yellow-100 disabled:opacity-50"
            onClick={() => callObj && safeEnableDevices(callObj)}
            disabled={enablingDevices}
          >
            {enablingDevices ? "Trying…" : "Retry enabling devices"}
          </button>
        </div>
      )}
      <StreamVideo client={client}>
        <StreamCall call={callObj}>
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
                            await handleLeave();
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
