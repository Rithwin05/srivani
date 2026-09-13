import { getObject } from '@/lib/storage';

export async function GET(_req, { params }) {
  const { path } = await params;
  const obj = await getObject(path.join('/')).catch(() => null);
  if (!obj) return new Response('Not found', { status: 404 });
  return new Response(obj.buffer, {
    headers: { 'Content-Type': obj.contentType, 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
