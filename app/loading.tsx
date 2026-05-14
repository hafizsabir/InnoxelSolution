// app/loading.tsx
// Root-level Next.js 16 loading convention.
// Automatically wraps EVERY route in a <Suspense> boundary — shown on initial load and navigation.
import PageLoader from '@/components/ui/PageLoader';

export default function Loading() {
  return <PageLoader />;
}
