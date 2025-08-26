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
          className="w-full bg-mysecondary text-white rounded-md py-2 hover:bg-mysecondary-hover hover:cursor-pointer transition-colors shadow-sm"
        >
          {buttonText}
        </button>
      </form>
    </Form>
  );
}

export default EmailPasswordForm;
