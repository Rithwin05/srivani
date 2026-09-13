import 'server-only';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

const base = ((process.env.INTEGRATION_PROXY_URL || '').trim() || 'https://integrations.emergentagent.com').replace(/\/$/, '');
const STORAGE_URL = `${base}/objstore/api/v1/storage`;
const APP = 'srivani';
const cache = globalThis.__srivaniStorage || (globalThis.__srivaniStorage = { key: null });

async function initStorage(force = false) {
  if (cache.key && !force) return cache.key;
  const res = await fetch(`${STORAGE_URL}/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emergent_key: process.env.EMERGENT_LLM_KEY }),
  });
  if (!res.ok) throw new Error(`storage init failed: ${res.status}`);
  cache.key = (await res.json()).storage_key;
  return cache.key;
}

export async function putObject(path, data, contentType) {
  const key = await initStorage();
  const res = await fetch(`${STORAGE_URL}/objects/${path}`, {
    method: 'PUT',
    headers: { 'X-Storage-Key': key, 'Content-Type': contentType },
    body: data,
  });
  if (!res.ok) throw new Error(`upload failed: ${res.status}`);
  return res.json();
}

export async function getObject(path) {
  let key = await initStorage();
  let res = await fetch(`${STORAGE_URL}/objects/${path}`, { headers: { 'X-Storage-Key': key }, cache: 'no-store' });
  if (res.status === 404) {
    key = await initStorage(true);
    res = await fetch(`${STORAGE_URL}/objects/${path}`, { headers: { 'X-Storage-Key': key }, cache: 'no-store' });
  }
  if (!res.ok) return null;
  return { buffer: Buffer.from(await res.arrayBuffer()), contentType: res.headers.get('content-type') || 'application/octet-stream' };
}

// Creates original + optimized (900px webp) + thumbnail (360px webp). Returns /media/... paths.
export async function uploadProductImage(file) {
  const id = randomUUID();
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const dir = `${APP}/products/${id}`;
  const [main, thumb] = await Promise.all([
    sharp(buf).rotate().resize({ width: 900, height: 1200, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer(),
    sharp(buf).rotate().resize({ width: 360, height: 480, fit: 'inside', withoutEnlargement: true }).webp({ quality: 78 }).toBuffer(),
  ]);
  await Promise.all([
    putObject(`${dir}/original.${ext}`, buf, file.type || 'application/octet-stream'),
    putObject(`${dir}/main.webp`, main, 'image/webp'),
    putObject(`${dir}/thumb.webp`, thumb, 'image/webp'),
  ]);
  return { image: `/media/${dir}/main.webp`, thumb: `/media/${dir}/thumb.webp`, original: `/media/${dir}/original.${ext}` };
}

export async function uploadAttachment(file) {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const path = `${APP}/enquiries/${randomUUID()}.${ext}`;
  await putObject(path, Buffer.from(await file.arrayBuffer()), file.type || 'application/octet-stream');
  return `/media/${path}`;
}
