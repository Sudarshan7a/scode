# Meeting Actions Module

## Overview

The Meeting Actions module provides dashboard-specific components for quick access to meeting functionality. It includes buttons to create new meetings (host) and join existing meetings, similar to the navbar buttons but styled specifically for the dashboard layout.

## Components

### MeetingActions

Main component that renders a card with both host and join meeting buttons.

**Location**: `components/dashboard/MeetingActions.tsx`

**Usage**:

```tsx
import MeetingActions from "@/components/dashboard/MeetingActions";

<MeetingActions />;
```

### DashboardHostButton

A button component that opens a dialog to create and start a new meeting immediately.

**Location**: `components/dashboard/meetingActions/DashboardHostButton.tsx`

**Features**:

- Opens a dialog with a form to configure meeting settings
- Integrates with the backend API to create and start a room
- Redirects to the newly created room upon success
- Displays loading states and toast notifications
- Styled with gradient blue background

**Usage**:

```tsx
import { DashboardHostButton } from "@/components/dashboard/meetingActions";

<DashboardHostButton />;
```

### DashboardJoinButton

A button component that opens a dialog to join an existing meeting.

**Location**: `components/dashboard/meetingActions/DashboardJoinButton.tsx`

**Features**:

- Opens a dialog with a form to enter room ID or link
- Integrates with the backend API to join a room
- Redirects to the joined room upon success
- Displays loading states and toast notifications
- Styled with gradient purple background

**Usage**:

```tsx
import { DashboardJoinButton } from "@/components/dashboard/meetingActions";

<DashboardJoinButton />;
```

## Integration

The `MeetingActions` component is integrated into the dashboard main content:

```tsx
// components/dashboard/DashboardMainContentLoading.tsx
import MeetingActions from "./MeetingActions";

export default async function DashboardMainContentLoading() {
  return (
    <div>
      <WelcomeBanner username={user?.name ?? "Guest"} />
      <div className="my-8">
        <MeetingActions />
      </div>
      <HeroSection />
      <UpcomingRoomsClient />
    </div>
  );
}
```

## Styling

### MeetingActions Card

- Responsive layout with gradient background
- Gradient title text from blue to purple
- Maximum width of 3xl (48rem)
- Centered horizontally

### Host Button

- Blue gradient background (from-blue-500 to-blue-600)
- VideoIcon with white background overlay
- Large size with vertical layout
- Hover effects with shadow and color transitions

### Join Button

- Purple gradient background with outline style
- JoinIcon with purple background
- Large size with vertical layout
- Hover effects with border and shadow transitions

## Dependencies

- `@/components/ui/dialog` - Dialog components
- `@/components/ui/button` - Button component
- `@/components/ui/card` - Card components
- `@/components/custom/schedule/forms/HostForm` - Host meeting form
- `@/components/custom/schedule/forms/JoinForm` - Join meeting form
- `@/lib/axiosInstance` - API client
- `@/hooks/useToast` - Toast notifications
- `@/components/icons/VideoIcon` - Video icon
- `@/components/icons/JoinIcon` - Join icon

## API Integration

### Host Meeting

**Endpoint**: `POST /api/rooms/start`

**Payload**:

```typescript
{
  ...formData,
  timeZone: string,
  language: string,
  browserTime: string,
  userAgent: string
}
```

**Response**: `{ roomId: string }`

### Join Meeting

**Endpoint**: `POST /api/rooms/join`

**Payload**:

```typescript
{
  ...formData,
  joinTimestamp: string,
  deviceBrowserInfo: {
    userAgent: string,
    platform: string,
    language: string,
    timeZone: string,
    screenResolution: string,
    cookieEnabled: boolean,
    onlineStatus: boolean
  }
}
```

**Response**: `{ roomId: string }`

## Error Handling

Both components include comprehensive error handling:

- Loading states during API requests
- Toast notifications for success/error states
- Console logging for debugging
- Graceful fallback messages

## Accessibility

- Semantic HTML with proper button roles
- Descriptive labels and ARIA attributes from shadcn/ui components
- Keyboard navigation support via dialog components
- Focus management in dialogs

## Future Enhancements

1. Add schedule meeting button to match navbar functionality
2. Add recent meetings quick access
3. Add meeting history/favorites
4. Add keyboard shortcuts
5. Add analytics tracking for button clicks
