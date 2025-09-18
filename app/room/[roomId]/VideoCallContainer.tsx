"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const joinedRef = useRef(false);

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

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
    const c = new StreamVideoClient({ apiKey, user, token });

    const call = c.call("default", roomId);
    await call.getOrCreate();
    await call.join({ create: true });

    return { c, call } as const;
  };

  useEffect(() => {
    let cancelled = false;
    let localCall: typeof callObj | null = null;
    let localClient: StreamVideoClient | null = null;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!apiKey)
          throw new Error(
            "Stream video not configured: NEXT_PUBLIC_STREAM_API_KEY is missing."
          );

        const { token, userId } = await fetchToken(roomId);

        const { c, call } = await createClientAndCall(
          apiKey,
          roomId,
          token,
          userId
        );
        localClient = c;
        localCall = call;
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
        joinedRef.current = true;
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
          }
        } catch (err) {
          console.warn("Failed to leave Stream call during cleanup", err);
        }
        try {
          localClient?.disconnectUser?.();
        } catch (err) {
          console.warn("Failed to disconnect Stream client during cleanup", err);
        }
        // Reset state to avoid retaining references
        setCallObj(null);
        setClient(null);
        joinedRef.current = false;
      })();
    };
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
      <StreamVideo client={client}>
        <StreamCall call={callObj}>
          <StreamTheme className="h-full">
            <div className="flex flex-col justify-end h-full">
              <div className="min-h-64 h-full overflow-hidden">
                <SpeakerLayout />
              </div>{" "}
              <div className="border-t border-gray-200 ">
                <CallControls />
              </div>
            </div>
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
    </div>
  );
}
