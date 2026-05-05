// @ts-nocheck
import { Container, Box, Typography, Avatar, Stack, Chip, Divider, Button } from '@mui/material';
import { ArrowBack, CalendarToday, AccessTime } from '@mui/icons-material';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readPosts } from '@/lib/blogs';
import BlogPostRenderer from '@/components/blog/BlogPostRenderer';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = readPosts().find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} — Innoxel Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = readPosts().find((p) => p.slug === slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        {/* Back Button */}
        <Button
          component={Link}
          href="/techblog"
          startIcon={<ArrowBack />}
          sx={{ mb: 6, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          Back to Blog
        </Button>

        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Chip
            label={post.category}
            sx={{
              mb: 3,
              fontWeight: 700,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(67,97,238,0.2)' : 'rgba(67,97,238,0.1)',
              color: 'primary.main',
              border: '1px solid',
              borderColor: 'rgba(67,97,238,0.3)',
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.25rem', md: '3.5rem' },
              lineHeight: 1.15,
              mb: 4,
              color: 'text.primary',
            }}
          >
            {post.title}
          </Typography>

          <Stack direction="row" spacing={3} sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: post.authorGradient,
                  fontSize: '1rem',
                  fontWeight: 800,
                }}
              >
                {post.authorInitials}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                  {post.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.authorRole}
                </Typography>
              </Box>
            </Box>
            
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
            
            <Stack direction="row" spacing={3} alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 18, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {post.date}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime sx={{ fontSize: 18, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {post.readTime}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        {/* Featured Image / Cover */}
        {post.coverImage ? (
           <Box 
            component="img" 
            src={post.coverImage} 
            sx={{ 
              width: '100%', 
              maxHeight: 450, 
              objectFit: 'cover', 
              borderRadius: 5, 
              mb: 8,
              boxShadow: '0 30px 60px rgba(0,0,0,0.15)'
            }} 
          />
        ) : (
          <Box 
            sx={{ 
              width: '100%', 
              height: 300, 
              background: post.coverGradient, 
              borderRadius: 5, 
              mb: 8,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          </Box>
        )}

        {/* Content Section */}
        <Box sx={{ position: 'relative' }}>
          <BlogPostRenderer blocks={post.content} />
        </Box>

        {/* Footer / Tags */}
        <Box sx={{ mt: 10, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap gap={1}>
            <Typography variant="subtitle2" sx={{ mr: 2, display: 'flex', alignItems: 'center', fontWeight: 800 }}>TAGS:</Typography>
            {post.tags.map(tag => (
              <Chip 
                key={tag} 
                label={`#${tag}`} 
                size="small" 
                variant="outlined"
                sx={{ fontWeight: 600, color: 'text.secondary' }}
              />
            ))}
          </Stack>
        </Box>

        {/* Newsletter / CTA Section could go here */}
      </Container>
    </Box>
  );
}
