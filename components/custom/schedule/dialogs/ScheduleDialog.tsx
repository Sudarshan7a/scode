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
import { ScheduleFormValues } from "../schemas/formSchemas";
import styles from "../MyScheduleModal.module.css";

interface ScheduleDialogProps {
  buttonUnderlineStyle?: string;
  onSubmit: (data: ScheduleFormValues) => void;
}

export function ScheduleDialog({
  buttonUnderlineStyle,
  onSubmit,
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
      <DialogContent
        className={`min-w-[60%] max-h-[90vh] overflow-y-auto ${styles.noScrollbar}`}
      >
        <DialogHeader>
          <DialogTitle className="text-title-last font-semibold">
            Schedule a Session
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to schedule a new session.
          </DialogDescription>
        </DialogHeader>
        <ScheduleForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
