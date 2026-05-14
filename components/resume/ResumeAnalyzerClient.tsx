// @ts-nocheck
// components/resume/ResumeAnalyzerClient.tsx
'use client';

import dynamic from 'next/dynamic';

const ATSAnalyzer = dynamic(
  () => import('@/components/resume/ATSAnalyzer'),
  { ssr: false }
);

export default function ResumeAnalyzerClient() {
  return <ATSAnalyzer />;
}
