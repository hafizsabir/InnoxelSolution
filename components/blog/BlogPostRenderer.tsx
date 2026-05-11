// @ts-nocheck
'use client';

import { Box, Typography, Divider, Paper } from '@mui/material';
import type { ContentBlock } from '@/types/blog';

export default function BlogPostRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <Box>
      {blocks.map((block) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <Typography
                key={block.id}
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  mb: 3,
                  fontSize: '1.1rem',
                  color: 'text.secondary',
                }}
              >
                {block.content}
              </Typography>
            );

          case 'heading':
            return (
              <Typography
                key={block.id}
                variant={block.level === 2 ? 'h4' : 'h5'}
                sx={{
                  fontWeight: 800,
                  mt: 6,
                  mb: 3,
                  color: 'text.primary',
                }}
              >
                {block.content}
              </Typography>
            );

          case 'image':
            return (
              <Box key={block.id} sx={{ my: 5 }}>
                <Box
                  component="img"
                  src={block.src}
                  alt={block.caption || 'Blog image'}
                  sx={{
                    width: '100%',
                    borderRadius: 4,
                    display: 'block',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  }}
                />
                {block.caption && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      mt: 2,
                      color: 'text.disabled',
                      fontStyle: 'italic',
                    }}
                  >
                    {block.caption}
                  </Typography>
                )}
              </Box>
            );

          case 'video':
            // Basic support for YouTube/Vimeo embeds
            const isYoutube = block.embedUrl?.includes('youtube.com') || block.embedUrl?.includes('youtu.be');
            let finalUrl = block.embedUrl;
            if (isYoutube) {
              const id = block.embedUrl.split('v=')[1] || block.embedUrl.split('/').pop();
              finalUrl = `https://www.youtube.com/embed/${id}`;
            }

            return (
              <Box
                key={block.id}
                sx={{
                  my: 5,
                  position: 'relative',
                  pt: '56.25%', // 16:9 Aspect Ratio
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
              >
                <Box
                  component="iframe"
                  src={finalUrl}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allowFullScreen
                />
              </Box>
            );

          case 'quote':
            return (
              <Box
                key={block.id}
                sx={{
                  my: 5,
                  pl: 4,
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  position: 'relative',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontStyle: 'italic',
                    fontWeight: 500,
                    lineHeight: 1.5,
                    color: 'text.primary',
                    mb: 2,
                  }}
                >
                  "{block.content}"
                </Typography>
                {block.quoteAuthor && (
                  <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                    — {block.quoteAuthor}
                  </Typography>
                )}
              </Box>
            );

          case 'code':
            return (
              <Paper
                key={block.id}
                sx={{
                  my: 4,
                  p: 3,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : '#1e1e1e',
                  borderRadius: 3,
                  overflowX: 'auto',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 700, textTransform: 'uppercase' }}>
                    {block.language || 'typescript'}
                  </Typography>
                </Box>
                <Box
                  component="pre"
                  sx={{
                    m: 0,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.9rem',
                    color: '#e8eaf6',
                    lineHeight: 1.6,
                  }}
                >
                  <code>{block.content}</code>
                </Box>
              </Paper>
            );

          case 'divider':
            return <Divider key={block.id} sx={{ my: 6, borderBottomWidth: 2, opacity: 0.5 }} />;

          default:
            return null;
        }
      })}
    </Box>
  );
}
