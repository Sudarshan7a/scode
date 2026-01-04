import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "./../components/Navbar";
import Footer from "./../components/Footer";
import { Toaster } from "./../components/ui/sonner";
import { RootAuthGuard } from "./../components/auth/RootAuthGuard";
import { SessionProviderWrapper } from "./../components/auth/SessionProviderWrapper";
import ErrorBoundary from "./../components/ErrorBoundary";
import { ThemeProvider } from "./../components/ThemeProvider";
import DesktopOnlyNotice from "./../components/DesktopOnlyNotice";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "S-Code | Real-time Collaborative Coding Platform",
  description:
    "Code together, think faster. The collaborative coding platform built for pair programming with real-time sync, voice chat, and AI assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="C-xarZ4TzSTKUv7Mle-mbiuumV4l7p-u5-K7Nhm2XEk"
        />
      </head>
      <body>
        <SessionProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary>
              <DesktopOnlyNotice />
              <RootAuthGuard>
                <Navbar />
                {children}
                <Toaster position="top-center" className=" rounded-sm" />
                <Footer />
              </RootAuthGuard>
            </ErrorBoundary>
          </ThemeProvider>
        </SessionProviderWrapper>
        {process.env.NEXT_PUBLIC_GA_MEASURE_ID && (
          <GoogleAnalytics
            gaId={process.env.NEXT_PUBLIC_GA_MEASURE_ID as string}
          />
        )}
      </body>
    </html>
  );
}
