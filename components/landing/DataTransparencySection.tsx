"use client";
import React from "react";
import Link from "next/link";
import { Shield, User, FileCode, Activity } from "lucide-react";

export default function DataTransparencySection() {
  return (
    <section className="py-24 px-6 bg-mybackground border-t border-mysecondary/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Transparent Data Usage
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            We believe you should know exactly why we request your data. 
            We only collect what is necessary to provide our services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 rounded-xl bg-card border border-mysecondary/10">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Profile Information</h3>
            <p className="text-foreground/70">
              We use your name and email solely for authentication and to identify you to your collaborators in coding rooms.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-mysecondary/10">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <FileCode className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Code Content</h3>
            <p className="text-foreground/70">
              Your code is processed to enable real-time synchronization and AI assistance. We do not use your code to train our models.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-mysecondary/10">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Usage Data</h3>
            <p className="text-foreground/70">
              We collect minimal usage metrics to improve platform performance and fix bugs.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-foreground/70 mb-4">
            For more details, please read our full
          </p>
          <Link 
            href="/privacy-policy" 
            className="inline-flex items-center gap-2 text-mysecondary font-semibold hover:underline"
          >
            <Shield className="w-4 h-4" />
            Privacy Policy
          </Link>
        </div>
      </div>
    </section>
  );
}
