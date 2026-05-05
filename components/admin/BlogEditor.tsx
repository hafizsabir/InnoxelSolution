// @ts-nocheck
'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  Stack,
  Card,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Chip,
  Avatar,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Add,
  Delete,
  ArrowUpward,
  ArrowDownward,
  Image as ImageIcon,
  FormatListBulleted,
  FormatQuote,
  Code as CodeIcon,
  VideoLibrary,
  TextFields,
  Remove,
  CloudUpload,
  Save,
  Publish,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import type { BlogPost, ContentBlock, BlockType } from '@/types/blog';

interface BlogEditorProps {
  initialData?: BlogPost;
  isEditing?: boolean;
}

const CATEGORIES = ['Artificial Intelligence', 'Architecture', 'Mobile Dev', 'Cloud Native', 'Cybersecurity', 'Web Development'];
const CATEGORY_COLORS = {
  'Artificial Intelligence': '#f72585',
  'Architecture': '#4361ee',
  'Mobile Dev': '#4cc9f0',
  'Cloud Native': '#7209b7',
  'Cybersecurity': '#3f37c9',
  'Web Development': '#4895ef',
};

export default function BlogEditor({ initialData, isEditing = false }: BlogEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [author, setAuthor] = useState(initialData?.author || 'Arslan Mehmood');
  const [authorRole, setAuthorRole] = useState(initialData?.authorRole || 'Lead Engineer');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [status, setStatus] = useState<'published' | 'draft'>(initialData?.status || 'draft');
  const [content, setContent] = useState<ContentBlock[]>(initialData?.content || [
    { id: '1', type: 'paragraph', content: '' }
  ]);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      level: type === 'heading' ? 2 : undefined,
    };
    setContent([...content, newBlock]);
  };

  const handleUpdateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setContent(content.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const handleRemoveBlock = (id: string) => {
    if (content.length > 1) {
      setContent(content.filter(b => b.id !== id));
    }
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newContent = [...content];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newContent.length) {
      [newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]];
      setContent(newContent);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        if (blockId) {
          handleUpdateBlock(blockId, { src: data.url });
        } else {
          setCoverImage(data.url);
        }
      }
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const handleSave = async (forcePublish = false) => {
    setLoading(true);
    const finalStatus = forcePublish ? 'published' : status;
    const postData = {
      title,
      excerpt,
      category,
      categoryColor: CATEGORY_COLORS[category] || '#4361ee',
      tags,
      author,
      authorRole,
      featured,
      status: finalStatus,
      content,
      coverImage,
    };

    try {
      const url = isEditing ? `/api/blogs/${initialData.slug}` : '/api/blogs';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={900}>
          {isEditing ? 'Edit Article' : 'Create New Article'}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => router.push('/admin')}>Cancel</Button>
          <Button 
            variant="contained" 
            startIcon={<Save />} 
            onClick={() => handleSave(false)}
            disabled={loading}
          >
            {isEditing ? 'Update Draft' : 'Save Draft'}
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<Publish />} 
            onClick={() => handleSave(true)}
            disabled={loading}
          >
            Publish Now
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Main Details */}
            <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, boxShadow: 'none' }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: 'text.secondary', textTransform: 'uppercase' }}>
                Basic Information
              </Typography>
              <TextField
                fullWidth
                label="Article Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 3 }}
                inputProps={{ style: { fontWeight: 700, fontSize: '1.25rem' } }}
              />
              <TextField
                fullWidth
                label="Short Excerpt"
                multiline
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                sx={{ mb: 3 }}
              />
              
              <Box 
                sx={{ 
                  p: 3, 
                  border: '2px dashed', 
                  borderColor: coverImage ? 'primary.main' : 'divider', 
                  borderRadius: 2, 
                  textAlign: 'center',
                  bgcolor: 'action.hover',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  hidden 
                  onChange={(e) => handleFileUpload(e)} 
                  accept="image/*"
                />
                {coverImage ? (
                  <Box component="img" src={coverImage} sx={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 1 }} />
                ) : (
                  <Box>
                    <CloudUpload sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">Click to upload cover image (optional)</Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Block Editor */}
            <Typography variant="h6" fontWeight={800}>Article Content</Typography>
            
            {content.map((block, index) => (
              <Box key={block.id} sx={{ position: 'relative', '&:hover .block-actions': { opacity: 1 } }}>
                <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, boxShadow: 'none' }}>
                  {/* Block Actions */}
                  <Stack 
                    className="block-actions"
                    direction="row" 
                    spacing={0.5} 
                    sx={{ 
                      position: 'absolute', 
                      right: -50, 
                      top: 0, 
                      opacity: 0, 
                      transition: 'opacity 0.2s',
                      display: { xs: 'none', md: 'flex' },
                      flexDirection: 'column'
                    }}
                  >
                    <IconButton size="small" onClick={() => handleMoveBlock(index, 'up')} disabled={index === 0}><ArrowUpward fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => handleMoveBlock(index, 'down')} disabled={index === content.length - 1}><ArrowDownward fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleRemoveBlock(block.id)}><Delete fontSize="small" /></IconButton>
                  </Stack>

                  {block.type === 'paragraph' && (
                    <TextField
                      fullWidth
                      multiline
                      placeholder="Start writing..."
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      value={block.content}
                      onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                    />
                  )}

                  {block.type === 'heading' && (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Select
                        size="small"
                        value={block.level}
                        onChange={(e) => handleUpdateBlock(block.id, { level: e.target.value as any })}
                        sx={{ minWidth: 70 }}
                      >
                        <MenuItem value={2}>H2</MenuItem>
                        <MenuItem value={3}>H3</MenuItem>
                      </Select>
                      <TextField
                        fullWidth
                        placeholder="Heading text..."
                        variant="standard"
                        InputProps={{ disableUnderline: true, style: { fontWeight: 800, fontSize: block.level === 2 ? '1.5rem' : '1.25rem' } }}
                        value={block.content}
                        onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                      />
                    </Stack>
                  )}

                  {block.type === 'image' && (
                    <Box>
                      {block.src ? (
                        <Box>
                          <Box component="img" src={block.src} sx={{ width: '100%', borderRadius: 1, mb: 1 }} />
                          <TextField
                            fullWidth
                            placeholder="Image caption..."
                            variant="standard"
                            size="small"
                            value={block.caption}
                            onChange={(e) => handleUpdateBlock(block.id, { caption: e.target.value })}
                          />
                        </Box>
                      ) : (
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<CloudUpload />}
                          component="label"
                          sx={{ py: 3, borderStyle: 'dashed' }}
                        >
                          Upload Image
                          <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, block.id)} />
                        </Button>
                      )}
                    </Box>
                  )}

                  {block.type === 'video' && (
                    <TextField
                      fullWidth
                      placeholder="Paste YouTube or Video URL..."
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      value={block.embedUrl}
                      onChange={(e) => handleUpdateBlock(block.id, { embedUrl: e.target.value })}
                    />
                  )}

                  {block.type === 'quote' && (
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        multiline
                        placeholder="Quote text..."
                        variant="standard"
                        InputProps={{ disableUnderline: true, style: { fontStyle: 'italic', fontSize: '1.1rem' } }}
                        value={block.content}
                        onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        placeholder="Author (optional)"
                        variant="standard"
                        size="small"
                        value={block.quoteAuthor}
                        onChange={(e) => handleUpdateBlock(block.id, { quoteAuthor: e.target.value })}
                      />
                    </Stack>
                  )}

                  {block.type === 'code' && (
                    <Stack spacing={1}>
                      <Select
                        size="small"
                        value={block.language || 'typescript'}
                        onChange={(e) => handleUpdateBlock(block.id, { language: e.target.value })}
                        sx={{ width: 120 }}
                      >
                        <MenuItem value="typescript">TypeScript</MenuItem>
                        <MenuItem value="javascript">JavaScript</MenuItem>
                        <MenuItem value="jsx">JSX / TSX</MenuItem>
                        <MenuItem value="css">CSS</MenuItem>
                        <MenuItem value="bash">Bash</MenuItem>
                      </Select>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Paste code here..."
                        variant="outlined"
                        sx={{ fontFamily: 'monospace', bgcolor: 'action.hover' }}
                        value={block.content}
                        onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                      />
                    </Stack>
                  )}

                  {block.type === 'divider' && (
                    <Box sx={{ py: 2 }}><Divider sx={{ borderBottomWidth: 2 }} /></Box>
                  )}
                </Paper>
              </Box>
            ))}

            {/* Block Adders */}
            <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'action.hover' }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1, textAlign: 'center' }}>
                ADD CONTENT BLOCK
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap gap={1}>
                <Tooltip title="Paragraph"><IconButton size="small" onClick={() => handleAddBlock('paragraph')} color="primary"><TextFields fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Heading"><IconButton size="small" onClick={() => handleAddBlock('heading')} color="primary"><FormatListBulleted fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Image"><IconButton size="small" onClick={() => handleAddBlock('image')} color="primary"><ImageIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Video"><IconButton size="small" onClick={() => handleAddBlock('video')} color="primary"><VideoLibrary fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Quote"><IconButton size="small" onClick={() => handleAddBlock('quote')} color="primary"><FormatQuote fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Code"><IconButton size="small" onClick={() => handleAddBlock('code')} color="primary"><CodeIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Divider"><IconButton size="small" onClick={() => handleAddBlock('divider')} color="primary"><Remove fontSize="small" /></IconButton></Tooltip>
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3} sx={{ position: 'sticky', top: 100 }}>
            <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, boxShadow: 'none' }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: 'text.secondary' }}>PUBLISH SETTINGS</Typography>
              
              <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <InputLabel>Category</InputLabel>
                <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </Select>
              </FormControl>

              <Typography variant="caption" fontWeight={700} color="text.secondary">TAGS (Enter to add)</Typography>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="e.g. Next.js"
                  sx={{ mt: 1 }}
                />
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap gap={1} sx={{ mt: 1.5 }}>
                  {tags.map(tag => (
                    <Chip key={tag} label={tag} size="small" onDelete={() => setTags(tags.filter(t => t !== tag))} />
                  ))}
                </Stack>
              </Box>

              <FormControlLabel
                control={<Switch checked={featured} onChange={(e) => setFeatured(e.target.checked)} />}
                label={<Typography variant="body2" fontWeight={600}>Featured Article</Typography>}
                sx={{ mb: 2 }}
              />

              <Divider sx={{ my: 2 }} />

              <Typography variant="caption" fontWeight={700} color="text.secondary">AUTHOR</Typography>
              <TextField
                fullWidth
                size="small"
                label="Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                sx={{ mt: 1, mb: 2 }}
              />
              <TextField
                fullWidth
                size="small"
                label="Role"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
              />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
