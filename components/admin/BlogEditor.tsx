// @ts-nocheck
'use client';

import { useState, useRef, useReducer } from 'react';
import {
  Box, TextField, Typography, Button, Stack, IconButton, MenuItem,
  Select, Switch, FormControlLabel, Divider, Paper, Chip, Tooltip,
  Grid, FormControl, InputLabel, CircularProgress, Alert,
} from '@mui/material';
import {
  Delete, ArrowUpward, ArrowDownward, Image as ImageIcon,
  FormatQuote, Code as CodeIcon, VideoLibrary, TextFields,
  Remove, CloudUpload, Save, Publish, Title, Cancel, Close,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import type { BlogPost, ContentBlock, BlockType, UploadResult } from '@/types/blog';

const CATEGORIES = ['Artificial Intelligence', 'Architecture', 'Mobile Dev', 'Cloud Native', 'Cybersecurity', 'Web Development'];
const CATEGORY_COLORS: Record<string, string> = {
  'Artificial Intelligence': '#f72585',
  'Architecture': '#4361ee',
  'Mobile Dev': '#4cc9f0',
  'Cloud Native': '#7209b7',
  'Cybersecurity': '#3f37c9',
  'Web Development': '#4895ef',
};

interface Props { initialData?: BlogPost; isEditing?: boolean; }

function newId() { return Date.now().toString() + Math.random().toString(36).slice(2); }

/** Delete a file from Supabase Storage via our API */
async function deleteStorageFile(path: string): Promise<void> {
  try {
    await fetch('/api/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
  } catch {
    // Non-blocking — UI state is already cleared
  }
}

// ── Content reducer (defined at module scope so it's never re-created) ──
type ContentAction =
  | { type: 'ADD'; blockType: BlockType }
  | { type: 'UPDATE'; id: string; patch: Partial<ContentBlock> }
  | { type: 'REMOVE'; id: string }
  | { type: 'MOVE'; idx: number; dir: 'up' | 'down' }
  | { type: 'SET'; blocks: ContentBlock[] };

function contentReducer(state: ContentBlock[], action: ContentAction): ContentBlock[] {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: newId(), type: action.blockType, content: '', level: action.blockType === 'heading' ? 2 : undefined }];
    case 'UPDATE':
      return state.map(b => b.id === action.id ? { ...b, ...action.patch } : b);
    case 'REMOVE':
      return state.length <= 1 ? state : state.filter(b => b.id !== action.id);
    case 'MOVE': {
      const next = [...state];
      const t = action.dir === 'up' ? action.idx - 1 : action.idx + 1;
      if (t >= 0 && t < next.length) { [next[action.idx], next[t]] = [next[t], next[action.idx]]; }
      return next;
    }
    default:
      return state;
  }
}

