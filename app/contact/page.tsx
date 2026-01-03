"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending email (in production, you'd call an API endpoint)
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-mybackground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-myforeground mb-6 bg-gradient-to-r from-myprimary to-mysecondary bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-mysecondary">
            Bug reports welcome — include code! (We're devs too, we get it)
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-mysecondary/10 hover:border-mysecondary/20 transition-all">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">📧</div>
              <div>
                <h3 className="text-lg font-semibold text-myforeground mb-2">
                  Email
                </h3>
                <a
                  href="mailto:sudarshanpower07@gmail.com"
                  className="text-myprimary hover:underline"
                >
                  sudarshanpower07@gmail.com
                </a>
                <p className="text-sm text-mysecondary mt-2">
                  We actually read our emails (shocking, we know)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-mysecondary/10 hover:border-mysecondary/20 transition-all">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🐛</div>
              <div>
                <h3 className="text-lg font-semibold text-myforeground mb-2">
                  Bug Reports & Feature Requests
                </h3>
                <a
                  href="https://github.com/Sudarshan7a/scode/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-myprimary hover:underline"
                >
                  GitHub Issues
                </a>
                <p className="text-sm text-mysecondary mt-2">
                  Found a bug? Tell us before it becomes a feature
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-mysecondary/10">
          <h2 className="text-2xl font-semibold text-myforeground mb-6">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-mysecondary mb-2"
              >
                Name
              </label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your name"
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-mysecondary mb-2"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your.email@example.com"
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-mysecondary mb-2"
              >
                Subject
              </label>
              <Input
                id="subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="What's this about?"
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-mysecondary mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Tell us what's on your mind..."
                rows={6}
                className="w-full px-3 py-2 bg-mybackground border border-mysecondary/20 rounded-md text-myforeground placeholder-mysecondary/50 focus:outline-none focus:ring-2 focus:ring-myprimary focus:border-transparent"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-myprimary hover:bg-myprimary/90 text-mybackground font-semibold py-3 rounded-lg transition-all hover:scale-[1.02]"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>

          <p className="text-sm text-mysecondary text-center mt-6">
            Expected response time: 24-48 hours (unless it's a weekend, then we're
            probably debugging our own code)
          </p>
        </div>
      </div>
    </div>
  );
}
