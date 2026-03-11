import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import DemoSection from "@/components/DemoSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import FooterSection from "@/components/FooterSection";
import CopilotPanel from "@/components/copilot/CopilotPanel";

const Index = () => {
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [copilotSide, setCopilotSide] = useState<"right" | "left">("right");

  return (
    <div className="min-h-screen bg-background flex">
      {copilotSide === "left" && (
        <CopilotPanel
          open={copilotOpen}
          setOpen={setCopilotOpen}
          side={copilotSide}
          setSide={setCopilotSide}
        />
      )}
      <div
        className="flex-1 min-w-0 transition-all duration-300 overflow-x-hidden"
      >
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DemoSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <FooterSection />
      </div>
      {copilotSide === "right" && (
        <CopilotPanel
          open={copilotOpen}
          setOpen={setCopilotOpen}
          side={copilotSide}
          setSide={setCopilotSide}
        />
      )}
    </div>
  );
};

export default Index;
