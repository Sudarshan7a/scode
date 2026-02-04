"use client";
import React from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dave",
    role: "Developer",
    avatar: "DV",
    content:
      "Feature rich application! Effortlessly collaborate with others",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Senior Developer @ TechCorp",
    avatar: "SC",
    content:
      "S-Code transformed how our team does code reviews. The real-time collaboration feels natural, and the voice chat integration is seamless.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Freelance Engineer",
    avatar: "MJ",
    content:
      "I've tried every pair programming tool out there. S-Code is the only one that doesn't feel like a compromise. It's fast, intuitive, and just works.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Tech Lead @ StartupXYZ",
    avatar: "PS",
    content:
      "Onboarding junior devs has never been easier. We pair program daily using S-Code, and the productivity boost is measurable.",
    rating: 5,
  },
  {
    name: "Alex Rivera",
    role: "CS Student",
    avatar: "AR",
    content:
      "Perfect for study groups and hackathons. The AI suggestions help us learn faster, and we can all code together from different locations.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Engineering Manager",
    avatar: "DK",
    content:
      "Finally, a collaboration tool that developers actually want to use. Our team adopted it without any push from leadership.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-mybackground">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Loved by developers
            <span className="text-mysecondary"> worldwide</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what developers are saying
            about S-Code.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-mybackground to-mysecondary/5 border border-mysecondary/10 hover:border-mysecondary/30 transition-all duration-300 hover:shadow-xl hover:shadow-mysecondary/10"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-12 h-12 text-mysecondary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-mysecondary text-mysecondary"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/80 leading-relaxed mb-6 relative z-10">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mysecondary to-mysecondary/60 flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-foreground/60">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 p-8 rounded-2xl bg-gradient-to-r from-mysecondary/10 via-mysecondary/5 to-mysecondary/10 border border-mysecondary/20">
          <div className="text-center">
            <p className="text-4xl font-bold text-mysecondary mb-2">4.9/5</p>
            <p className="text-sm text-foreground/60">Average rating</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-mysecondary mb-2">10K+</p>
            <p className="text-sm text-foreground/60">Happy developers</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-mysecondary mb-2">98%</p>
            <p className="text-sm text-foreground/60">Would recommend</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-mysecondary mb-2">24/7</p>
            <p className="text-sm text-foreground/60">Support available</p>
          </div>
        </div>
      </div>
    </section>
  );
}
