"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Copy, ExternalLink, Check, Calendar, Clock } from "lucide-react";

interface ScheduleSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomTitle: string;
  scheduledAt?: string;
}

export function ScheduleSuccessDialog({
  isOpen,
  onClose,
  roomId,
  roomTitle,
  scheduledAt,
}: ScheduleSuccessDialogProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Smooth entrance animation
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setMounted(true), 100);
      return () => clearTimeout(timer);
    } else {
      setMounted(false);
    }
  }, [isOpen]);

  const roomUrl =
    typeof window !== "undefined"
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

  const handleGoToRoom = () => {
    if (typeof window !== "undefined") {
      window.location.href = `/room/${roomId}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl border-0 p-0 bg-transparent shadow-none overflow-hidden">
        {/* Accessible title for screen readers */}
        <DialogTitle className="sr-only">
          Session Successfully Scheduled
        </DialogTitle>

        {/* Animated background matching RoomStatusCard */}
        <div
          className="fixed inset-0 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,152,25,0.06), rgba(60,141,227,0.06), rgba(147,51,234,0.04))",
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Main container */}
        <div
          className={`relative z-50 w-full max-w-2xl mx-auto mt-16 transition-all duration-500 ease-out ${
            mounted
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-96 translate-y-4"
          }`}
        >
          {/* Glassmorphism card matching RoomStatusCard style */}
          <div className="relative w-full group">
            <div className="absolute -inset-2 rounded-3xl blur-xl opacity-30 bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400 group-hover:opacity-40 transition-opacity duration-500 animate-pulse" />

            <div className="absolute -inset-1 rounded-2xl blur-lg opacity-20 bg-gradient-to-r from-mysecondary to-[#3c8de3] group-hover:opacity-30 transition-opacity duration-300" />

            <div className="relative rounded-2xl bg-white/95 dark:bg-[#0f0f10]/95 border border-white/30 dark:border-white/20 shadow-2xl backdrop-blur-lg overflow-hidden transition-all duration-300">
              {/* Gradient header strip */}
              <div className="h-3 w-full bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>

              {/* Success header */}
              <div className="px-8 pt-8 pb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full mb-4">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>

                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight mb-2">
                  Session Successfully Scheduled
                </h1>

                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium max-w-md mx-auto">
                  Your collaborative session has been created and is ready to
                  share with participants
                </p>
              </div>

              {/* Content section */}
              <div className="px-8 pb-8 space-y-6">
                {/* Session details card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-mysecondary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-mysecondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Session Information
                      </h3>
                      <p className="text-xl font-semibold text-gray-900 dark:text-white mb-3 break-words">
                        {roomTitle}
                      </p>
                      {scheduledAt && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {new Date(scheduledAt).toLocaleString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Room access information */}
                <div className="grid gap-4">
                  {/* Room ID section */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Room ID
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 group hover:border-mysecondary/30 transition-colors duration-200">
                      <code className="flex-1 font-mono text-lg font-semibold text-gray-900 dark:text-white tracking-wide">
                        {roomId}
                      </code>
                      <Button
                        size="sm"
                        onClick={handleCopyLink}
                        className="bg-mysecondary hover:bg-mysecondary-hover text-white border-0 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-2">
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          <span className="font-medium">
                            {copied ? "Copied" : "Copy"}
                          </span>
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* Share URL section */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Invitation Link
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 group hover:border-mysecondary/30 transition-colors duration-200">
                      <input
                        readOnly
                        value={roomUrl}
                        className="flex-1 bg-transparent text-gray-900 dark:text-white font-mono text-sm outline-none"
                      />
                      <Button
                        size="sm"
                        onClick={handleCopyLink}
                        variant="outline"
                        className="border-mysecondary/20 text-mysecondary hover:bg-mysecondary hover:text-white transition-all duration-200"
                      >
                        <div className="flex items-center gap-2">
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          <span className="font-medium">
                            {copied ? "Copied" : "Copy"}
                          </span>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/30">
                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                    <strong>Next steps:</strong> Share the Room ID or invitation
                    link with your participants. As the host, you can access the
                    room anytime to prepare before starting the session.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 py-3 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <span className="font-medium">Done</span>
                  </Button>
                  <Button
                    onClick={handleGoToRoom}
                    className="flex-1 py-3 bg-mysecondary hover:bg-mysecondary-hover text-white transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span className="font-medium">Enter Room</span>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Bottom gradient line */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
