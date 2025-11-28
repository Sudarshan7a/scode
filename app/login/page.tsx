"use client";
import MyLoginForm from "@/components/auth/forms/MyLoginForm";
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
      <div className="select-none pointer-events-none md:sticky md:top-0 md:h-screen flex-1 bg-gradient-to-br from-mysecondary to-mysecondary-hover p-8 flex flex-col justify-center items-center text-white">
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
      <div
        className="flex-1 bg-mybackground flex justify-center items-center p-4 md:p-6 bg-[linear-gradient(135deg,rgba(60,141,227,0.18),rgba(255,152,25,0.16))]"
      >
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-myforeground">
              Welcome Back
            </h2>
            <p className="text-sm font-medium text-mysecondary/80 mt-2">
              Please enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <MyLoginForm />

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-myforeground/70">
              Don&#39;t have an account?{" "}
              <Link
                href="/signup"
                className="text-mysecondary hover:underline font-medium"
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
