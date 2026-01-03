"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-mybackground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold  mb-6 bg-linear-to-r from-myprimary to-mysecondary bg-clip-text text-transparent">
            About S-Code
          </h1>
          <p className="text-xl text-myforeground/80 max-w-2xl mx-auto">
            Pair programming without the awkward Zoom screen share
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-mysecondary/60 hover:border-mysecondary transition-all">
            <h2 className="text-3xl font-semibold text-myforeground mb-4">
              🎯 Our Story
            </h2>
            <div className="text-myforeground/80 space-y-4 leading-relaxed">
              <p>
                Built by indie devs who were tired of juggling Zoom, Slack, VS
                Code, and three browser tabs just to code with a friend. We
                thought: "There has to be a better way."
              </p>
              <p>Spoiler: There wasn't. So we built it.</p>
              <p>
                S-Code is what happens when developers get frustrated enough to
                actually solve their own problems instead of complaining on
                Twitter. It's a collaborative coding platform that doesn't make
                you want to throw your laptop out the window.
              </p>
            </div>
          </section>

          <section className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-mysecondary/60 hover:border-mysecondary transition-all">
            <h2 className="text-3xl font-semibold text-myforeground mb-4">
              ⚡ What Makes Us Different
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-myforeground">
                  🤖 AI That Actually Helps
                </h3>
                <p className="text-myforeground/80">
                  Gemini-powered assistant that fixes bugs before you rage-quit
                  (unlike Googling "center div" for the 100th time).
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-myforeground">
                  🔒 Privacy-First
                </h3>
                <p className="text-myforeground/80">
                  Your code stays yours. We don't train AI on it, sell it, or
                  judge your variable names (okay, maybe a little).
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-myforeground">
                  ⚡ Sub-100ms Sync
                </h3>
                <p className="text-myforeground/80">
                  Real-time collaboration that actually feels real-time, even on
                  spotty WiFi.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-myforeground">
                  🎨 Monaco Editor
                </h3>
                <p className="text-myforeground/80">
                  The same editor that powers VS Code, with full syntax
                  highlighting and IntelliSense.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-mysecondary/60 hover:border-mysecondary transition-all">
            <h2 className="text-3xl font-semibold text-myforeground mb-4">
              🛠️ Powered By
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-mybackground/50 rounded-lg">
                <p className="text-sm text-myforeground/80">Next.js 16</p>
              </div>
              <div className="p-4 bg-mybackground/50 rounded-lg">
                <p className="text-sm text-myforeground/80">MongoDB</p>
              </div>
              <div className="p-4 bg-mybackground/50 rounded-lg">
                <p className="text-sm text-myforeground/80">Y.js CRDTs</p>
              </div>
              <div className="p-4 bg-mybackground/50 rounded-lg">
                <p className="text-sm text-myforeground/80">Google Gemini</p>
              </div>
            </div>
            <p className="text-myforeground/80 text-center mt-6 text-sm">
              Open-source friendly. Developer-first. Built with caffeine and
              questionable life choices.
            </p>
          </section>

          <section className="bg-linear-to-r from-myprimary/10 to-mysecondary/10 backdrop-blur-sm rounded-2xl p-8 border border-myprimary/40 text-center">
            <h2 className="text-3xl font-semibold text-myforeground mb-4">
              Ready to Code Together?
            </h2>
            <p className="text-myforeground/80 mb-6">
              Join thousands of developers who ditched the old way of pair
              programming
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-3 bg-myprimary text-myforeground/80 rounded-lg font-semibold hover:bg-myprimary/90 transition-all hover:scale-105"
            >
              Get Started — Free, No CC Needed
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
