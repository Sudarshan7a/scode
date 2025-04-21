type NavLink = Array<{ name: string; path: string; id: number }>;
export const navlinks: NavLink = [
  { name: "Dashboard", path: "/dashboard", id: 1 },
  { name: "Explore", path: "/explore", id: 2 },
  { name: "How it works", path: "/how-it-works", id: 3 },
];

type MeetingLink = Array<string>;
export const meetingLinks: MeetingLink = ["Schedule", "Join", "Host"];
