import 'server-only';
import { randomUUID } from 'crypto';
import { getDb } from './db';
import { slugify } from './taxonomy';
import { seedIfEmpty } from './seed';

export const PAGE_SIZE = 24;
const PUBLIC = { projection: { _id: 0, searchText: 0 } };

function esc(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normalizeProduct(input, existing = {}) {
  const name = String(input.name || '').trim();
  const p = {
    sku: String(input.sku || existing.sku || '').trim(),
    name,
    author: (input.author || '').trim(),
    publisher: (input.publisher || '').trim(),
    category: (input.category || '').trim(),
    subcategory: (input.subcategory || '').trim(),
    className: (input.className || '').trim(),
    subject: (input.subject || '').trim(),
    exam: (input.exam || '').trim(),
    language: (input.language || '').trim(),
    isbn: (input.isbn || '').trim(),
    price: input.price === '' || input.price == null ? null : Number(input.price),
    mrp: input.mrp === '' || input.mrp == null ? null : Number(input.mrp),
    description: (input.description || '').trim(),
    tags: Array.isArray(input.tags) ? input.tags : String(input.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    image: input.image ?? existing.image ?? '',
    thumb: input.thumb ?? existing.thumb ?? '',
    featured: !!input.featured,
    newArrival: !!input.newArrival,
    pick: !!input.pick,
    trending: !!input.trending,
    inStock: input.inStock === undefined ? existing.inStock ?? true : !!input.inStock,
    popularity: Number(input.popularity ?? existing.popularity ?? 0),
  };
  p.subcategorySlug = slugify(p.subcategory);
  p.searchText = [p.name, p.author, p.publisher, p.category, p.subcategory, p.className, p.subject, p.exam, p.sku, p.isbn, p.language, ...p.tags].join(' ').toLowerCase();
  return p;
}

async function uniqueSlug(db, name, id) {
  const base = slugify(name) || 'product';
  let slug = base;
  for (let i = 2; await db.collection('products').findOne({ slug, id: { $ne: id } }, { projection: { _id: 1 } }); i++) slug = `${base}-${i}`;
  return slug;
}

export async function saveProduct(input) {
  const db = await getDb();
  const id = input.id || randomUUID();
  const existing = input.id ? await db.collection('products').findOne({ id }, { projection: { _id: 0 } }) : null;
  const doc = normalizeProduct(input, existing || {});
  if (!doc.name) throw new Error('Name is required');
  doc.slug = existing && slugify(existing.name) === slugify(doc.name) ? existing.slug : await uniqueSlug(db, doc.name, id);
  doc.updatedAt = new Date();
  await db.collection('products').updateOne({ id }, { $set: doc, $setOnInsert: { id, createdAt: new Date() } }, { upsert: true });
  return { id, slug: doc.slug };
}

export async function upsertBySku(rows) {
  const db = await getDb();
  let created = 0, updated = 0;
  for (const row of rows) {
    const existing = row.sku ? await db.collection('products').findOne({ sku: row.sku }, { projection: { _id: 0 } }) : null;
    const id = existing?.id || randomUUID();
    const doc = normalizeProduct(row, existing || {});
    doc.slug = existing?.slug || (await uniqueSlug(db, doc.name, id));
    doc.updatedAt = new Date();
    await db.collection('products').updateOne({ id }, { $set: doc, $setOnInsert: { id, createdAt: new Date() } }, { upsert: true });
    existing ? updated++ : created++;
  }
  return { created, updated };
}

export async function deleteProduct(id) {
  const db = await getDb();
  await db.collection('products').deleteOne({ id });
}

export async function setFlags(id, flags) {
  const db = await getDb();
  await db.collection('products').updateOne({ id }, { $set: { ...flags, updatedAt: new Date() } });
}

export async function getProductById(id) {
  const db = await getDb();
  return db.collection('products').findOne({ id }, PUBLIC);
}

export async function getProductBySlug(slug) {
  const db = await getDb();
  await seedIfEmpty(db);
  return db.collection('products').findOne({ slug }, PUBLIC);
}

export function buildQuery(params = {}) {
  const q = {};
  const map = { category: 'category', subcategory: 'subcategory', subcategorySlug: 'subcategorySlug', class: 'className', className: 'className', subject: 'subject', exam: 'exam', author: 'author', publisher: 'publisher' };
  for (const [k, field] of Object.entries(map)) if (params[k]) q[field] = params[k];
  if (params.type === 'books') q.category = { $nin: ['Stationery', 'Art & Craft'] };
  if (params.flag === 'featured') q.featured = true;
  if (params.flag === 'new') q.newArrival = true;
  if (params.flag === 'picks') q.pick = true;
  if (params.flag === 'trending') q.trending = true;
  if (params.min || params.max) q.price = { ...(params.min ? { $gte: Number(params.min) } : {}), ...(params.max ? { $lte: Number(params.max) } : {}) };
  const tokens = String(params.q || '').toLowerCase().split(/\s+/).filter(Boolean).slice(0, 8);
  if (tokens.length) q.$and = tokens.map((t) => ({ searchText: { $regex: esc(t) } }));
  return q;
}

const SORT = { popular: { popularity: -1, name: 1 }, az: { name: 1 }, newest: { createdAt: -1 }, price_asc: { price: 1 }, price_desc: { price: -1 } };

export async function searchProducts(params = {}) {
  const db = await getDb();
  await seedIfEmpty(db);
  const query = buildQuery(params);
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Number(params.limit) || PAGE_SIZE;
  const [items, total] = await Promise.all([
    db.collection('products').find(query, PUBLIC).sort(SORT[params.sort] || SORT.popular).skip((page - 1) * limit).limit(limit).toArray(),
    db.collection('products').countDocuments(query),
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) };
}

export async function getFacets(params = {}) {
  const db = await getDb();
  const base = buildQuery({ ...params, category: undefined, subcategory: undefined, class: undefined, subject: undefined, exam: undefined, author: undefined, publisher: undefined });
  const keep = { category: params.category, className: params.class, exam: params.exam };
  const facet = (field, extra = {}) => [{ $match: { ...base, ...extra } }, { $match: { [field]: { $nin: ['', null] } } }, { $group: { _id: `$${field}`, n: { $sum: 1 } } }, { $sort: { n: -1, _id: 1 } }, { $limit: 40 }];
  const scoped = { ...(keep.category ? { category: keep.category } : {}) };
  const [r] = await db.collection('products').aggregate([{ $facet: {
    category: facet('category'),
    subcategory: facet('subcategory', scoped),
    className: facet('className', scoped),
    subject: facet('subject', { ...scoped, ...(keep.className ? { className: keep.className } : {}) }),
    exam: facet('exam', scoped),
    author: facet('author', scoped),
    publisher: facet('publisher', scoped),
  } }]).toArray();
  const out = {};
  for (const k of Object.keys(r)) out[k] = r[k].map((x) => ({ value: x._id, count: x.n }));
  return out;
}

export async function getRelated(product, limit = 6) {
  const db = await getDb();
  const or = [];
  if (product.className) or.push({ className: product.className });
  if (product.exam) or.push({ exam: product.exam });
  if (product.subcategory) or.push({ subcategory: product.subcategory });
  or.push({ category: product.category });
  const items = await db.collection('products').find({ id: { $ne: product.id }, $or: or }, PUBLIC).sort({ popularity: -1 }).limit(limit * 2).toArray();
  const rank = (p) => (p.className && p.className === product.className ? 3 : 0) + (p.exam && p.exam === product.exam ? 3 : 0) + (p.subcategory === product.subcategory ? 1 : 0);
  return items.sort((a, b) => rank(b) - rank(a)).slice(0, limit);
}

// "You may also need": same class, different subject + stationery essentials.
export async function getAlsoNeed(product, limit = 6) {
  const db = await getDb();
  const out = [];
  if (product.className && product.category === 'School Books') {
    out.push(...(await db.collection('products').find({ id: { $ne: product.id }, className: product.className, subject: { $ne: product.subject } }, PUBLIC).sort({ popularity: -1 }).limit(4).toArray()));
  }
  if (product.category !== 'Stationery') {
    out.push(...(await db.collection('products').find({ category: 'Stationery', tags: 'essential' }, PUBLIC).sort({ popularity: -1 }).limit(limit - out.length).toArray()));
  }
  return out.slice(0, limit);
}

export async function getHomeData() {
  const db = await getDb();
  await seedIfEmpty(db);
  const find = (q, n) => db.collection('products').find(q, PUBLIC).sort({ popularity: -1 }).limit(n).toArray();
  const [trending, picks, newArrivals, featured, total] = await Promise.all([
    find({ trending: true }, 8), find({ pick: true }, 8), find({ newArrival: true }, 8), find({ featured: true }, 8), db.collection('products').countDocuments(),
  ]);
  return { trending, picks, newArrivals, featured, total };
}

export async function listAllForSitemap() {
  const db = await getDb();
  return db.collection('products').find({}, { projection: { _id: 0, slug: 1, updatedAt: 1 } }).limit(5000).toArray();
}

export async function adminListProducts({ q, page = 1, limit = 40 } = {}) {
  const db = await getDb();
  const query = buildQuery({ q });
  const [items, total] = await Promise.all([
    db.collection('products').find(query, PUBLIC).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
    db.collection('products').countDocuments(query),
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) };
}
