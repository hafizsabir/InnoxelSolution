// @ts-nocheck
import {
  Container,
  Box,
  Typography,
  Avatar,
  Stack,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  AccessTime,
  LocalOffer,
  Visibility,
  PersonOutline,
} from '@mui/icons-material';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BlogPostRenderer from '@/components/blog/BlogPostRenderer';
import ViewTracker from '@/components/blog/ViewTracker';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('blogs')
    .select('title, excerpt, cover_image')
    .eq('slug', slug)
    .single();
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
  const formatViews = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <ViewTracker slug={post.slug} />

      {/* ── HERO: two-column layout ── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0d0f1a 0%, #1a1040 50%, #0d0f1a 100%)',
          pt: { xs: 4, md: 6 },
          pb: { xs: 0, md: 0 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative blobs */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(67,97,238,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            right: '-5%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(114,9,183,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Back button */}
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Link href="/techblog" style={{ textDecoration: 'none' }}>
              <Button
                startIcon={<ArrowBack />}
                size="small"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  bgcolor: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 99,
                  px: 2.5,
                  py: 0.8,
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.13)',
                    color: '#fff',
                  },
                }}
              >
                Back to Blog
              </Button>
            </Link>
          </Box>

          {/* Two-column: text LEFT — image RIGHT */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 420px' },
              gap: { xs: 4, md: 6 },
              alignItems: 'center',
              pb: { xs: 5, md: 7 },
            }}
          >
            {/* ── LEFT: meta + title + author ── */}
            <Box>
              {/* Category chip */}
              <Chip
                label={post.category}
                size="small"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  bgcolor: 'rgba(67,97,238,0.2)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(67,97,238,0.35)',
                }}
              />

              {/* Title */}
              <Typography
                variant="h1"
                sx={{
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  mb: 3,
                }}
              >
                {post.title}
              </Typography>

              {/* Excerpt */}
              {post.excerpt && (
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '1.1rem',
                    lineHeight: 1.75,
                    mb: 4,
                    maxWidth: 560,
                  }}
                >
                  {post.excerpt}
                </Typography>
              )}

              {/* Author row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3.5 }}>
                <Avatar
                  sx={{
                    width: 46,
                    height: 46,
                    background: authorGradient,
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    flexShrink: 0,
                    boxShadow: '0 0 0 3px rgba(255,255,255,0.1)',
                  }}
                >
                  {post.author_initials}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#fff' }}>
                    {post.author}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    {post.author_role}
                  </Typography>
                </Box>
              </Box>

              {/* Meta pills */}
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.6,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 99,
                    bgcolor: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <CalendarToday sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                    {post.published_date}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.6,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 99,
                    bgcolor: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <AccessTime sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                    {post.read_time}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.6,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 99,
                    bgcolor: 'rgba(67,97,238,0.12)',
                    border: '1px solid rgba(67,97,238,0.25)',
                  }}
                >
                  <Visibility sx={{ fontSize: 13, color: '#818cf8' }} />
                  <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 700 }}>
                    {formatViews(post.view_count ?? 0)} {(post.view_count ?? 0) === 1 ? 'view' : 'views'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* ── RIGHT: cover image ── */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
                  aspectRatio: '4/3',
                  background: coverGradient,
                  position: 'relative',
                }}
              >
                {post.cover_image ? (
                  <Box
                    component="img"
                    src={post.cover_image}
                    alt={post.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                ) : (
                  /* Decorative pattern for gradient covers */
                  <>
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                          'radial-gradient(circle at 25% 75%, rgba(255,255,255,0.18), transparent 55%), radial-gradient(circle at 75% 25%, rgba(255,255,255,0.12), transparent 55%)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                          'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '4.5rem',
                          fontWeight: 900,
                          color: 'rgba(255,255,255,0.25)',
                          letterSpacing: '-0.05em',
                          userSelect: 'none',
                          lineHeight: 1,
                          px: 3,
                          textAlign: 'center',
                        }}
                      >
                        {post.title.split(' ').slice(0, 2).join(' ')}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>

              {/* Decorative glow behind image */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: -20,
                  borderRadius: 6,
                  background: 'linear-gradient(135deg, rgba(67,97,238,0.25), rgba(114,9,183,0.2))',
                  filter: 'blur(40px)',
                  zIndex: -1,
                  pointerEvents: 'none',
                }}
              />
            </Box>
          </Box>
        </Container>

        {/* Wave separator */}
        <Box sx={{ lineHeight: 0, mt: -1 }}>
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            style={{ width: '100%', height: 60, display: 'block' }}
          >
            <path
              d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
              fill="var(--mui-palette-background-default, #fff)"
            />
          </svg>
        </Box>
      </Box>

      {/* ── ARTICLE BODY: full width ── */}
      <Container maxWidth="md" sx={{ pt: 2 }}>
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
                <Typography
                  variant="caption"
                  fontWeight={800}
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
                >
                  Tags
                </Typography>
              </Box>
              {(post.tags || []).map((tag: string) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    borderColor: 'divider',
                    '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </Stack>

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
