// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Chip, Stack, CircularProgress } from '@mui/material';
import { Article, RssFeed } from '@mui/icons-material';
import BlogCard from '@/components/blog/BlogCard';
import type { BlogPost } from '@/types/blog';

const categories = ['All', 'Artificial Intelligence', 'Architecture', 'Mobile Dev', 'Cloud Native'];

export default function TechBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(p => 
    selectedCategory === 'All' || p.category === selectedCategory
  );

  const featured = filteredPosts.filter((p) => p.featured);
  const regular = filteredPosts.filter((p) => !p.featured);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Hero Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1, mb: 3, px: 2, py: 0.75, borderRadius: 99,
              background: 'linear-gradient(135deg, rgba(67,97,238,0.12), rgba(247,37,133,0.1))',
              border: '1px solid rgba(67,97,238,0.25)',
            }}
          >
            <RssFeed sx={{ fontSize: 15, color: 'primary.main' }} />
            <Typography variant="caption" color="primary.main" fontWeight={700} letterSpacing="0.08em" textTransform="uppercase">
              Engineering Blog
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3.25rem', md: '4rem' },
              lineHeight: 1.1, mb: 2.5,
            }}
          >
            <Box component="span" color="text.primary">Ideas, </Box>
            <Box component="span" sx={{ background: 'linear-gradient(135deg, #4361ee 0%, #f72585 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Insights</Box>
            <Box component="span" color="text.primary"> & Deep Dives</Box>
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: 'auto', lineHeight: 1.8, fontSize: '1.1rem' }}>
            Practical engineering articles from the team building production-grade software.
          </Typography>

          <Stack direction="row" sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 1, mt: 4 }}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                clickable
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  ...(selectedCategory === cat
                    ? { background: 'linear-gradient(135deg, #4361ee, #7209b7)', color: '#fff', border: 'none' }
                    : { bgcolor: 'transparent', border: '1px solid', borderColor: 'divider', color: 'text.secondary' }),
                }}
              />
            ))}
          </Stack>
        </Box>

        {posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" color="text.secondary">No articles published yet.</Typography>
          </Box>
        ) : (
          <>
            {/* Featured Section */}
            {featured.length > 0 && (
              <Box sx={{ mb: 8 }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 4 }}>Featured</Typography>
                <Grid container spacing={4}>
                  {featured.map((post, i) => (
                    <Grid size={{ xs: 12, md: 6 }} key={post.id}>
                      <BlogCard post={post} index={i} featured />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Latest Section */}
            {regular.length > 0 && (
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 4 }}>Latest Articles</Typography>
                <Grid container spacing={4}>
                  {regular.map((post, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                      <BlogCard post={post} index={i} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
