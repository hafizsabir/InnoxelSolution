// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  TrendingUp,
} from '@mui/icons-material';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs?all=1');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleTogglePublish = async (slug: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await fetch(`/api/blogs/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/blogs/${deleteId}`, { method: 'DELETE' });
      setDeleteId(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>Blog Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Manage your articles and publishing workflow</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          href="/admin/new"
          sx={{ px: 3, py: 1.2 }}
        >
          New Post
        </Button>
      </Box>

      {/* Stats Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Posts', value: posts.length, icon: <TrendingUp color="primary" /> },
          { label: 'Published', value: posts.filter(p => p.status === 'published').length, icon: <Visibility color="success" /> },
          { label: 'Drafts', value: posts.filter(p => p.status === 'draft').length, icon: <VisibilityOff color="warning" /> },
        ].map((stat, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>{stat.icon}</Box>
              <Box>
                <Typography variant="h5" fontWeight={800}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>{stat.label}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={filter} onChange={(_, v) => setFilter(v)} color="primary">
          <Tab label={`All (${posts.length})`} value="all" sx={{ fontWeight: 600 }} />
          <Tab label="Published" value="published" sx={{ fontWeight: 600 }} />
          <Tab label="Drafts" value="draft" sx={{ fontWeight: 600 }} />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {filteredPosts.map((post) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              border: '1px solid', 
              borderColor: 'divider', 
              boxShadow: 'none',
              borderRadius: 3,
              overflow: 'hidden',
              '&:hover': { borderColor: 'primary.main' }
            }}>
              <Box sx={{ height: 140, background: post.coverGradient, position: 'relative' }}>
                <Chip
                  label={post.status}
                  size="small"
                  color={post.status === 'published' ? 'success' : 'warning'}
                  sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700, textTransform: 'capitalize' }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Typography variant="caption" color="primary.main" fontWeight={700} sx={{ display: 'block', mb: 1 }}>
                  {post.category}
                </Typography>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 1, lineHeight: 1.3, height: 50, overflow: 'hidden' }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
                  {post.excerpt}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <IconButton 
                    size="small" 
                    color="primary" 
                    component={Link} 
                    href={`/admin/edit/${post.slug}`}
                    title="Edit"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color={post.status === 'published' ? 'warning' : 'success'}
                    onClick={() => handleTogglePublish(post.slug, post.status)}
                    title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {post.status === 'published' ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => setDeleteId(post.slug)}
                    title="Delete"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Article?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this article? This action cannot be undone.
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteId(null)} color="inherit">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
