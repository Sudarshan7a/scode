"use client";

import { SessionProvider } from "next-auth/react";

export function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider
      refetchInterval={0} // Disable automatic session polling
      refetchOnWindowFocus={false} // Disable refetch when window regains focus
    >
      {children}
    </SessionProvider>
  );
}
