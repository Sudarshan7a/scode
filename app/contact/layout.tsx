import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | S-Code",
  description:
    "Get in touch with the S-Code team. We'd love to hear your feedback, questions, or partnership inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
