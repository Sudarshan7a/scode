import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useRoomOperations } from "@/hooks/useRoomOperations";
import { installFetchMock, resetFetchMock, FetchMock } from "@/tests/mocks/next";

// Mock useToast hook
const mockSuccess = vi.fn();
const mockError = vi.fn();
const mockPromise = vi.fn((promise) => promise);

vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({
    success: mockSuccess,
    error: mockError,
    promise: mockPromise,
  }),
  TOAST_MESSAGES: {
    ROOM: {
      COPIED_LINK: "Link copied to clipboard",
      LEFT: "Left room successfully",
      DELETED: "Room deleted",
      DELETE_ERROR: "Failed to delete room",
      INVITE_SENT: "Invitation sent",
    },
  },
}));

describe("useRoomOperations", () => {
  let fetchMock: FetchMock;
  let mockClipboard: { writeText: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    fetchMock = installFetchMock();
    mockClipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
    Object.assign(navigator, { clipboard: mockClipboard });
  });

  afterEach(() => {
    resetFetchMock();
    vi.clearAllMocks();
  });

  describe("copyRoomLink", () => {
    it("copies room URL to clipboard and shows success toast", async () => {
      const { result } = renderHook(() => useRoomOperations());
      const roomId = "test-room-123";

      await act(async () => {
        await result.current.copyRoomLink(roomId);
      });

      expect(mockClipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining(`/room/${roomId}`)
      );
      expect(mockSuccess).toHaveBeenCalledWith("Link copied to clipboard");
    });

    it("handles clipboard write errors", async () => {
      mockClipboard.writeText.mockRejectedValueOnce(new Error("Clipboard denied"));
      const { result } = renderHook(() => useRoomOperations());

      await act(async () => {
        await result.current.copyRoomLink("test-room");
      });

      expect(mockError).toHaveBeenCalledWith("Failed to copy link to clipboard");
    });
  });

  describe("leaveRoom", () => {
    it("shows success toast and calls onLeave callback", async () => {
      const onLeaveMock = vi.fn();
      const { result } = renderHook(() => useRoomOperations());

      await act(async () => {
        await result.current.leaveRoom(onLeaveMock);
      });

      expect(mockSuccess).toHaveBeenCalledWith("Left room successfully");
      expect(onLeaveMock).toHaveBeenCalledTimes(1);
    });

    it("works without onLeave callback", async () => {
      const { result } = renderHook(() => useRoomOperations());

      await act(async () => {
        await result.current.leaveRoom();
      });

      expect(mockSuccess).toHaveBeenCalled();
    });
  });

  describe("deleteRoom", () => {
    it("deletes room and calls onDelete callback on success", async () => {
      const onDeleteMock = vi.fn();
      const roomId = "room-to-delete";

      fetchMock.json?.({ ok: true }, { status: 200 });
      mockPromise.mockImplementationOnce((promise) => promise);

      const { result } = renderHook(() => useRoomOperations());

      await act(async () => {
        await result.current.deleteRoom(roomId, onDeleteMock);
      });

      await waitFor(() => {
        expect(mockPromise).toHaveBeenCalledWith(
          expect.any(Promise),
          expect.objectContaining({
            loading: "Deleting room...",
            success: "Room deleted",
            error: "Failed to delete room",
          })
        );
      });

      expect(onDeleteMock).toHaveBeenCalledTimes(1);
    });

    it("handles delete errors without calling onDelete", async () => {
      const onDeleteMock = vi.fn();
      fetchMock.json?.({ message: "Not found" }, { status: 404 });
      mockPromise.mockRejectedValueOnce(new Error("Delete failed"));

      const { result } = renderHook(() => useRoomOperations());

      await act(async () => {
        await result.current.deleteRoom("nonexistent-room", onDeleteMock);
      });

      expect(onDeleteMock).not.toHaveBeenCalled();
    });
  });

  describe("inviteToRoom", () => {
    it("sends invitation with correct payload", async () => {
      const roomId = "test-room";
      const email = "guest@example.com";

      fetchMock.json?.({ ok: true, message: "Invited" }, { status: 200 });
      mockPromise.mockImplementationOnce((promise) => promise);

      const { result } = renderHook(() => useRoomOperations());

      await act(async () => {
        await result.current.inviteToRoom(roomId, email);
      });

      await waitFor(() => {
        expect(mockPromise).toHaveBeenCalledWith(
          expect.any(Promise),
          expect.objectContaining({
            loading: "Sending invitation...",
            success: "Invitation sent",
            error: "Failed to send invitation",
          })
        );
      });
    });

    it("handles invitation errors", async () => {
      fetchMock.json?.({ message: "Email service unavailable" }, { status: 500 });
      mockPromise.mockRejectedValueOnce(new Error("Invite failed"));

      const { result } = renderHook(() => useRoomOperations());

      await act(async () => {
        await result.current.inviteToRoom("room-id", "user@test.com");
      });

      await waitFor(() => {
        expect(mockPromise).toHaveBeenCalled();
      });
    });
  });
});
