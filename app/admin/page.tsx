// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, Button, Chip, Stack,
  IconButton, Tabs, Tab, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Avatar, Divider,
} from '@mui/material';
import {
  Add, Edit, Delete, Visibility, VisibilityOff,
  TrendingUp, Article, Star,
} from '@mui/icons-material';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';

type SupabaseBlog = {
  id: string; slug: string; title: string; excerpt: string;
  category: string; cover_gradient: string; cover_image: string | null;
  status: string; featured: boolean; published_date: string; read_time: string;
};

export default function AdminDashboard() {
  const [posts, setPosts] = useState<SupabaseBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs?all=1');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

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
    await fetch(`/api/blogs/${deleteSlug}`, { method: 'DELETE' });
    setDeleteSlug(null);
    fetchPosts();
  };

  const filtered = posts.filter(p => filter === 'all' || p.status === filter);
  const published = posts.filter(p => p.status === 'published').length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="text.primary">Dashboard</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your blog articles and publishing workflow
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} component={Link} href="/admin/new" sx={{ px: 3 }}>
          New Article
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          { label: 'Total Articles', value: posts.length, icon: <Article />, color: '#4361ee' },
          { label: 'Published', value: published, icon: <Visibility />, color: '#06d6a0' },
          { label: 'Drafts', value: posts.length - published, icon: <VisibilityOff />, color: '#f72585' },
          { label: 'Featured', value: posts.filter(p => p.featured).length, icon: <Star />, color: '#ffd166' },
        ].map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
            <Card sx={{ p: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${stat.color}18` }}>
                <Box sx={{ color: stat.color }}>{stat.icon}</Box>
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>{stat.label}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={filter} onChange={(_, v) => setFilter(v)}>
          <Tab label={`All (${posts.length})`} value="all" sx={{ fontWeight: 600 }} />
          <Tab label={`Published (${published})`} value="published" sx={{ fontWeight: 600 }} />
          <Tab label={`Drafts (${posts.length - published})`} value="draft" sx={{ fontWeight: 600 }} />
        </Tabs>
      </Box>

      {/* Posts Grid */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography color="text.secondary">No articles here yet.</Typography>
          <Button variant="contained" component={Link} href="/admin/new" sx={{ mt: 2 }}>
            Create your first article
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((post) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 3, overflow: 'hidden', transition: 'border-color 0.2s', '&:hover': { borderColor: 'primary.main' } }}>
                {/* Cover */}
                <Box sx={{ height: 130, background: post.cover_image ? 'none' : post.cover_gradient, position: 'relative', flexShrink: 0 }}>
                  {post.cover_image && <Box component="img" src={post.cover_image} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
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
                      <IconButton size="small" component={Link} href={`/admin/edit/${post.slug}`} title="Edit">
                        <Edit fontSize="small" sx={{ color: 'text.secondary' }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleToggle(post.slug, post.status)} title={post.status === 'published' ? 'Unpublish' : 'Publish'}>
                        {post.status === 'published' ? <VisibilityOff fontSize="small" color="warning" /> : <Visibility fontSize="small" color="success" />}
                      </IconButton>
                      <IconButton size="small" onClick={() => setDeleteSlug(post.slug)} title="Delete">
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirm */}
      <Dialog open={!!deleteSlug} onClose={() => setDeleteSlug(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={800}>Delete Article?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteSlug(null)} color="inherit">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
