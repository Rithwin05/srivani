import 'server-only';
import { randomUUID } from 'crypto';
import { getDb } from './db';

export const DEFAULT_SETTINGS = {
  id: 'main',
  storeName: 'Srivani Book Stall',
  tagline: 'Books. Stationery. Education. Everything you need, under one roof.',
  teluguTagline: 'మీ చదువుకి, మీ గెలుపుకి — శ్రీవాణి బుక్ స్టాల్',
  phone: '+91 98492 12345',
  whatsapp: '919849212345',
  address: 'H.No. 3-7-892/B, Beside Alphors College, Vavilalapally Road, Jagtial Road, Karimnagar – 505001, Telangana',
  city: 'Karimnagar',
  hours: 'Mon – Sun · 9:00 AM – 8:30 PM',
  established: 2004,
  rating: 4.5,
  reviewCount: 14,
  reviewsUrl: 'https://www.justdial.com/Karimnagar/Srivani-Book-Seller-Stationery-Xerox-Beside-Alphors-College-Jagithyala-Road/9999PX878-X878-140509195827-A6U7_BZDET',
  mapsQuery: 'Srivani Book Seller & Stationery Xerox, Beside Alphors College, Jagtial Road, Karimnagar',
  statProducts: '1,500+',
  statCategories: '25+',
  bannerActive: true,
  bannerTitle: 'Back to School',
  bannerSubtitle: 'Textbooks, guides, notebooks and the full stationery list — everything students need, ready at the counter.',
  bannerCta: 'Explore School Shelf',
  bannerLink: '/books/school',
};

export async function getSettings() {
  const db = await getDb();
  const doc = await db.collection('settings').findOne({ id: 'main' }, { projection: { _id: 0 } });
  return { ...DEFAULT_SETTINGS, ...(doc || {}) };
}

export async function updateSettings(patch) {
  const db = await getDb();
  await db.collection('settings').updateOne({ id: 'main' }, { $set: { ...patch, id: 'main', updatedAt: new Date() } }, { upsert: true });
}

export async function getOffers(activeOnly = true) {
  const db = await getDb();
  return db.collection('offers').find(activeOnly ? { active: true } : {}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
}

export async function saveOffer(data) {
  const db = await getDb();
  const id = data.id || randomUUID();
  const doc = { title: data.title, subtitle: data.subtitle || '', price: data.price ? Number(data.price) : null, badge: data.badge || '', link: data.link || '', active: data.active !== false, updatedAt: new Date() };
  await db.collection('offers').updateOne({ id }, { $set: doc, $setOnInsert: { id, createdAt: new Date() } }, { upsert: true });
  return id;
}

export async function deleteOffer(id) {
  const db = await getDb();
  await db.collection('offers').deleteOne({ id });
}

export async function createEnquiry(data) {
  const db = await getDb();
  const doc = { id: randomUUID(), status: 'new', createdAt: new Date(), ...data };
  await db.collection('enquiries').insertOne(doc);
  return doc.id;
}

export async function getEnquiries() {
  const db = await getDb();
  return db.collection('enquiries').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(300).toArray();
}

export async function setEnquiryStatus(id, status) {
  const db = await getDb();
  await db.collection('enquiries').updateOne({ id }, { $set: { status, updatedAt: new Date() } });
}

export async function getDashboardStats() {
  const db = await getDb();
  const [products, enquiries, newEnquiries, offers, categories] = await Promise.all([
    db.collection('products').countDocuments(),
    db.collection('enquiries').countDocuments(),
    db.collection('enquiries').countDocuments({ status: 'new' }),
    db.collection('offers').countDocuments({ active: true }),
    db.collection('products').aggregate([{ $group: { _id: '$category', count: { $sum: 1 }, subs: { $addToSet: '$subcategory' } } }, { $sort: { count: -1 } }]).toArray(),
  ]);
  return { products, enquiries, newEnquiries, offers, categories: categories.map((c) => ({ name: c._id, count: c.count, subs: c.subs.filter(Boolean).sort() })) };
}
