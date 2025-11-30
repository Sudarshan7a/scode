import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/60 selection:bg-mysecondary/20 selection:text-myforeground dark:bg-mybackground/50 flex h-11 w-full min-w-0 rounded-xl border border-mysecondary/25 bg-mybackground px-4 py-2 text-base shadow-sm transition-all duration-200 ease-out outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:border-mysecondary/40 hover:shadow-md hover:shadow-mysecondary/5",
        "focus-visible:border-mysecondary focus-visible:ring-mysecondary/20 focus-visible:ring-[3px] focus-visible:shadow-md focus-visible:shadow-mysecondary/10",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
