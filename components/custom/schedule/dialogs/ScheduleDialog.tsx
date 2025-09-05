"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScheduleForm } from "../forms/ScheduleForm";
import { CreateRoomSchema } from "../schemas/formSchemas";

interface ScheduleDialogProps {
  buttonUnderlineStyle?: string;
  onSubmit: (data: CreateRoomSchema) => void;
  isLoading?: boolean;
}

export function ScheduleDialog({
  buttonUnderlineStyle,
  onSubmit,
  isLoading = false,
}: ScheduleDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className={`text-foreground ${buttonUnderlineStyle}`}
        >
          Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[60%] max-h-[90vh] overflow-y-auto overflow-x-hidden border-0 p-0 bg-transparent shadow-none [&>[data-slot=dialog-close]]:bg-white/80 [&>[data-slot=dialog-close]]:backdrop-blur-sm [&>[data-slot=dialog-close]]:border [&>[data-slot=dialog-close]]:border-white/20 [&>[data-slot=dialog-close]]:shadow-lg [&>[data-slot=dialog-close]_svg]:size-4">
        {/* Glassmorphism card */}
        <div className="relative w-full">
          <div className="relative rounded-2xl bg-white/98 dark:bg-[#0f0f10]/90 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-sm overflow-hidden">
            {/* Gradient header strip */}
            <div className="h-3 w-full bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>

            <div className="p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
                  Schedule a Session
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  Fill in the details below to schedule a new collaborative
                  session.
                </DialogDescription>
              </DialogHeader>
              <ScheduleForm onSubmit={onSubmit} isLoading={isLoading} />
            </div>

            {/* Bottom gradient line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
