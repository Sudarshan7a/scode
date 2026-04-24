import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import DataTransparencySection from "@/components/landing/DataTransparencySection";
import { getAppBaseUrl } from "@/lib/urlConfig";

const BASE_URL = getAppBaseUrl();

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "S-Code",
  url: BASE_URL,
  description:
    "Code together, think faster. The collaborative coding platform built for pair programming with real-time sync, voice chat, and AI assistance.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DataTransparencySection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
