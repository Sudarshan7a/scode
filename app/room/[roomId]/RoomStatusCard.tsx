"use client";
import type React from "react";
import { useState } from "react";
import TopLogo from "@/components/TopLogo";
import PrimaryAction from "@/components/PrimaryAction";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check } from "lucide-react";

type RoomState = "live" | "scheduled" | "ended" | "saved" | "unknown";

type Props = {
  title: string;
  subtitle?: string;
  details?: React.ReactNode;
  children?: React.ReactNode;
  isHost?: boolean;
  roomState?: RoomState;
  onStart?: () => void;
  onJoin?: () => void;
  isStarting?: boolean;
  isJoining?: boolean;
  roomId?: string;
};

export default function RoomStatusCard({
  title,
  subtitle,
  details,
  children,
  isHost = false,
  roomState = "unknown",
  onStart,
  onJoin,
  isStarting = false,
  isJoining = false,
  roomId,
}: Props) {
  const [copied, setCopied] = useState(false);
  const disabled = roomState === "scheduled" || roomState === "ended";

  const roomUrl =
    roomId && typeof window !== "undefined"
      ? `${window.location.origin}/room/${roomId}`
      : "";

  const handleCopyLink = async () => {
    if (!roomUrl) return;

    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = roomUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
      }
    }
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(255,152,25,0.06), rgba(60,141,227,0.06), rgba(147,51,234,0.04))",
      }}
      className="flex flex-col items-center min-h-screen w-full px-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Logo positioned at top with reduced spacing */}
      <div className="pt-8 pb-4 relative z-30">
        <TopLogo />
      </div>

      {/* Main content with flex-1 to take remaining space and center vertically */}
      <div className="flex-1 w-full max-w-lg flex flex-col items-center justify-center relative z-10 pb-8">
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          {/* <Logo className="scale-150 drop-shadow-lg mt-2" /> */}
        </div>

        <div className="relative w-full group">
          <div className="absolute -inset-2 rounded-3xl blur-xl opacity-30 bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400 group-hover:opacity-40 transition-opacity duration-500 animate-pulse" />

          <div className="absolute -inset-1 rounded-2xl blur-lg opacity-20 bg-gradient-to-r from-mysecondary to-[#3c8de3] group-hover:opacity-30 transition-opacity duration-300" />

          <div className="relative rounded-2xl bg-white/98 dark:bg-[#0f0f10]/90 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-sm overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
            <div className="h-3 w-full bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>

            <div className="p-8 space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
                {title}
              </h2>

              {subtitle && (
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  {subtitle}
                </p>
              )}

              {details && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {details}
                  </div>
                </div>
              )}

              {/* Join Link Section - Show for scheduled rooms */}
              {roomState === "scheduled" && roomId && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Share this room
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium">
                        Room ID
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs font-mono text-blue-800 dark:text-blue-200">
                          {roomId}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyLink}
                          className="h-8 px-2 text-xs"
                        >
                          {copied ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium">
                        Join Link
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          readOnly
                          value={roomUrl}
                          className="flex-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs font-mono text-blue-800 dark:text-blue-200 truncate"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyLink}
                          className="h-8 px-2 text-xs"
                        >
                          {copied ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {children && <div className="pt-2 space-y-3">{children}</div>}

              <div className="space-y-3">
                {isHost ? (
                  <PrimaryAction
                    label={disabled ? "Unavailable" : "Start Room"}
                    onClick={onStart}
                    disabled={disabled}
                    loading={isStarting}
                  />
                ) : (
                  <PrimaryAction
                    label={disabled ? "Unavailable" : "Join Room"}
                    onClick={onJoin}
                    disabled={disabled}
                    loading={isJoining}
                  />
                )}

                <Button className="w-full text-foreground/80 py-3 rounded-md border-1 border-foreground/60 transition-all duration-300 bg-foreground/5 hover:bg-mysecondary/40">
                  View Details
                </Button>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
