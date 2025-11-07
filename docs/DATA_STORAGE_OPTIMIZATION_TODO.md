# Data Storage Optimization TODO

## Overview
This document identifies opportunities to optimize data storage by using localStorage or regular cookies instead of making repeated API calls to the server. The goal is to reduce server load and improve performance while maintaining security with httpOnly cookies for sensitive data.

---

## Security Principles

### ✅ MUST use httpOnly cookies (server-side only):
- `userId` - User identifier
- `refreshToken` - Authentication token
- Any session-related security tokens

### ✅ CAN use localStorage or regular cookies (client-side):
- User preferences (theme, language, notifications)
- Non-sensitive user data (name, avatarId, pronouns)
- UI state (last visited page, collapsed sections)
- Cached data with expiration

---

## Current Issues & Optimization Opportunities

### 🔴 HIGH PRIORITY

#### 1. **Navbar Authentication Check**
**File:** `components/Navbar.tsx`
**Current:** Checking `userId` from `document.cookie` (won't work with httpOnly)
**Issue:** httpOnly cookies cannot be read by JavaScript
**Solution:**
- [ ] Create a non-httpOnly cookie `isAuthenticated` (boolean) set during login
- [ ] Update on login/logout
- [ ] Use this for client-side auth checks instead of API calls
- [ ] Keep `userId` as httpOnly for security

**Code Location:** Line 26-32
```typescript
// CURRENT (BROKEN)
const userId = document.cookie
  .split("; ")
  .find((row) => row.startsWith("userId="))
  ?.split("=")[1];
setIsLoggedIn(!!userId);

// PROPOSED
const isAuth = document.cookie
  .split("; ")
  .find((row) => row.startsWith("isAuthenticated="))
  ?.split("=")[1];
setIsLoggedIn(isAuth === "true");
```

---

#### 2. **UserAvatar Component**
**File:** `components/UserAvatar.tsx`
**Current:** Fetches avatar from API on every mount
**Issue:** Makes unnecessary API call for data that rarely changes
**Solution:**
- [ ] Store `avatarId` in localStorage after login
- [ ] Update localStorage when user changes avatar
- [ ] Fall back to API only if localStorage is empty
- [ ] Add cache expiration (e.g., 24 hours)

**Code Location:** Line 19-40
```typescript
// PROPOSED
const loadUserAvatar = async () => {
  try {
    // Check localStorage first
    const cachedAvatar = localStorage.getItem('userAvatarId');
    const cacheTime = localStorage.getItem('userAvatarCacheTime');
    
    if (cachedAvatar && cacheTime) {
      const age = Date.now() - parseInt(cacheTime);
      if (age < 24 * 60 * 60 * 1000) { // 24 hours
        setAvatarId(parseInt(cachedAvatar));
        setLoading(false);
        return;
      }
    }
    
    // Fetch from API if cache miss or expired
    const response = await fetch('/api/user/me');
    const data = await response.json();
    
    if (data.success && data.user.avatarId !== undefined) {
      setAvatarId(data.user.avatarId);
      localStorage.setItem('userAvatarId', data.user.avatarId.toString());
      localStorage.setItem('userAvatarCacheTime', Date.now().toString());
    }
  } catch (err) {
    console.error("Failed to load avatar:", err);
  } finally {
    setLoading(false);
  }
};
```

---

#### 3. **User Profile Data Caching**
**Files:** 
- `components/profile/GeneralSettings.tsx`
- `components/profile/SecuritySettings.tsx`

**Current:** Fetches full user profile from `/api/user/me` on every page load
**Issue:** Repeated API calls for data that doesn't change frequently
**Solution:**
- [ ] Create a user context/provider to cache user data
- [ ] Store non-sensitive data in localStorage
- [ ] Implement cache invalidation on profile updates
- [ ] Use SWR or React Query for smart caching

**Proposed Structure:**
```typescript
// lib/userCache.ts
interface CachedUserData {
  name: string;
  email: string;
  avatarId: number;
  pronouns: string;
  role: string;
  dateOfBirth: string;
  cacheTime: number;
}

export const UserCache = {
  set: (data: Omit<CachedUserData, 'cacheTime'>) => {
    const cached: CachedUserData = { ...data, cacheTime: Date.now() };
    localStorage.setItem('userData', JSON.stringify(cached));
  },
  
  get: (): CachedUserData | null => {
    const cached = localStorage.getItem('userData');
    if (!cached) return null;
    
    const data: CachedUserData = JSON.parse(cached);
    const age = Date.now() - data.cacheTime;
    
    // Cache valid for 1 hour
    if (age > 60 * 60 * 1000) {
      UserCache.clear();
      return null;
    }
    
    return data;
  },
  
  clear: () => {
    localStorage.removeItem('userData');
  },
  
  update: (field: keyof Omit<CachedUserData, 'cacheTime'>, value: any) => {
    const cached = UserCache.get();
    if (cached) {
      cached[field] = value;
      UserCache.set(cached);
    }
  }
};
```

---

### 🟡 MEDIUM PRIORITY

#### 4. **Theme Preference**
**File:** `components/profile/PreferencesSettings.tsx`
**Current:** Uses `next-themes` which stores in localStorage
**Status:** ✅ Already optimized (next-themes handles this)
**Note:** Verify ThemeProvider is properly configured in layout

---

#### 5. **Notification Preferences**
**File:** `components/profile/PreferencesSettings.tsx`
**Current:** State only (not persisted)
**Solution:**
- [ ] Store notification preference in localStorage
- [ ] Sync with backend on change
- [ ] Load from localStorage on mount

```typescript
// PROPOSED
const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
  const saved = localStorage.getItem('notificationsEnabled');
  return saved ? JSON.parse(saved) : false;
});

const handleNotificationChange = (enabled: boolean) => {
  setNotificationsEnabled(enabled);
  localStorage.setItem('notificationsEnabled', JSON.stringify(enabled));
  // Optionally sync with backend
};
```

---

#### 6. **Room Subscription Status**
**File:** `components/RoomCard.tsx`
**Current:** Fetches user data from `/api/auth/me` for every room card
**Issue:** Multiple API calls when rendering room lists
**Solution:**
- [ ] Use cached user data from context/localStorage
- [ ] Batch subscription status checks
- [ ] Cache subscription status per room

---

### 🟢 LOW PRIORITY

#### 7. **Language Preference**
**File:** `components/profile/PreferencesSettings.tsx`
**Current:** Disabled (coming soon)
**Future Solution:**
- [ ] Store in localStorage when implemented
- [ ] Use for i18n initialization

---

#### 8. **Dashboard Welcome Banner**
**Potential:** Cache username for welcome message
**Solution:**
- [ ] Store username in localStorage after login
- [ ] Update on profile change
- [ ] Use for quick display before full profile loads

---

## Implementation Plan

### Phase 1: Critical Fixes (Week 1)
1. Fix Navbar authentication check with non-httpOnly cookie
2. Implement UserAvatar localStorage caching
3. Create UserCache utility

### Phase 2: Profile Optimization (Week 2)
4. Implement user data caching in profile components
5. Add cache invalidation on updates
6. Test cache expiration logic

### Phase 3: Additional Optimizations (Week 3)
7. Add notification preference persistence
8. Optimize room card rendering
9. Add dashboard data caching

### Phase 4: Context/Provider (Week 4)
10. Create UserContext for global state
11. Migrate localStorage logic to context
12. Implement cache warming on login

---

## API Endpoints to Modify

### Login Endpoint (`/api/auth/login`)
**Changes needed:**
- [ ] Set `isAuthenticated=true` cookie (non-httpOnly)
- [ ] Return user data for localStorage caching
- [ ] Set cache headers

### Logout Endpoint (`/api/auth/logout`)
**Changes needed:**
- [ ] Clear `isAuthenticated` cookie
- [ ] Return instruction to clear localStorage

### Profile Update Endpoint (`/api/user/update-profile`)
**Changes needed:**
- [ ] Return updated user data for cache refresh
- [ ] Include cache-control headers

---

## Testing Checklist

- [ ] Test authentication check without httpOnly cookie access
- [ ] Verify avatar loads from cache on subsequent visits
- [ ] Test cache invalidation on profile updates
- [ ] Verify logout clears all cached data
- [ ] Test cache expiration after timeout
- [ ] Verify fallback to API when cache is empty
- [ ] Test concurrent updates don't corrupt cache
- [ ] Verify security: no sensitive data in localStorage

---

## Security Considerations

### ✅ Safe to cache in localStorage:
- User name
- Avatar ID
- Pronouns
- Date of birth
- Role (if not security-critical)
- UI preferences
- Theme settings
- Language preference

### ❌ NEVER cache in localStorage:
- Passwords
- Refresh tokens
- Access tokens
- Email verification tokens
- Password reset tokens
- OAuth tokens
- Session IDs
- Any PII that could be exploited

### 🔒 Best Practices:
1. Always validate cached data on critical operations
2. Implement cache versioning for schema changes
3. Clear cache on logout
4. Use short expiration times (1-24 hours)
5. Encrypt sensitive cached data if necessary
6. Implement cache size limits
7. Handle cache corruption gracefully

---

## Performance Metrics to Track

**Before Optimization:**
- [ ] Count API calls on page load
- [ ] Measure time to interactive
- [ ] Track server load

**After Optimization:**
- [ ] Verify reduced API calls (target: 50% reduction)
- [ ] Measure improved load time (target: 20% faster)
- [ ] Confirm reduced server load

---

## Related Files to Review

1. `lib/mongodb.ts` - Database connection
2. `app/api/auth/login/route.ts` - Login logic
3. `app/api/auth/logout/route.ts` - Logout logic
4. `app/api/user/me/route.ts` - User data endpoint
5. `components/auth/RootAuthGuard.tsx` - Auth guard logic
6. `hooks/useLayoutVisibility.ts` - Layout visibility hook

---

## Notes

- Consider using SWR or React Query for automatic caching and revalidation
- Implement a global cache invalidation strategy
- Add cache versioning to handle schema changes
- Consider IndexedDB for larger data sets
- Monitor localStorage size limits (5-10MB)
- Implement graceful degradation if localStorage is disabled

---

**Last Updated:** 2024
**Status:** 🔴 In Progress
**Priority:** HIGH - Affects core functionality and performance
