import HeroSection from "@/components/home/HeroSection";
import FeaturedIdeas from "@/components/home/FeaturedIdeas";
import CategoriesSection from "@/components/home/CategoriesSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TopVotedSection from "@/components/home/TopVotedSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import CTASection from "@/components/home/CTASection";
import FAQSection from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <FeaturedIdeas />
      <HowItWorksSection />
      <TopVotedSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <NewsletterSection />
    </div>
  );
}
