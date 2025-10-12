import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

interface EditorEnabledCheckboxProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
}

export function EditorEnabledCheckbox({
  register,
}: EditorEnabledCheckboxProps) {
  return (
    <div className="flex items-center space-x-2 mt-2 mb-4">
      <Input
        type="checkbox"
        id="editorEnabled"
        className="w-4 h-4 accent-primary"
        {...register("editorEnabled")}
      />
      <Label htmlFor="editorEnabled" className="text-sm cursor-pointer">
        Enable others to edit code (This can be changed during the session)
      </Label>
    </div>
  );
}
