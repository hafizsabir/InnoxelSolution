// @ts-nocheck
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Grid, Typography, Chip, Stack,
  CircularProgress, TextField, InputAdornment, Pagination,
} from '@mui/material';
import { RssFeed, Search } from '@mui/icons-material';
import BlogCard from '@/components/blog/BlogCard';
import type { BlogPost } from '@/types/blog';

const categories = ['All', 'Artificial Intelligence', 'Architecture', 'Mobile Dev', 'Cloud Native'];
const PAGE_SIZE = 9;

export default function TechBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [selectedCategory, debouncedSearch]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (selectedCategory !== 'All') params.set('category', selectedCategory);

      const res = await fetch(`/api/blogs?${params.toString()}`);
      const json = await res.json();

      // API returns { data, total, page, pageSize } when page param is given
      setPosts(Array.isArray(json) ? json : (json.data ?? []));
      setTotal(json.total ?? 0);
    } catch (err) {
      console.error(err);
      setPosts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedCategory]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, total);

  // For the layout: first post on page-1 with no filters is "featured hero", rest are regular
  const isUnfiltered = page === 1 && !debouncedSearch && selectedCategory === 'All';
  const featured = isUnfiltered ? posts.filter(p => p.featured) : [];
  const regular = isUnfiltered ? posts.filter(p => !p.featured) : posts;

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* ── Hero Header ── */}
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
            <Typography variant="caption" color="primary.main" fontWeight={700} sx={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
            <Box component="span" color="text.primary"> &amp; Deep Dives</Box>
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: 'auto', lineHeight: 1.8, fontSize: '1.1rem' }}>
            Practical engineering articles from the team building production-grade software.
          </Typography>

          {/* ── Category Chips ── */}
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

        {/* ── Search Bar ── */}
        <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search articles by title…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            sx={{
              maxWidth: { sm: 480 },
              mx: 'auto',
              '& .MuiOutlinedInput-root': { borderRadius: 3 },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          {total > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
              Showing {showingFrom}–{showingTo} of {total} article{total !== 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        {/* ── Content ── */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 16 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" color="text.secondary" mb={1}>
              {debouncedSearch ? `No articles matching "${debouncedSearch}"` : 'No articles published yet.'}
            </Typography>
            {debouncedSearch && (
              <Chip
                label="Clear search"
                clickable
                onClick={() => setSearchQuery('')}
                sx={{ mt: 2, fontWeight: 600 }}
              />
            )}
          </Box>
        ) : (
          <>
            {/* Featured Section (only shown on unfiltered page 1) */}
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

            {/* Articles Grid */}
            {regular.length > 0 && (
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 4 }}>
                  {debouncedSearch || selectedCategory !== 'All' ? 'Results' : 'Latest Articles'}
                </Typography>
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

        {/* ── Pagination ── */}
        {!loading && pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, v) => {
                setPage(v);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              color="primary"
              shape="rounded"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
