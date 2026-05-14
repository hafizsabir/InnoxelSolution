// app/techblog/page.tsx
// Server component shell — TechBlogClient is already a 'use client' component.
import type { Metadata } from 'next';
import TechBlogClient from '@/components/blog/TechBlogClient';

export const metadata: Metadata = {
  title: 'Tech Blog',
  description:
    'Practical engineering articles from the Innoxel Solutions team — AI, architecture, mobile dev, and cloud native deep dives.',
};

export default function TechBlogPage() {
  return <TechBlogClient />;
}
