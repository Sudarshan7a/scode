"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface TermsAndPrivacyProps {
  text: string;
}

const sectionTitle =
  "text-sm font-semibold tracking-wide text-foreground/90 flex items-center gap-2 before:w-1 before:h-4 before:rounded before:bg-mysecondary";
const listBase = "list-disc pl-5 space-y-1 marker:text-mysecondary/80";

const TERMS_BODY = (
  <div className="space-y-6 text-sm leading-relaxed text-left">
    <section className="space-y-3 rounded-md border border-border/60 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm p-4 shadow-sm">
      <h2 className={sectionTitle}>1. Overview</h2>
      <p>
        This platform is a <strong>student / community prototype</strong>, not a
        production SaaS. Data, accounts, and features may change or disappear at
        any time without notice.
      </p>
    </section>
    <section className="space-y-3 rounded-md border border-border/60 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm p-4 shadow-sm">
      <h2 className={sectionTitle}>2. Usage Restrictions</h2>
      <ul className={listBase}>
        <li>
          No business, financial, medical, legal or safety‑critical reliance.
        </li>
        <li>
          No uploading of secrets, regulated data, or sensitive personal info.
        </li>
        <li>
          No attempts to hold authors / maintainers liable for loss or damage.
        </li>
        <li>No abuse, spam, automated scraping, or disruption of service.</li>
      </ul>
    </section>
    <section className="space-y-3 rounded-md border border-border/60 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm p-4 shadow-sm">
      <h2 className={sectionTitle}>3. No Warranty</h2>
      <p>
        Provided <em>AS IS</em> with <strong>NO warranties</strong>, express or
        implied. Use is entirely at your own risk. Discontinue use if you do not
        agree.
      </p>
    </section>
    <section className="space-y-3 rounded-md border border-border/60 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm p-4 shadow-sm">
      <h2 className={sectionTitle}>4. Data & Logging</h2>
      <p>
        Minimal technical logs (rate limiting events, generic error traces) may
        be collected solely to improve stability. No ad tracking. No data sale.
      </p>
    </section>
    <section className="space-y-3 rounded-md border border-border/60 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm p-4 shadow-sm">
      <h2 className={sectionTitle}>5. Acceptance</h2>
      <p>
        Continuing to use this prototype indicates acceptance of these terms. If
        you disagree, please close the site now.
      </p>
      <p className="text-xs italic opacity-70">
        Last updated: {new Date().getFullYear()} (prototype draft)
      </p>
    </section>
  </div>
);

const PRIVACY_BODY = (
  <div className="space-y-6 text-sm leading-relaxed text-left">
    <section className="space-y-3 rounded-md border border-border/60 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm p-4 shadow-sm">
      <h2 className={sectionTitle}>1. What We Store (Minimal)</h2>
      <ul className={listBase}>
        <li>Account basics: email, username, creation timestamps.</li>
        <li>
          Password <strong>hashes only</strong> (bcrypt) – never the raw
          password.
        </li>
        <li>Ephemeral tokens (verification / reset) with short expiry.</li>
        <li>Session + rate limit metadata (non-personal, technical).</li>
      </ul>
    </section>
    <section className="space-y-3 rounded-md border border-border/60 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm p-4 shadow-sm">
      <h2 className={sectionTitle}>2. What We Don&apos;t Store</h2>
      <ul className={listBase}>
        <li>No payment data.</li>
        <li>No analytics trackers for advertising.</li>
        <li>
          No sensitive personal profile fields beyond what you directly give.
        </li>
      </ul>
    </section>
    <section className="space-y-3 rounded-md border border-border/60 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm p-4 shadow-sm">
      <h2 className={sectionTitle}>3. Email Usage</h2>
      <p>
        Your email is used only to send verification or password reset links you
        request. No marketing blasts.
      </p>
    </section>
    <section className="space-y-3 rounded-md border border-border/60 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm p-4 shadow-sm">
      <h2 className={sectionTitle}>4. Password Advice</h2>
      <p>
        Do <strong>not</strong> reuse a production or critical password here.
        Even with hashing, this is still a learning environment.
      </p>
    </section>
    <section className="space-y-3 rounded-md border border-border/60 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm p-4 shadow-sm">
      <h2 className={sectionTitle}>5. Removal</h2>
      <p>
        You can request deletion (future UI or maintainer contact). Backups are
        not guaranteed; removal may be immediate & irreversible.
      </p>
    </section>
    <section className="space-y-3 rounded-md border border-border/60 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm p-4 shadow-sm">
      <h2 className={sectionTitle}>6. Educational Context</h2>
      <p>
        This prototype is non‑commercial. Privacy expectations should match an
        experimental / demo environment.
      </p>
      <p className="text-xs italic opacity-70">
        Last updated: {new Date().getFullYear()} (privacy draft)
      </p>
    </section>
  </div>
);

export function TermsAndPrivacy({ text }: TermsAndPrivacyProps) {
  return (
    <div className="text-xs text-center text-foreground/80 flex flex-col items-center gap-1">
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="text-mysecondary hover:underline focus:outline-none"
          >
            Terms of Service
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto no-scrollbar sm:max-w-2xl w-full bg-gradient-to-br from-background via-background/95 to-background border border-border/60 shadow-lg">
          <DialogHeader>
            <DialogTitle>Terms of Service (Project Prototype)</DialogTitle>
            <DialogDescription className="text-foreground">
              Please read this quick notice. Continued use = acceptance.
            </DialogDescription>
          </DialogHeader>
          {TERMS_BODY}
        </DialogContent>
      </Dialog>
      <Separator className="w-10 opacity-20" />
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="text-mysecondary hover:underline focus:outline-none"
          >
            Privacy Policy
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto no-scrollbar sm:max-w-2xl w-full bg-gradient-to-br from-background via-background/95 to-background border border-border/60 shadow-lg">
          <DialogHeader>
            <DialogTitle>Privacy Policy (Prototype Context)</DialogTitle>
            <DialogDescription className="text-foreground">
              Minimal data, no guarantees, educational use only.
            </DialogDescription>
          </DialogHeader>
          {PRIVACY_BODY}
        </DialogContent>
      </Dialog>
      <p className="mt-1 max-w-sm text-[10px] text-foreground/60">
        {text}. Using this site means you agree to the above prototype terms.
      </p>
    </div>
  );
}

export default TermsAndPrivacy;
