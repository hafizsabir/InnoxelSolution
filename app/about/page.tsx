// app/about/page.tsx
import type { Metadata } from 'next';
import AboutClient from '@/components/about/AboutClient';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Innoxel Solutions — our story, mission, vision, team, and the values that guide us in building world-class software.',
};

export default function AboutPage() {
  return <AboutClient />;
}
