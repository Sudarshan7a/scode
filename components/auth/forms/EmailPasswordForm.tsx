"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface EmailPasswordFormProps {
  onSubmit: (values: LoginFormValues) => void;
  buttonText: string;
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
}

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

  const handleSubmit = (values: LoginFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-mybackground">Email</FormLabel>
              <FormControl>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="text-mybackground w-full border border-mybtext-mybackground rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-mysecondary"
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
              <FormLabel className="text-mybackground">Password</FormLabel>
              <FormControl>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="text-mybackground w-full border border-mybtext-mybackground rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-mysecondary"
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
                  className="ml-2 block text-sm text-mybackground"
                >
                  Remember me
                </label>
              </div>
            )}

            {showForgotPassword && (
              <div className="text-sm">
                <a
                  href="#"
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
          className="w-full bg-mysecondary text-white rounded-md py-2 hover:bg-mysecondary/90 hover:cursor-pointer transition-colors"
        >
          {buttonText}
        </button>
      </form>
    </Form>
  );
}

export default EmailPasswordForm;
