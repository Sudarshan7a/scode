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

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export function MyLoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Login submitted:", values);
    // Add authentication logic here
  }

  const handleOAuthLogin = (providerId: string) => {
    console.log(`Initiating ${providerId} OAuth login flow`);
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
            onClick={() => handleOAuthLogin(provider.id)}
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

      {/* Regular Login Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <div className="flex items-center justify-between">
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

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-mysecondary hover:text-mysecondary-hover"
              >
                Forgot password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full  bg-mysecondary text-white rounded-md py-2 hover:bg-mysecondary/90 hover:cursor-pointer transition-colors"
          >
            Log In
          </button>

          <div className=" text-xs text-center text-mybackground/70">
            By logging in, you agree to our{" "}
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

export default MyLoginForm;
