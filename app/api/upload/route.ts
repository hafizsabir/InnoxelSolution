import { NextResponse, type NextRequest } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const BUCKET = 'blog-media';

// POST /api/upload — upload a file to Supabase Storage
export async function POST(req: NextRequest) {
  try {
    // 1. Verify the user is authenticated (anon client reads session cookie)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Use service-role client for storage — bypasses RLS on the bucket
    const adminClient = createAdminClient();
    const { data, error } = await adminClient.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('[upload] Supabase storage error:', JSON.stringify(error));
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: { publicUrl } } = adminClient.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    // Return both the public URL and the storage path (needed for deletion)
    return NextResponse.json({ url: publicUrl, path: data.path });
  } catch (err) {
    console.error('[upload POST]', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// DELETE /api/upload — remove a file from Supabase Storage
// Body: { path: string }
export async function DELETE(req: NextRequest) {
  try {
    // 1. Verify authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { path } = await req.json() as { path?: string };
    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'path is required' }, { status: 400 });
    }

    // Prevent path traversal — only allow simple filenames
    const safePath = path.replace(/[^a-zA-Z0-9._\-\/]/g, '');
    if (safePath !== path) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    // 2. Use service-role client to delete
    const adminClient = createAdminClient();
    const { error } = await adminClient.storage
      .from(BUCKET)
      .remove([safePath]);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[upload DELETE]', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
