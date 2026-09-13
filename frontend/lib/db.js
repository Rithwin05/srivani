import 'server-only';
import { MongoClient } from 'mongodb';

const cache = globalThis.__srivaniMongo || (globalThis.__srivaniMongo = { promise: null, indexed: false });

export async function getDb() {
  const uri = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME;
  if (!uri || !dbName) throw new Error('MONGO_URL and DB_NAME must be set');
  if (!cache.promise) cache.promise = new MongoClient(uri).connect();
  const client = await cache.promise;
  const db = client.db(dbName);
  if (!cache.indexed) {
    cache.indexed = true;
    ensureIndexes(db).catch((e) => console.error('index error', e));
  }
  return db;
}

async function ensureIndexes(db) {
  await db.collection('products').createIndexes([
    { key: { slug: 1 }, unique: true },
    { key: { sku: 1 } },
    { key: { category: 1, subcategory: 1 } },
    { key: { className: 1 } },
    { key: { exam: 1 } },
    { key: { price: 1 } },
    { key: { popularity: -1 } },
    { key: { createdAt: -1 } },
    { key: { featured: 1, newArrival: 1, pick: 1 } },
  ]);
  await db.collection('sessions').createIndex({ sessionToken: 1 });
  await db.collection('enquiries').createIndex({ createdAt: -1 });
}
