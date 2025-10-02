/**
 * Video token API client
 * Handles fetching authentication tokens for Stream Video SDK
 */

interface TokenResponse {
  token: string;
  userId: string;
}

/**
 * Fetches a video authentication token from the backend API
 * @param roomId - The room identifier
 * @returns Promise resolving to token and userId
 * @throws Error if the request fails or response is invalid
 */
export async function fetchVideoToken(roomId: string): Promise<TokenResponse> {
  const response = await fetch(
    `/api/video/token?roomId=${encodeURIComponent(roomId)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch video token (${response.status})`);
  }

  const payload = (await response.json()) as {
    token?: string;
    userId?: string;
  };

  if (!payload.token || !payload.userId) {
    throw new Error("Invalid token response");
  }

  return payload as TokenResponse;
}
