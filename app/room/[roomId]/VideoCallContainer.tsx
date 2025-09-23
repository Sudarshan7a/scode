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

type Props = {
  roomId: string;
};

// Minimal, self-contained video call container.
// It expects a backend at /api/video/token to provide { token, userId } for the current user.
// If not configured, it renders a small non-blocking message.
export default function VideoCallContainer({ roomId }: Props) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [callObj, setCallObj] = useState<ReturnType<
    StreamVideoClient["call"]
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [enablingDevices, setEnablingDevices] = useState(false);
  const joinedRef = useRef(false);

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

  // Named handler for leaving the call
  const handleLeave = async () => {
    try {
      // Try to end the room if the current user is the host.
      // The API enforces host-only; non-hosts will get 403 which we ignore.
      try {
        await fetch("/api/rooms/end", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId }),
        });
      } catch (err) {
        console.warn(
          "Failed to request end room (will ignore if not host)",
          err
        );
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
    const ClientAny: any = StreamVideoClient as any;
    // Prefer library provided singleton accessor if available to avoid duplicate client warnings.
    const c: StreamVideoClient =
      typeof ClientAny.getOrCreateInstance === "function"
        ? ClientAny.getOrCreateInstance({ apiKey, user, token })
        : new StreamVideoClient({ apiKey, user, token });

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

  useEffect(() => {
    let cancelled = false;
    let localCall: typeof callObj | null = null;
    let localClient: StreamVideoClient | null = null;
    let createdByThisComponent = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!apiKey)
          throw new Error(
            "Stream video not configured: NEXT_PUBLIC_STREAM_API_KEY is missing."
          );
        // If we already have a client & call (e.g. hot reload) do not recreate.
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
        localClient = c;
        localCall = call;
        createdByThisComponent = !client; // we didn't have one before
        if (cancelled) {
          // If effect was cleaned up before init completed, dispose immediately.
          try {
            await call.leave();
          } catch {}
          try {
            c.disconnectUser?.();
          } catch {}
          return;
        }
        setClient(c);
        setCallObj(call);
        joinedRef.current = didJoin;
        if (!didJoin) {
          throw new Error(
            "Failed to join the call. Please check your network and try again."
          );
        }
        // If we had to join without media, attempt to enable devices gracefully
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
    run();
    return () => {
      cancelled = true;
      (async () => {
        try {
          if (joinedRef.current && localCall) {
            await localCall.leave();
            console.log("Left the call successfully");
          }
        } catch (err) {
          console.warn("Failed to leave Stream call during cleanup", err);
        }
        try {
          // Only disconnect the user if we created this client instance; otherwise it may be shared.
          if (createdByThisComponent) {
            localClient?.disconnectUser?.();
          }
        } catch (err) {
          console.warn(
            "Failed to disconnect Stream client during cleanup",
            err
          );
        }
        // Reset state to avoid retaining references
        setCallObj(null);
        setClient(null);
        joinedRef.current = false;
      })();
    };
    // Intentionally do NOT add `client` or `callObj` as dependencies to avoid re-init loops.
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
                <CallControls onLeave={handleLeave} />
              </div>
            </div>
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
    </div>
  );
}
