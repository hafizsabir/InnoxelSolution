// app/page.tsx
// Server component — imports a 'use client' shell that lazy-loads the sections.
import type { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';

export const metadata: Metadata = {
  title: 'Innoxel Solutions — Premium Software Development Company',
  description:
    'We build world-class web apps, mobile apps, AI solutions, and cloud infrastructure that drive real business growth. Partner with Innoxel today.',
};

export default function HomePage() {
  return <HomeClient />;
}
