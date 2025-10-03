/**
 * Pre-join resources hook
 * Initializes Stream Video client and call for preview/join screens
 */

import { useEffect, useState } from "react";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import type { Call, User } from "@stream-io/video-react-sdk";
import { fetchVideoToken } from "./tokenApi";
import { ensureHostCall, checkCallExists } from "./callOperations";

interface PreJoinResourceParams {
  apiKey?: string;
  roomId: string;
  isHost: boolean;
}

interface PreJoinResourceState {
  status: "idle" | "loading" | "ready" | "error";
  client: StreamVideoClient | null;
  call: Call | null;
  hostRoomExists: boolean | null;
  error: string | null;
}

/**
 * Hook to initialize Stream Video resources for pre-join preview
 *
 * Responsibilities:
 * - Fetch authentication token from backend
 * - Create StreamVideoClient instance
 * - Initialize Call object
 * - Verify call exists (or create if host)
 *
 * @param params - Configuration including API key, room ID, and host status
 * @returns Resource state including client, call, and loading/error states
 */
export function usePreJoinResources({
  apiKey,
  roomId,
  isHost,
}: PreJoinResourceParams): PreJoinResourceState {
  const [state, setState] = useState<PreJoinResourceState>({
    status: apiKey ? "idle" : "error",
    client: null,
    call: null,
    hostRoomExists: null,
    error: apiKey ? null : "Stream video not configured (missing api key)",
  });

  useEffect(() => {
    let isActive = true;

    async function setup() {
      if (!apiKey) return;

      setState((prev) => ({
        ...prev,
        status: "loading",
        error: null,
        client: null,
        call: null,
        hostRoomExists: null,
      }));

      try {
        const { token, userId } = await fetchVideoToken(roomId);
        if (!isActive) return;

        const user: User = { id: userId };
        const client = new StreamVideoClient({ apiKey, user, token });
        const call = client.call("default", roomId);

        const hostRoomExists = isHost
          ? await ensureHostCall(call)
          : await checkCallExists(call);

        if (!isActive) return;

        setState({
          status: "ready",
          client,
          call,
          hostRoomExists,
          error: null,
        });
      } catch (error) {
        if (!isActive) return;
        setState({
          status: "error",
          client: null,
          call: null,
          hostRoomExists: null,
          error:
            error instanceof Error
              ? error.message
              : "Failed to prepare video preview",
        });
      }
    }

    setup();

    return () => {
      isActive = false;
    };
  }, [apiKey, isHost, roomId]);

  return state;
}
