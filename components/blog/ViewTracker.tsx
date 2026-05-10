'use client';

import { useEffect, useRef } from 'react';

interface ViewTrackerProps {
  slug: string;
}

/**
 * Invisible component — fires a single PATCH request to increment the
 * view_count for this post when the article page first mounts.
 *
 * The `tracked` ref guards against double-fire in React Strict Mode (dev)
 * where effects run twice.
 */
export default function ViewTracker({ slug }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    fetch(`/api/blogs/${slug}/views`, { method: 'PATCH' }).catch(() => {
      // Silently ignore — view tracking is non-critical
    });
  }, [slug]);

  return null;
}
