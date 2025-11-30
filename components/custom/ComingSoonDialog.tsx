"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "lucide-react";

interface ComingSoonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName?: string;
}

export function ComingSoonDialog({
  open,
  onOpenChange,
  featureName = "This feature",
}: ComingSoonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm border-0 bg-gradient-to-b from-white to-gray-50/80 dark:from-zinc-900 dark:to-zinc-950 shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-2xl overflow-hidden p-0">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-mysecondary/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <div className="relative px-8 pt-10 pb-8">
          <DialogHeader className="flex flex-col items-center text-center gap-5">
            {/* Elegant icon with soft glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-mysecondary/20 blur-xl rounded-full scale-150" />
              <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-mysecondary to-mysecondary-hover shadow-lg shadow-mysecondary/25">
                <SparklesIcon className="w-7 h-7 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Coming Soon
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px]">
                {featureName} is being crafted with care. We&apos;ll notify you when it&apos;s ready.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-5 mt-8">
            {/* Minimal status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-mysecondary/10 dark:bg-mysecondary/15">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-mysecondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-mysecondary"></span>
              </span>
              <span className="text-xs font-medium text-mysecondary">In Development</span>
            </div>
            
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-medium rounded-xl h-11 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
            >
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ComingSoonDialog;
