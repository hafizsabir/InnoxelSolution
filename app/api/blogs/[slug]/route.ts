import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readPosts, writePosts, calcReadTime, formatDate } from '@/lib/blogs';

// GET /api/blogs/[slug]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = readPosts().find((p) => p.slug === slug);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

// PUT /api/blogs/[slug]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await req.json();
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const now = new Date().toISOString();
  posts[idx] = {
    ...posts[idx],
    ...body,
    readTime: calcReadTime(body.content ?? posts[idx].content),
    date: formatDate(posts[idx].createdAt),
    updatedAt: now,
  };
  writePosts(posts);
  return NextResponse.json(posts[idx]);
}

// DELETE /api/blogs/[slug]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = readPosts();
  const filtered = posts.filter((p) => p.slug !== slug);
  if (filtered.length === posts.length)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  writePosts(filtered);
  return NextResponse.json({ ok: true });
}
