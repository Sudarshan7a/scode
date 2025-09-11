"use client";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

/**
 * Small hook to encapsulate copying text to clipboard with a fallback.
 */
function useCopyToClipboard(text?: string) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
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

  return { copied, handleCopy };
}

/**
 * Decorative background circles moved to a small component to keep the main component concise.
 */
function DecorativeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
    </div>
  );
}

/**
 * The card content is extracted so RoomStatusCard stays small and easy to understand.
 */
function RoomShareSection({
  roomId,
  roomUrl,
  copiedId,
  copiedLink,
  onCopyId,
  onCopyLink,
}: {
  roomState?: RoomState;
  roomId?: string;
  roomUrl: string;
  copiedId?: boolean;
  copiedLink?: boolean;
  onCopyId?: () => void;
  onCopyLink?: () => void;
}) {
  // Show the share section whenever we have a roomId so users can copy
  // the room ID or link from any card (scheduled, live, ended, etc.).
  if (!roomId) return null;

  return (
    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/50 dark:border-blue-700/50">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ExternalLink className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
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
              onClick={onCopyId}
              className="h-6 px-2 text-xs"
            >
              {copiedId ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-1">
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
              onClick={onCopyLink}
              className="h-6 px-2 text-xs"
            >
              {copiedLink ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionArea({
  isHost,
  disabled,
  onStart,
  onJoin,
  isStarting,
  isJoining,
  roomState,
}: {
  isHost?: boolean;
  disabled: boolean;
  onStart?: () => void;
  onJoin?: () => void;
  isStarting?: boolean;
  isJoining?: boolean;
  roomState?: RoomState;
}) {
  // Determine primary action based on room state and role
  const isLive = roomState === "live";
  const canStart = roomState === "scheduled" && isHost;

  const label = isLive ? "Join Room" : canStart ? "Start Room" : "Join Room";
  const onClick = isLive ? onJoin : canStart ? onStart : onJoin;
  const loading = isLive ? isJoining : canStart ? isStarting : isJoining;

  return (
    <div className="space-y-2">
      <PrimaryAction
        label={disabled && label !== "Start Room" ? "Unavailable" : label}
        onClick={onClick}
        disabled={disabled}
        loading={Boolean(loading)}
      />

      <Button className="w-full text-foreground/80 py-2 text-sm rounded-md border-1 border-foreground/60 transition-all duration-300 bg-foreground/5 hover:bg-mysecondary/40">
        View Details
      </Button>
    </div>
  );
}

function CardContent({
  title,
  subtitle,
  details,
  children,
  isHost,
  roomState,
  onStart,
  onJoin,
  isStarting,
  isJoining,
  roomId,
  roomUrl,
  copiedId,
  copiedLink,
  onCopyId,
  onCopyLink,
}: Props & {
  roomUrl: string;
  copiedId?: boolean;
  copiedLink?: boolean;
  onCopyId?: () => void;
  onCopyLink?: () => void;
}) {
  // A button should be enabled when:
  // - room is live, OR
  // - room is scheduled AND the user is the host
  // Otherwise it should be disabled (including ended rooms).
  const enabled = roomState === "live" || (roomState === "scheduled" && isHost);

  const disabled = roomState === "ended" || !enabled;

  const router = useRouter();
  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="relative w-full group">
      <div className="absolute -inset-2 rounded-3xl blur-xl opacity-30 bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400 group-hover:opacity-40 transition-opacity duration-500 animate-pulse" />

      <div className="absolute -inset-1 rounded-2xl blur-lg opacity-20 bg-gradient-to-r from-mysecondary to-[#3c8de3] group-hover:opacity-30 transition-opacity duration-300" />

      <div className="relative rounded-2xl bg-white/98 dark:bg-[#0f0f10]/90 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-sm overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
        <div className="h-3 w-full bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>

        <div className="p-6 space-y-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              {subtitle}
            </p>
          )}

          {details && (
            <div className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                {details}
              </div>
            </div>
          )}

          <RoomShareSection
            roomState={roomState}
            roomId={roomId}
            roomUrl={roomUrl}
            copiedId={copiedId}
            copiedLink={copiedLink}
            onCopyId={onCopyId}
            onCopyLink={onCopyLink}
          />

          {children && <div className="pt-1 space-y-2">{children}</div>}

          {roomState === "ended" ? (
            <div className="space-y-2">
              <Button
                onClick={handleGoToDashboard}
                className="w-full py-2 text-sm rounded-md border-1 border-foreground/60 transition-all duration-300 bg-green-600 hover:bg-green-700 text-white"
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <ActionArea
              isHost={isHost}
              disabled={disabled}
              onStart={onStart}
              onJoin={onJoin}
              isStarting={isStarting}
              isJoining={isJoining}
              roomState={roomState}
            />
          )}
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
      </div>
    </div>
  );
}

/**
 * Exported component is small and composes the smaller pieces.
 * This keeps the exported function cyclomatic complexity low.
 */
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
  const roomUrl =
    roomId && typeof window !== "undefined"
      ? `${window.location.origin}/room/${roomId}`
      : "";

  // Separate copy hooks so ID copy and Link copy are independent
  const { copied: copiedId, handleCopy: handleCopyId } =
    useCopyToClipboard(roomId);
  const { copied: copiedLink, handleCopy: handleCopyLink } =
    useCopyToClipboard(roomUrl);

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(255,152,25,0.06), rgba(60,141,227,0.06), rgba(147,51,234,0.04))",
      }}
      className="flex flex-col items-center min-h-screen w-full px-4 relative overflow-hidden"
    >
      <DecorativeBackground />

      {/* Logo positioned at top with minimal spacing */}
      <div className="pt-6 pb-2 relative z-30">
        <TopLogo />
      </div>

      {/* Main content with compact sizing */}
      <div className="flex-1 w-full max-w-md flex flex-col items-center justify-center relative z-10 pb-6">
        <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
          {/* Placeholder for optional logo */}
        </div>

        <CardContent
          title={title}
          subtitle={subtitle}
          details={details}
          isHost={isHost}
          roomState={roomState}
          onStart={onStart}
          onJoin={onJoin}
          isStarting={isStarting}
          isJoining={isJoining}
          roomId={roomId}
          roomUrl={roomUrl}
          copiedId={copiedId}
          copiedLink={copiedLink}
          onCopyId={handleCopyId}
          onCopyLink={handleCopyLink}
        >
          {children}
        </CardContent>
      </div>
    </div>
  );
}
