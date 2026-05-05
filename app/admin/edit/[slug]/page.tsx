// @ts-nocheck
import BlogEditor from '@/components/admin/BlogEditor';
import { readPosts } from '@/lib/blogs';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = readPosts().find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <BlogEditor initialData={post} isEditing />;
}
