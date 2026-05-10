// @ts-nocheck
'use client';

import { Box, Chip, Typography, Avatar, Stack } from '@mui/material';
import { AccessTime, CalendarToday, Visibility } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface BlogCardProps {
  post: any; // Supabase snake_case fields
  index: number;
  featured?: boolean;
}

export default function BlogCard({ post, index, featured = false }: BlogCardProps) {
  // Support both snake_case (Supabase) and camelCase (static data)
  const coverImage = post.cover_image || post.coverImage || null;
  const coverGradient = post.cover_gradient || post.coverGradient || 'linear-gradient(135deg, #4361ee 0%, #7209b7 100%)';
  const readTime = post.read_time || post.readTime || '';
  const publishedDate = post.published_date || post.date || '';
  const authorGradient = post.author_gradient || post.authorGradient || 'linear-gradient(135deg, #4361ee, #7209b7)';
  const authorInitials = post.author_initials || post.authorInitials || (post.author || 'A').slice(0, 2).toUpperCase();
  const authorRole = post.author_role || post.authorRole || '';
  const viewCount: number = post.view_count ?? 0;
  const formatViews = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ height: '100%' }}
    >
      <Box
        component={Link}
        href={`/techblog/${post.slug}`}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          textDecoration: 'none',
          transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 24px 48px rgba(67,97,238,0.14)',
            borderColor: 'primary.main',
          },
        }}
      >
        {/* ── Cover ── */}
        <Box
          sx={{
            height: featured ? 240 : 190,
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
            background: coverGradient,
          }}
        >
          {/* Actual uploaded image */}
          {coverImage && (
            <Box
              component="img"
              src={coverImage}
              alt={post.title}
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          )}

          {/* Gradient overlay so badges are readable over images */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: coverImage
                ? 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 60%, transparent 100%)'
                : 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)',
            }}
          />

          {/* Grid texture (only when no image) */}
          {!coverImage && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
          )}

          {/* Category badge */}
          <Box sx={{ position: 'absolute', top: 14, left: 14 }}>
            <Chip
              label={post.category}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.7rem',
                border: '1px solid rgba(255,255,255,0.35)',
              }}
            />
          </Box>

          {/* Featured badge */}
          {featured && (
            <Box sx={{ position: 'absolute', top: 14, right: 14 }}>
              <Chip
                label="✦ Featured"
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              />
            </Box>
          )}

          {/* Read time pinned to bottom-right over image */}
          {coverImage && readTime && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(6px)',
                borderRadius: 99,
                px: 1.25,
                py: 0.4,
              }}
            >
              <AccessTime sx={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.68rem', fontWeight: 600 }}>
                {readTime}
              </Typography>
            </Box>
          )}
        </Box>

        {/* ── Content ── */}
        <Box sx={{ p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {/* Meta row */}
          <Stack direction="row" sx={{ gap: 1.5, mb: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 13, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.disabled" fontWeight={500}>
                {publishedDate}
              </Typography>
            </Box>
            {!coverImage && readTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTime sx={{ fontSize: 13, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.disabled" fontWeight={500}>
                  {readTime}
                </Typography>
              </Box>
            )}
            {/* View count pill */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.4,
                px: 1,
                py: 0.25,
                borderRadius: 99,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(67,97,238,0.15)'
                    : 'rgba(67,97,238,0.08)',
                border: '1px solid rgba(67,97,238,0.18)',
                ml: 'auto',
              }}
            >
              <Visibility sx={{ fontSize: 11, color: 'primary.main' }} />
              <Typography
                variant="caption"
                fontWeight={700}
                color="primary.main"
                sx={{ fontSize: '0.67rem', lineHeight: 1 }}
              >
                {formatViews(viewCount)}
              </Typography>
            </Box>
          </Stack>

          {/* Title */}
          <Typography
            variant={featured ? 'h6' : 'subtitle1'}
            color="text.primary"
            sx={{
              fontWeight: 800,
              lineHeight: 1.35,
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.title}
          </Typography>

          {/* Excerpt */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.75,
              mb: 2.5,
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: featured ? 4 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </Typography>

          {/* Tags */}
          {(post.tags || []).length > 0 && (
            <Stack direction="row" sx={{ gap: 0.75, mb: 2.5, flexWrap: 'wrap' }}>
              {(post.tags || []).slice(0, 3).map((tag: string) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    bgcolor: (theme) =>
                      theme.palette.mode === 'light' ? 'rgba(67,97,238,0.08)' : 'rgba(67,97,238,0.18)',
                    color: 'primary.main',
                    border: '1px solid rgba(67,97,238,0.2)',
                    height: 22,
                  }}
                />
              ))}
            </Stack>
          )}

          {/* Author */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              mt: 'auto',
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: authorGradient,
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {authorInitials}
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.primary" fontWeight={700} display="block">
                {post.author}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {authorRole}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
