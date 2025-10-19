export interface NotificationItem {
  key: string;
  title: string;
  description: string;
}

export interface NotificationGroup {
  label: string;
  items: NotificationItem[];
}

export const NOTIFICATION_DATA: NotificationGroup[] = [
  {
    label: "Today",
    items: [
      {
        key: "today-1",
        title: "New Feature Available!",
        description:
          "Dark mode theme has been added to enhance your coding experience.",
      },
      {
        key: "today-2",
        title: "System Update",
        description:
          "Your workspace has been successfully updated with the latest features.",
      },
      {
        key: "today-3",
        title: "Collaboration Invite",
        description:
          "You've been invited to join a new coding session. Check your dashboard.",
      },
    ],
  },
  {
    label: "Earlier",
    items: [
      {
        key: "earlier-1",
        title: "Weekly Summary",
        description:
          "Your coding activity summary for this week is now available.",
      },
      {
        key: "earlier-2",
        title: "Extension Recommendation",
        description:
          "Based on your activity, we recommend installing the Python extension.",
      },
      {
        key: "earlier-3",
        title: "Backup Complete",
        description:
          "Your project files have been successfully backed up to the cloud.",
      },
    ],
  },
];
