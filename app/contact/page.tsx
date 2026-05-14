// @ts-nocheck
// app/contact/page.tsx
import type { Metadata } from 'next';
import ContactClient from '@/components/contact/ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Innoxel Solutions. Start your project, request a quote, or just say hello. We respond within 24 hours.',
};

export default function ContactPage() {
  return <ContactClient />;
}
