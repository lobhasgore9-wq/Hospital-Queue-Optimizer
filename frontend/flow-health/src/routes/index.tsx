import { createFileRoute } from '@tanstack/react-router';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { AnalyticsPreview } from '@/components/landing/AnalyticsPreview';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection, LandingFooter } from '@/components/landing/CTASection';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Hospital Queue Optimizer — Smarter Patient Flow, Shorter Waits' },
      { name: 'description', content: 'AI-powered queue management for hospitals, clinics, and healthcare facilities. Reduce wait times by 40%, optimize patient flow, and keep patients informed in real time.' },
      { property: 'og:title', content: 'Hospital Queue Optimizer — Smarter Patient Flow, Shorter Waits' },
      { property: 'og:description', content: 'AI-powered queue management for hospitals and clinics. Reduce wait times, optimize patient flow, and improve care.' },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <AnalyticsPreview />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
