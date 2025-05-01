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

// Signup form schema
const signupSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupEmailPasswordFormProps {
  onSubmit: (values: SignupFormValues) => void;
  buttonText: string;
}

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

  const handleSubmit = (values: SignupFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
