import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";

interface DescriptionInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
}

export function DescriptionInput({ register }: DescriptionInputProps) {
  return (
    <>
      <Label htmlFor="description">Description (optional)</Label>
      <Textarea
        className="mt-2 border-1 border-mysecondary placeholder:text-foreground"
        placeholder="Description (optional) "
        {...register("description")}
      />
    </>
  );
}
