import HeroSection from "@/components/landing/hero-section";
import InteractiveMatchDemo from "@/components/landing/interactive-match-demo";
import HowItWorksSection from "@/components/landing/how-it-works-section";
import PillarsSection from "@/components/landing/pillars-section";
import FeaturesSection from "@/components/landing/features-section";
import StartupsCarousel from "@/components/landing/startups-carousel";
import TestimonialsSection from "@/components/landing/testimonials-section";
import ComparisonTable from "@/components/landing/comparison-table";
import DemoVideoSection from "@/components/landing/demo-video-section";
import FaqSection from "@/components/landing/faq-section";
import RoadmapSection from "@/components/landing/roadmap-section";
import FooterSection from "@/components/landing/footer-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <InteractiveMatchDemo />
      <HowItWorksSection />
      <StartupsCarousel />
      <PillarsSection />
      <FeaturesSection />
      <DemoVideoSection />
      <TestimonialsSection />
      <ComparisonTable />
      <FaqSection />
      <RoadmapSection />
      <FooterSection />
    </>
  );
}
