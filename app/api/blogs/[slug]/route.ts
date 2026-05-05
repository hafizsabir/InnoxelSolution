import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calcReadTime, formatDate } from '@/lib/blogs';

// GET /api/blogs/[slug]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

// PUT /api/blogs/[slug]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.title !== undefined) updates.title = body.title;
  if (body.excerpt !== undefined) updates.excerpt = body.excerpt;
  if (body.category !== undefined) updates.category = body.category;
  if (body.categoryColor !== undefined) updates.category_color = body.categoryColor;
  if (body.coverImage !== undefined) updates.cover_image = body.coverImage;
  if (body.coverGradient !== undefined) updates.cover_gradient = body.coverGradient;
  if (body.tags !== undefined) updates.tags = body.tags;
  if (body.featured !== undefined) updates.featured = body.featured;
  if (body.status !== undefined) updates.status = body.status;
  if (body.content !== undefined) {
    updates.content = body.content;
    updates.read_time = calcReadTime(body.content);
  }
  if (body.author !== undefined) {
    updates.author = body.author;
    updates.author_initials = body.author.slice(0, 2).toUpperCase();
  }
  if (body.authorRole !== undefined) updates.author_role = body.authorRole;

  const { data, error } = await supabase
    .from('blogs')
    .update(updates)
    .eq('slug', slug)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/blogs/[slug]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase.from('blogs').delete().eq('slug', slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
