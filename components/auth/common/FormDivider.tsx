"use client";

import React from "react";

interface FormDividerProps {
  text: string;
}

export function FormDivider({ text }: FormDividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[var(--color-mybackground)]/20"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-myforeground font-medium text-[var(--color-mybackground)]/70">
          {text}
        </span>
      </div>
    </div>
  );
}

export default FormDivider;
