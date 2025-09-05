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
import { JoinForm } from "../forms/JoinForm";
import { JoinFormValues } from "../schemas/formSchemas";
import styles from "../MyScheduleModal.module.css";

interface JoinDialogProps {
  buttonUnderlineStyle?: string;
  onSubmit: (data: JoinFormValues) => void;
  isLoading?: boolean;
}

export function JoinDialog({
  buttonUnderlineStyle,
  onSubmit,
  isLoading = false,
}: JoinDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className={`text-foreground ${buttonUnderlineStyle}`}
        >
          Join
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`min-w-[40%] max-h-[70vh] overflow-y-auto ${styles.noScrollbar}`}
      >
        <DialogHeader>
          <DialogTitle className="text-title-last">Join a Session</DialogTitle>
          <DialogDescription>
            Enter the room link or ID to join an existing session.
          </DialogDescription>
        </DialogHeader>
        <JoinForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
