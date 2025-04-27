"use client";
import MyLoginForm from "@/components/custom/MyLoginForm";
import React from "react";
import Logo from "@/components/Logo";
import Link from "next/link";
import VideoIcon from "@/components/icons/VideoIcon";
import LightningIcon from "@/components/icons/LightningIcon";
import HeartIcon from "@/components/icons/HeartIcon";

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
            Welcome Back to SCode
          </h1>
          <p className="text-lg md:text-xl opacity-90 text-center mb-8">
            Continue building the future with real-time code collaboration.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <VideoIcon />
              </div>
              <span>Unlock Seamless Real-Time Collaboration</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <LightningIcon />
              </div>
              <span>Experience Unmatched Speed and Performance</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <HeartIcon />
              </div>
              <span>Effortless Collaboration, Anytime, Anywhere</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form section */}
      <div className="flex-1 bg-[var(--color-mybackground)] flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[var(--color-myforeground)]">
              Welcome Back
            </h2>
            <p className="text-sm font-medium text-[var(--color-mysecondary)]/80 mt-2">
              Please enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <MyLoginForm />

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--color-myforeground)]/70">
              Don&#39;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[var(--color-mysecondary)] hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
