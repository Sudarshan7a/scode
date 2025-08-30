"use client";

import React from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  signupSchema,
  SignupFormValues,
  SignupEmailPasswordFormProps,
} from "@/types/authTypes";

export function SignupEmailPasswordForm({
  onSubmit,
  buttonText,
}: SignupEmailPasswordFormProps) {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (values: SignupFormValues) => {
    // Clear previous server-side errors
    form.clearErrors();
    setIsLoading(true);
    try {
      const result = await onSubmit(values);
      if (!result.ok) {
        // Show field errors if provided
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([key, msg]) => {
            if (!msg) return;
            if (key === "root") {
              form.setError("root", { type: "server", message: msg });
            } else {
              form.setError(key as keyof SignupFormValues, {
                type: "server",
                message: msg,
              });
            }
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Config-driven fields to keep render small & consistent
  const fields: Array<{
    name: keyof SignupFormValues;
    label: string;
    type: string;
    placeholder: string;
  }> = [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "Enter your username",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm your password",
    },
  ];

  const inputClasses =
    "w-full rounded-md px-3 py-2 bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-mysecondary/50 focus:border-mysecondary transition";
  const labelClasses =
    "text-neutral-700 dark:text-neutral-200 text-sm font-medium";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {form.formState.errors.root?.message && (
          <div className="text-red-500 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}
        {fields.map((f) => (
          <FormField
            key={f.name}
            control={form.control}
            name={f.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>{f.label}</FormLabel>
                <FormControl>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    className={inputClasses}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className={`w-full bg-mysecondary text-white rounded-md py-2 hover:bg-mysecondary-hover hover:cursor-pointer transition-colors shadow-sm ${
            isLoading ? "opacity-70 cursor-wait" : ""
          }`}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CircularProgress size={18} color="inherit" />
              <span>Creating...</span>
            </Box>
          ) : (
            buttonText
          )}
        </button>
      </form>
    </Form>
  );
}

export default SignupEmailPasswordForm;
