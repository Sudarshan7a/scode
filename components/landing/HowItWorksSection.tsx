"use client";
import React from "react";
import { UserPlus, Settings, Code, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your account",
    description:
      "Sign up in seconds. No credit card required, no commitment needed.",
  },
  {
    number: "02",
    icon: Settings,
    title: "Set up your room",
    description:
      "Choose your language, invite a partner, or join an existing session.",
  },
  {
    number: "03",
    icon: Code,
    title: "Start coding together",
    description:
      "Write, debug, and collaborate in real-time with voice and shared editor.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Ship faster",
    description:
      "Save sessions, review notes, and watch your productivity soar.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-mysecondary/5 to-mybackground">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            From signup to
            <span className="text-mysecondary"> shipping</span> in minutes
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Getting started is effortless. Here&apos;s how S-Code works.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-mysecondary/30 to-transparent"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Step card */}
                  <div className="flex flex-col items-center text-center group">
                    {/* Number badge */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-mysecondary to-mysecondary/60 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-bold text-white">
                          {step.number}
                        </span>
                      </div>
                      {/* Icon overlay */}
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-mybackground border-2 border-mysecondary/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-mysecondary" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow connector (mobile only) */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-8">
                      <svg
                        className="w-6 h-6 text-mysecondary/30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-lg text-foreground/80 mb-6">
            Ready to experience the future of pair programming?
          </p>
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-mysecondary hover:bg-mysecondary-hover rounded-lg shadow-lg hover:shadow-xl transition-all group"
          >
            Get started for free
            <svg
              className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
