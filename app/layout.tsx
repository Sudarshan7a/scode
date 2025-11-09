import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "./../components/Navbar";
import Footer from "./../components/Footer";
import { Toaster } from "./../components/ui/sonner";
import { RootAuthGuard } from "./../components/auth/RootAuthGuard";
import ErrorBoundary from "./../components/ErrorBoundary";
import { ThemeProvider } from "./../components/ThemeProvider";
import DesktopOnlyNotice from "./../components/DesktopOnlyNotice";

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
      <body>
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
      </body>
    </html>
  );
}
