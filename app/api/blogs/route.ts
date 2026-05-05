import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { slugify, calcReadTime, formatDate } from '@/lib/blogs';

// GET /api/blogs          → published posts
// GET /api/blogs?all=1    → all posts (admin)
export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get('all') === '1';
  const supabase = await createClient();

  let query = supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (!all) {
    query = query.eq('status', 'published');
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/blogs → create post
export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const now = new Date().toISOString();

  const slug = slugify(body.title || 'untitled');

  const { data: existing } = await supabase
    .from('blogs')
    .select('id')
    .eq('slug', slug)
    .single();

  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const post = {
    slug: finalSlug,
    title: body.title || 'Untitled',
    excerpt: body.excerpt || '',
    category: body.category || 'General',
    category_color: body.categoryColor || '#4361ee',
    cover_image: body.coverImage || null,
    cover_gradient: body.coverGradient || 'linear-gradient(135deg, #4361ee 0%, #7209b7 100%)',
    read_time: calcReadTime(body.content || []),
    published_date: formatDate(now),
    author: body.author || 'Innoxel Team',
    author_role: body.authorRole || 'Writer',
    author_initials: (body.author || 'IT').slice(0, 2).toUpperCase(),
    author_gradient: 'linear-gradient(135deg, #4361ee, #7209b7)',
    tags: body.tags || [],
    featured: body.featured || false,
    status: body.status || 'draft',
    content: body.content || [],
    author_id: user.id,
  };

  const { data, error } = await supabase.from('blogs').insert(post).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
