import Hero from '@/sections/Hero'
import StatsBand from '@/sections/StatsBand'
import SavingsCalculator from '@/sections/SavingsCalculator'
import RolesPreview from '@/sections/RolesPreview'
import WhyPhilippines from '@/sections/WhyPhilippines'
import ProcessPreview from '@/sections/ProcessPreview'
import Testimonials from '@/sections/Testimonials'
import FaqSection from '@/sections/FaqSection'
import CtaSection from '@/sections/CtaSection'

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBand />
      <SavingsCalculator />
      <RolesPreview />
      <WhyPhilippines />
      <ProcessPreview />
      <Testimonials />
      <FaqSection />
      <CtaSection />
    </>
  )
}
