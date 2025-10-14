import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useLoading, useMultipleLoading } from "@/hooks/useLoading";

// Mock useToast
const mockSuccess = vi.fn();
const mockErrorToast = vi.fn();

vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({
    success: mockSuccess,
    error: mockErrorToast,
  }),
}));

describe("useLoading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with default loading state", () => {
    const { result } = renderHook(() => useLoading());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("initializes with custom loading state", () => {
    const { result } = renderHook(() => useLoading(true));

    expect(result.current.isLoading).toBe(true);
  });

  it("starts and stops loading", () => {
    const { result } = renderHook(() => useLoading());

    act(() => {
      result.current.startLoading();
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    act(() => {
      result.current.stopLoading();
    });
    expect(result.current.isLoading).toBe(false);
  });

  it("sets error state", () => {
    const { result } = renderHook(() => useLoading());

    act(() => {
      result.current.setError("Something went wrong");
    });

    expect(result.current.error).toBe("Something went wrong");
  });

  describe("executeAsync", () => {
    it("executes async function successfully", async () => {
      const { result } = renderHook(() => useLoading());
      const asyncFn = vi.fn().mockResolvedValue("success");

      let returnValue: string | null = null;
      await act(async () => {
        returnValue = await result.current.executeAsync(asyncFn);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(returnValue).toBe("success");
      expect(asyncFn).toHaveBeenCalledTimes(1);
    });

    it("shows success toast when showToasts is true", async () => {
      const { result } = renderHook(() => useLoading());
      const asyncFn = vi.fn().mockResolvedValue("done");

      await act(async () => {
        await result.current.executeAsync(asyncFn, {
          successMessage: "Operation completed",
          showToasts: true,
        });
      });

      expect(mockSuccess).toHaveBeenCalledWith("Operation completed");
      expect(mockErrorToast).not.toHaveBeenCalled();
    });

    it("handles errors and sets error state", async () => {
      const { result } = renderHook(() => useLoading());
      const asyncFn = vi.fn().mockRejectedValue(new Error("Test error"));

      let returnValue: string | null = "initial";
      await act(async () => {
        returnValue = await result.current.executeAsync(asyncFn);
      });

      expect(result.current.error).toBe("Test error");
      expect(returnValue).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it("shows error toast when showToasts is true", async () => {
      const { result } = renderHook(() => useLoading());
      const asyncFn = vi.fn().mockRejectedValue(new Error("API failed"));

      await act(async () => {
        await result.current.executeAsync(asyncFn, {
          errorMessage: "Custom error message",
          showToasts: true,
        });
      });

      expect(mockErrorToast).toHaveBeenCalledWith("Custom error message");
    });

    it("uses default error message when none provided", async () => {
      const { result } = renderHook(() => useLoading());
      const asyncFn = vi.fn().mockRejectedValue(new Error("Network error"));

      await act(async () => {
        await result.current.executeAsync(asyncFn, { showToasts: true });
      });

      expect(mockErrorToast).toHaveBeenCalledWith("Network error");
    });

    it("handles non-Error rejections", async () => {
      const { result } = renderHook(() => useLoading());
      const asyncFn = vi.fn().mockRejectedValue("String error");

      await act(async () => {
        await result.current.executeAsync(asyncFn);
      });

      expect(result.current.error).toBe("An error occurred");
    });
  });
});

describe("useMultipleLoading", () => {
  it("initializes with empty loading states", () => {
    const { result } = renderHook(() => useMultipleLoading());

    expect(result.current.loadingStates).toEqual({});
    expect(result.current.isAnyLoading()).toBe(false);
  });

  it("sets and gets loading state for specific key", () => {
    const { result } = renderHook(() => useMultipleLoading());

    act(() => {
      result.current.setLoading("fetch-users", true);
    });

    expect(result.current.isLoading("fetch-users")).toBe(true);
    expect(result.current.isLoading("other-key")).toBe(false);
  });

  it("tracks multiple loading states independently", () => {
    const { result } = renderHook(() => useMultipleLoading());

    act(() => {
      result.current.setLoading("action1", true);
      result.current.setLoading("action2", true);
      result.current.setLoading("action3", false);
    });

    expect(result.current.isLoading("action1")).toBe(true);
    expect(result.current.isLoading("action2")).toBe(true);
    expect(result.current.isLoading("action3")).toBe(false);
    expect(result.current.isAnyLoading()).toBe(true);
  });

  it("isAnyLoading returns false when all states are false", () => {
    const { result } = renderHook(() => useMultipleLoading());

    act(() => {
      result.current.setLoading("action1", true);
      result.current.setLoading("action2", true);
    });

    expect(result.current.isAnyLoading()).toBe(true);

    act(() => {
      result.current.setLoading("action1", false);
      result.current.setLoading("action2", false);
    });

    expect(result.current.isAnyLoading()).toBe(false);
  });

  it("updates existing loading state", () => {
    const { result } = renderHook(() => useMultipleLoading());

    act(() => {
      result.current.setLoading("test", true);
    });
    expect(result.current.isLoading("test")).toBe(true);

    act(() => {
      result.current.setLoading("test", false);
    });
    expect(result.current.isLoading("test")).toBe(false);
  });
});
