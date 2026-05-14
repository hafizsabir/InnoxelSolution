// @ts-nocheck
// components/home/HomeClient.tsx
'use client';

import dynamic from 'next/dynamic';

const HeroSection      = dynamic(() => import('@/components/home/HeroSection'),      { ssr: false });
const ServicesOverview = dynamic(() => import('@/components/home/ServicesOverview'), { ssr: false });
const WhyChooseUs      = dynamic(() => import('@/components/home/WhyChooseUs'),      { ssr: false });

export default function HomeClient() {
  return (
    <>
      <HeroSection />
      <ServicesOverview />
      <WhyChooseUs />
    </>
  );
}
