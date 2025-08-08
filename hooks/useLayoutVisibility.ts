"use client";

import { usePathname } from "next/navigation";

export function useLayoutVisibility(pathsToHideOn: string[] = ["/room"]) {
  const pathname = usePathname();

  if (!pathname) {
    return true; // Or handle appropriately if pathname can be null/undefined
  }

  // Check if the current path starts with any of the paths to hide on
  const shouldHide = pathsToHideOn.some((path) => pathname.startsWith(path));

  // Return true to show the layout, false to hide it
  return !shouldHide;
}
