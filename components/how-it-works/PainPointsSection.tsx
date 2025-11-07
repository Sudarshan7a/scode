import React from "react";
import { Zap, Shield, Code2 } from "lucide-react";

export default function PainPointsSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-mysecondary/5 to-mybackground">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built to Eliminate Friction
          </h2>
          <p className="text-lg text-foreground/70">
            We solved the problems that make remote pairing painful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-mybackground border border-mysecondary/10">
            <div className="w-12 h-12 rounded-lg bg-mysecondary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-mysecondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Zero Lag</h3>
            <p className="text-foreground/70">
              Built on WebRTC and optimized sync. No stuttering, no delay—just
              instant collaboration.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-mybackground border border-mysecondary/10">
            <div className="w-12 h-12 rounded-lg bg-mysecondary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-mysecondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Private & Secure
            </h3>
            <p className="text-foreground/70">
              End-to-end encryption. Your code stays yours. Invite-only rooms
              for peace of mind.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-mybackground border border-mysecondary/10">
            <div className="w-12 h-12 rounded-lg bg-mysecondary/10 flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-mysecondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No Setup Hell
            </h3>
            <p className="text-foreground/70">
              No plugins, no config files, no dependencies. Just click, code,
              and collaborate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
