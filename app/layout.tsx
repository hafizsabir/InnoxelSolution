import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from '@/theme/ThemeRegistry';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Innoxel Solutions — Premium Software Development Company',
    template: '%s | Innoxel Solutions',
  },
  description:
    'Innoxel Solutions builds world-class web apps, mobile apps, AI solutions, and cloud infrastructure for forward-thinking businesses worldwide.',
  keywords: [
    'software development',
    'web application development',
    'mobile app development',
    'AI solutions',
    'cloud solutions',
    'UI UX design',
    'custom software',
  ],
  authors: [{ name: 'Innoxel Solutions' }],
  openGraph: {
    type: 'website',
    siteName: 'Innoxel Solutions',
    title: 'Innoxel Solutions — Premium Software Development Company',
    description:
      'We build world-class web apps, mobile apps, AI, and cloud solutions for ambitious businesses.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <ThemeRegistry>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </ThemeRegistry>
      </body>
    </html>
  );
}