export default function BlogEditor({ initialData, isEditing = false }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [title, setTitle] = useState(initialData?.title || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [authorRole, setAuthorRole] = useState(initialData?.authorRole || '');
  const [featured, setFeatured] = useState(initialData?.featured || false);

  // Cover image: track both the public URL (for display) and the storage path (for deletion)
  const [coverImage, setCoverImage] = useState<string | null>(initialData?.coverImage || null);
  const [coverImagePath, setCoverImagePath] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);

  const [content, dispatch] = useReducer(
    contentReducer,
    initialData?.content?.length ? initialData.content : [{ id: newId(), type: 'paragraph', content: '' }]
  );

  // Track which block IDs are currently uploading
  const [uploadingBlocks, setUploadingBlocks] = useState<Set<string>>(new Set());

  const coverRef = useRef<HTMLInputElement>(null);

  // ── Block helpers ──
  const addBlock = (blockType: BlockType) => dispatch({ type: 'ADD', blockType });

  // Plain function — no useCallback needed; dispatch is always stable from useReducer
  const updateBlock = (id: string, patch: Partial<ContentBlock>) =>
    dispatch({ type: 'UPDATE', id, patch });

  const removeBlock = (id: string) => {
    // Side effect MUST happen before dispatch, not inside the reducer
    const block = content.find(b => b.id === id);
    if (block?.type === 'image' && block.path) {
      deleteStorageFile(block.path);
    }
    dispatch({ type: 'REMOVE', id });
  };

  const moveBlock = (idx: number, dir: 'up' | 'down') =>
    dispatch({ type: 'MOVE', idx, dir });

  // ── Upload helpers ──
  const uploadCover = async (file: File) => {
    setCoverUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data: UploadResult & { error?: string } = await res.json();
      if (!res.ok || data.error) {
        setError('Cover upload failed: ' + (data.error || 'Unknown error'));
        return;
      }
      // If there was a previous cover image in storage, delete it
      if (coverImagePath) deleteStorageFile(coverImagePath);
      setCoverImage(data.url);
      setCoverImagePath(data.path);
    } catch {
      setError('Cover upload failed — network error.');
    } finally {
      setCoverUploading(false);
    }
  };

  const removeCover = () => {
    if (coverImagePath) deleteStorageFile(coverImagePath);
    setCoverImage(null);
    setCoverImagePath(null);
    if (coverRef.current) coverRef.current.value = '';
  };

  const uploadBlockImage = async (file: File, blockId: string) => {
    setUploadingBlocks(prev => new Set(prev).add(blockId));
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data: UploadResult & { error?: string } = await res.json();
      if (!res.ok || data.error) {
        setError('Image upload failed: ' + (data.error || 'Unknown error'));
        return;
      }
      updateBlock(blockId, { src: data.url, path: data.path });
    } catch {
      setError('Image upload failed — network error.');
    } finally {
      setUploadingBlocks(prev => { const s = new Set(prev); s.delete(blockId); return s; });
    }
  };

  const removeBlockImage = (block: ContentBlock) => {
    if (block.path) deleteStorageFile(block.path);
    updateBlock(block.id, { src: undefined, path: undefined, caption: undefined });
  };

  // ── Save ──
  const handleSave = async (publish = false) => {
    if (!title.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(''); setSuccess('');

    const payload = {
      title, excerpt, category,
      categoryColor: CATEGORY_COLORS[category] || '#4361ee',
      tags, author, authorRole, featured,
      status: publish ? 'published' : 'draft',
      content, coverImage,
    };

    try {
      const url = isEditing ? `/api/blogs/${(initialData as any).slug}` : '/api/blogs';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Save failed'); return; }
      setSuccess(publish ? 'Published successfully!' : 'Saved as draft!');
      setTimeout(() => router.push('/admin'), 1000);
    } catch { setError('Network error.'); } finally { setSaving(false); }
  };

  // ── Render ──
  return (
    <Box>
      {/* Top Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={900}>{isEditing ? 'Edit Article' : 'New Article'}</Typography>
          <Typography variant="body2" color="text.secondary">Fill in the details and add content blocks below</Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button variant="outlined" startIcon={<Cancel />} onClick={() => router.push('/admin')} disabled={saving}>Cancel</Button>
          <Button variant="outlined" color="inherit" startIcon={<Save />} onClick={() => handleSave(false)} disabled={saving}>
            {saving ? <CircularProgress size={16} /> : 'Save Draft'}
          </Button>
          <Button variant="contained" color="success" startIcon={<Publish />} onClick={() => handleSave(true)} disabled={saving}>
            Publish Now
          </Button>
        </Stack>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Grid container spacing={4}>
        {/* ── LEFT: Content Editor ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Title */}
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <TextField
                fullWidth placeholder="Article title…" variant="standard"
                value={title} onChange={e => setTitle(e.target.value)}
                InputProps={{ disableUnderline: true, style: { fontSize: '1.75rem', fontWeight: 900, lineHeight: 1.2 } }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth placeholder="Short excerpt / subtitle…" multiline rows={2} variant="standard"
                value={excerpt} onChange={e => setExcerpt(e.target.value)}
                InputProps={{ disableUnderline: true }}
              />
            </Paper>

            {/* Cover Image Upload */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: coverImage ? 'primary.main' : 'divider', borderRadius: 3, overflow: 'hidden' }}>
              {coverImage ? (
                <Box sx={{ position: 'relative' }}>
                  <Box component="img" src={coverImage} sx={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }} />
                  <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 1 }}>
                    <Button
                      size="small" variant="contained" component="label"
                      disabled={coverUploading}
                      sx={{ bgcolor: 'rgba(0,0,0,0.65)', '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' }, minWidth: 80 }}
                    >
                      {coverUploading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : 'Change'}
                      <input type="file" hidden accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) uploadCover(f); }} />
                    </Button>
                    <Button
                      size="small" variant="contained" color="error"
                      startIcon={<Close fontSize="small" />}
                      onClick={removeCover}
                      sx={{ bgcolor: 'rgba(220,53,69,0.85)', '&:hover': { bgcolor: 'error.main' } }}
                    >
                      Remove
                    </Button>
                  </Box>
                  {/* Path indicator for debug (small badge) */}
                  {coverImagePath && (
                    <Box sx={{ position: 'absolute', bottom: 8, left: 8, bgcolor: 'rgba(0,0,0,0.5)', borderRadius: 1, px: 1, py: 0.25 }}>
                      <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.65rem' }}>✓ Stored in Supabase</Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{ p: 5, textAlign: 'center', cursor: coverUploading ? 'default' : 'pointer', bgcolor: 'action.hover', '&:hover': { bgcolor: coverUploading ? 'action.hover' : 'action.selected' }, transition: 'background 0.2s' }}
                  onClick={() => !coverUploading && coverRef.current?.click()}
                >
                  {coverUploading ? (
                    <Stack alignItems="center" spacing={1}>
                      <CircularProgress size={36} />
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>Uploading…</Typography>
                    </Stack>
                  ) : (
                    <>
                      <CloudUpload sx={{ fontSize: 44, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>Click to upload cover image</Typography>
                      <Typography variant="caption" color="text.disabled">PNG, JPG, WEBP — recommended 1200×630 — max 10 MB</Typography>
                    </>
                  )}
                  <input ref={coverRef} type="file" hidden accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) uploadCover(f); }} />
                </Box>
              )}
            </Paper>

            {/* Content Blocks */}
            <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 1 }}>Article Content</Typography>

            <Stack spacing={2}>
              {content.map((block, idx) => {
                const isBlockUploading = uploadingBlocks.has(block.id);
                return (
                  <Paper key={block.id} elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, position: 'relative', '&:hover': { borderColor: 'primary.light' }, transition: 'border-color 0.2s' }}>
                    {/* Block top bar */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                      <Chip label={block.type.toUpperCase()} size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', bgcolor: 'rgba(67,97,238,0.08)', color: 'primary.main' }} />
                      <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" onClick={() => moveBlock(idx, 'up')} disabled={idx === 0}><ArrowUpward fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => moveBlock(idx, 'down')} disabled={idx === content.length - 1}><ArrowDownward fontSize="small" /></IconButton>
                        <Tooltip title="Remove block">
                          <IconButton size="small" color="error" onClick={() => removeBlock(block.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>

                    {/* Block editors */}
                    {block.type === 'paragraph' && (
                      <TextField fullWidth multiline minRows={3} placeholder="Start writing…" variant="standard"
                        InputProps={{ disableUnderline: true }} value={block.content}
                        onChange={e => updateBlock(block.id, { content: e.target.value })} />
                    )}

                    {block.type === 'heading' && (
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Select size="small" value={block.level ?? 2} onChange={e => updateBlock(block.id, { level: e.target.value as any })} sx={{ minWidth: 68 }}>
                          <MenuItem value={2}>H2</MenuItem><MenuItem value={3}>H3</MenuItem>
                        </Select>
                        <TextField fullWidth placeholder="Heading…" variant="standard"
                          InputProps={{ disableUnderline: true, style: { fontWeight: 800, fontSize: block.level === 2 ? '1.5rem' : '1.2rem' } }}
                          value={block.content} onChange={e => updateBlock(block.id, { content: e.target.value })} />
                      </Stack>
                    )}

                    {block.type === 'image' && (
                      block.src ? (
                        <Box>
                          <Box sx={{ position: 'relative' }}>
                            <Box component="img" src={block.src} sx={{ width: '100%', borderRadius: 2, mb: 1.5, display: 'block' }} />
                            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.75 }}>
                              <Button
                                size="small" variant="contained" component="label"
                                disabled={isBlockUploading}
                                sx={{ bgcolor: 'rgba(0,0,0,0.65)', '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' }, fontSize: '0.7rem', py: 0.5 }}
                              >
                                {isBlockUploading ? <CircularProgress size={12} sx={{ color: 'white' }} /> : 'Change'}
                                <input type="file" hidden accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) uploadBlockImage(f, block.id); }} />
                              </Button>
                              <Button
                                size="small" variant="contained" color="error"
                                startIcon={<Close sx={{ fontSize: '0.85rem !important' }} />}
                                onClick={() => removeBlockImage(block)}
                                sx={{ bgcolor: 'rgba(220,53,69,0.85)', '&:hover': { bgcolor: 'error.main' }, fontSize: '0.7rem', py: 0.5 }}
                              >
                                Delete
                              </Button>
                            </Box>
                            {block.path && (
                              <Box sx={{ position: 'absolute', bottom: 20, left: 8, bgcolor: 'rgba(0,0,0,0.5)', borderRadius: 1, px: 1, py: 0.25 }}>
                                <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.65rem' }}>✓ Stored in Supabase</Typography>
                              </Box>
                            )}
                          </Box>
                          <TextField fullWidth size="small" placeholder="Image caption (optional)…" variant="outlined"
                            value={block.caption ?? ''} onChange={e => updateBlock(block.id, { caption: e.target.value })} />
                        </Box>
                      ) : (
                        <Button variant="outlined" fullWidth component="label" disabled={isBlockUploading}
                          startIcon={isBlockUploading ? <CircularProgress size={16} /> : <CloudUpload />}
                          sx={{ py: 3, borderStyle: 'dashed', borderRadius: 2 }}>
                          {isBlockUploading ? 'Uploading…' : 'Upload Image'}
                          <input type="file" hidden accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) uploadBlockImage(f, block.id); }} />
                        </Button>
                      )
                    )}

                    {block.type === 'video' && (
                      <Box>
                        <TextField fullWidth placeholder="Paste YouTube / Vimeo URL…" variant="outlined"
                          value={block.embedUrl ?? ''} onChange={e => updateBlock(block.id, { embedUrl: e.target.value })}
                          helperText="Supports YouTube, Vimeo, or direct video URLs" />
                        {block.embedUrl && (
                          <Box sx={{ mt: 2, position: 'relative', pt: '56.25%', borderRadius: 2, overflow: 'hidden', bgcolor: '#000' }}>
                            <Box component="iframe"
                              src={block.embedUrl.includes('youtube') ? `https://www.youtube.com/embed/${block.embedUrl.split('v=')[1]?.split('&')[0] || block.embedUrl.split('/').pop()}` : block.embedUrl}
                              sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                              allowFullScreen />
                          </Box>
                        )}
                      </Box>
                    )}

                    {block.type === 'quote' && (
                      <Stack spacing={1.5}>
                        <TextField fullWidth multiline rows={2} placeholder="Quote text…" variant="outlined"
                          value={block.content ?? ''} onChange={e => updateBlock(block.id, { content: e.target.value })}
                          sx={{ fontStyle: 'italic' }} />
                        <TextField fullWidth size="small" placeholder="— Quote author (optional)" variant="outlined"
                          value={block.quoteAuthor ?? ''} onChange={e => updateBlock(block.id, { quoteAuthor: e.target.value })} />
                      </Stack>
                    )}

                    {block.type === 'code' && (
                      <Stack spacing={1.5}>
                        <Select size="small" value={block.language || 'typescript'} onChange={e => updateBlock(block.id, { language: e.target.value })} sx={{ width: 140 }}>
                          {['typescript', 'javascript', 'jsx', 'tsx', 'python', 'css', 'html', 'bash', 'json', 'sql'].map(l => (
                            <MenuItem key={l} value={l}>{l}</MenuItem>
                          ))}
                        </Select>
                        <TextField fullWidth multiline minRows={5} placeholder="Paste code here…"
                          value={block.content ?? ''} onChange={e => updateBlock(block.id, { content: e.target.value })}
                          sx={{ '& textarea': { fontFamily: 'JetBrains Mono, Consolas, monospace', fontSize: '0.85rem' } }} />
                      </Stack>
                    )}

                    {block.type === 'divider' && (
                      <Box sx={{ py: 1 }}><Divider /></Box>
                    )}
                  </Paper>
                );
              })}

              {/* Add Block Toolbar */}
              <Paper elevation={0} sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 2.5, bgcolor: 'action.hover' }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" textAlign="center" mb={1.5}>
                  + ADD CONTENT BLOCK
                </Typography>
                <Stack direction="row" flexWrap="wrap" justifyContent="center" sx={{ gap: 1 }}>
                  {([
                    { type: 'paragraph', icon: <TextFields />, label: 'Paragraph' },
                    { type: 'heading', icon: <Title />, label: 'Heading' },
                    { type: 'image', icon: <ImageIcon />, label: 'Image' },
                    { type: 'video', icon: <VideoLibrary />, label: 'Video' },
                    { type: 'quote', icon: <FormatQuote />, label: 'Quote' },
                    { type: 'code', icon: <CodeIcon />, label: 'Code' },
                    { type: 'divider', icon: <Remove />, label: 'Divider' },
                  ] as const).map(({ type, icon, label }) => (
                    <Tooltip key={type} title={label}>
                      <Button size="small" startIcon={icon} onClick={() => addBlock(type as BlockType)}
                        sx={{ borderRadius: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', color: 'text.secondary', '&:hover': { color: 'primary.main', borderColor: 'primary.main' } }}>
                        {label}
                      </Button>
                    </Tooltip>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Stack>
        </Grid>

        {/* ── RIGHT: Metadata Sidebar ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3} sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.07em' }} mb={2.5}>
                Publish Settings
              </Typography>

              <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                <InputLabel>Category</InputLabel>
                <Select value={category} label="Category" onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>

              <Typography variant="caption" fontWeight={700} color="text.secondary">TAGS (press Enter to add)</Typography>
              <TextField
                fullWidth size="small" placeholder="e.g. Next.js" value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    e.preventDefault();
                    if (!tags.includes(tagInput.trim())) setTags(prev => [...prev, tagInput.trim()]);
                    setTagInput('');
                  }
                }}
                sx={{ mt: 1, mb: 1.5 }}
              />
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.75, mb: 2.5 }}>
                {tags.map(tag => (
                  <Chip key={tag} label={tag} size="small" onDelete={() => setTags(prev => prev.filter(t => t !== tag))} />
                ))}
              </Stack>

              <FormControlLabel
                control={<Switch checked={featured} onChange={e => setFeatured(e.target.checked)} />}
                label={<Typography variant="body2" fontWeight={600}>Featured Article</Typography>}
              />
            </Paper>

            {/* Author */}
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.07em' }} mb={2.5}>
                Author
              </Typography>
              <TextField fullWidth size="small" label="Full Name" value={author} onChange={e => setAuthor(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth size="small" label="Role / Title" value={authorRole} onChange={e => setAuthorRole(e.target.value)} />
            </Paper>

            {/* Quick Actions */}
            <Stack spacing={1.5}>
              <Button fullWidth variant="contained" color="success" size="large" startIcon={<Publish />} onClick={() => handleSave(true)} disabled={saving}>
                {saving ? <CircularProgress size={20} color="inherit" /> : 'Publish Now'}
              </Button>
              <Button fullWidth variant="outlined" startIcon={<Save />} onClick={() => handleSave(false)} disabled={saving}>
                Save as Draft
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
