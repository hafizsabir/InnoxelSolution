import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import ServicesOverview from '@/components/home/ServicesOverview';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';

export const metadata: Metadata = {
  title: 'Innoxel Solutions — Premium Software Development Company',
  description:
    'We build world-class web apps, mobile apps, AI solutions, and cloud infrastructure that drive real business growth. Partner with Innoxel today.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesOverview />
      <WhyChooseUs />
      {/* <Testimonials /> */}
    </>
  );
}
