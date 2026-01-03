"use client";
import React from "react";
import {
  Video,
  MessageSquare,
  Sparkles,
  GitBranch,
  Lock,
  Gauge,
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Built-in Voice Chat",
    description:
      "No third-party hassle. Just code and talk. Finally, an end to 'Can you hear me now?'",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: GitBranch,
    title: "Sub-100ms Sync",
    description:
      "Real-time that actually feels real-time. Even on spotty WiFi. Not your dial-up era lag fest.",
    color: "from-purple-500/20 to-purple-500/5",
  },
  {
    icon: Sparkles,
    title: "Gemini AI Assistant",
    description:
      "Because asking Google 'how to center a div' for the 100th time is kinda lame. Fixes bugs before you rage-quit.",
    color: "from-pink-500/20 to-pink-500/5",
  },
  {
    icon: MessageSquare,
    title: "Smart Notes System",
    description:
      "Take notes, leave comments, and actually remember what you decided 2 hours ago.",
    color: "from-green-500/20 to-green-500/5",
  },
  {
    icon: Gauge,
    title: "Lightning Fast",
    description:
      "No lag, no delays, no 'let me share my screen' nonsense. Just pure, responsive collaboration.",
    color: "from-orange-500/20 to-orange-500/5",
  },
  {
    icon: Lock,
    title: "E2E Encryption",
    description:
      "Your code stays yours. We don't train AI on it, sell it, or judge your variable names (much).",
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
