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

  const handleSubmit = async (values: SignupFormValues) => {
    // Clear previous server-side errors
    form.clearErrors();
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
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {form.formState.errors.root?.message && (
          <div className="text-red-500 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-mybackground">Username</FormLabel>
              <FormControl>
                <input
                  type="text"
                  placeholder="Enter your username"
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-mybackground">
                Confirm Password
              </FormLabel>
              <FormControl>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="text-mybackground w-full border border-mybtext-mybackground rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-mysecondary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

export default SignupEmailPasswordForm;
