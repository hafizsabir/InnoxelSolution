import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PATCH /api/blogs/[slug]/views
 *
 * Atomically increments the view_count for the blog post identified by slug.
 * No authentication required — called by any visitor landing on a post page.
 * Uses a Supabase RPC so the increment is race-condition safe.
 */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const supabase = await createClient();

  const { error } = await supabase.rpc('increment_view_count', {
    post_slug: slug,
  });

  if (error) {
    console.error('[views] RPC error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
