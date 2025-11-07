import React from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
          Ready to pair up and level up?
        </h2>
        <p className="text-xl text-foreground/70 mb-10">
          Join thousands of developers coding better together with S-Code.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-mysecondary hover:bg-mysecondary-hover text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all group"
            >
              Start Your First Session
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/explore">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-mysecondary text-foreground hover:bg-mysecondary/10 px-8 py-6 text-lg font-semibold rounded-lg transition-all"
            >
              Explore Features
            </Button>
          </Link>
        </div>

        <p className="text-sm text-foreground/60">
          No credit card required • Free forever plan • Cancel anytime
        </p>
      </div>
    </section>
  );
}
