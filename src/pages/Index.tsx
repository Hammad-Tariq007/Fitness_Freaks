
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { WorkoutPreview } from "@/components/WorkoutPreview";
import { NutritionPreview } from "@/components/NutritionPreview";
import { TrustedBySection } from "@/components/TrustedBySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="flex flex-col gap-0 sm:gap-8">
        <HeroSection />
        <FeaturesSection />
        <WorkoutPreview />
        <NutritionPreview />
        <TrustedBySection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
