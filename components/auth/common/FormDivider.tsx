"use client";

import React from "react";

interface FormDividerProps {
  text: string;
}

export function FormDivider({ text }: FormDividerProps) {
  return (
    <div className="my-6 flex items-center text-sm select-none">
      <div className="h-px flex-1 bg-[var(--color-mybackground)]/20 dark:bg-white/15" />
      <span
        className={`mx-3 px-2 py-0.5 rounded-md font-medium tracking-tight text-neutral-700 dark:text-neutral-200 `}
      >
        {text}
      </span>
      <div className="h-px flex-1 bg-[var(--color-mybackground)]/20 dark:bg-white/15" />
    </div>
  );
}

export default FormDivider;
