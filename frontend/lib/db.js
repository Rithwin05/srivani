import 'server-only';
import { MongoClient } from 'mongodb';

const cache = globalThis.__srivaniMongo || (globalThis.__srivaniMongo = { promise: null, indexed: false });

const mockCursor = {
  sort: () => mockCursor,
  skip: () => mockCursor,
  limit: () => mockCursor,
  toArray: async () => []
};

const mockCollection = {
  findOne: async () => null,
  find: () => mockCursor,
  countDocuments: async () => 0,
  estimatedDocumentCount: async () => 1,
  aggregate: () => mockCursor,
  updateOne: async () => ({}),
  insertOne: async () => ({}),
  deleteOne: async () => ({}),
  deleteMany: async () => ({}),
  insertMany: async () => ({}),
  createIndexes: async () => ({}),
  createIndex: async () => ({})
};

const mockDb = {
  collection: () => mockCollection
};

export async function getDb() {
  const uri = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME;
  
  if (!uri || !dbName) {
    console.warn('⚠️ MONGO_URL or DB_NAME is not set. Returning a mock database. The app will not function correctly until these are configured.');
    return mockDb;
  }
  
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
