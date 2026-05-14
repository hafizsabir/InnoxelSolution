// @ts-nocheck
// app/services/page.tsx
import type { Metadata } from 'next';
import ServicesClient from '@/components/services/ServicesClient';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore the full range of software development services from Innoxel Solutions — web apps, mobile apps, AI/ML, cloud, UI/UX, and custom software.',
};

export default function ServicesPage() {
  return <ServicesClient />;
}
