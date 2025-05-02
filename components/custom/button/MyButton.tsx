import React from "react";
import { Button } from "@/components/ui/button";

function MyButton({
  label,
  className,
  variant = "default",
}: {
  label: string | React.ReactNode;
  className?: string;
  variant:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}) {
  return (
    <Button className={className} variant={variant}>
      {label}
    </Button>
  );
}

export default MyButton;
