// @ts-nocheck
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Grid, Card, Button, Chip, Stack,
  IconButton, Tabs, Tab, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Divider, Tooltip,
  FormControl, InputLabel, Select, MenuItem, Pagination,
  TextField, InputAdornment,
} from '@mui/material';
import {
  Add, Edit, Delete, Visibility, VisibilityOff,
  TrendingUp, Article, Star, Search, FilterList,
} from '@mui/icons-material';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';

const CATEGORIES = ['All', 'Artificial Intelligence', 'Architecture', 'Mobile Dev', 'Cloud Native', 'Cybersecurity', 'Web Development'];
const PAGE_SIZE = 5;

type SupabaseBlog = {
  id: string; slug: string; title: string; excerpt: string;
  category: string; cover_gradient: string; cover_image: string | null;
  status: string; featured: boolean; published_date: string; read_time: string;
};

export default function AdminDashboard() {
  const [posts, setPosts] = useState<SupabaseBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs?all=1');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [statusFilter, categoryFilter, searchQuery]);

  const handleToggle = async (slug: string, current: string) => {
    await fetch(`/api/blogs/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: current === 'published' ? 'draft' : 'published' }),
    });
    fetchPosts();
  };

  const handleDelete = async () => {
    if (!deleteSlug) return;
    setDeleting(true);
    try {
      await fetch(`/api/blogs/${deleteSlug}`, { method: 'DELETE' });
      setDeleteSlug(null);
      fetchPosts();
    } finally {
      setDeleting(false);
    }
  };

  // ── Derived stats ──
  const published = posts.filter(p => p.status === 'published').length;
  const drafts = posts.length - published;
  const featuredCount = posts.filter(p => p.featured).length;

  // ── Filtered + searched + paginated results ──
  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchSearch = !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchCategory && matchSearch;
    });
  }, [posts, statusFilter, categoryFilter, searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const showingFrom = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, filtered.length);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Page Header ── */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 5 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your blog articles and publishing workflow
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} component={Link} href="/admin/new" sx={{ px: 3, flexShrink: 0 }}>
          New Article
        </Button>
      </Box>

      {/* ── Stats ── */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          { label: 'Total Articles', value: posts.length, icon: <Article />, color: '#4361ee' },
          { label: 'Published', value: published, icon: <Visibility />, color: '#06d6a0' },
          { label: 'Drafts', value: drafts, icon: <VisibilityOff />, color: '#f72585' },
          { label: 'Featured', value: featuredCount, icon: <Star />, color: '#ffd166' },
        ].map((stat) => (
          <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
            <Card sx={{ p: { xs: 2, md: 3 }, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${stat.color}18`, flexShrink: 0 }}>
                <Box sx={{ color: stat.color }}>{stat.icon}</Box>
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600} noWrap>{stat.label}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Status Tabs ── */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={statusFilter} onChange={(_, v) => setStatusFilter(v)} variant="scrollable" scrollButtons="auto">
          <Tab label={`All (${posts.length})`} value="all" sx={{ fontWeight: 600 }} />
          <Tab label={`Published (${published})`} value="published" sx={{ fontWeight: 600 }} />
          <Tab label={`Drafts (${drafts})`} value="draft" sx={{ fontWeight: 600 }} />
        </Tabs>
      </Box>

      {/* ── Filters Row ── */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }} alignItems={{ sm: 'center' }}>
        {/* Search */}
        <TextField
          size="small"
          placeholder="Search articles…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          sx={{ flex: 1, maxWidth: { sm: 340 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Category filter */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select value={categoryFilter} label="Category" onChange={e => setCategoryFilter(e.target.value)}>
            {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>

        {/* Results count */}
        <Typography variant="body2" color="text.secondary" sx={{ ml: { sm: 'auto' }, flexShrink: 0 }}>
          {filtered.length === 0
            ? 'No articles found'
            : `Showing ${showingFrom}–${showingTo} of ${filtered.length}`}
        </Typography>
      </Stack>

      {/* ── Posts Grid ── */}
      {paginated.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, border: '1px dashed', borderColor: 'divider', borderRadius: 3 }}>
          <Article sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary" fontWeight={600} mb={1}>
            {posts.length === 0 ? 'No articles yet' : 'No articles match your filters'}
          </Typography>
          {posts.length === 0 && (
            <Button variant="contained" component={Link} href="/admin/new" sx={{ mt: 1 }}>
              Create your first article
            </Button>
          )}
          {posts.length > 0 && (
            <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => { setStatusFilter('all'); setCategoryFilter('All'); setSearchQuery(''); }}>
              Clear filters
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {paginated.map((post) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
              <Card sx={{
                height: '100%', display: 'flex', flexDirection: 'column',
                border: '1px solid', borderColor: 'divider', boxShadow: 'none',
                borderRadius: 3, overflow: 'hidden', transition: 'border-color 0.2s, transform 0.2s',
                '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' },
              }}>
                {/* Cover */}
                <Box sx={{ height: 160, background: post.cover_gradient || 'linear-gradient(135deg,#4361ee,#7209b7)', position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
                  {post.cover_image && (
                    <Box component="img" src={post.cover_image} alt={post.title}
                      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  )}
                  {/* Overlay so badges are readable */}
                  <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)' }} />
                  <Chip
                    label={post.status}
                    size="small"
                    color={post.status === 'published' ? 'success' : 'default'}
                    sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 700, textTransform: 'capitalize' }}
                  />
                  {post.featured && (
                    <Chip label="★ Featured" size="small" sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 700, bgcolor: 'rgba(255,209,102,0.9)', color: '#7a5800' }} />
                  )}
                </Box>

                {/* Content */}
                <Box sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" color="primary.main" fontWeight={700} display="block" mb={0.75}>
                    {post.category}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.35, mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 'auto' }}>
                    {post.excerpt}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.disabled">{post.read_time}</Typography>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Edit">
                        <IconButton size="small" component={Link} href={`/admin/edit/${post.slug}`}>
                          <Edit fontSize="small" sx={{ color: 'text.secondary' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={post.status === 'published' ? 'Unpublish' : 'Publish'}>
                        <IconButton size="small" onClick={() => handleToggle(post.slug, post.status)}>
                          {post.status === 'published'
                            ? <VisibilityOff fontSize="small" color="warning" />
                            : <Visibility fontSize="small" color="success" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => setDeleteSlug(post.slug)}>
                          <Delete fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ── Pagination ── */}
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, v) => { setPage(v); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={!!deleteSlug} onClose={() => !deleting && setDeleteSlug(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={800}>Delete Article?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">This action cannot be undone. The article will be permanently removed.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteSlug(null)} color="inherit" disabled={deleting}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? <CircularProgress size={18} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
