import fs from 'fs';
import path from 'path';
import type { BlogPost } from '@/types/blog';

const DB_PATH = path.join(process.cwd(), 'data', 'blog-posts.json');

export function readPosts(): BlogPost[] {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

export function writePosts(posts: BlogPost[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(posts, null, 2));
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function calcReadTime(content: BlogPost['content']): string {
  const words = content.reduce((acc, b) => acc + (b.content?.split(' ').length ?? 0), 0);
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
