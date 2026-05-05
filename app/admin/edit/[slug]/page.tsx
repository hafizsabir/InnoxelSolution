// @ts-nocheck
import BlogEditor from '@/components/admin/BlogEditor';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post) notFound();

  // Map Supabase snake_case to camelCase for BlogEditor
  const initialData = {
    ...post,
    categoryColor: post.category_color,
    coverImage: post.cover_image,
    coverGradient: post.cover_gradient,
    authorRole: post.author_role,
    authorInitials: post.author_initials,
    authorGradient: post.author_gradient,
  };

  return <BlogEditor initialData={initialData} isEditing />;
}
