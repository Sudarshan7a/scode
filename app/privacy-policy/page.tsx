"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-mybackground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-myforeground mb-4">
            Privacy Policy
          </h1>
          <p className="text-myforeground/80">
            Last updated: January 3, 2026 (yes, the future is now)
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/60">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              🎭 The TL;DR Version
            </h2>
            <p className="text-myforeground/80 leading-relaxed">
              We collect some data. We don&apos;t sell it. We&apos;re not
              Facebook. You&apos;re welcome.
            </p>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/60">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              📊 What We Collect
            </h2>
            <ul className="list-disc list-inside text-myforeground/80 space-y-2">
              <li>
                <strong>Email address</strong> — So we can send you important
                stuff (and maybe the occasional &quot;we miss you&quot; email
                that you&apos;ll ignore)
              </li>
              <li>
                <strong>Name</strong> — Because calling you &quot;User
                #48291&quot; felt impersonal
              </li>
              <li>
                <strong>Your code</strong> — It lives on our servers while
                you&apos;re collaborating. We promise not to judge your variable
                naming conventions (okay, maybe a little)
              </li>
              <li>
                <strong>OAuth data</strong> — If you sign in with Google or
                GitHub, we get your profile info. We mainly use it to show your
                fancy avatar.
              </li>
              <li>
                <strong>Usage data</strong> — We track what features you use so
                we can make them better, not so we can sell you things you
                don&apos;t need
              </li>
            </ul>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/60">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              🔒 How We Protect Your Data
            </h2>
            <ul className="list-disc list-inside text-myforeground/80 space-y-2">
              <li>
                Passwords are hashed with bcrypt (the good stuff, not MD5 like
                it&apos;s 2005)
              </li>
              <li>
                All data transmitted over HTTPS (because HTTP is so last decade)
              </li>
              <li>
                HttpOnly cookies for auth tokens (XSS attackers hate this one
                simple trick)
              </li>
              <li>Rate limiting everywhere (bots, please touch grass)</li>
              <li>Security headers that would make OWASP proud</li>
            </ul>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/60">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              🍪 Cookies
            </h2>
            <p className="text-myforeground/80 leading-relaxed">
              Yes, we use cookies. No, not the delicious kind (sadly). Our
              cookies are strictly functional — they keep you logged in and
              remember your preferences. We don&apos;t use tracking cookies to
              follow you around the internet like a creepy ex. You&apos;re
              welcome.
            </p>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/60">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              🤝 Third Parties
            </h2>
            <p className="text-myforeground/80 leading-relaxed mb-4">
              We work with some third parties who are actually trustworthy:
            </p>
            <ul className="list-disc list-inside text-myforeground/80 space-y-2">
              <li>
                <strong>MongoDB</strong> — Stores your data (they&apos;re cool)
              </li>
              <li>
                <strong>Google & GitHub</strong> — For OAuth (you already trust
                them with everything anyway)
              </li>
              <li>
                <strong>Resend</strong> — Sends our emails (so they don&apos;t
                end up in spam... hopefully)
              </li>
              <li>
                <strong>Google Analytics</strong> — To see if anyone actually
                uses this thing (anonymized, we promise)
              </li>
              <li>
                <strong>Gemini AI</strong> — Powers our coding assistant (your
                code questions are processed but not stored)
              </li>
            </ul>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/60">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              🗑️ Data Deletion
            </h2>
            <p className="text-myforeground/80 leading-relaxed">
              Want to leave? We&apos;ll be sad, but we respect your decision.
              Contact us and we&apos;ll delete your data faster than you can say
              &quot;GDPR compliance.&quot; Unlike that gym membership, we
              actually let you cancel.
            </p>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/60">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              📧 Contact Us
            </h2>
            <p className="text-myforeground/80 leading-relaxed">
              Questions? Concerns? Just want to chat about privacy? Reach out at{" "}
              <a
                href="mailto:sudarshanpower07@gmail.com"
                className="text-myprimary hover:underline"
              >
                sudarshanpower07@gmail.com
              </a>
              . We read every email (eventually).
            </p>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/60">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              🔄 Changes to This Policy
            </h2>
            <p className="text-myforeground/80 leading-relaxed">
              We might update this policy occasionally. When we do, we&apos;ll
              update the date at the top. We won&apos;t send you a 47-page email
              about it like some companies. You&apos;re welcome (again).
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-myprimary hover:underline">
            ← Back to actually writing code
          </Link>
        </div>
      </div>
    </div>
  );
}
