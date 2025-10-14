import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useRooms } from "@/hooks/useRooms";
import { installFetchMock, resetFetchMock, FetchMock } from "@/tests/mocks/next";

describe("useRooms", () => {
  let fetchMock: FetchMock;

  beforeEach(() => {
    fetchMock = installFetchMock();
  });

  afterEach(() => {
    resetFetchMock();
    vi.clearAllMocks();
  });

  const mockRooms = [
    {
      id: "1",
      title: "Public Live Room",
      status: "live",
      isPrivate: false,
      createdAt: "2025-01-01",
    },
    {
      id: "2",
      title: "Private Scheduled Room",
      status: "scheduled",
      isPrivate: true,
      createdAt: "2025-01-02",
      scheduledAt: "2025-02-01",
    },
    {
      id: "3",
      title: "Public Ended Room",
      status: "ended",
      isPrivate: false,
      createdAt: "2025-01-03",
    },
  ];

  it("fetches and returns all rooms by default", async () => {
    fetchMock.json?.({ rooms: mockRooms }, { status: 200 });

    const { result } = renderHook(() => useRooms());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.rooms).toEqual([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.rooms).toHaveLength(3);
    expect(result.current.error).toBeNull();
  });

  it("filters rooms by privacy when privacy='private'", async () => {
    fetchMock.json?.({ rooms: mockRooms }, { status: 200 });

    const { result } = renderHook(() => useRooms({ privacy: "private" }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.rooms).toHaveLength(1);
    expect(result.current.rooms[0].id).toBe("2");
    expect(result.current.rooms[0].isPrivate).toBe(true);
  });

  it("filters rooms by privacy when privacy='public'", async () => {
    fetchMock.json?.({ rooms: mockRooms }, { status: 200 });

    const { result } = renderHook(() => useRooms({ privacy: "public" }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.rooms).toHaveLength(2);
    expect(result.current.rooms.every((room) => !room.isPrivate)).toBe(true);
  });

  it("filters rooms by status", async () => {
    fetchMock.json?.({ rooms: mockRooms }, { status: 200 });

    const { result } = renderHook(() =>
      useRooms({ status: ["live", "scheduled"] })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.rooms).toHaveLength(2);
    expect(result.current.rooms.find((r) => r.status === "ended")).toBeUndefined();
  });

  it("combines privacy and status filters", async () => {
    fetchMock.json?.({ rooms: mockRooms }, { status: 200 });

    const { result } = renderHook(() =>
      useRooms({ privacy: "private", status: ["scheduled"] })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.rooms).toHaveLength(1);
    expect(result.current.rooms[0].id).toBe("2");
  });

  it("handles fetch errors gracefully", async () => {
    fetchMock.json?.({ message: "Server error" }, { status: 500 });

    const { result } = renderHook(() => useRooms());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toContain("Failed to fetch rooms");
    expect(result.current.rooms).toEqual([]);
  });

  it("refetch re-fetches rooms", async () => {
    fetchMock.json?.({ rooms: mockRooms }, { status: 200 });

    const { result } = renderHook(() => useRooms());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Queue new response for refetch
    fetchMock.json?.({ rooms: [...mockRooms, { id: "4", title: "New Room", status: "live", isPrivate: false, createdAt: "2025-01-04" }] }, { status: 200 });

    result.current.refetch();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  it("prevents simultaneous fetch requests", async () => {
    fetchMock.json?.({ rooms: mockRooms }, { status: 200 });

    const { result } = renderHook(() => useRooms());

    // Trigger refetch while initial fetch is still pending
    result.current.refetch();
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should only have called fetch once
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
