"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-mybackground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-myforeground mb-4">
            Terms of Service
          </h1>
          <p className="text-mysecondary">
            Last updated: January 3, 2026 (we&apos;re from the future, obviously)
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/20">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              🎯 The TL;DR Version
            </h2>
            <p className="text-mysecondary leading-relaxed">
              Don&apos;t be a jerk. Don&apos;t break stuff. Don&apos;t use our
              platform for evil. That&apos;s basically it. The rest is just
              lawyers making us write more words.
            </p>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/20">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              ✅ What You Can Do
            </h2>
            <ul className="list-disc list-inside text-mysecondary space-y-2">
              <li>
                Write code (obviously — that&apos;s literally the point)
              </li>
              <li>
                Collaborate with friends, colleagues, or that one person who
                insists tabs are better than spaces
              </li>
              <li>
                Use our AI assistant to debug your code (it won&apos;t judge you
                for googling &quot;how to center a div&quot; for the 100th time)
              </li>
              <li>
                Create rooms for interviews, pair programming, or pretending to
                work
              </li>
              <li>
                Have fun! (Yes, coding can be fun. We said what we said.)
              </li>
            </ul>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/20">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              🚫 What You Can&apos;t Do
            </h2>
            <ul className="list-disc list-inside text-mysecondary space-y-2">
              <li>
                <strong>No hacking</strong> — Please don&apos;t try to break our
                stuff. We worked hard on it. If you find a bug, tell us nicely
                and we&apos;ll fix it.
              </li>
              <li>
                <strong>No spam</strong> — Creating 500 rooms called &quot;FREE
                ROBUX&quot; is not cool
              </li>
              <li>
                <strong>No illegal stuff</strong> — Don&apos;t use S-code to
                write malware, ransomware, or that script that&apos;s definitely
                not for hacking your ex&apos;s Facebook
              </li>
              <li>
                <strong>No harassment</strong> — Be kind to other developers.
                We&apos;re all suffering together in this industry.
              </li>
              <li>
                <strong>No crypto mining</strong> — Our servers have feelings
                too
              </li>
              <li>
                <strong>No sharing accounts</strong> — Your account is yours.
                Get your friend their own. It&apos;s free anyway.
              </li>
            </ul>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/20">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              📝 Your Code
            </h2>
            <p className="text-mysecondary leading-relaxed">
              Your code is yours. We don&apos;t claim ownership of anything you
              write on S-code. That brilliant algorithm? Yours. That
              spaghetti code you wrote at 3 AM? Also yours (sorry). We just
              host it temporarily while you&apos;re collaborating. Once you
              delete a room, it&apos;s gone. Like tears in rain.
            </p>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/20">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              💰 Payment & Pricing
            </h2>
            <p className="text-mysecondary leading-relaxed">
              S-code is currently free. Yes, actually free. No, there&apos;s no
              catch. No, we&apos;re not mining your data to sell to advertisers.
              We might add premium features in the future, but the core
              experience will always be free. We&apos;re developers too — we
              know the pain of subscription fatigue.
            </p>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/20">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              ⚠️ Disclaimers
            </h2>
            <p className="text-mysecondary leading-relaxed mb-4">
              The boring but necessary stuff:
            </p>
            <ul className="list-disc list-inside text-mysecondary space-y-2">
              <li>
                S-code is provided &quot;as is&quot; — we try our best, but
                sometimes things break. That&apos;s life.
              </li>
              <li>
                We&apos;re not responsible if the code you write doesn&apos;t
                work. (Have you tried turning it off and on again?)
              </li>
              <li>
                Our AI assistant is helpful but not perfect. Double-check its
                suggestions. It&apos;s AI, not a senior developer with 20 years
                of experience.
              </li>
              <li>
                If our service goes down, we&apos;ll fix it ASAP. But maybe
                take a break? Go outside? Touch some grass?
              </li>
            </ul>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/20">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              🔨 Account Termination
            </h2>
            <p className="text-mysecondary leading-relaxed">
              If you break the rules, we reserve the right to ban you. But
              we&apos;re not tyrants — we&apos;ll warn you first unless you do
              something really bad (like trying to hack us). You can also
              delete your account anytime. No hard feelings. We&apos;ll miss
              you though 🥲
            </p>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/20">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              ⚖️ Legal Stuff
            </h2>
            <p className="text-mysecondary leading-relaxed">
              These terms are governed by the laws of the internet... just
              kidding. If there&apos;s ever a dispute, let&apos;s talk it out
              like adults before getting lawyers involved. Lawyers are
              expensive, and we&apos;d rather spend that money on servers.
            </p>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/20">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              📧 Questions?
            </h2>
            <p className="text-mysecondary leading-relaxed">
              Got questions about these terms? Think we should add something?
              Just want to say hi? Email us at{" "}
              <a
                href="mailto:legal@s-code.live"
                className="text-myprimary hover:underline"
              >
                legal@s-code.live
              </a>
              . We promise a human will read it (eventually).
            </p>
          </section>

          <section className="bg-card/50 rounded-lg p-6 border border-mysecondary/20">
            <h2 className="text-2xl font-semibold text-myforeground mb-4">
              🎉 Final Words
            </h2>
            <p className="text-mysecondary leading-relaxed">
              By using S-code, you agree to these terms. If you don&apos;t
              agree, we&apos;ll be sad to see you go, but we respect your
              choice. For everyone else — welcome to the family! Now go write
              some awesome code. Or terrible code. We don&apos;t judge.
            </p>
            <p className="text-mysecondary leading-relaxed mt-4 italic">
              (Okay, we judge a little if you don&apos;t use semicolons in
              JavaScript. But that&apos;s between you and your conscience.)
            </p>
          </section>
        </div>

        <div className="mt-12 text-center space-x-4">
          <Link
            href="/privacy-policy"
            className="text-myprimary hover:underline"
          >
            Privacy Policy
          </Link>
          <span className="text-mysecondary">•</span>
          <Link
            href="/"
            className="text-myprimary hover:underline"
          >
            Back to coding
          </Link>
        </div>
      </div>
    </div>
  );
}
