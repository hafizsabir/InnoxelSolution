// app/careers/page.tsx
import type { Metadata } from 'next';
import CareersClient from '@/components/careers/CareersClient';

export const metadata: Metadata = {
  title: 'Careers — Join Innoxel Solutions',
  description: 'Explore exciting career opportunities at Innoxel Solutions. We are hiring talented developers, designers, and cloud engineers.',
};

export default function CareersPage() {
  // CareersClient is already 'use client' — it loads correctly as a server-rendered shell
  return <CareersClient />;
}
