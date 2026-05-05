import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readPosts, writePosts, slugify, calcReadTime, formatDate } from '@/lib/blogs';
import type { BlogPost } from '@/types/blog';

// GET /api/blogs          → published posts
// GET /api/blogs?all=1    → all posts (admin)
export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get('all') === '1';
  const posts = readPosts();
  return NextResponse.json(all ? posts : posts.filter((p) => p.status === 'published'));
}

// POST /api/blogs  → create post
export async function POST(req: NextRequest) {
  const body = await req.json();
  const posts = readPosts();

  const slug = slugify(body.title || 'untitled');
  const uniqueSlug = posts.some((p) => p.slug === slug) ? `${slug}-${Date.now()}` : slug;

  const now = new Date().toISOString();
  const newPost: BlogPost = {
    id: Date.now().toString(),
    slug: uniqueSlug,
    title: body.title || 'Untitled',
    excerpt: body.excerpt || '',
    category: body.category || 'General',
    categoryColor: body.categoryColor || '#4361ee',
    coverImage: body.coverImage || null,
    coverGradient: body.coverGradient || 'linear-gradient(135deg, #4361ee 0%, #7209b7 100%)',
    readTime: calcReadTime(body.content || []),
    date: formatDate(now),
    author: body.author || 'Innoxel Team',
    authorRole: body.authorRole || 'Writer',
    authorInitials: (body.author || 'IT').slice(0, 2).toUpperCase(),
    authorGradient: body.authorGradient || 'linear-gradient(135deg, #4361ee, #7209b7)',
    tags: body.tags || [],
    featured: body.featured || false,
    status: body.status || 'draft',
    content: body.content || [],
    createdAt: now,
    updatedAt: now,
  };

  posts.unshift(newPost);
  writePosts(posts);
  return NextResponse.json(newPost, { status: 201 });
}
