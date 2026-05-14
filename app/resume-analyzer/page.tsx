// app/resume-analyzer/page.tsx
import type { Metadata } from 'next';
import ResumeAnalyzerClient from '@/components/resume/ResumeAnalyzerClient';

export const metadata: Metadata = {
  title: 'Resume Analyzer',
  description: 'Upload your CV and instantly get an ATS score with detailed section-by-section feedback, missing keywords, and an editable CV you can download as PDF or Word.',
};

export default function ResumePage() {
  return <ResumeAnalyzerClient />;
}
