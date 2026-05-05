import type { Metadata } from 'next';
import CompanyIntro from '@/components/about/CompanyIntro';
import MissionVision from '@/components/about/MissionVision';
import TeamSection from '@/components/about/TeamSection';
import CompanyValues from '@/components/about/CompanyValues';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Innoxel Solutions — our story, mission, vision, team, and the values that guide us in building world-class software.',
};

export default function AboutPage() {
  return (
    <>
      <CompanyIntro />
      <MissionVision />
      <TeamSection />
      <CompanyValues />
    </>
  );
}
