import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { CTASection } from "./CTASection";
import { FAQSection } from "./FAQSection";

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />

      {/* Bolt.new Badge */}
      <div className="fixed bottom-4 right-4 z-50">
        <a href="https://bolt.new" target="_blank" rel="noopener noreferrer">
          <img
            src="/white_circle_360x360.png"
            alt="Powered by Bolt.new"
            className="h-12 w-12 dark:block hidden"
          />
          <img
            src="/black_circle_360x360.png"
            alt="Powered by Bolt.new"
            className="h-12 w-12 dark:hidden block"
          />
        </a>
      </div>
    </div>
  );
}
