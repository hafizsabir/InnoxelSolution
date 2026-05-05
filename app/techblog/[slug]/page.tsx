// @ts-nocheck
import { Container, Box, Typography, Avatar, Stack, Chip, Divider, Button } from '@mui/material';
import { ArrowBack, CalendarToday, AccessTime, LocalOffer } from '@mui/icons-material';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BlogPostRenderer from '@/components/blog/BlogPostRenderer';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('blogs').select('title, excerpt, cover_image').eq('slug', slug).single();
  if (!data) return { title: 'Post Not Found' };
  return {
    title: `${data.title} — Innoxel Blog`,
    description: data.excerpt,
    openGraph: { images: data.cover_image ? [data.cover_image] : [] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) notFound();

  const coverGradient = post.cover_gradient || 'linear-gradient(135deg, #4361ee 0%, #7209b7 100%)';
  const authorGradient = post.author_gradient || 'linear-gradient(135deg, #4361ee, #7209b7)';

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* ── Hero / Cover ── */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 280, sm: 380, md: 480 },
          background: post.cover_image ? 'transparent' : coverGradient,
          overflow: 'hidden',
        }}
      >
        {post.cover_image && (
          <Box
            component="img"
            src={post.cover_image}
            alt={post.title}
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}

        {/* Dark gradient overlay for text readability */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
          }}
        />

        {/* Decorative pattern for gradient-only covers */}
        {!post.cover_image && (
          <>
            <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1), transparent 50%)' }} />
            <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </>
        )}

        {/* Back button */}
        <Box sx={{ position: 'absolute', top: { xs: 16, md: 24 }, left: { xs: 16, md: 40 } }}>
          <Link href="/techblog" style={{ textDecoration: 'none' }}>
            <Button
              startIcon={<ArrowBack />}
              size="small"
              sx={{
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 99,
                px: 2,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
              }}
            >
              Back to Blog
            </Button>
          </Link>
        </Box>

        {/* Category & title overlay at bottom */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            px: { xs: 2, md: 0 },
            pb: { xs: 3, md: 5 },
          }}
        >
          <Container maxWidth="md">
            <Chip
              label={post.category}
              size="small"
              sx={{
                mb: 2,
                fontWeight: 700,
                fontSize: '0.72rem',
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.35)',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                color: '#fff',
                fontWeight: 900,
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.2,
                textShadow: '0 2px 20px rgba(0,0,0,0.4)',
              }}
            >
              {post.title}
            </Typography>
          </Container>
        </Box>
      </Box>

      {/* ── Article Body ── */}
      <Container maxWidth="md">
        {/* Author + meta bar */}
        <Box
          sx={{
            py: { xs: 3, md: 4 },
            mb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 3 }}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
          >
            {/* Author */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: authorGradient,
                  fontSize: '1rem',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {post.author_initials}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={800} color="text.primary">
                  {post.author}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {post.author_role}
                </Typography>
              </Box>
            </Box>

            {/* Date + read time */}
            <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" sx={{ gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CalendarToday sx={{ fontSize: 16, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.secondary">{post.published_date}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <AccessTime sx={{ fontSize: 16, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.secondary">{post.read_time}</Typography>
              </Box>
            </Stack>
          </Stack>

          {/* Excerpt */}
          {post.excerpt && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 2.5, lineHeight: 1.8, fontSize: '1.05rem', fontStyle: 'italic', borderLeft: '3px solid', borderColor: 'primary.main', pl: 2 }}
            >
              {post.excerpt}
            </Typography>
          )}
        </Box>

        {/* Article content */}
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <BlogPostRenderer blocks={post.content || []} />
        </Box>

        {/* Tags footer */}
        {(post.tags || []).length > 0 && (
          <Box sx={{ pt: 5, pb: 8, borderTop: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" sx={{ gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
                <LocalOffer sx={{ fontSize: 16, color: 'text.disabled' }} />
                <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Tags
                </Typography>
              </Box>
              {(post.tags || []).map((tag: string) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600, color: 'text.secondary', borderColor: 'divider', '&:hover': { borderColor: 'primary.main', color: 'primary.main' }, transition: 'all 0.2s' }}
                />
              ))}
            </Stack>

            {/* Back link at bottom */}
            <Box sx={{ mt: 6 }}>
              <Link href="/techblog" style={{ textDecoration: 'none' }}>
                <Button
                  startIcon={<ArrowBack />}
                  variant="outlined"
                  sx={{ borderRadius: 99, px: 3 }}
                >
                  Back to Blog
                </Button>
              </Link>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
