import React from "react";
import { CheckCircle2, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-mysecondary/10 via-mybackground to-mysecondary/5">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-mysecondary/10 border border-mysecondary/20">
          <Zap className="w-4 h-4 text-mysecondary" />
          <span className="text-sm font-medium text-foreground">
            Simple. Fast. Powerful.
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Pair faster. Learn smarter.
        </h1>
        <p className="text-xl md:text-2xl text-foreground/70 mb-8">
          Here's how S-Code gets you coding together in minutes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <CheckCircle2 className="w-5 h-5 text-mysecondary" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <CheckCircle2 className="w-5 h-5 text-mysecondary" />
            <span>Setup in under 2 minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <CheckCircle2 className="w-5 h-5 text-mysecondary" />
            <span>Works with any language</span>
          </div>
        </div>
      </div>
    </section>
  );
}
