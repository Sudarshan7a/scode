"use client";
import MySignupForm from "@/components/auth/forms/MySignupForm";
import React from "react";
import Logo from "@/components/Logo";
import Link from "next/link";
import UserGroupIcon from "@/components/icons/UserGroupIcon";
import ChartIcon from "@/components/icons/ChartIcon";
import ShieldIcon from "@/components/icons/ShieldIcon";

function Page() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side - Brand section */}
      <div className="select-none pointer-events-none md:sticky md:top-0 md:h-screen flex-1 bg-gradient-to-br from-[var(--color-mysecondary)] to-[var(--color-mysecondary-hover)] p-8 flex flex-col justify-center items-center text-white">
        <div className="max-w-md mx-auto flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8">
            <Logo className="scale-150" />
          </div>

          {/* Inspirational content */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Collaborate on Code in Real-Time
          </h1>
          <p className="text-lg md:text-xl opacity-90 text-center mb-8">
            Join thousands of developers who are building the future together.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <UserGroupIcon />
              </div>
              <span>Empower Your Team with Instant Collaboration</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <ChartIcon />
              </div>
              <span>Create, Collaborate, and Deliver Faster</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <ShieldIcon />
              </div>
              <span>
                Build Your Team&#39;s Success with Speed and Precision
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form section */}
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(60,141,227,0.18), rgba(255,152,25,0.16))",
        }}
        className="flex-1 bg-[var(--color-mybackground)] flex justify-center items-center p-8"
      >
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[var(--color-myforeground)]">
              Create an Account
            </h2>
            <p className="text-sm text-[var(--color-myforeground)]/70 mt-2">
              Join SCode today to start collaborating in real-time
            </p>
          </div>

          {/* Form */}
          <MySignupForm />

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--color-myforeground)]/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[var(--color-mysecondary)] hover:underline font-medium"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
