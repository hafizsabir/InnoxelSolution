import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { slugify, calcReadTime, formatDate } from '@/lib/blogs';

/**
 * GET /api/blogs
 *
 * Query params
 * ────────────
 * all=1          include drafts (admin)
 * search=foo     filter by title (case-insensitive ilike)
 * category=X     filter by category  (omit or "All" → no filter)
 * status=X       filter by status    (omit or "all"  → no filter)
 * page=1         1-based page number (enables paginated response)
 * limit=10       items per page (default 10, max 50)
 *
 * Response (when page param present)
 * ────────────────────────────────────
 *   { data: BlogPost[], total: number, page: number, pageSize: number }
 *
 * Response (no page param – backwards compat)
 *   BlogPost[]
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const all = sp.get('all') === '1';
  const search = sp.get('search')?.trim() ?? '';
  const category = sp.get('category') ?? '';
  const statusParam = sp.get('status') ?? '';
  const pageParam = sp.get('page');
  const limit = Math.min(Number(sp.get('limit') ?? 10), 50);
  const page = Math.max(1, Number(pageParam ?? 1));

  const supabase = await createClient();

  // ── Build base query ──────────────────────────────────────────────────────
  let query = supabase
    .from('blogs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Published-only guard (public route)
  if (!all) {
    query = query.eq('status', 'published');
  }

  // Status filter (admin only – only respected when all=1)
  if (all && statusParam && statusParam !== 'all') {
    query = query.eq('status', statusParam);
  }

  // Category filter
  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  // Title search (case-insensitive)
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  // ── Pagination ────────────────────────────────────────────────────────────
  const isPaginated = pageParam !== null;
  if (isPaginated) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Paginated response
  if (isPaginated) {
    return NextResponse.json({
      data: data ?? [],
      total: count ?? 0,
      page,
      pageSize: limit,
    });
  }

  // Legacy flat array (backward compat)
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
