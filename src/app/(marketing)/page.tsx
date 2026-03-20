import { HeroSection } from '@/components/organisms/landing/hero-section'
import { FeaturesSection } from '@/components/organisms/landing/features-section'
import { PricingSection } from '@/components/organisms/landing/pricing-section'
import { TestimonialsSection } from '@/components/organisms/landing/testimonials-section'
import { CTASection } from '@/components/organisms/landing/cta-section'
import { Footer } from '@/components/organisms/landing/footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  )
}
