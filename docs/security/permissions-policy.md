# Permissions-Policy Fix

## The Problem

Video calls weren't working because the header **blocked** camera/microphone access.

## The Solution

In [next.config.ts](../../next.config.ts):

```typescript
{
  key: "Permissions-Policy",
  value: "camera=(self), microphone=(self), geolocation=()",
}
```

## What This Means

- `camera=(self)` - ✅ Allows camera on your domain
- `microphone=(self)` - ✅ Allows microphone on your domain  
- `geolocation=()` - ❌ Blocks location (not needed)

## Quick Reference

| Config | Result |
|--------|--------|
| `camera=()` | ❌ Blocks everything (even your site) |
| `camera=*` | ⚠️ Allows everyone (security risk) |
| `camera=(self)` | ✅ Allows your site only |

## Quick Test

1. Open DevTools → Network → Check Response Headers
2. Should see: `Permissions-Policy: camera=(self), microphone=(self)`
3. Join a video call → Browser prompts for permission → Works! ✅

## Troubleshooting

**Video not working?**

1. Check `next.config.ts` has `camera=(self)` not `camera=()`
2. Restart dev server: `pnpm dev`
3. Clear browser: Lock icon 🔒 → Reset permissions
4. Refresh page

**Still broken?**
- Console shows `NotAllowedError`? → Check Permissions-Policy
- No permission prompt? → User previously denied, must reset
- Works on localhost but not production? → Need HTTPS
