/**
 * User Cache Utility
 *
 * Manages client-side caching of non-sensitive user data in localStorage.
 * Implements cache expiration and provides type-safe access to user data.
 *
 * Security: Only stores non-sensitive data. Never cache passwords, tokens, or session IDs.
 */

export interface CachedUserData {
  name: string;
  email: string;
  avatarId: number;
  pronouns?: string;
  role?: string;
  dateOfBirth?: string;
  cacheTime: number;
}

export interface UserDataInput {
  name: string;
  email: string;
  avatarId: number;
  pronouns?: string;
  role?: string;
  dateOfBirth?: string;
}

const CACHE_KEY = "userData";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Validates that cached data has required fields and correct types
 */
function isValidCachedData(data: unknown): data is CachedUserData {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.name === "string" &&
    d.name.length > 0 &&
    typeof d.email === "string" &&
    d.email.length > 0 &&
    typeof d.avatarId === "number" &&
    typeof d.cacheTime === "number"
  );
}

export const UserCache = {
  /**
   * Store user data in localStorage with timestamp
   */
  set: (data: UserDataInput): void => {
    try {
      const cached: CachedUserData = {
        ...data,
        cacheTime: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch (error) {
      console.error("Failed to set user cache:", error);
      // Handle quota exceeded or other localStorage errors
    }
  },

  /**
   * Retrieve user data from localStorage
   * Returns null if cache is expired or doesn't exist
   */
  get: (): CachedUserData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const data = JSON.parse(cached);

      // Validate data structure
      if (!isValidCachedData(data)) {
        console.warn("Invalid user cache data, clearing");
        UserCache.clear();
        return null;
      }

      const age = Date.now() - data.cacheTime;

      // Check if cache is expired
      if (age > CACHE_DURATION) {
        UserCache.clear();
        return null;
      }

      return data;
    } catch (error) {
      console.error("Failed to get user cache:", error);
      UserCache.clear(); // Clear corrupted cache
      return null;
    }
  },

  /**
   * Clear user data from localStorage
   */
  clear: (): void => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error("Failed to clear user cache:", error);
    }
  },

  /**
   * Update a specific field in the cached user data
   * If cache doesn't exist or is expired, this will fail silently
   */
  update: <K extends keyof UserDataInput>(
    field: K,
    value: UserDataInput[K]
  ): void => {
    try {
      const cached = UserCache.get();
      if (cached) {
        // Update the field using proper type handling
        cached[field] = value as CachedUserData[K];
        cached.cacheTime = Date.now(); // Refresh cache time
        localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
      }
    } catch (error) {
      console.error("Failed to update user cache:", error);
    }
  },

  /**
   * Check if cache exists and is valid
   */
  isValid: (): boolean => {
    return UserCache.get() !== null;
  },

  /**
   * Get cache age in milliseconds
   */
  getAge: (): number | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const data: CachedUserData = JSON.parse(cached);
      return Date.now() - data.cacheTime;
    } catch {
      return null;
    }
  },

  /**
   * Refresh cache timestamp without changing data
   * Useful when data is confirmed to still be valid
   */
  refresh: (): void => {
    try {
      const cached = UserCache.get();
      if (cached) {
        cached.cacheTime = Date.now();
        localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
      }
    } catch (error) {
      console.error("Failed to refresh user cache:", error);
    }
  },
};

/**
 * Avatar Cache - Separate cache for avatar with longer expiration
 */
const AVATAR_CACHE_KEY = "userAvatarId";
const AVATAR_CACHE_TIME_KEY = "userAvatarCacheTime";
const AVATAR_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const AvatarCache = {
  set: (avatarId: number): void => {
    try {
      localStorage.setItem(AVATAR_CACHE_KEY, avatarId.toString());
      localStorage.setItem(AVATAR_CACHE_TIME_KEY, Date.now().toString());
    } catch (error) {
      console.error("Failed to set avatar cache:", error);
    }
  },

  get: (): number | null => {
    try {
      const cachedAvatar = localStorage.getItem(AVATAR_CACHE_KEY);
      const cacheTime = localStorage.getItem(AVATAR_CACHE_TIME_KEY);

      if (!cachedAvatar || !cacheTime) return null;

      const age = Date.now() - parseInt(cacheTime);
      if (age > AVATAR_CACHE_DURATION) {
        AvatarCache.clear();
        return null;
      }

      return parseInt(cachedAvatar);
    } catch (error) {
      console.error("Failed to get avatar cache:", error);
      AvatarCache.clear();
      return null;
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(AVATAR_CACHE_KEY);
      localStorage.removeItem(AVATAR_CACHE_TIME_KEY);
    } catch (error) {
      console.error("Failed to clear avatar cache:", error);
    }
  },

  isValid: (): boolean => {
    return AvatarCache.get() !== null;
  },
};

/**
 * Clear all user-related caches
 */
export const clearAllUserCaches = (): void => {
  UserCache.clear();
  AvatarCache.clear();
  // Add other cache clear calls here as needed
};
