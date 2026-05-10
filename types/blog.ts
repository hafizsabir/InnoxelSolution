export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'image'
  | 'video'
  | 'quote'
  | 'code'
  | 'divider';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content?: string;
  level?: 2 | 3;
  src?: string;
  /** Supabase Storage path for this image block (used to delete the file) */
  path?: string;
  embedUrl?: string;
  caption?: string;
  language?: string;
  quoteAuthor?: string;
}

export interface UploadResult {
  url: string;
  path: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  coverImage?: string | null;
  coverGradient: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  authorInitials: string;
  authorGradient: string;
  tags: string[];
  featured: boolean;
  status: 'published' | 'draft';
  content: ContentBlock[];
  createdAt: string;
  updatedAt: string;
  view_count?: number;
}
