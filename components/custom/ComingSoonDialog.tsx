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
import { RocketIcon } from "lucide-react";

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
      <DialogContent className="sm:max-w-md border-mysecondary border-2 bg-mybackground">
        <DialogHeader className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-mysecondary/20">
            <RocketIcon className="w-8 h-8 text-mysecondary" />
          </div>
          <DialogTitle className="text-2xl font-bold text-myforeground">
            Coming Soon!
          </DialogTitle>
          <DialogDescription className="text-myforeground/70 text-base">
            {featureName} is currently under development. We&apos;re working
            hard to bring this to you soon!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-mysecondary">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mysecondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-mysecondary"></span>
            </span>
            In Development
          </div>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-mysecondary hover:bg-mysecondary-hover text-white w-full max-w-[200px]"
          >
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ComingSoonDialog;
