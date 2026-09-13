'use server';
import Papa from 'papaparse';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { saveProduct, deleteProduct, setFlags, upsertBySku } from '@/lib/products';
import { saveOffer, deleteOffer, updateSettings, setEnquiryStatus } from '@/lib/store';
import { uploadProductImage } from '@/lib/storage';
import { seedDemo } from '@/lib/seed';

const refresh = () => revalidatePath('/', 'layout');
const str = (fd, k) => (fd.get(k) ?? '').toString();
const bool = (fd, k) => fd.get(k) === 'on' || fd.get(k) === 'true';

export async function saveProductAction(formData) {
  await requireAdmin();
  const input = {
    id: str(formData, 'id') || undefined,
    sku: str(formData, 'sku'), name: str(formData, 'name'), author: str(formData, 'author'), publisher: str(formData, 'publisher'),
    category: str(formData, 'category'), subcategory: str(formData, 'subcategory'), className: str(formData, 'className'), subject: str(formData, 'subject'),
    exam: str(formData, 'exam'), language: str(formData, 'language'), isbn: str(formData, 'isbn'), price: str(formData, 'price'), mrp: str(formData, 'mrp'),
    description: str(formData, 'description'), tags: str(formData, 'tags'),
    featured: bool(formData, 'featured'), newArrival: bool(formData, 'newArrival'), pick: bool(formData, 'pick'), trending: bool(formData, 'trending'), inStock: bool(formData, 'inStock'),
    popularity: str(formData, 'popularity') || 0,
  };
  const imageUrl = str(formData, 'imageUrl');
  if (imageUrl) { input.image = imageUrl; input.thumb = imageUrl; }
  const file = formData.get('imageFile');
  if (file && typeof file === 'object' && file.size > 0) {
    if (!file.type.startsWith('image/')) return { error: 'Please upload an image file.' };
    const up = await uploadProductImage(file);
    input.image = up.image; input.thumb = up.thumb;
  }
  try {
    const r = await saveProduct(input);
    refresh();
    return { ok: true, ...r };
  } catch (e) {
    return { error: e.message };
  }
}

export async function deleteProductAction(id) {
  await requireAdmin();
  await deleteProduct(id);
  refresh();
  return { ok: true };
}

export async function toggleFlagAction(id, flag, value) {
  await requireAdmin();
  if (!['featured', 'newArrival', 'pick', 'trending', 'inStock'].includes(flag)) return { error: 'bad flag' };
  await setFlags(id, { [flag]: !!value });
  refresh();
  return { ok: true };
}

const COLS = { sku: 'sku', name: 'name', category: 'category', subcategory: 'subcategory', author: 'author', publisher: 'publisher', price: 'price', mrp: 'mrp', class: 'className', subject: 'subject', exam: 'exam', language: 'language', isbn: 'isbn', image: 'image', tags: 'tags', description: 'description', featured: 'featured', newarrival: 'newArrival', pick: 'pick', trending: 'trending', instock: 'inStock' };

export async function importCsvAction(formData) {
  await requireAdmin();
  const file = formData.get('file');
  const mode = str(formData, 'mode') || 'preview';
  if (!file || typeof file !== 'object' || !file.size) return { error: 'Please choose a CSV file.' };
  const text = await file.text();
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true, transformHeader: (h) => h.trim().toLowerCase().replace(/[^a-z]/g, '') });
  const rows = [], errors = [];
  parsed.data.forEach((raw, i) => {
    const row = {};
    for (const [k, v] of Object.entries(raw)) if (COLS[k] !== undefined) row[COLS[k]] = typeof v === 'string' ? v.trim() : v;
    ['featured', 'newArrival', 'pick', 'trending'].forEach((f) => (row[f] = /^(1|yes|true|y)$/i.test(row[f] || '')));
    row.inStock = !/^(0|no|false|n)$/i.test(row.inStock || '');
    if (row.image) row.thumb = row.image;
    if (!row.name) errors.push(`Row ${i + 2}: missing Name`);
    else if (row.price && isNaN(Number(row.price))) errors.push(`Row ${i + 2}: invalid Price "${row.price}"`);
    else rows.push(row);
  });
  if (mode === 'preview') return { ok: true, total: rows.length, errors, preview: rows.slice(0, 8) };
  const result = await upsertBySku(rows);
  refresh();
  return { ok: true, ...result, errors };
}

export async function saveOfferAction(formData) {
  await requireAdmin();
  const id = await saveOffer({ id: str(formData, 'id') || undefined, title: str(formData, 'title'), subtitle: str(formData, 'subtitle'), price: str(formData, 'price'), badge: str(formData, 'badge'), link: str(formData, 'link'), active: bool(formData, 'active') });
  refresh();
  return { ok: true, id };
}

export async function deleteOfferAction(id) {
  await requireAdmin();
  await deleteOffer(id);
  refresh();
  return { ok: true };
}

export async function saveSettingsAction(formData) {
  await requireAdmin();
  const patch = {};
  for (const k of ['storeName', 'tagline', 'teluguTagline', 'phone', 'whatsapp', 'address', 'city', 'hours', 'reviewsUrl', 'mapsQuery', 'statProducts', 'statCategories', 'bannerTitle', 'bannerSubtitle', 'bannerCta', 'bannerLink']) patch[k] = str(formData, k);
  patch.whatsapp = patch.whatsapp.replace(/\D/g, '');
  patch.established = Number(str(formData, 'established')) || 2004;
  patch.rating = Number(str(formData, 'rating')) || 0;
  patch.reviewCount = Number(str(formData, 'reviewCount')) || 0;
  patch.bannerActive = bool(formData, 'bannerActive');
  await updateSettings(patch);
  refresh();
  return { ok: true };
}

export async function setEnquiryStatusAction(id, status) {
  await requireAdmin();
  await setEnquiryStatus(id, status);
  revalidatePath('/admin/enquiries');
  return { ok: true };
}

export async function seedDemoAction() {
  await requireAdmin();
  const n = await seedDemo(await getDb());
  refresh();
  return { ok: true, count: n };
}
