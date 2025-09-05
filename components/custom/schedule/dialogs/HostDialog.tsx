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
import { HostForm } from "../forms/HostForm";
import { HostFormValues } from "../schemas/formSchemas";
import styles from "../MyScheduleModal.module.css";

interface HostDialogProps {
  buttonUnderlineStyle?: string;
  onSubmit: (data: HostFormValues) => void;
  isLoading?: boolean;
}

export function HostDialog({
  buttonUnderlineStyle,
  onSubmit,
  isLoading = false,
}: HostDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className={`text-foreground ${buttonUnderlineStyle}`}
        >
          Host
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`min-w-[60%] max-h-[90vh] overflow-y-auto ${styles.noScrollbar}`}
      >
        <DialogHeader>
          <DialogTitle className="text-title-last font-semibold">
            Host a Session
          </DialogTitle>
          <DialogDescription className="text-foreground">
            Fill in the details below to host a session immediately.
          </DialogDescription>
        </DialogHeader>
        <HostForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
