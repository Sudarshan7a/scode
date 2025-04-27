"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import OAuthButton from "./OAuthButton";
import { oauthProviders } from "@/constants/OAuthProviders";

const formSchema = z
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

export function MySignupForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Sign-up submitted:", values);
  }

  const handleOAuthSignup = (providerId: string) => {
    console.log(`Initiating ${providerId} OAuth signup flow`);
    // Here you would implement the actual OAuth flow
    // For example, with NextAuth.js you might use signIn(providerId)
  };

  return (
    <div className="min-w-md mx-auto bg-myforeground shadow-sm rounded-md p-6">
      {/* OAuth Provider Buttons */}
      <div className="space-y-3 mb-6">
        {oauthProviders.map((provider) => (
          <OAuthButton
            key={provider.id}
            provider={provider.name}
            logo={provider.logo}
            onClick={() => handleOAuthSignup(provider.id)}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-mybackground)]/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-myforeground font-medium text-[var(--color-mybackground)]/70">
            or continue with email
          </span>
        </div>
      </div>

      {/* Regular Signup Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            className="w-full bg-mysecondary text-white rounded-md py-2 hover:bg-mysecondary/90 transition-colors"
          >
            Sign Up
          </button>

          <div className=" text-xs text-center text-mybackground/70">
            By signing up, you agree to our{" "}
            <a href="#" className="text-mysecondary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-mysecondary hover:underline">
              Privacy Policy
            </a>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default MySignupForm;
