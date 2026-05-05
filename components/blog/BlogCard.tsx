// @ts-nocheck
'use client';

import {
  Box,
  Chip,
  Typography,
  Avatar,
  Stack,
} from '@mui/material';
import { AccessTime, CalendarToday } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { BlogPost } from '@/data/blogs';

interface BlogCardProps {
  post: BlogPost;
  index: number;
  featured?: boolean;
}

export default function BlogCard({ post, index, featured = false }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      style={{ height: '100%' }}
    >
      <Box
        component={Link}
        href={`/techblog/${post.slug}`}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          textDecoration: 'none',
          transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 24px 48px rgba(67,97,238,0.14)`,
            borderColor: 'primary.main',
          },
        }}
      >
        {/* Cover */}
        <Box
          sx={{
            height: featured ? 220 : 180,
            background: post.coverGradient,
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {/* Decorative pattern */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}
          />
          {/* Grid texture */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
            <Chip
              label={post.category}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.7rem',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            />
          </Box>
          {featured && (
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Chip
                label="✦ Featured"
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              />
            </Box>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {/* Meta row */}
          <Stack direction="row" sx={{ gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 13, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.disabled" fontWeight={500}>
                {post.date}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime sx={{ fontSize: 13, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.disabled" fontWeight={500}>
                {post.readTime}
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
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </Typography>

          {/* Tags */}
          <Stack direction="row" sx={{ gap: 0.75, mb: 2.5, flexWrap: 'wrap' }}>
            {post.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'light'
                      ? 'rgba(67,97,238,0.08)'
                      : 'rgba(67,97,238,0.18)',
                  color: 'primary.main',
                  border: '1px solid',
                  borderColor: 'rgba(67,97,238,0.2)',
                  height: 22,
                }}
              />
            ))}
          </Stack>

          {/* Author */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                background: post.authorGradient,
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              {post.authorInitials}
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.primary" fontWeight={700} display="block">
                {post.author}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {post.authorRole}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
