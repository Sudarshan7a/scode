import type { Metadata } from "next";
import React from "react";
import { UserPlus, Settings, Code2, Rocket } from "lucide-react";
import HeroSection from "@/components/how-it-works/HeroSection";
import StepCard from "@/components/how-it-works/StepCard";
import PainPointsSection from "@/components/how-it-works/PainPointsSection";
import CTASection from "@/components/how-it-works/CTASection";

export const metadata: Metadata = {
  title: "How It Works | S-Code",
  description:
    "See how S-Code works – create a room, invite collaborators, code in real-time with voice chat and AI assistance. Get started in minutes.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  const steps = [
    {
      stepNumber: 1,
      title: "Create Your Space",
      description:
        "Sign up with your email or GitHub account. No lengthy forms, no payment walls, no hassle. You're in and ready to code in under 30 seconds.",
      icon: UserPlus,
      iconColor: "from-mysecondary to-mysecondary/60",
      accentColor: "text-mysecondary",
      features: [
        "One-click signup — Use Google, GitHub, or email",
        "Instant dashboard — Access your workspace immediately",
        "Free forever — Core features always available",
      ],
      reverse: false,
    },
    {
      stepNumber: 2,
      title: "Set Up Your Room",
      description:
        "Choose your programming language, name your session, and invite a partner. Or join an existing room with a simple code. Either way, you're live in seconds.",
      icon: Settings,
      iconColor: "from-purple-500 to-purple-600",
      accentColor: "text-purple-600",
      features: [
        "Pick your language — JavaScript, Python, C++, Java, Go, and more",
        "Invite teammates — Share a link or room code instantly",
        "Private rooms — Secure, invite-only collaboration",
      ],
      reverse: true,
    },
    {
      stepNumber: 3,
      title: "Code Together in Real-Time",
      description:
        "See every keystroke as it happens. Talk via voice chat. Get AI suggestions on the fly. No lag, no friction — just pure, collaborative flow.",
      icon: Code2,
      iconColor: "from-green-500 to-green-600",
      accentColor: "text-green-600",
      features: [
        "Live code sync — Zero-latency collaboration",
        "Voice + text — Built-in communication, no extra tools",
        "AI assistance — Smart suggestions when you need them",
      ],
      reverse: false,
    },
    {
      stepNumber: 4,
      title: "Save, Share & Ship Faster",
      description:
        "When you're done, save your session notes and code snippets. Export to GitHub, review later, or share with your team. Learning and shipping has never been smoother.",
      icon: Rocket,
      iconColor: "from-orange-500 to-orange-600",
      accentColor: "text-orange-600",
      features: [
        "Auto-save sessions — Never lose your work",
        "Export to GitHub — Push code directly from the editor",
        "Session history — Review past collaborations anytime",
      ],
      reverse: true,
    },
  ];

  return (
    <div className="min-h-screen bg-mybackground">
      <HeroSection />

      {/* Steps Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {steps.map((step) => (
            <StepCard key={step.stepNumber} {...step} />
          ))}
        </div>
      </section>

      <PainPointsSection />
      <CTASection />
    </div>
  );
}
