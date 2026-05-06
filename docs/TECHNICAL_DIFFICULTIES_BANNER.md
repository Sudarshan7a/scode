# Technical Difficulties Banner

This is a global banner component that displays a technical difficulties notice to alert users that some functionality may not work properly due to maintenance or technical issues.

## Files Created

- **`components/TechnicalDifficultiesBanner.tsx`** - The banner component itself
- **`constants/technicalIssueConfig.ts`** - Configuration file to control the banner
- **`app/layout.tsx`** - Updated to include the banner conditionally

## How to Use

### Enable/Disable the Banner

Edit `constants/technicalIssueConfig.ts`:

```typescript
export const technicalIssueConfig: TechnicalIssueConfig = {
  enabled: true, // Set to true to show the banner
  message: "We're experiencing some technical difficulties...",
  affectedFeatures: [],
  persistent: false,
};
```

### Customize the Message

```typescript
export const technicalIssueConfig: TechnicalIssueConfig = {
  enabled: true,
  message: "Scheduled maintenance in progress. Please check back later.",
  affectedFeatures: ["Video Calls", "Room Creation", "Real-time Sync"],
  persistent: true, // Make non-dismissible
};
```

### Configuration Options

| Option             | Type     | Description                              |
| ------------------ | -------- | ---------------------------------------- |
| `enabled`          | boolean  | Show/hide the banner                     |
| `message`          | string   | Main message displayed to users          |
| `affectedFeatures` | string[] | List of features not working (optional)  |
| `persistent`       | boolean  | If true, users cannot dismiss the banner |

## Banner Features

✅ **Responsive Design** - Works on mobile and desktop
✅ **Dismissible** - Users can close the banner (unless persistent)
✅ **Customizable** - Easy configuration from one file
✅ **Accessible** - Includes ARIA labels and semantic HTML
✅ **Global** - Displays on all pages (below navbar)
✅ **Styled** - Amber/warning color scheme with icons

## Examples

### Example 1: Simple Maintenance Notice

```typescript
export const technicalIssueConfig: TechnicalIssueConfig = {
  enabled: true,
  message: "Scheduled maintenance - we'll be back online shortly.",
  affectedFeatures: [],
  persistent: false,
};
```

### Example 2: Specific Feature Issues

```typescript
export const technicalIssueConfig: TechnicalIssueConfig = {
  enabled: true,
  message: "We're investigating an issue with real-time sync.",
  affectedFeatures: ["Real-time Code Sync", "Cursor Positions"],
  persistent: false,
};
```

### Example 3: Critical Maintenance (Non-dismissible)

```typescript
export const technicalIssueConfig: TechnicalIssueConfig = {
  enabled: true,
  message: "Critical maintenance in progress. Most features are unavailable.",
  affectedFeatures: ["Rooms", "Messaging", "Video Calls"],
  persistent: true,
};
```

## Visual Appearance

The banner displays:

- ⚠️ Alert icon
- Main message
- List of affected features (if provided)
- Apology message
- Close button (unless persistent)
- Amber/warning color scheme

## Location

The banner appears right below the navbar on all pages (when enabled) and above the main page content.

## Using the Component Directly

You can also use the banner in specific pages if needed:

```tsx
import TechnicalDifficultiesBanner from "@/components/TechnicalDifficultiesBanner";

export default function MyPage() {
  return (
    <>
      <TechnicalDifficultiesBanner
        message="Custom issue on this page"
        affectedFeatures={["Feature A", "Feature B"]}
        persistent={false}
      />
      {/* rest of page */}
    </>
  );
}
```
