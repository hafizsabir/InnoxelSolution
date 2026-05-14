// @ts-nocheck
// components/about/AboutClient.tsx
'use client';

import dynamic from 'next/dynamic';

const CompanyIntro  = dynamic(() => import('@/components/about/CompanyIntro'),  { ssr: false });
const MissionVision = dynamic(() => import('@/components/about/MissionVision'), { ssr: false });
const TeamSection   = dynamic(() => import('@/components/about/TeamSection'),   { ssr: false });
const CompanyValues = dynamic(() => import('@/components/about/CompanyValues'), { ssr: false });

export default function AboutClient() {
  return (
    <>
      <CompanyIntro />
      <MissionVision />
      <TeamSection />
      <CompanyValues />
    </>
  );
}
