"use client";
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight, Code2, Users, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-52px)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-mybackground via-mybackground to-mysecondary/10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-mysecondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mysecondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-mysecondary/10 border border-mysecondary/20 backdrop-blur-sm">
          <Zap className="w-4 h-4 text-mysecondary" />
          <span className="text-sm font-medium text-foreground">
            Real-time collaboration reimagined
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
          Code Together,
          <br />
          <span className="bg-gradient-to-r from-mysecondary to-mysecondary/60 bg-clip-text text-transparent">
            Think Faster
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed">
          The collaborative coding platform built for pair programming.
          <br className="hidden md:block" />
          Write, debug, and learn together in real-time with voice chat and AI
          assistance.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-mysecondary hover:bg-mysecondary-hover text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all group"
            >
              Start Pairing Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-mysecondary text-foreground hover:bg-mysecondary/10 px-8 py-6 text-lg font-semibold rounded-lg transition-all"
            >
              See How It Works
            </Button>
          </Link>
        </div>

        {/* Stats/Trust indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-8 border-t border-mysecondary/20">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-mysecondary/10">
              <Users className="w-6 h-6 text-mysecondary" />
            </div>
            <p className="text-3xl font-bold text-foreground">10K+</p>
            <p className="text-sm text-foreground/60">Active developers</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-mysecondary/10">
              <Code2 className="w-6 h-6 text-mysecondary" />
            </div>
            <p className="text-3xl font-bold text-foreground">50K+</p>
            <p className="text-sm text-foreground/60">Pair sessions</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-mysecondary/10">
              <Zap className="w-6 h-6 text-mysecondary" />
            </div>
            <p className="text-3xl font-bold text-foreground">3x</p>
            <p className="text-sm text-foreground/60">Faster debugging</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-mysecondary/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-mysecondary rounded-full"></div>
        </div>
      </div> */}
    </section>
  );
}
