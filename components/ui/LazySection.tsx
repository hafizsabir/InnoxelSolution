// @ts-nocheck
// components/ui/LazySection.tsx
// 'use client' wrapper that enables ssr:false dynamic imports from server component pages.
// Usage: <LazySection loader={() => import('@/components/home/HeroSection')} />

'use client';

import dynamic from 'next/dynamic';
import { ComponentType, Suspense, useEffect, useState } from 'react';

interface Props {
  /** A function returning the dynamic import promise, e.g. () => import('@/components/foo/Bar') */
  loader: () => Promise<{ default: ComponentType<any> }>;
  /** Props forwarded to the loaded component */
  componentProps?: Record<string, unknown>;
}

/**
 * Thin 'use client' boundary that wraps next/dynamic with ssr:false.
 * Server components can render <LazySection loader={...} /> without getting
 * the "ssr:false is not allowed in Server Components" error.
 */
export default function LazySection({ loader, componentProps = {} }: Props) {
  const [Comp, setComp] = useState<ComponentType<any> | null>(null);

  useEffect(() => {
    loader().then((mod) => setComp(() => mod.default));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!Comp) return null;
  return <Comp {...componentProps} />;
}
