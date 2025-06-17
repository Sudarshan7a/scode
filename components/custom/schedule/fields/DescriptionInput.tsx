import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";

interface DescriptionInputProps {
  register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function DescriptionInput({ register }: DescriptionInputProps) {
  return (
    <>
      <Label htmlFor="description">Description (optional)</Label>
      <Textarea
        className="mt-2 border-1 border-mysecondary"
        placeholder="Description (optional)"
        {...register("description")}
      />
    </>
  );
}
