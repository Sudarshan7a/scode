"use client";

import React from "react";
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
  loginSchema,
  LoginFormValues,
  EmailPasswordFormProps,
} from "@/types/authTypes";
import { authInputClasses, authLabelClasses } from "./formStyles";

export function EmailPasswordForm({
  onSubmit,
  buttonText,
  showRememberMe = true,
  showForgotPassword = true,
}: EmailPasswordFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      // support both sync and async onSubmit handlers
      const maybePromise = onSubmit(values) as unknown;
      if (maybePromise && typeof (maybePromise as Promise<unknown>).then === "function") {
        await maybePromise;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={authLabelClasses}>Email</FormLabel>
              <FormControl>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={authInputClasses}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={authLabelClasses}>Password</FormLabel>
              <FormControl>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={authInputClasses}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(showRememberMe || showForgotPassword) && (
          <div className="flex items-center justify-between">
            {showRememberMe && (
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-mysecondary focus:ring-mysecondary border-mybackground rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300"
                >
                  Remember me
                </label>
              </div>
            )}

            {showForgotPassword && (
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-mysecondary hover:text-mysecondary-hover"
                >
                  Forgot password?
                </a>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className={`w-full bg-mysecondary text-white rounded-md py-2 hover:bg-mysecondary-hover hover:cursor-pointer transition-colors shadow-sm ${
            isLoading ? "opacity-70 cursor-wait" : ""
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            buttonText
          )}
        </button>
      </form>
    </Form>
  );
}

export default EmailPasswordForm;
