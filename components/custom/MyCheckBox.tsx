"use client";

import { Checkbox } from "@/components/ui/checkbox";

export default function MyCheckBox({ description }: { description?: string }) {
  return (
    <div className="flex items-center space-x-2 ">
      <Checkbox id="terms" className="border-foreground" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {description || "ERROR"}
      </label>
    </div>
  );
}
