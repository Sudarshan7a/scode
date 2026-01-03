"use client";
import React from "react";
import {
  Code,
  MessageSquare,
  Sparkles,
  GitBranch,
  Lock,
  Gauge,
} from "lucide-react";

const features = [
  {
    icon: Code,
    title: "Monaco Editor",
    description:
      "The power of VS Code in your browser. Syntax highlighting, IntelliSense, and more.",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: GitBranch,
    title: "Real-time Sync",
    description:
      "See every keystroke instantly. Collaborate like you're sitting side by side.",
    color: "from-purple-500/20 to-purple-500/5",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Assist",
    description:
      "Get intelligent suggestions, auto-complete, and error detection as you code.",
    color: "from-pink-500/20 to-pink-500/5",
  },
  {
    icon: MessageSquare,
    title: "Integrated Notes",
    description:
      "Take shared notes, leave comments, and track decisions without leaving the editor.",
    color: "from-green-500/20 to-green-500/5",
  },
  {
    icon: Gauge,
    title: "Lightning Fast",
    description:
      "Built for speed. No lag, no delays. Just pure, responsive collaboration.",
    color: "from-orange-500/20 to-orange-500/5",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "End-to-end encryption for your code. Private rooms with invite-only access.",
    color: "from-red-500/20 to-red-500/5",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-mybackground">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need to
            <span className="text-mysecondary"> code together</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Built by developers, for developers. Every feature designed to make
            pair programming effortless.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-mybackground to-mysecondary/5 border border-mysecondary/10 hover:border-mysecondary/30 transition-all duration-300 hover:shadow-xl hover:shadow-mysecondary/10 hover:-translate-y-1"
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-mysecondary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-mysecondary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-foreground/60 mb-4">
            Want to see all features in action?
          </p>
          <a
            href="/explore"
            className="text-mysecondary font-semibold hover:underline inline-flex items-center gap-2 group"
          >
            Explore the platform
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
