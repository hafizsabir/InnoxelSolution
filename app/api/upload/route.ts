import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    mkdirSync(uploadDir, { recursive: true });

    const ext = file.name.split('.').pop() ?? 'bin';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    writeFileSync(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
