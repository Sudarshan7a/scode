"use client";

import { toast } from "sonner";
import { useCallback } from "react";

export interface ToastOptions {
  duration?: number;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface UseToastReturn {
  success: (message: string, options?: ToastOptions) => string | number;
  error: (message: string, options?: ToastOptions) => string | number;
  warning: (message: string, options?: ToastOptions) => string | number;
  info: (message: string, options?: ToastOptions) => string | number;
  loading: (
    message: string,
    options?: Omit<ToastOptions, "action">
  ) => string | number;
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => Promise<T>;
  dismiss: (toastId?: string | number) => void;
  dismissAll: () => void;
}

/**
 * Enhanced toast hook with predefined styles and utility methods
 *
 * @example
 * ```tsx
 * const { success, error, promise } = useToast();
 *
 * // Simple success message
 * success("Room created successfully!");
 *
 * // Error with action
 * error("Failed to join room", {
 *   action: {
 *     label: "Retry",
 *     onClick: () => retryJoinRoom()
 *   }
 * });
 *
 * // Promise-based toast for async operations
 * promise(
 *   createRoom(data),
 *   {
 *     loading: "Creating room...",
 *     success: "Room created successfully!",
 *     error: "Failed to create room"
 *   }
 * );
 * ```
 */
function makeHandler(
  handler: (message: string, options?: Record<string, unknown>) => string | number,
  defaults: { duration?: number; allowAction?: boolean } = {}
) {
  return (message: string, options?: ToastOptions) => {
    const payload = {
      duration: options?.duration ?? defaults.duration,
      position: options?.position,
      dismissible: options?.dismissible ?? true,
      ...(defaults.allowAction && options?.action ? { action: options.action } : {}),
    };

    return handler(message, payload);
  };
}

export function useToast(): UseToastReturn {
  const success = makeHandler(toast.success, {
    duration: 4000,
    allowAction: true,
  }) as UseToastReturn["success"];
  const error = makeHandler(toast.error, {
    duration: 6000,
    allowAction: true,
  }) as UseToastReturn["error"];
  const warning = makeHandler(toast.warning, {
    duration: 5000,
    allowAction: true,
  }) as UseToastReturn["warning"];
  const info = makeHandler(toast.info, {
    duration: 4000,
    allowAction: true,
  }) as UseToastReturn["info"];
  const loading = makeHandler(toast.loading, {
    duration: Infinity,
    allowAction: false,
  }) as UseToastReturn["loading"];

  const promise = useCallback(
    <T>(
      promiseToResolve: Promise<T>,
      options: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: Error) => string);
      }
    ): Promise<T> => {
      toast.promise(promiseToResolve, options);
      return promiseToResolve;
    },
    []
  );

  const dismiss = useCallback((toastId?: string | number) => {
    // sonner.toast.dismiss accepts an optional id; calling it with undefined will dismiss all
    if (toastId !== undefined) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }, []);

  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss,
    dismissAll,
  };
}

// Predefined toast messages for common scenarios
export const TOAST_MESSAGES = {
  // Authentication
  AUTH: {
    LOGIN_SUCCESS: "Welcome back! You've been logged in successfully.",
    LOGIN_ERROR: "Login failed. Please check your credentials and try again.",
    LOGOUT_SUCCESS: "You've been logged out successfully.",
    SIGNUP_SUCCESS: "Account created successfully! Welcome to S Code.",
    SIGNUP_ERROR: "Failed to create account. Please try again.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",
    PASSWORD_RESET_SENT: "Password reset link sent to your email.",
    PASSWORD_RESET_SUCCESS: "Password updated successfully!",
    EMAIL_VERIFICATION_SENT:
      "Verification email sent. Please check your inbox.",
    EMAIL_VERIFIED: "Email verified successfully!",
  },

  // Room Operations
  ROOM: {
    CREATED: "Room created successfully! Redirecting...",
    CREATE_ERROR: "Failed to create room. Please try again.",
    JOINED: "Successfully joined the room!",
    JOIN_ERROR: "Failed to join room. Please check the room ID and try again.",
    LEFT: "You've left the room.",
    SCHEDULED: "Room scheduled successfully!",
    SCHEDULE_ERROR: "Failed to schedule room. Please try again.",
    DELETED: "Room deleted successfully.",
    DELETE_ERROR: "Failed to delete room. Please try again.",
    UPDATED: "Room settings updated successfully.",
    UPDATE_ERROR: "Failed to update room settings.",
    COPIED_LINK: "Room link copied to clipboard!",
    INVITE_SENT: "Invitation sent successfully!",
  },

  // Editor & Collaboration
  EDITOR: {
    SAVE_SUCCESS: "Code saved successfully!",
    SAVE_ERROR: "Failed to save code. Your changes are stored locally.",
    SYNC_ERROR: "Connection lost. Reconnecting...",
    SYNC_RESTORED: "Connection restored. Your changes have been synced.",
    COMPILE_SUCCESS: "Code compiled successfully!",
    COMPILE_ERROR: "Compilation failed. Check your code for errors.",
    SHARED: "Code shared successfully!",
    SHARE_ERROR: "Failed to share code. Please try again.",
  },

  // Network & System
  SYSTEM: {
    NETWORK_ERROR: "Network error. Please check your connection and try again.",
    SERVER_ERROR: "Server error. Please try again later.",
    LOADING_ERROR: "Failed to load data. Please refresh the page.",
    UNAUTHORIZED: "You don't have permission to perform this action.",
    RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
    MAINTENANCE: "System is under maintenance. Please try again later.",
    OFFLINE: "You're offline. Some features may not work properly.",
    ONLINE: "You're back online!",
  },

  // File Operations
  FILE: {
    UPLOADED: "File uploaded successfully!",
    UPLOAD_ERROR: "Failed to upload file. Please try again.",
    DELETED: "File deleted successfully.",
    DELETE_ERROR: "Failed to delete file.",
    DOWNLOADED: "File downloaded successfully!",
    DOWNLOAD_ERROR: "Failed to download file.",
    SIZE_ERROR: "File size exceeds the maximum limit.",
    TYPE_ERROR: "File type not supported.",
  },

  // Profile & Settings
  PROFILE: {
    UPDATED: "Profile updated successfully!",
    UPDATE_ERROR: "Failed to update profile. Please try again.",
    AVATAR_UPDATED: "Profile picture updated successfully!",
    AVATAR_ERROR: "Failed to update profile picture.",
    PREFERENCES_SAVED: "Preferences saved successfully!",
    PREFERENCES_ERROR: "Failed to save preferences.",
  },
} as const;
